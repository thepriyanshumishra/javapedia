import { twMerge } from "tailwind-merge";
import Image from "next/image";
import React from "react";

export default function Logo({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex items-center gap-2" {...props}>
      <div className={twMerge("relative h-10 w-auto", className)}>
        <Image
          src="/logo.png"
          alt="Javapedia Logo"
          width={200}
          height={50}
          className="h-full w-auto object-contain"
          priority
        />
      </div>
      <span className="font-funnel-display text-xl font-bold text-neutral-900 dark:text-white">
        javapedia
      </span>
    </div>
  );
}
