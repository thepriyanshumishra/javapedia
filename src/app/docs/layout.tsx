import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { DocsLayout, DocsLayoutProps } from "fumadocs-ui/layouts/notebook";
import type { ReactNode } from "react";

const docsLayoutOptions: DocsLayoutProps = {
  tree: source.pageTree,
  ...baseOptions,
};

import { ProgressProvider } from "@/components/gamification/progress-provider";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ProgressProvider>
      {/* <SidebarLockInjector /> */}
      <DocsLayout {...docsLayoutOptions}>{children}</DocsLayout>
    </ProgressProvider>
  );
}
