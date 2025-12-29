"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    Code2,
    Calculator,
    GitBranch,
    Layers,
    Type,
    FunctionSquare,
    Box,
    AlertTriangle,
    Cpu,
    Database,
    FileText,
    Zap,
    LayoutGrid,
    Hash,
    ArrowLeftRight,
    MoreHorizontal
} from "lucide-react";

const categories = [
    {
        id: "introduction",
        title: "Introduction",
        description: "Start your Java journey with basic programs like Hello World, Variables, and Data Types.",
        icon: Code2,
        color: "bg-blue-500/10 text-blue-500",
        programs: [
            { title: "Hello World", href: "/programs/01-introduction/hello-world" },
            { title: "ASCII Value", href: "/programs/01-introduction/ascii-value-of-character" },
            { title: "Size of Data Types", href: "/programs/01-introduction/size-of-data-types" },
        ]
    },
    {
        id: "operators",
        title: "Operators",
        description: "Learn about Arithmetic, Relational, Logical, and Bitwise operators in Java.",
        icon: Calculator,
        color: "bg-green-500/10 text-green-500",
        programs: [
            { title: "Arithmetic Operators", href: "/programs/02-operators/arithmetic-operators" },
            { title: "Relational Operators", href: "/programs/02-operators/relational-operators" },
            { title: "Logical Operators", href: "/programs/02-operators/logical-operators" },
            { title: "Bitwise Operators", href: "/programs/02-operators/bitwise-operators" },
            { title: "Assignment Operators", href: "/programs/02-operators/assignment-operators" },
            { title: "Ternary Operator", href: "/programs/02-operators/ternary-operator" },
            { title: "Unary Operators", href: "/programs/02-operators/unary-operators" },
        ]
    },
    {
        id: "control-flow",
        title: "Control Flow",
        description: "Master decision making and loops with If-else, Switch, and For/While loops.",
        icon: GitBranch,
        color: "bg-orange-500/10 text-orange-500",
        programs: [
            { title: "Largest of Three", href: "/programs/03-control-flow/largest-of-three-numbers" },
            { title: "Quadratic Equation", href: "/programs/03-control-flow/roots-of-quadratic-equation" },
            { title: "Calculator (Switch)", href: "/programs/03-control-flow/calculator-using-switch" },
            { title: "Sum of Natural Numbers", href: "/programs/03-control-flow/sum-of-natural-numbers" },
            { title: "Multiplication Table", href: "/programs/03-control-flow/multiplication-table" },
            { title: "Display Alphabets", href: "/programs/03-control-flow/display-alphabets" },
            { title: "Count Digits", href: "/programs/03-control-flow/count-digits" },
        ]
    },
    {
        id: "arrays",
        title: "Arrays",
        description: "Understand how to work with Arrays, Matrices, and Sorting algorithms.",
        icon: Layers,
        color: "bg-purple-500/10 text-purple-500",
        programs: [
            { title: "Average Using Arrays", href: "/programs/04-arrays/average-using-arrays" },
            { title: "Largest Element", href: "/programs/04-arrays/largest-element-array" },
            { title: "Add Matrices", href: "/programs/04-arrays/add-two-matrices" },
            { title: "Multiply Matrices", href: "/programs/04-arrays/multiply-two-matrices" },
            { title: "Transpose Matrix", href: "/programs/04-arrays/transpose-matrix" },
            { title: "Standard Deviation", href: "/programs/04-arrays/standard-deviation" },
        ]
    },
    {
        id: "strings",
        title: "Strings",
        description: "Explore String manipulation, comparison, and conversion techniques.",
        icon: Type,
        color: "bg-pink-500/10 text-pink-500",
        programs: [
            { title: "Frequency of Character", href: "/programs/05-strings/frequency-of-character" },
            { title: "Count Vowels/Consonants", href: "/programs/05-strings/count-vowels-consonants" },
            { title: "Sort String", href: "/programs/05-strings/sort-string-alphabetically" },
            { title: "String to Date", href: "/programs/05-strings/convert-string-to-date" },
            { title: "Concatenate Strings", href: "/programs/05-strings/concatenate-two-strings" },
            { title: "Check Numeric", href: "/programs/05-strings/check-string-is-numeric" },
            { title: "Compare Strings", href: "/programs/05-strings/compare-strings" },
        ]
    },
    {
        id: "methods",
        title: "Methods",
        description: "Learn about Functions, Recursion, and modular programming.",
        icon: FunctionSquare,
        color: "bg-indigo-500/10 text-indigo-500",
        programs: [
            { title: "Prime Numbers", href: "/programs/06-methods/prime-numbers-using-function" },
            { title: "Sum Natural Numbers", href: "/programs/06-methods/sum-natural-numbers-recursion" },
            { title: "Factorial (Recursion)", href: "/programs/06-methods/factorial-recursion" },
            { title: "GCD (Recursion)", href: "/programs/06-methods/gcd-recursion" },
            { title: "Binary to Decimal", href: "/programs/06-methods/binary-to-decimal" },
            { title: "Decimal to Binary", href: "/programs/06-methods/decimal-to-binary" },
        ]
    },
    {
        id: "oops",
        title: "OOPs",
        description: "Dive into Object-Oriented Programming: Classes, Objects, Inheritance, and Polymorphism.",
        icon: Box,
        color: "bg-red-500/10 text-red-500",
        programs: [
            { title: "Method Overloading", href: "/programs/07-oops/calculate-area-using-method-overloading" },
            { title: "Abstract Class", href: "/programs/07-oops/abstract-class-example" },
            { title: "Interface", href: "/programs/07-oops/interface-example" },
            { title: "Encapsulation", href: "/programs/07-oops/encapsulation-example" },
        ]
    },
    {
        id: "exception-handling",
        title: "Exception Handling",
        description: "Handle errors gracefully using Try-Catch, Finally, and Custom Exceptions.",
        icon: AlertTriangle,
        color: "bg-yellow-500/10 text-yellow-500",
        programs: [
            { title: "Multiple Catch", href: "/programs/08-exception-handling/multiple-catch-block" },
            { title: "Finally Block", href: "/programs/08-exception-handling/finally-block" },
        ]
    },
    {
        id: "multithreading",
        title: "Multithreading",
        description: "Learn concurrent programming with Threads and Runnable interface.",
        icon: Cpu,
        color: "bg-cyan-500/10 text-cyan-500",
        programs: [
            { title: "Extend Thread", href: "/programs/09-multithreading/create-thread-extending-thread" },
            { title: "Implement Runnable", href: "/programs/09-multithreading/create-thread-implementing-runnable" },
        ]
    },
    {
        id: "collections",
        title: "Collections",
        description: "Work with data structures like ArrayList, LinkedList, HashSet, and HashMap.",
        icon: Database,
        color: "bg-teal-500/10 text-teal-500",
        programs: [
            { title: "ArrayList", href: "/programs/10-collections/arraylist-example" },
            { title: "LinkedList", href: "/programs/10-collections/linkedlist-example" },
            { title: "HashSet", href: "/programs/10-collections/hashset-example" },
            { title: "HashMap", href: "/programs/10-collections/hashmap-example" },
        ]
    },
    {
        id: "file-handling",
        title: "File Handling",
        description: "Learn how to Create, Read, and Write files in Java.",
        icon: FileText,
        color: "bg-slate-500/10 text-slate-500",
        programs: [
            { title: "Create File", href: "/programs/11-file-handling/create-file" },
            { title: "Write to File", href: "/programs/11-file-handling/write-to-file" },
        ]
    },
    {
        id: "advanced",
        title: "Advanced Topics",
        description: "Explore advanced concepts like Lambda Expressions, Stream API, and Date-Time API.",
        icon: Zap,
        color: "bg-violet-500/10 text-violet-500",
        programs: [
            { title: "Lambda Expressions", href: "/programs/12-advanced/lambda-expression-example" },
            { title: "Stream API", href: "/programs/12-advanced/stream-api-example" },
            { title: "Date-Time API", href: "/programs/12-advanced/date-time-api" },
        ]
    },
    {
        id: "patterns",
        title: "Patterns",
        description: "Master logical thinking with Star, Number, and Character patterns.",
        icon: LayoutGrid,
        color: "bg-fuchsia-500/10 text-fuchsia-500",
        programs: [
            { title: "Right Triangle", href: "/programs/13-patterns/right-triangle-star-pattern" },
            { title: "Left Triangle", href: "/programs/13-patterns/left-triangle-star-pattern" },
            { title: "Pyramid", href: "/programs/13-patterns/pyramid-star-pattern" },
            { title: "Diamond", href: "/programs/13-patterns/diamond-shape-pattern" },
            { title: "Downward Triangle", href: "/programs/13-patterns/downward-triangle-star-pattern" },
            { title: "Mirrored Triangle", href: "/programs/13-patterns/mirrored-right-triangle-star-pattern" },
            { title: "Pascal's Triangle", href: "/programs/13-patterns/pascals-triangle" },
            { title: "Floyd's Triangle", href: "/programs/13-patterns/floyds-triangle" },
            { title: "Number Pattern", href: "/programs/13-patterns/number-pattern" },
            { title: "Character Pattern", href: "/programs/13-patterns/character-pattern" },
        ]
    },
    {
        id: "numbers",
        title: "Number Programs",
        description: "Solve problems related to Digits, Primes, Palindromes, and Special Numbers.",
        icon: Hash,
        color: "bg-rose-500/10 text-rose-500",
        programs: [
            { title: "Reverse Number", href: "/programs/14-numbers/reverse-a-number" },
            { title: "Palindrome", href: "/programs/14-numbers/palindrome-number" },
            { title: "Armstrong", href: "/programs/14-numbers/armstrong-number" },
            { title: "Fibonacci", href: "/programs/14-numbers/fibonacci-series" },
            { title: "Prime Check", href: "/programs/14-numbers/prime-number-check" },
            { title: "Automorphic", href: "/programs/14-numbers/automorphic-number" },
            { title: "Peterson", href: "/programs/14-numbers/peterson-number" },
            { title: "Sunny", href: "/programs/14-numbers/sunny-number" },
            { title: "Tech Number", href: "/programs/14-numbers/tech-number" },
            { title: "Fascinating", href: "/programs/14-numbers/fascinating-number" },
            { title: "Keith Number", href: "/programs/14-numbers/keith-number" },
            { title: "Neon Number", href: "/programs/14-numbers/neon-number" },
            { title: "Spy Number", href: "/programs/14-numbers/spy-number" },
            { title: "ATM Program", href: "/programs/14-numbers/atm-program" },
            { title: "Number to Word", href: "/programs/14-numbers/number-to-word" },
        ]
    },
    {
        id: "conversions",
        title: "Conversions",
        description: "Convert between Data Types and Number Systems.",
        icon: ArrowLeftRight,
        color: "bg-lime-500/10 text-lime-500",
        programs: [
            { title: "String to Int", href: "/programs/15-conversions/string-to-integer" },
            { title: "Int to String", href: "/programs/15-conversions/integer-to-string" },
            { title: "String to Date", href: "/programs/15-conversions/string-to-date" },
            { title: "Date to String", href: "/programs/15-conversions/date-to-string" },
            { title: "Char to String", href: "/programs/15-conversions/char-to-string" },
            { title: "String to Char", href: "/programs/15-conversions/string-to-char" },
            { title: "Binary to Octal", href: "/programs/15-conversions/binary-to-octal" },
            { title: "Octal to Binary", href: "/programs/15-conversions/octal-to-binary" },
            { title: "Decimal to Hex", href: "/programs/15-conversions/decimal-to-hexadecimal" },
            { title: "Hex to Decimal", href: "/programs/15-conversions/hexadecimal-to-decimal" },
        ]
    },
    {
        id: "miscellaneous",
        title: "Miscellaneous",
        description: "Various useful programs including Math, Geometry, and Simulations.",
        icon: MoreHorizontal,
        color: "bg-amber-500/10 text-amber-500",
        programs: [
            { title: "Calculate Average", href: "/programs/16-miscellaneous/calculate-average" },
            { title: "Calculate CGPA", href: "/programs/16-miscellaneous/calculate-cgpa" },
            { title: "Compound Interest", href: "/programs/16-miscellaneous/compound-interest" },
            { title: "Simple Interest", href: "/programs/16-miscellaneous/simple-interest" },
            { title: "Area of Circle", href: "/programs/16-miscellaneous/area-of-circle" },
            { title: "Area of Rectangle", href: "/programs/16-miscellaneous/area-of-rectangle" },
            { title: "Area of Triangle", href: "/programs/16-miscellaneous/area-of-triangle" },
            { title: "IP Validation", href: "/programs/16-miscellaneous/ip-address-validation" },
            { title: "Random Number", href: "/programs/16-miscellaneous/generate-random-number" },
            { title: "Coin Toss", href: "/programs/16-miscellaneous/coin-toss-simulation" },
        ]
    },
    {
        id: "real-world-projects",
        title: "Real-World Projects",
        description: "Comprehensive critical thinking programs like Banking Systems, Library Management, and more practical applications.",
        icon: Zap,
        color: "bg-violet-500/10 text-violet-500",
        programs: [
            { title: "Banking System", href: "/programs/17-real-world-projects/banking-system" },
            { title: "Library Management", href: "/programs/17-real-world-projects/library-management" },
            { title: "Attendance Calculator", href: "/programs/17-real-world-projects/attendance-calculator" },
            { title: "Grade Calculator & GPA", href: "/programs/17-real-world-projects/grade-calculator-gpa" },
            { title: "University Timetable", href: "/programs/17-real-world-projects/university-timetable" },
            { title: "Payroll System", href: "/programs/17-real-world-projects/payroll-system" },
            { title: "Shopping Cart", href: "/programs/17-real-world-projects/shopping-cart" },
            { title: "Movie Ticket Booking", href: "/programs/17-real-world-projects/movie-ticket-booking" },
            { title: "Hotel Booking", href: "/programs/17-real-world-projects/hotel-booking" },
            { title: "Contact Manager", href: "/programs/17-real-world-projects/contact-manager" },
            { title: "To-Do List", href: "/programs/17-real-world-projects/todo-list" },
            { title: "Expense Tracker", href: "/programs/17-real-world-projects/expense-tracker" },
            { title: "Scientific Calculator", href: "/programs/17-real-world-projects/scientific-calculator" },
            { title: "Tic-Tac-Toe", href: "/programs/17-real-world-projects/tic-tac-toe" },
            { title: "Quiz Application", href: "/programs/17-real-world-projects/quiz-application" },
            { title: "Voting System", href: "/programs/17-real-world-projects/voting-system" },
            { title: "Parking Lot Management", href: "/programs/17-real-world-projects/parking-lot-management" },
            { title: "Hospital Management", href: "/programs/17-real-world-projects/hospital-management" },
            { title: "Restaurant Billing", href: "/programs/17-real-world-projects/restaurant-billing" },
            { title: "ATM Simulator", href: "/programs/17-real-world-projects/atm-simulator" },
            { title: "Traffic Light Simulator", href: "/programs/17-real-world-projects/traffic-light-simulator" },
            { title: "Student Report Card", href: "/programs/17-real-world-projects/student-report-card" },
            { title: "Inventory Management", href: "/programs/17-real-world-projects/inventory-management" },
            { title: "Bus Reservation", href: "/programs/17-real-world-projects/bus-reservation" },
        ]
    },
];

export function ProgramExplorer() {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const syllabusCategories = categories.slice(0, 12);
    const miscellaneousCategories = categories.slice(12);

    const renderGrid = (items: typeof categories) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {items.map((category) => (
                <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    key={category.id}
                    onClick={() => setSelectedId(selectedId === category.id ? null : category.id)}
                    className={cn(
                        "relative overflow-hidden rounded-xl border bg-card p-6 cursor-pointer hover:bg-accent/50",
                        selectedId === category.id ? "col-span-1 md:col-span-2 lg:col-span-3 row-span-2 ring-2 ring-primary/20 shadow-lg" : ""
                    )}
                    initial={{ borderRadius: 12 }}
                >
                    <motion.div layout="position" className="flex items-start gap-4">
                        <div className={cn("p-3 rounded-lg", category.color)}>
                            <category.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <motion.h3 layout="position" className="text-lg font-semibold mb-1">
                                {category.title}
                            </motion.h3>
                            <motion.p layout="position" className="text-sm text-muted-foreground">
                                {category.description}
                            </motion.p>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {selectedId === category.id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="mt-6 pt-6 border-t"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {category.programs.map((program, index) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + index * 0.05 }}
                                            key={program.href}
                                        >
                                            <Link
                                                href={program.href}
                                                className="group flex items-center gap-2 p-3 rounded-lg border bg-background/50 hover:bg-accent hover:border-accent-foreground/20 transition-all"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                                                <span className="text-sm font-medium">{program.title}</span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );

    return (
        <div className="space-y-12">
            <section>
                <h2 className="text-2xl font-bold px-4 mb-4">Syllabus Programs</h2>
                {renderGrid(syllabusCategories)}
            </section>

            <section>
                <h2 className="text-2xl font-bold px-4 mb-4">Miscellaneous & Practice</h2>
                {renderGrid(miscellaneousCategories)}
            </section>
        </div>
    );
}
