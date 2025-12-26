"use client";

import { CTASection } from "@/components/home";
import { ANIMATION_VARIANTS } from "@/components/home/animation-variants";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, CalendarIcon, UserIcon } from "lucide-react";
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

interface Post {
  url: string;
  data: {
    title: string;
    description?: string;
    date?: string | Date;
    author?: string;
  };
}

export function BlogPosts({ posts }: { posts: Post[] }) {
  return (
    <motion.div
      className="mx-auto max-w-5xl py-24"
      initial="hidden"
      animate="visible"
      variants={ANIMATION_VARIANTS.container}
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
            Blog & Updates
          </SectionBadge>

          <motion.h1
            className="font-funnel-display mt-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-4xl leading-tight font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300"
            variants={ANIMATION_VARIANTS.title}
          >
            Latest from{" "}
            <span className="bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Javapedia
            </span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground mx-auto mt-8 max-w-3xl text-xl leading-relaxed sm:text-2xl"
            variants={ANIMATION_VARIANTS.item}
          >
            Tutorials, updates, and insights from the Java world.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Blog Grid */}
      <motion.section
        className="mb-32 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        variants={ANIMATION_VARIANTS.container}
      >
        {posts.map((post) => (
          <motion.div
            key={post.url}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/60 bg-white shadow-lg transition-all duration-500 hover:shadow-xl dark:border-neutral-700/60 dark:bg-neutral-900"
            variants={ANIMATION_VARIANTS.item}
            whileHover={{ y: -8 }}
          >
            <div className="flex flex-1 flex-col p-8">
              <div className="mb-4 flex items-center gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {post.data.date && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {new Date(post.data.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                )}
                {post.data.author && (
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-3.5 w-3.5" />
                    {post.data.author}
                  </div>
                )}
              </div>

              <h3 className="text-foreground font-funnel-display mb-3 text-2xl leading-tight font-bold transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {post.data.title}
              </h3>

              <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                {post.data.description}
              </p>

              <div className="mt-auto">
                <Link href={post.url}>
                  <Button
                    variant="ghost"
                    className="group/btn p-0 hover:bg-transparent hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Read Article
                    <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.section>

      <CTASection />
    </motion.div>
  );
}
