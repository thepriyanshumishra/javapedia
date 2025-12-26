"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-primary text-9xl font-black">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h2>
        <p className="text-muted-foreground mt-6 text-base leading-7">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/">
            <Button size="lg" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go back home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
