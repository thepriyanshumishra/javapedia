import SearchDialog from "@/components/search";
import { GoogleAnalytics } from "@next/third-parties/google";
import { RootProvider } from "fumadocs-ui/provider";
import type { Metadata } from "next";
import { Funnel_Display, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./global.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: "variable",
  display: "swap",
  preload: true,
});

const funnelDisplay = Funnel_Display({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  variable: "--font-funnel-display",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://javapedia.vercel.app"),
  title: {
    default: "Javapedia - The Free Java Learning Platform",
    template: "%s | Javapedia",
  },
  description:
    "Master Java programming for free with Javapedia. Interactive tutorials, comprehensive documentation, and a supportive community for beginners to experts.",
  keywords: [
    "Java",
    "Programming",
    "Learn Java",
    "Java Tutorial",
    "Java Documentation",
    "Coding",
    "Education",
    "Open Source",
  ],
  authors: [
    {
      name: "Priyanshu Mishra",
      url: "https://github.com/thepriyanshumishra",
    },
  ],
  creator: "Priyanshu Mishra",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://javapedia.vercel.app",
    title: "Javapedia - The Free Java Learning Platform",
    description:
      "Master Java programming for free with Javapedia. Interactive tutorials, comprehensive documentation, and a supportive community.",
    siteName: "Javapedia",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Javapedia - Learn Java for Free",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Javapedia - The Free Java Learning Platform",
    description:
      "Master Java programming for free with Javapedia. Interactive tutorials, comprehensive documentation, and a supportive community.",
    images: ["/og.png"],
    creator: "@thepriyanshumishra",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${funnelDisplay.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <RootProvider
          search={{
            SearchDialog,
          }}
        >
          {children}
        </RootProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS!} />
    </html>
  );
}
