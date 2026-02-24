import type { Metadata } from "next";
import { Caveat, Manrope } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { env } from "@/lib/env";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const display = Caveat({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Gabriel Greier | Engineering + Automotive Visuals",
    template: "%s | Gabriel Greier"
  },
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
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
