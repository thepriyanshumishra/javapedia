import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Article, WithContext } from "schema-dts";
import { ClientGate } from "@/components/gamification/client-gate";
import { FadeIn } from "@/components/animations/fade-in";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const MDXContent = page.data.body;

  const jsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.data.title,
    description: page.data.description,
    author: {
      "@type": "Organization",
      name: "Javapedia",
    },
    publisher: {
      "@type": "Organization",
      name: "Javapedia",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://javapedia.vercel.app${page.url}`,
    },
  };

  const slug = params.slug?.join("/") || "index";

  return (
    <ClientGate slug={slug}>
      <DocsPage
        toc={page.data.toc}
        tableOfContent={{
          style: "clerk",
          single: false,
        }}
        full={page.data.full}
      >
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription className="mb-3">
          {page.data.description}
        </DocsDescription>

        <DocsBody>
          <FadeIn>
            <MDXContent
              components={getMDXComponents({
                // this allows you to link to other pages with relative file paths
                a: createRelativeLink(source, page),
              })}
            />
          </FadeIn>
        </DocsBody>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </DocsPage>
    </ClientGate>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

type Props = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const page = source.getPage(slug);

  if (!page) notFound();

  return {
    title: `${page.data.title} - Javapedia`,
    description: page.data.description,
    openGraph: {
      title: `${page.data.title} - Javapedia`,
      description: page.data.description,
      siteName: "Javapedia",
      url: `https://javapedia.vercel.app${page.url}`,
      images: `https://og-javapedia.vercel.app/og?title=${page.data.title}`,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}
