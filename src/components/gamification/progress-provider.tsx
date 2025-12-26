"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface ProgressContextType {
  completedChapters: string[];
  unlockedChapters: string[];
  markCompleted: (id: string, nextChapterId?: string) => void;
  isUnlocked: (id: string) => boolean;
  isCompleted: (id: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined,
);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [unlockedChapters, setUnlockedChapters] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Initial load
  useEffect(() => {
    setMounted(true);
    const savedCompleted = localStorage.getItem("javapedia-completed");
    const savedUnlocked = localStorage.getItem("javapedia-unlocked");

    if (savedCompleted) {
      setCompletedChapters(JSON.parse(savedCompleted));
    }
    if (savedUnlocked) {
      setUnlockedChapters(JSON.parse(savedUnlocked));
    } else {
      // Default: Unlock the first chapter (e.g., 'introduction')
      // We might need a better way to determine the "first" chapter dynamically,
      // but for now, let's assume 'introduction' is always unlocked or handle it via logic.
      // Actually, let's just ensure the user can always access the page they are on if it's the first one.
      // For strict locking, we'd need the full tree.
      // Let's start with a safe default.
      setUnlockedChapters(["index", "introduction"]);
    }
  }, []);

  const markCompleted = (id: string, nextChapterId?: string) => {
    console.log("markCompleted called:", { id, nextChapterId });
    if (!completedChapters.includes(id)) {
      const newCompleted = [...completedChapters, id];
      setCompletedChapters(newCompleted);
      localStorage.setItem("javapedia-completed", JSON.stringify(newCompleted));
    }

    if (nextChapterId && !unlockedChapters.includes(nextChapterId)) {
      console.log("Unlocking chapter:", nextChapterId);
      const newUnlocked = [...unlockedChapters, nextChapterId];
      setUnlockedChapters(newUnlocked);
      localStorage.setItem("javapedia-unlocked", JSON.stringify(newUnlocked));
    } else {
      console.log("Chapter already unlocked or no nextChapterId:", {
        nextChapterId,
        unlockedChapters,
      });
    }
  };

  const isUnlocked = (id: string) => {
    // If not mounted yet (SSR), assume unlocked to prevent hydration mismatch or flash
    // OR assume locked. Assuming unlocked is safer for SEO/SSR but might show content briefly.
    // However, since this is for a "locked" feature, we might want to be strict.
    // But for the sidebar, we want to show locks.
    if (!mounted) return false;

    // 'introduction' and 'index' are always unlocked
    if (id === "introduction" || id === "index") return true;

    return unlockedChapters.includes(id);
  };

  const isCompleted = (id: string) => {
    if (!mounted) return false;
    return completedChapters.includes(id);
  };

  return (
    <ProgressContext.Provider
      value={{
        completedChapters,
        unlockedChapters,
        markCompleted,
        isUnlocked,
        isCompleted,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
