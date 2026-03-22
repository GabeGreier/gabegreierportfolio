import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SiteChrome } from "@/components/site/site-chrome";
import { env } from "@/lib/env";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Gabriel Greier | Computer Engineering Portfolio",
    template: "%s | Gabriel Greier"
  },
  description:
    "Portfolio of Gabriel Greier, a computer engineering builder creating hardware/software projects and cinematic automotive visuals.",
  keywords: [
    "Gabriel Greier",
    "computer engineering portfolio",
    "software projects",
    "hardware projects",
    "automotive photography",
    "Saskatoon developer"
  ],
  authors: [{ name: "Gabriel Greier" }],
  creator: "Gabriel Greier",
  publisher: "Gabriel Greier",
  category: "Technology",
  openGraph: {
    title: "Gabriel Greier | Computer Engineering Portfolio",
    description:
      "Computer engineering projects and cinematic automotive photography in one cohesive portfolio.",
    type: "website",
    url: "/",
    siteName: "Gabriel Greier",
    locale: "en_CA",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Gabriel Greier portfolio preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabriel Greier | Computer Engineering Portfolio",
    description: "Engineering projects and cinematic automotive visuals.",
    images: ["/og-image.svg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="font-sans">
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
