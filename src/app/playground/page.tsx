"use client";

import React, { useEffect, useRef, useState } from "react";
import { baseOptions } from "@/app/layout.config";
import { Footer } from "@/components/footer";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { JSX } from "react/jsx-runtime";
import Editor from "@monaco-editor/react";
import {
  Play,
  RotateCcw,
  Download,
  Copy,
  Moon,
  Sun,
  ChevronDown,
} from "lucide-react";
import type { Terminal } from "xterm";
import type { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import io, { Socket } from "socket.io-client";

export default function PlayGround(): JSX.Element {
  const DEFAULT_CODE = `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Enter your name: ");
        String name = scanner.nextLine();
        
        System.out.println("Hello, " + name + "!");
        
        System.out.println("Enter your age: ");
        int age = scanner.nextInt();
        
        System.out.println("You are " + age + " years old.");
        scanner.close();
    }
}`;

  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [toast, setToast] = useState<string>("");
  const [examplesOpen, setExamplesOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [fontSize, setFontSize] = useState<number>(14);

  useEffect(() => {
    try {
      const savedCode = localStorage.getItem("javapedia_code");
      if (savedCode) setCode(savedCode);

      const savedTheme = localStorage.getItem("javapedia_theme") as
        | "vs-dark"
        | "light";
      if (savedTheme) setTheme(savedTheme);

      const savedFontSize = localStorage.getItem("javapedia_fontSize");
      if (savedFontSize) setFontSize(parseInt(savedFontSize));
    } catch {}
  }, []);

  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("javapedia_code", code);
      }
    } catch {}
  }, [code]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("javapedia_theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("javapedia_fontSize", fontSize.toString());
    }
  }, [fontSize]);

  // Initialize Terminal and Socket
  useEffect(() => {
    if (!terminalRef.current) return;

    let cleanupResize: (() => void) | undefined;

    const initTerminal = async () => {
      const { Terminal } = await import("xterm");
      const { FitAddon } = await import("xterm-addon-fit");

      // Initialize xterm.js
      const term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
        theme:
          theme === "vs-dark"
            ? {
                background: "#1e1e1e",
                foreground: "#ffffff",
              }
            : {
                background: "#ffffff",
                foreground: "#000000",
              },
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current!);
      fitAddon.fit();

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      term.writeln("\x1b[32mWelcome to Javapedia Terminal!\x1b[0m");
      term.writeln("Connecting to local server...");

      // Initialize Socket.io
      const socket = io("http://localhost:4000");
      socketRef.current = socket;

      socket.on("connect", () => {
        term.writeln("\r\n\x1b[32mConnected to server.\x1b[0m\r\n");
      });

      socket.on("connect_error", () => {
        term.writeln(
          '\r\n\x1b[31mFailed to connect to server. Make sure "npm run server" is running.\x1b[0m\r\n',
        );
      });

      socket.on("output", (data) => {
        term.write(data);
      });

      term.onData((data) => {
        socket.emit("input", data);
      });

      // Handle resize
      const handleResize = () => {
        fitAddon.fit();
        if (xtermRef.current) {
          socket.emit("resize", {
            cols: xtermRef.current.cols,
            rows: xtermRef.current.rows,
          });
        }
      };

      window.addEventListener("resize", handleResize);
      cleanupResize = () => window.removeEventListener("resize", handleResize);
    };

    initTerminal();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (xtermRef.current) xtermRef.current.dispose();
      if (cleanupResize) cleanupResize();
    };
  }, []);

  // Update terminal theme when theme changes
  useEffect(() => {
    if (xtermRef.current) {
      xtermRef.current.options.theme =
        theme === "vs-dark"
          ? {
              background: "#1e1e1e",
              foreground: "#ffffff",
            }
          : {
              background: "#ffffff",
              foreground: "#000000",
            };
    }
  }, [theme]);

  const showToast = (msg: string, ms = 2000): void => {
    setToast(msg);
    window.setTimeout(() => setToast(""), ms);
  };

  const runCode = (): void => {
    if (socketRef.current && xtermRef.current) {
      xtermRef.current.writeln("\r\n\x1b[33mRunning code...\x1b[0m\r\n");
      socketRef.current.emit("run", code);
      xtermRef.current.focus();
    } else {
      showToast("Server not connected");
    }
  };

  const clearCode = (): void => {
    setCode(DEFAULT_CODE);
    showToast("Reset to default template");
  };

  const copyCode = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      showToast("Code copied to clipboard!");
    } catch {
      showToast("Unable to copy");
    }
  };

  const downloadCode = (): void => {
    try {
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Main.java";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Delay revocation to ensure download starts
      setTimeout(() => URL.revokeObjectURL(url), 100);

      showToast("Downloaded Main.java");
    } catch (error) {
      console.error("Download failed:", error);
      showToast("Download failed");
    }
  };

  const toggleTheme = (): void => {
    setTheme(theme === "vs-dark" ? "light" : "vs-dark");
    showToast(`Switched to ${theme === "vs-dark" ? "light" : "dark"} mode`);
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
    }
  };

  const EXAMPLES: Record<string, string> = {
    "Scanner Input": `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("Enter first number: ");
        int a = scanner.nextInt();
        
        System.out.println("Enter second number: ");
        int b = scanner.nextInt();
        
        System.out.println("Sum: " + (a + b));
        scanner.close();
    }
}`,
    "Hello World": `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Javapedia!");
    }
}`,
    "For Loop": `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}`,
    Arrays: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30, 40, 50};
        
        System.out.println("Array elements:");
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Element at index " + i + ": " + numbers[i]);
        }
        
        System.out.println("\\nEnhanced for loop:");
        for (int num : numbers) {
            System.out.println(num);
        }
    }
}`,
    "If-Else": `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter a number: ");
        int num = scanner.nextInt();
        
        if (num > 0) {
            System.out.println(num + " is positive.");
        } else if (num < 0) {
            System.out.println(num + " is negative.");
        } else {
            System.out.println("The number is zero.");
        }
        scanner.close();
    }
}`,
    "Switch Case": `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter day number (1-7): ");
        int day = scanner.nextInt();
        String dayName;
        
        switch (day) {
            case 1: dayName = "Monday"; break;
            case 2: dayName = "Tuesday"; break;
            case 3: dayName = "Wednesday"; break;
            case 4: dayName = "Thursday"; break;
            case 5: dayName = "Friday"; break;
            case 6: dayName = "Saturday"; break;
            case 7: dayName = "Sunday"; break;
            default: dayName = "Invalid day"; break;
        }
        
        System.out.println("Day: " + dayName);
        scanner.close();
    }
}`,
    "While Loop": `public class Main {
    public static void main(String[] args) {
        int i = 5;
        while (i > 0) {
            System.out.println("Countdown: " + i);
            i--;
        }
        System.out.println("Blastoff!");
    }
}`,
    Methods: `public class Main {
    public static void main(String[] args) {
        greet("Alice");
        int sum = add(5, 3);
        System.out.println("Sum: " + sum);
    }
    
    public static void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
    
    public static int add(int a, int b) {
        return a + b;
    }
}`,
    "Classes & Objects": `class Car {
    String brand;
    int year;
    
    Car(String brand, int year) {
        this.brand = brand;
        this.year = year;
    }
    
    void displayInfo() {
        System.out.println("Car: " + brand + ", Year: " + year);
    }
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car("Toyota", 2022);
        myCar.displayInfo();
        
        Car anotherCar = new Car("Honda", 2023);
        anotherCar.displayInfo();
    }
}`,
    Calculator: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Simple Calculator");
        System.out.println("-----------------");
        
        System.out.print("Enter first number: ");
        double num1 = scanner.nextDouble();
        
        System.out.print("Enter operator (+, -, *, /): ");
        char operator = scanner.next().charAt(0);
        
        System.out.print("Enter second number: ");
        double num2 = scanner.nextDouble();
        
        double result = 0;
        boolean valid = true;
        
        switch(operator) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
            case '/': 
                if(num2 != 0) result = num1 / num2;
                else {
                    System.out.println("Error: Division by zero");
                    valid = false;
                }
                break;
            default:
                System.out.println("Error: Invalid operator");
                valid = false;
        }
        
        if(valid) {
            System.out.println("Result: " + result);
        }
        scanner.close();
    }
}`,
    "Guessing Game": `import java.util.Scanner;
import java.util.Random;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();
        
        int target = random.nextInt(100) + 1;
        int attempts = 0;
        int guess = 0;
        
        System.out.println("Number Guessing Game!");
        System.out.println("I'm thinking of a number between 1 and 100.");
        
        while (guess != target) {
            System.out.print("Enter your guess: ");
            guess = scanner.nextInt();
            attempts++;
            
            if (guess < target) {
                System.out.println("Too low! Try again.");
            } else if (guess > target) {
                System.out.println("Too high! Try again.");
            } else {
                System.out.println("Correct! You won in " + attempts + " attempts.");
            }
        }
        scanner.close();
    }
}`,
    "Bank System": `import java.util.Scanner;

class BankAccount {
    String owner;
    double balance;
    
    BankAccount(String owner, double balance) {
        this.owner = owner;
        this.balance = balance;
    }
    
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited $" + amount);
        }
    }
    
    void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrew $" + amount);
        } else {
            System.out.println("Insufficient funds or invalid amount.");
        }
    }
    
    void checkBalance() {
        System.out.println("Balance: $" + balance);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Bank Management System");
        
        System.out.print("Enter account owner name: ");
        String name = scanner.nextLine();
        
        BankAccount account = new BankAccount(name, 0);
        System.out.println("Account created for " + name);
        
        boolean running = true;
        while (running) {
            System.out.println("\\n1. Deposit");
            System.out.println("2. Withdraw");
            System.out.println("3. Check Balance");
            System.out.println("4. Exit");
            System.out.print("Choose an option: ");
            
            int choice = scanner.nextInt();
            
            switch (choice) {
                case 1:
                    System.out.print("Enter amount to deposit: ");
                    account.deposit(scanner.nextDouble());
                    break;
                case 2:
                    System.out.print("Enter amount to withdraw: ");
                    account.withdraw(scanner.nextDouble());
                    break;
                case 3:
                    account.checkBalance();
                    break;
                case 4:
                    running = false;
                    System.out.println("Thank you for using our bank!");
                    break;
                default:
                    System.out.println("Invalid option.");
            }
        }
        scanner.close();
    }
}`,
    "Library System": `import java.util.ArrayList;
import java.util.Scanner;

class Book {
    String title;
    boolean isBorrowed;

    Book(String title) {
        this.title = title;
        this.isBorrowed = false;
    }
}

public class Main {
    static ArrayList<Book> library = new ArrayList<>();
    static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        // Add some initial books
        library.add(new Book("The Great Gatsby"));
        library.add(new Book("1984"));
        library.add(new Book("Java Programming"));

        System.out.println("Library Management System");

        boolean running = true;
        while (running) {
            System.out.println("\\n1. List Books");
            System.out.println("2. Borrow Book");
            System.out.println("3. Return Book");
            System.out.println("4. Add Book");
            System.out.println("5. Exit");
            System.out.print("Choose an option: ");

            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1: listBooks(); break;
                case 2: borrowBook(); break;
                case 3: returnBook(); break;
                case 4: addBook(); break;
                case 5: running = false; break;
                default: System.out.println("Invalid option.");
            }
        }
        System.out.println("Goodbye!");
    }

    static void listBooks() {
        System.out.println("\\n--- Library Books ---");
        for (int i = 0; i < library.size(); i++) {
            Book b = library.get(i);
            System.out.println((i + 1) + ". " + b.title + (b.isBorrowed ? " [Borrowed]" : " [Available]"));
        }
    }

    static void borrowBook() {
        listBooks();
        System.out.print("Enter book number to borrow: ");
        int index = scanner.nextInt() - 1;
        if (index >= 0 && index < library.size()) {
            Book b = library.get(index);
            if (!b.isBorrowed) {
                b.isBorrowed = true;
                System.out.println("You borrowed \\"" + b.title + "\\"");
            } else {
                System.out.println("Sorry, that book is already borrowed.");
            }
        } else {
            System.out.println("Invalid book number.");
        }
    }

    static void returnBook() {
        listBooks();
        System.out.print("Enter book number to return: ");
        int index = scanner.nextInt() - 1;
        if (index >= 0 && index < library.size()) {
            Book b = library.get(index);
            if (b.isBorrowed) {
                b.isBorrowed = false;
                System.out.println("You returned \\"" + b.title + "\\"");
            } else {
                System.out.println("That book wasn't borrowed.");
            }
        } else {
            System.out.println("Invalid book number.");
        }
    }

    static void addBook() {
        System.out.print("Enter book title: ");
        String title = scanner.nextLine();
        library.add(new Book(title));
        System.out.println("Added \\"" + title + "\\" to the library.");
    }
}`,
  };

  const loadExample = (key: string): void => {
    setCode(EXAMPLES[key]);
    setExamplesOpen(false);
    showToast(`Loaded: ${key}`);
  };

  const clearTerminal = (): void => {
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  };

  return (
    <>
      <HomeLayout
        {...baseOptions}
        style={{ "--spacing-fd-container": "1400px" } as React.CSSProperties}
      >
        <div className="mb-5 space-y-4" onKeyDown={handleKeyPress}>
          <h1 className="font-funnel-display mx-auto -mt-10 max-w-4xl text-center text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl lg:text-[80px] dark:text-white">
            Javapedia{" "}
            <span className="bg-gradient-to-br from-sky-400 to-indigo-500 bg-clip-text text-transparent">
              IDE
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-center text-neutral-600 dark:text-neutral-400">
            Professional Java development environment with Real Terminal
          </p>

          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={runCode}
                  className="flex items-center gap-2 rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-600"
                >
                  <Play size={16} />
                  Run Code
                </button>

                <button
                  onClick={clearCode}
                  className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 shadow transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <div className="relative">
                  <button
                    onClick={() => setExamplesOpen(!examplesOpen)}
                    className="flex items-center gap-2 rounded-md bg-purple-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-purple-600"
                  >
                    Examples
                    <ChevronDown size={16} />
                  </button>
                  {examplesOpen && (
                    <ul className="absolute z-10 mt-2 w-56 rounded-md border bg-white p-2 shadow-lg dark:border-gray-600 dark:bg-gray-700">
                      {Object.keys(EXAMPLES).map((key) => (
                        <li key={key}>
                          <button
                            onClick={() => loadExample(key)}
                            className="w-full rounded px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            {key}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  onClick={copyCode}
                  className="flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-600"
                >
                  <Copy size={16} />
                  Copy
                </button>

                <button
                  onClick={downloadCode}
                  className="flex items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-yellow-600"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  className="rounded-md bg-gray-200 p-2 text-gray-800 shadow transition-colors hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  title="Toggle theme"
                >
                  {theme === "vs-dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <button
                  onClick={clearTerminal}
                  className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-red-600"
                >
                  Clear Terminal
                </button>
              </div>
            </div>

            {/* Editor and Terminal */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Editor Panel */}
              <div className="flex h-[600px] flex-col overflow-hidden rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-700">
                  <span className="font-mono text-sm font-medium">
                    Main.java
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                      className="rounded px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      A-
                    </button>
                    <span className="text-xs">{fontSize}px</span>
                    <button
                      onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                      className="rounded px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      A+
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    defaultLanguage="java"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme={theme}
                    options={{
                      fontSize: fontSize,
                      minimap: { enabled: true },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 4,
                      wordWrap: "on",
                      lineNumbers: "on",
                      renderLineHighlight: "all",
                      cursorBlinking: "smooth",
                      smoothScrolling: true,
                      fontFamily:
                        "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                      fontLigatures: true,
                    }}
                  />
                </div>
              </div>

              {/* Terminal Panel */}
              <div className="flex h-[600px] flex-col overflow-hidden rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2 dark:border-gray-600 dark:bg-gray-700">
                  <span className="font-mono text-sm font-medium">
                    Terminal
                  </span>
                  <span className="text-xs text-gray-500">Local Execution</span>
                </div>
                <div
                  className="flex-1 overflow-hidden bg-black p-2"
                  ref={terminalRef}
                ></div>
              </div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-2 text-xs text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <div className="flex gap-4">
                <span>Language: Java</span>
                <span>•</span>
                <span>Encoding: UTF-8</span>
              </div>
              <div className="flex gap-4">
                <span>{code.split("\n").length} lines</span>
                <span>•</span>
                <span>{code.length} characters</span>
              </div>
            </div>
          </div>

          {toast && (
            <div className="animate-in slide-in-from-bottom-5 fixed right-6 bottom-6 z-50 rounded-lg bg-black/90 px-4 py-3 text-white shadow-lg">
              {toast}
            </div>
          )}
        </div>
      </HomeLayout>
      <Footer />
    </>
  );
}
