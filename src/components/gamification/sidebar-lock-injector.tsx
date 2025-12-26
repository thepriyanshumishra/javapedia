"use client";

import { useProgress } from "@/components/gamification/progress-provider";
import { Lock, Unlock } from "lucide-react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";

export function SidebarLockInjector() {
  const { isUnlocked } = useProgress();

  useEffect(() => {
    // Function to inject icons
    const injectIcons = () => {
      // Select all sidebar links. Fumadocs usually uses 'a' tags in the sidebar.
      // We might need a more specific selector depending on the DOM structure.
      // Let's assume they are inside a <nav> or have a specific class.
      // A generic approach: find all 'a' tags that start with /docs/
      const links = document.querySelectorAll('a[href^="/docs/"]');

      links.forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;

        // Extract slug from href
        // e.g. /docs/introduction -> introduction
        // e.g. /docs -> index
        let slug = href.replace(/^\/docs/, ""); // Remove /docs prefix
        slug = slug.replace(/^\//, ""); // Remove leading slash

        const effectiveSlug = slug === "" ? "index" : slug;

        console.log("SidebarLockInjector processing:", { href, effectiveSlug });

        const unlocked = isUnlocked(effectiveSlug);

        // Check if we already injected an icon
        if (link.querySelector(".lock-icon-wrapper")) return;

        // Create a wrapper for the icon
        const iconWrapper = document.createElement("span");
        iconWrapper.className = "lock-icon-wrapper ml-auto pl-2";

        // We can't easily render a React component into a raw DOM node without a root.
        // But for a simple icon, we can use innerHTML or createRoot.
        // createRoot is cleaner but heavier. Let's use createRoot to be safe with React 18.

        // Append wrapper to link
        link.appendChild(iconWrapper);

        const root = createRoot(iconWrapper);
        root.render(
          unlocked ? (
            <Unlock className="h-3 w-3 text-green-500/50" />
          ) : (
            <Lock className="text-muted-foreground/50 h-3 w-3" />
          ),
        );

        // Add visual style for locked items
        if (!unlocked) {
          link.classList.add("opacity-50", "cursor-not-allowed");
          // Optional: disable click
          link.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
          });
        } else {
          link.classList.remove("opacity-50", "cursor-not-allowed");
        }
      });
    };

    // Run initially
    injectIcons();

    // Run on mutation (in case sidebar is dynamic/collapsible)
    const observer = new MutationObserver(injectIcons);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isUnlocked]);

  return null;
}
