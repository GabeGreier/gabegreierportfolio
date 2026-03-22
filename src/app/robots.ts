import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*"]
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/admin/*"]
      }
    ],
    host: env.siteUrl,
    sitemap: `${env.siteUrl}/sitemap.xml`
  };
}
