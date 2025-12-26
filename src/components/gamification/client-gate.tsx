"use client";

import { ReactNode } from "react";

export function ClientGate({
  children,
}: {
  children: ReactNode;
  slug: string;
}) {
  // Normalize slug: remove leading/trailing slashes, handle arrays if needed
  // The slug passed here should match the ID used in markCompleted/isUnlocked
  // For now, let's assume the slug is the last part of the URL or the full path relative to docs
  // e.g., "introduction", "variables-and-literals"

  // Locking logic disabled
  // const unlocked = isUnlocked(slug);
  // if (!unlocked) { ... }

  return <>{children}</>;
}
