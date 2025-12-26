import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code, stdin } = await req.json();

    if (!code || typeof code !== "string") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid code provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Use Piston API to execute Java code
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: "java",
        version: "15.0.2",
        files: [
          {
            name: "Main.java",
            content: code,
          },
        ],
        stdin: stdin || "", // Pass user input to the program
      }),
    });

    if (!response.ok) {
      throw new Error(`Piston API error: ${response.status}`);
    }

    const data = await response.json();

    // Combine stdout and stderr
    const output =
      [
        data.run?.stdout || "",
        data.run?.stderr || "",
        data.compile?.stderr || "",
      ]
        .filter(Boolean)
        .join("\n")
        .trim() || "No output";

    return new NextResponse(
      JSON.stringify({
        run: {
          output: output,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err: unknown) {
    console.error("Playground API error:", err);
    return new NextResponse(
      JSON.stringify({
        run: {
          output: `Execution failed: ${err instanceof Error ? err.message : String(err)}`,
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
