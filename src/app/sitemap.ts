import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.siteUrl;

  return [
    { url: `${baseUrl}/`, priority: 1 },
    { url: `${baseUrl}/projects`, priority: 0.8 },
    { url: `${baseUrl}/visuals`, priority: 0.8 },
    { url: `${baseUrl}/about`, priority: 0.6 },
    { url: `${baseUrl}/contact`, priority: 0.6 }
  ];
}
