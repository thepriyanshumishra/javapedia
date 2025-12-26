"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizProps {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export function Quiz({ question, options, correctAnswerIndex }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const isCorrect = selected === correctAnswerIndex;

  return (
    <div className="bg-card my-8 rounded-xl border p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">{question}</h3>
      <div className="space-y-2">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => !submitted && setSelected(index)}
            disabled={submitted}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors",
              selected === index
                ? "border-primary bg-primary/5"
                : "hover:bg-muted",
              submitted &&
                index === correctAnswerIndex &&
                "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
              submitted &&
                selected === index &&
                selected !== correctAnswerIndex &&
                "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
            )}
          >
            <span>{option}</span>
            {submitted && index === correctAnswerIndex && (
              <Check className="h-5 w-5 text-green-600" />
            )}
            {submitted &&
              selected === index &&
              selected !== correctAnswerIndex && (
                <X className="h-5 w-5 text-red-600" />
              )}
          </button>
        ))}
      </div>
      {!submitted && (
        <button
          onClick={() => selected !== null && setSubmitted(true)}
          disabled={selected === null}
          className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Check Answer
        </button>
      )}
      {submitted && (
        <div
          className={cn(
            "mt-4 text-sm font-medium",
            isCorrect ? "text-green-600" : "text-red-600",
          )}
        >
          {isCorrect ? "Correct! Well done." : "Incorrect. Try again!"}
          {!isCorrect && (
            <button
              onClick={() => {
                setSubmitted(false);
                setSelected(null);
              }}
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          )}
        </div>
      )}
    </div>
  );
}
