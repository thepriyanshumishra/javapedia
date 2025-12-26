/**
 * Java to JavaScript Transpiler
 * Converts Java code to executable JavaScript
 */

export interface TranspileResult {
  success: boolean;
  code?: string;
  error?: string;
}

export function transpileJavaToJS(javaCode: string): TranspileResult {
  try {
    let jsCode = javaCode;

    // 0. Protect strings
    const strings: string[] = [];
    jsCode = jsCode.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match) => {
      strings.push(match);
      return `__STR${strings.length - 1}__`;
    });

    // 1. Remove package and imports
    jsCode = jsCode.replace(/package\s+[\w.]+;/g, "");
    jsCode = jsCode.replace(/import\s+[\w.]+;/g, "");

    // 1.2 Handle interfaces and implements
    jsCode = jsCode.replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "");
    jsCode = jsCode.replace(/\bimplements\s+[\w\s,]+/g, "");

    // 1.3 Keyword cleanup
    const javaKeywords = [
      "public",
      "private",
      "protected",
      "final",
      "abstract",
      "synchronized",
      "volatile",
      "transient",
      "native",
      "strictfp",
      "throws",
    ];
    const keywordRegex = new RegExp(`\\b(${javaKeywords.join("|")})\\b`, "g");
    jsCode = jsCode.replace(keywordRegex, "");

    // 1.4 Remove annotations
    jsCode = jsCode.replace(/@\w+/g, "");

    // 1.5 Identify classes and their fields (static and instance)
    const classFields = new Map<
      string,
      { static: Set<string>; instance: Set<string> }
    >();
    const classRegex =
      /class\s+(\w+)(?:\s+extends\s+(\w+))?\s*(?:\s+implements\s+[\w\s,]+)?\s*\{/g;
    let classMatch;
    while ((classMatch = classRegex.exec(jsCode)) !== null) {
      const className = classMatch[1];
      const start = classMatch.index + classMatch[0].length;
      let braceCount = 1;
      let end = -1;
      for (let i = start; i < jsCode.length; i++) {
        if (jsCode[i] === "{") braceCount++;
        else if (jsCode[i] === "}") braceCount--;
        if (braceCount === 0) {
          end = i;
          break;
        }
      }
      if (end !== -1) {
        const classBody = jsCode.substring(start, end);
        const staticFields = new Set<string>();
        const instanceFields = new Set<string>();

        // Match fields: <type> <name> [= value] ;
        const fieldRegex =
          /(?:static\s+)?(?:[\w<>\[\]]+\s+)(\w+)\s*(?:=[^;]*)?;/g;
        let fieldMatch;
        while ((fieldMatch = fieldRegex.exec(classBody)) !== null) {
          const fieldName = fieldMatch[1];
          const fullMatch = fieldMatch[0];

          // Check if it's inside a method by checking brace depth
          const before = classBody.substring(0, fieldMatch.index);
          const openBraces = (before.match(/\{/g) || []).length;
          const closeBraces = (before.match(/\}/g) || []).length;
          if (openBraces === closeBraces) {
            if (fullMatch.includes("static")) {
              staticFields.add(fieldName);
            } else {
              instanceFields.add(fieldName);
            }
          }
        }
        classFields.set(className, {
          static: staticFields,
          instance: instanceFields,
        });
      }
    }

    // 2. Remove class wrapper(s) - target the one with main method
    const mainClassMatch = jsCode.match(
      /class\s+\w+\s*\{[^}]*(?:static\s+)?void\s+main/,
    );
    if (mainClassMatch) {
      const braceIndex = jsCode.indexOf("{", mainClassMatch.index);
      const start = braceIndex + 1;
      let count = 1;
      let end = -1;
      for (let i = start; i < jsCode.length; i++) {
        if (jsCode[i] === "{") count++;
        else if (jsCode[i] === "}") count--;
        if (count === 0) {
          end = i;
          break;
        }
      }
      if (end !== -1) {
        const before = jsCode.substring(0, mainClassMatch.index);
        const inside = jsCode.substring(start, end);
        const after = jsCode.substring(end + 1);
        jsCode = before + inside + after;
      }
    }

    // 3. Convert methods: void main(String[] args) -> function main()
    jsCode = jsCode.replace(
      /(?:static\s+)?([\w<>\[\]]+\s+)?(\w+)\s*\(([^)]*)\)\s*\{/g,
      (match, returnType, methodName, args, offset, fullString) => {
        if (
          ["if", "for", "while", "catch", "switch", "try"].includes(methodName)
        )
          return match;

        const before = fullString.substring(0, offset);
        const openBraces = (before.match(/\{/g) || []).length;
        const closeBraces = (before.match(/\}/g) || []).length;
        const isInsideClass = openBraces > closeBraces;

        const cleanArgs = args
          .split(",")
          .map((arg: string) => {
            const parts = arg.trim().split(/\s+/);
            return parts.length > 0 ? parts[parts.length - 1] : "";
          })
          .filter(Boolean)
          .join(", ");

        if (isInsideClass) {
          if (!returnType) return `constructor(${cleanArgs}) {`;
          const isStatic = match.includes("static");
          return `${isStatic ? "static " : ""}${methodName}(${cleanArgs}) {`;
        } else {
          return `function ${methodName}(${cleanArgs}) {`;
        }
      },
    );

    // 4. Convert variable declarations
    const types = [
      "int",
      "long",
      "double",
      "float",
      "boolean",
      "char",
      "String",
      "var",
      "void",
    ];
    const typeRegex = new RegExp(
      `(?<!class\\s+|new\\s+|extends\\s+|implements\\s+)\\b(?:${types.join("|")}|[A-Z][a-z]\\w*)(?:\\[\\])*\\s+`,
      "g",
    );
    jsCode = jsCode.replace(typeRegex, (match, offset, fullString) => {
      const trimmed = match.trim();
      if (
        ["Return", "Public", "Static", "Class", "New", "System"].includes(
          trimmed,
        )
      )
        return match;

      const before = fullString.substring(0, offset);
      const lastOpenBrace = before.lastIndexOf("{");
      if (lastOpenBrace !== -1) {
        const textBeforeBrace = before.substring(0, lastOpenBrace).trim();
        if (
          textBeforeBrace.match(/\bclass\s+\w+\s*$/) ||
          textBeforeBrace.match(/\bclass\s+\w+\s+extends\s+\w+\s*$/)
        ) {
          return ""; // Field declaration
        }
      }

      return "let ";
    });

    // 7. Array access bounds checking
    for (let i = 0; i < 3; i++) {
      jsCode = jsCode.replace(
        /([\w\.\[\]]+)\[([^\]]+)\]/g,
        (match, target, index) => {
          if (
            [
              "int",
              "String",
              "double",
              "float",
              "long",
              "boolean",
              "char",
            ].includes(target)
          )
            return match;
          if (target.endsWith("]")) {
            const base = target.substring(0, target.lastIndexOf("[")).trim();
            if (
              [
                "int",
                "String",
                "double",
                "float",
                "long",
                "boolean",
                "char",
              ].includes(base)
            )
              return match;
          }
          return `__get(${target}, ${index})`;
        },
      );
    }

    // 5. Convert enhanced for loops
    jsCode = jsCode.replace(
      /for\s*\(\s*[\w<>\[\]]+\s+(\w+)\s*:\s*(\w+)\s*\)/g,
      "for (let $1 of $2)",
    );

    // 6. Convert catch blocks
    jsCode = jsCode.replace(
      /catch\s*\([\w<>\[\]\.]+\s+(\w+)\s*\)/g,
      "catch ($1)",
    );

    // 8. Array initializers
    const replaceBraces = (str: string): string => {
      let result = "";
      let depth = 0;
      let inArray = false;
      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const prev = str.substring(0, i).trim();
        const isStartOfArray =
          char === "{" &&
          (prev.endsWith("=") || prev.endsWith("return") || prev.endsWith(","));

        if (isStartOfArray || (inArray && char === "{")) {
          result += "[";
          depth++;
          inArray = true;
        } else if (inArray && char === "}") {
          result += "]";
          depth--;
          if (depth === 0) inArray = false;
        } else {
          result += char;
        }
      }
      return result;
    };
    jsCode = replaceBraces(jsCode);

    // 9. Handle System.out.println
    jsCode = jsCode.replace(/System\.out\.println/g, "__log");
    jsCode = jsCode.replace(
      /System\.out\.print/g,
      "(msg) => __log(msg, false)",
    );

    // 10. Number suffixes
    jsCode = jsCode.replace(/(\d+\.?\d*)[fFlL]\b/g, "$1");

    // 11. String methods
    jsCode = jsCode.replace(/\.length\(\)/g, ".length");
    jsCode = jsCode.replace(/\.equals\(([^)]+)\)/g, " === $1");

    // 10. Restore strings
    strings.forEach((s, i) => {
      jsCode = jsCode.replace(`__STR${i}__`, s);
    });

    // 11. Prefix fields within classes
    for (const [className, fields] of classFields) {
      const classHeaderRegex = new RegExp(`class\\s+${className}\\s*\\{`);
      const headerMatch = jsCode.match(classHeaderRegex);
      if (headerMatch && headerMatch.index !== undefined) {
        const start = headerMatch.index + headerMatch[0].length;
        let braceCount = 1;
        let end = -1;
        for (let i = start; i < jsCode.length; i++) {
          if (jsCode[i] === "{") braceCount++;
          else if (jsCode[i] === "}") braceCount--;
          if (braceCount === 0) {
            end = i;
            break;
          }
        }
        if (end !== -1) {
          let body = jsCode.substring(start, end);

          // Prefix static fields
          for (const field of fields.static) {
            const fieldRegex = new RegExp(
              `(?<![\\w\\.])\\b${field}\\b(?![\\w\\.])`,
              "g",
            );
            body = body.replace(fieldRegex, (match, offset) => {
              const beforeBody = body.substring(0, offset);
              const openBraces = (beforeBody.match(/\{/g) || []).length;
              const closeBraces = (beforeBody.match(/\}/g) || []).length;

              if (openBraces > closeBraces) {
                const trimmedBefore = beforeBody.trim();
                if (trimmedBefore.endsWith(`${className}.`)) return match;

                const methodStart = body.lastIndexOf("{", offset);
                if (methodStart !== -1) {
                  const methodHeader = body.substring(0, methodStart);
                  const lastMethodHeaderMatch = [
                    ...methodHeader.matchAll(
                      /(?:constructor|[\w$]+)\s*\(([^)]*)\)\s*$/g,
                    ),
                  ].pop();
                  if (lastMethodHeaderMatch) {
                    const params = lastMethodHeaderMatch[1]
                      .split(",")
                      .map((p) => p.trim());
                    if (params.includes(field)) return match;
                  }
                }

                return `${className}.${field}`;
              }
              return match;
            });
          }

          // Prefix instance fields
          for (const field of fields.instance) {
            const fieldRegex = new RegExp(
              `(?<![\\w\\.])\\b${field}\\b(?![\\w\\.])`,
              "g",
            );
            body = body.replace(fieldRegex, (match, offset) => {
              const beforeBody = body.substring(0, offset);
              const openBraces = (beforeBody.match(/\{/g) || []).length;
              const closeBraces = (beforeBody.match(/\}/g) || []).length;

              if (openBraces > closeBraces) {
                const trimmedBefore = beforeBody.trim();
                if (trimmedBefore.endsWith("this.")) return match;

                const methodStart = body.lastIndexOf("{", offset);
                if (methodStart !== -1) {
                  const methodHeader = body.substring(0, methodStart);
                  const lastMethodHeaderMatch = [
                    ...methodHeader.matchAll(
                      /(?:constructor|[\w$]+)\s*\(([^)]*)\)\s*$/g,
                    ),
                  ].pop();
                  if (lastMethodHeaderMatch) {
                    const params = lastMethodHeaderMatch[1]
                      .split(",")
                      .map((p) => p.trim());
                    if (params.includes(field)) return match;
                  }
                }

                return `this.${field}`;
              }
              return match;
            });
          }

          jsCode = jsCode.substring(0, start) + body + jsCode.substring(end);
        }
      }
    }

    // 12. Add execution wrapper
    jsCode +=
      "\nif (typeof main === 'function') { main(); } else { \n// If no main, run the code directly\n }";

    return {
      success: true,
      code: jsCode,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Transpilation failed",
    };
  }
}

export function executeTranspiledCode(transpiledCode: string): {
  output: string;
  error?: string;
} {
  const outputLines: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const __log = (msg: any, newline = true): void => {
    const str = String(msg);
    if (newline) {
      outputLines.push(str);
    } else {
      if (outputLines.length === 0) outputLines.push("");
      outputLines[outputLines.length - 1] += str;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const __get = (arr: any, index: number) => {
    if (!Array.isArray(arr)) return arr[index];
    if (index < 0 || index >= arr.length) {
      throw new Error("ArrayIndexOutOfBoundsException");
    }
    return arr[index];
  };

  try {
    const fn = new Function("__log", "__get", transpiledCode);
    fn(__log, __get);
    return { output: outputLines.join("\n") };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      output: outputLines.join("\n"),
      error: "Error: " + error.message,
    };
  }
}
