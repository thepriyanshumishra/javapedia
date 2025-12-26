"use client";

import { CTASection } from "@/components/home";
import { ANIMATION_VARIANTS } from "@/components/home/animation-variants";
import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  GlobeIcon,
  LinkedinIcon,
  MailIcon,
  TwitterIcon,
  UsersIcon,
} from "lucide-react";
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

const TEAM_MEMBERS = [
  {
    name: "Priyanshu Mishra",
    role: "Founder & Lead Developer",
    bio: "Passionate about making programming education accessible to everyone. Building Javapedia to transform learning worldwide through comprehensive tutorials and community-driven content.",
    image: "https://github.com/thepriyanshumishra.png",
    social: {
      github: "https://github.com/thepriyanshumishra",
      linkedin: "https://www.linkedin.com/in/thepriyanshumishra/",
      website: "https://priyanshumishra.dev", // Assuming website
    },
  },
  // Add more team members here
];

export default function TeamPage() {
  return (
    <motion.div
      className="mx-auto max-w-5xl py-24"
      variants={ANIMATION_VARIANTS.container}
      initial="hidden"
      animate="visible"
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
          <SectionBadge className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
            Our Team
          </SectionBadge>

          <motion.h1
            className="font-funnel-display mt-6 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-4xl leading-tight font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300"
            variants={ANIMATION_VARIANTS.title}
          >
            Meet the{" "}
            <span className="bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
              Builders
            </span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground mx-auto mt-8 max-w-3xl text-xl leading-relaxed sm:text-2xl"
            variants={ANIMATION_VARIANTS.item}
          >
            The passionate individuals behind Javapedia, working together to
            make Java education accessible for everyone.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Team Grid */}
      <motion.section className="mb-32" variants={ANIMATION_VARIANTS.container}>
        <motion.div
          className="grid justify-center gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={ANIMATION_VARIANTS.container}
        >
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.name}
              className="group relative overflow-hidden rounded-3xl border border-neutral-200/60 bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 p-8 text-center shadow-xl transition-all duration-500 hover:shadow-2xl dark:border-neutral-700/60 dark:from-neutral-900 dark:via-orange-950/20 dark:to-red-950/20"
              variants={ANIMATION_VARIANTS.item}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="relative">
                <motion.div
                  className="relative mx-auto mb-6 h-32 w-32"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full rounded-full object-cover shadow-lg ring-4 ring-orange-500/20"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <h3 className="text-foreground font-funnel-display mb-2 text-2xl font-bold">
                  {member.name}
                </h3>
                <div className="mb-6 inline-flex items-center rounded-full bg-gradient-to-r from-orange-100 to-red-100 px-3 py-1 text-sm font-medium text-orange-800 dark:from-orange-900/30 dark:to-red-900/30 dark:text-orange-300">
                  {member.role}
                </div>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                  {member.bio}
                </p>
                <div className="flex justify-center space-x-4">
                  {member.social.github && (
                    <Link
                      href={member.social.github}
                      target="_blank"
                      className="text-muted-foreground hover:text-foreground group/link transition-colors"
                    >
                      <motion.div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 shadow-md transition-all group-hover/link:shadow-lg dark:from-neutral-800 dark:to-neutral-700"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <GitHubIcon className="h-4 w-4" />
                      </motion.div>
                    </Link>
                  )}
                  {member.social.linkedin && (
                    <Link
                      href={member.social.linkedin}
                      target="_blank"
                      className="text-muted-foreground hover:text-foreground group/link transition-colors"
                    >
                      <motion.div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-200 shadow-md transition-all group-hover/link:shadow-lg dark:from-blue-900/50 dark:to-indigo-800/50"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <LinkedinIcon className="h-4 w-4" />
                      </motion.div>
                    </Link>
                  )}
                  {member.social.website && (
                    <Link
                      href={member.social.website}
                      target="_blank"
                      className="text-muted-foreground hover:text-foreground group/link transition-colors"
                    >
                      <motion.div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-emerald-100 to-teal-200 shadow-md transition-all group-hover/link:shadow-lg dark:from-emerald-900/50 dark:to-teal-800/50"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <GlobeIcon className="h-4 w-4" />
                      </motion.div>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Join Us Card */}
          <motion.div
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-neutral-300 bg-neutral-50/50 p-8 text-center transition-all duration-500 hover:border-neutral-400 hover:bg-neutral-100/50 dark:border-neutral-700 dark:bg-neutral-900/50 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/50"
            variants={ANIMATION_VARIANTS.item}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800">
              <UsersIcon className="h-10 w-10 text-neutral-500 dark:text-neutral-400" />
            </div>
            <h3 className="text-foreground font-funnel-display mb-2 text-2xl font-bold">
              Join the Team
            </h3>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              We are always looking for passionate contributors. Help us build
              the future of Java education.
            </p>
            <Link
              href="https://github.com/thepriyanshumishra/javapedia"
              target="_blank"
            >
              <Button variant="outline" className="rounded-full">
                Contribute on GitHub
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <CTASection />
    </motion.div>
  );
}
