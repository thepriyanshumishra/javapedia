import { programsSource } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HowTo, WithContext } from "schema-dts";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = programsSource.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;

  const jsonLd: WithContext<HowTo> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.data.title,
    description: page.data.description,
    provider: {
      "@type": "Organization",
      name: "Javapedia",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://javapedia.vercel.app${page.url}`,
    },
  };

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{
        style: "clerk",
      }}
      full={page.data.full}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(programsSource, page),
          })}
        />
      </DocsBody>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return programsSource.generateParams();
}

type Props = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = programsSource.getPage(slug);
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
