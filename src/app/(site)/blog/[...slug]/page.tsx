import { blogSource } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { DocsBody } from "fumadocs-ui/page";
import { CalendarIcon, ChevronLeftIcon, UserIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function BlogPostPage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);

  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/blog">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent hover:pl-0"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>

      <article>
        <header className="mb-10 text-center">
          <div className="text-muted-foreground mb-6 flex items-center justify-center gap-4 text-sm">
            {page.data.date && (
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={new Date(page.data.date).toISOString()}>
                  {new Date(page.data.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}
            {page.data.author && (
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>{page.data.author}</span>
              </div>
            )}
          </div>

          <h1 className="font-funnel-display mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {page.data.title}
          </h1>

          <p className="text-muted-foreground text-xl">
            {page.data.description}
          </p>
        </header>

        <DocsBody>
          <MDXContent components={getMDXComponents({})} />
        </DocsBody>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  return blogSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);

  if (!page) notFound();

  return {
    title: `${page.data.title} - Javapedia Blog`,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: "article",
      publishedTime: page.data.date
        ? new Date(page.data.date).toISOString()
        : undefined,
      authors: page.data.author ? [page.data.author] : undefined,
    },
  };
}
