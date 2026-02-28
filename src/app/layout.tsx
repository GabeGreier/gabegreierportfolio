import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SiteChrome } from "@/components/site/site-chrome";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: "Gabriel Greier",
  description:
    "Portfolio of Gabriel Greier, a computer engineering builder creating hardware/software projects and cinematic automotive visuals.",
  openGraph: {
    title: "Gabriel Greier Portfolio",
    description:
      "Computer engineering projects and cinematic automotive photography in one cohesive portfolio.",
    type: "website",
    url: "/",
    siteName: "Gabriel Greier",
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
    title: "Gabriel Greier Portfolio",
    description: "Engineering projects and cinematic automotive visuals.",
    images: ["/og-image.svg"]
  },
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
