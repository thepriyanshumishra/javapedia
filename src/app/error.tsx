"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground mt-4 text-base leading-7">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={() => reset()} size="lg">
            Try again
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => (window.location.href = "/")}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
