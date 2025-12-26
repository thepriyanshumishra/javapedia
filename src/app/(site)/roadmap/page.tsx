"use client";

import { CTASection } from "@/components/home";
import { ANIMATION_VARIANTS } from "@/components/home/animation-variants";
import { Button } from "@/components/ui/button";
import {
  BookOpenIcon,
  Code2Icon,
  CoffeeIcon,
  GraduationCapIcon,
  LayersIcon,
  RocketIcon,
  ServerIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import React from "react";

// Reusable SectionBadge component
const SectionBadge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${className}`}
    variants={ANIMATION_VARIANTS.item}
  >
    <div className="mr-2 h-1.5 w-1.5 rounded-full bg-current opacity-60" />
    {children}
  </motion.div>
);

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  topics: string[];
  link: string;
}

const LEARNING_PATH: RoadmapStep[] = [
  {
    id: 1,
    title: "The Fundamentals",
    description:
      "Start your journey by mastering the syntax, basic concepts, and core building blocks of Java programming.",
    icon: <CoffeeIcon className="h-6 w-6 text-white" />,
    color: "from-orange-500 to-amber-600",
    link: "/docs/introduction",
    topics: [
      "Java Syntax & Structure",
      "Variables & Data Types",
      "Operators & Expressions",
      "Control Flow (If/Else, Loops)",
      "Arrays & Strings",
    ],
  },
  {
    id: 2,
    title: "Object-Oriented Programming",
    description:
      "Dive into the heart of Java. Learn how to model real-world problems using classes, objects, and relationships.",
    icon: <LayersIcon className="h-6 w-6 text-white" />,
    color: "from-blue-500 to-indigo-600",
    link: "/docs/class-objects",
    topics: [
      "Classes & Objects",
      "Constructors & Methods",
      "Inheritance & Polymorphism",
      "Encapsulation & Abstraction",
      "Interfaces & Abstract Classes",
    ],
  },
  {
    id: 3,
    title: "Core Java APIs",
    description:
      "Explore the powerful standard libraries that make Java robust. Handle data, errors, and files efficiently.",
    icon: <ServerIcon className="h-6 w-6 text-white" />,
    color: "from-emerald-500 to-green-600",
    link: "/docs/collections-overview",
    topics: [
      "Exception Handling",
      "Collections Framework (List, Set, Map)",
      "Generics",
      "File I/O & Serialization",
      "Java Time API",
    ],
  },
  {
    id: 4,
    title: "Advanced Concepts",
    description:
      "Level up your skills with advanced features. Write efficient, concurrent, and functional code.",
    icon: <Code2Icon className="h-6 w-6 text-white" />,
    color: "from-purple-500 to-pink-600",
    link: "/docs/multithreading",
    topics: [
      "Multithreading & Concurrency",
      "Lambda Expressions",
      "Stream API",
      "Functional Interfaces",
      "Memory Management (Garbage Collection)",
    ],
  },
  {
    id: 5,
    title: "Build Tools & Ecosystem",
    description:
      "Learn the tools used in professional development. Build, test, and deploy your Java applications.",
    icon: <RocketIcon className="h-6 w-6 text-white" />,
    color: "from-red-500 to-rose-600",
    link: "/docs/maven",
    topics: [
      "Build Tools (Maven/Gradle)",
      "Unit Testing (JUnit)",
      "Debugging Techniques",
      "IDE Mastery (IntelliJ IDEA)",
      "Version Control (Git)",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <motion.div
      className="mx-auto max-w-5xl py-24"
      variants={ANIMATION_VARIANTS.container}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section
        className="relative my-12 text-center"
        variants={ANIMATION_VARIANTS.container}
      >
        <motion.div
          className="mx-auto max-w-4xl"
          variants={ANIMATION_VARIANTS.container}
        >
          <SectionBadge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            Learning Path
          </SectionBadge>

          <motion.h1
            className="font-funnel-display mt-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-4xl leading-tight font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300"
            variants={ANIMATION_VARIANTS.title}
          >
            Your Journey to{" "}
            <span className="bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Java Mastery
            </span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground mx-auto mt-8 max-w-3xl text-xl leading-relaxed sm:text-2xl"
            variants={ANIMATION_VARIANTS.item}
          >
            A structured, step-by-step roadmap designed to take you from a
            complete beginner to a confident Java developer.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Timeline Section */}
      <motion.section
        className="relative mb-32 px-4"
        variants={ANIMATION_VARIANTS.container}
      >
        <div className="absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-neutral-200 via-neutral-200 to-transparent md:block dark:from-neutral-800 dark:via-neutral-800" />

        <div className="space-y-12 md:space-y-24">
          {LEARNING_PATH.map((step, index) => (
            <motion.div
              key={step.id}
              className={`relative flex flex-col gap-8 md:flex-row ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
              variants={ANIMATION_VARIANTS.item}
              whileHover={{ y: -4 }}
            >
              {/* Timeline Dot */}
              <div className="absolute top-0 left-1/2 -ml-6 hidden h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-white shadow-sm md:flex dark:border-neutral-950 dark:bg-neutral-900">
                <div
                  className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${step.color}`}
                >
                  <span className="font-funnel-display text-lg font-bold text-white">
                    {step.id}
                  </span>
                </div>
              </div>

              {/* Content Card */}
              <div className="flex-1">
                <div className="group relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-white p-8 shadow-lg transition-all duration-500 hover:shadow-xl dark:border-neutral-700/60 dark:bg-neutral-900">
                  {/* Card Header */}
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
                    >
                      {step.icon}
                    </div>
                    <h3 className="text-foreground font-funnel-display text-2xl font-bold">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="mb-8 rounded-2xl bg-neutral-50 p-6 dark:bg-neutral-800/50">
                    <h4 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">
                      Key Topics:
                    </h4>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {step.topics.map((topic, i) => (
                        <li
                          key={i}
                          className="flex items-center text-sm text-neutral-600 dark:text-neutral-300"
                        >
                          <div
                            className={`mr-2 h-1.5 w-1.5 rounded-full bg-gradient-to-br ${step.color}`}
                          />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={step.link}>
                    <Button className="w-full transition-transform group-hover:translate-x-1">
                      Start Learning
                      <BookOpenIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="flex-1" />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        className="mb-32 text-center"
        variants={ANIMATION_VARIANTS.container}
      >
        <motion.div
          className="mx-auto max-w-2xl rounded-3xl border border-dashed border-neutral-300 bg-neutral-50/50 p-12 dark:border-neutral-700 dark:bg-neutral-900/50"
          variants={ANIMATION_VARIANTS.item}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <GraduationCapIcon className="h-8 w-8 text-white" />
          </div>
          <h2 className="font-funnel-display mb-4 text-3xl font-bold">
            Ready to Start?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            The best time to start learning was yesterday. The second best time
            is now.
          </p>
          <Link href="/docs/introduction">
            <Button size="lg" className="w-full sm:w-auto">
              Begin Your Journey
              <RocketIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <CTASection />
    </motion.div>
  );
}
