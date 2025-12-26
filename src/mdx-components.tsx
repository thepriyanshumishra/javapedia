import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import * as icons from "lucide-react";
import { InstagramIcon, LinkedInIcon } from "@/components/icons";
import { Challenge } from "@/components/gamification/challenge";
import { Quiz } from "@/components/gamification/quiz";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    InstagramIcon,
    LinkedInIcon,
    Challenge,
    Quiz,
    ...components,
  };
}
