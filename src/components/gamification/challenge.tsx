"use client";

import { useState } from "react";
import { useProgress } from "./progress-provider";
import {
  Play,
  RotateCcw,
  Check,
  X as XIcon,
  Copy,
  LightbulbIcon,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Confetti } from "@/components/gamification/confetti";

interface ChallengeProps {
  id: string;
  nextChapterId?: string;
  question: string;
  expectedOutput: string;
  defaultCode?: string;
  hint?: string;
  solution?: string;
}

export function Challenge({
  id,
  nextChapterId,
  question,
  expectedOutput,
  defaultCode = '// Write your code here\nSystem.out.println("Hello World");',
  hint,
  solution,
}: ChallengeProps) {
  const { markCompleted, isCompleted } = useProgress();
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [debugInfo, setDebugInfo] = useState<{
    expected: string;
    simulated: string;
  } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const completed = isCompleted(id);

  const runCode = () => {
    let simulatedOutput = "";
    const __log = (msg: unknown = "", newline = true) => {
      simulatedOutput += String(msg) + (newline ? "\n" : "");
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
      let jsCode = code;

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
            ["if", "for", "while", "catch", "switch", "try"].includes(
              methodName,
            )
          )
            return match;

          // Check if we are inside a class (simple brace counting)
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
      // Updated typeRegex to avoid matching all-caps constants as types and avoid matching after 'extends' or 'class'
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

        // Check if we are inside a class body (for fields)
        const before = fullString.substring(0, offset);
        const lastOpenBrace = before.lastIndexOf("{");
        if (lastOpenBrace !== -1) {
          const textBeforeBrace = before.substring(0, lastOpenBrace).trim();
          // Check if the last open brace belongs to a class
          if (
            textBeforeBrace.match(/\bclass\s+\w+\s*$/) ||
            textBeforeBrace.match(/\bclass\s+\w+\s+extends\s+\w+\s*$/)
          ) {
            return ""; // Field declaration
          }
        }

        return "let ";
      });

      // 7. Array access bounds checking - BEFORE brace replacement
      // We run this multiple times to catch nested accesses like arr[i][j]
      for (let i = 0; i < 3; i++) {
        jsCode = jsCode.replace(
          /([\w\.\[\]]+)\[([^\]]+)\]/g,
          (match, target, index) => {
            // Avoid replacing if it's part of a type declaration or already a __get call that we shouldn't wrap (though wrapping is usually fine)
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
            // If target is just a type like int[], skip
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

      // 8. Array initializers (handle nested)
      const replaceBraces = (str: string): string => {
        let result = "";
        let depth = 0;
        let inArray = false;
        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          const prev = str.substring(0, i).trim();
          const isStartOfArray =
            char === "{" &&
            (prev.endsWith("=") ||
              prev.endsWith("return") ||
              prev.endsWith(","));

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

                // Only prefix if inside a method
                if (openBraces > closeBraces) {
                  // Check if it's already prefixed with className.
                  const trimmedBefore = beforeBody.trim();
                  if (trimmedBefore.endsWith(`${className}.`)) return match;

                  // Check if it's a parameter of the current method
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

                // Only prefix if inside a method
                if (openBraces > closeBraces) {
                  // Check if it's already prefixed with this.
                  const trimmedBefore = beforeBody.trim();
                  if (trimmedBefore.endsWith("this.")) return match;

                  // Check if it's a parameter of the current method
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

      // 11. Execution
      jsCode +=
        "\nif (typeof main === 'function') { main(); } else { \n// If no main, run the code directly\n }";

      const fn = new Function("__log", "__get", jsCode);
      fn(__log, __get);
    } catch (err: unknown) {
      simulatedOutput =
        "Error: " + (err instanceof Error ? err.message : String(err));
    }

    // Normalize outputs for comparison
    const cleanSimulated = simulatedOutput.trim().replace(/\r\n/g, "\n");
    const cleanExpected = expectedOutput
      .replace(/\\n/g, "\n")
      .trim()
      .replace(/\r\n/g, "\n");

    setOutput(cleanSimulated || "(No output)");
    setDebugInfo({ expected: cleanExpected, simulated: cleanSimulated });

    if (cleanSimulated === cleanExpected) {
      setStatus("success");
      markCompleted(id, nextChapterId);
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="bg-card text-card-foreground relative my-8 overflow-hidden rounded-xl border shadow-sm">
      {status === "success" && <Confetti />}
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="flex items-center gap-2 font-semibold">
          <CodeIcon className="text-primary h-5 w-5" />
          Challenge
        </h3>
        {/* {completed && (
                    <span className="flex items-center gap-1 text-sm font-medium text-green-500">
                        <CheckCircle className="h-4 w-4" />
                        Completed
                    </span>
                )} */}
      </div>

      <div className="space-y-4 p-4">
        <div className="text-muted-foreground text-sm">
          <p className="text-foreground mb-1 font-medium">Task:</p>
          {question}
        </div>

        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-muted/50 focus:ring-primary/50 min-h-[150px] w-full resize-y rounded-md border p-4 font-mono text-sm focus:ring-2 focus:outline-none"
            spellCheck={false}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCode(defaultCode)}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Code
            </button>
            {hint && (
              <button
                onClick={() => setShowHint(true)}
                className="flex items-center gap-1 text-xs text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400"
              >
                <LightbulbIcon className="h-3 w-3" />
                Hint
              </button>
            )}
            {solution && (
              <button
                onClick={() => setShowSolution(true)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400"
              >
                <CodeIcon className="h-3 w-3" />
                Solution
              </button>
            )}
          </div>

          <button
            onClick={runCode}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            <Play className="h-4 w-4" />
            Run Code
          </button>
        </div>

        {output && (
          <div
            className={cn(
              "rounded-md border p-4 font-mono text-sm",
              status === "success"
                ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400"
                : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
            )}
          >
            <div className="mb-1 text-xs font-semibold uppercase opacity-70">
              Output:
            </div>
            {output}
            {status === "success" ? (
              <div className="mt-2 font-bold">Correct! Chapter Completed.</div>
            ) : (
              <div className="mt-2 font-bold">
                Incorrect. Expected: &quot;{expectedOutput}&quot;
                {debugInfo && (
                  <div className="mt-2 border-t border-red-500/20 pt-2 text-xs">
                    <div>
                      Clean Expected: &quot;{debugInfo.expected}&quot; (Len:{" "}
                      {debugInfo.expected.length})
                    </div>
                    <div>
                      Clean Simulated: &quot;{debugInfo.simulated}&quot; (Len:{" "}
                      {debugInfo.simulated.length})
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hint Modal */}
      {showHint && (
        <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card animate-in fade-in zoom-in relative w-full max-w-md rounded-lg border p-6 shadow-lg duration-200">
            <button
              onClick={() => setShowHint(false)}
              className="text-muted-foreground hover:text-foreground absolute top-2 right-2"
            >
              <XIcon className="h-4 w-4" />
            </button>
            <h4 className="mb-4 flex items-center gap-2 font-semibold text-yellow-600 dark:text-yellow-500">
              <LightbulbIcon className="h-4 w-4" />
              Hint
            </h4>
            <p className="text-muted-foreground text-sm">{hint}</p>
          </div>
        </div>
      )}

      {/* Solution Modal */}
      {showSolution && (
        <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card animate-in fade-in zoom-in relative w-full max-w-md rounded-lg border p-6 shadow-lg duration-200">
            <button
              onClick={() => setShowSolution(false)}
              className="text-muted-foreground hover:text-foreground absolute top-2 right-2"
            >
              <XIcon className="h-4 w-4" />
            </button>
            <h4 className="text-primary mb-4 flex items-center gap-2 font-semibold">
              <CodeIcon className="h-4 w-4" />
              Solution
            </h4>
            <div className="group relative">
              <pre className="bg-muted overflow-x-auto rounded-md p-4 font-mono text-xs whitespace-pre-wrap">
                {solution}
              </pre>
              <button
                onClick={() => {
                  if (solution) {
                    navigator.clipboard.writeText(solution);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="bg-background/50 absolute top-2 right-2 rounded-md border p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                title="Copy solution"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
