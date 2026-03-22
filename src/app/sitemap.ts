import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getPublicProjects, getPublicVisuals } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.siteUrl;
  const projects = await getPublicProjects();
  const visuals = await getPublicVisuals();

  const latestProjectUpdate = projects.reduce<string | null>((latest, project) => {
    if (!latest) {
      return project.updated_at;
    }
    return new Date(project.updated_at) > new Date(latest) ? project.updated_at : latest;
  }, null);

  const latestVisualUpdate = visuals.reduce<string | null>((latest, visual) => {
    if (!latest) {
      return visual.updated_at;
    }
    return new Date(visual.updated_at) > new Date(latest) ? visual.updated_at : latest;
  }, null);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, priority: 1, changeFrequency: "weekly", lastModified: new Date() },
    { url: `${baseUrl}/projects`, priority: 0.9, changeFrequency: "weekly", lastModified: latestProjectUpdate ?? new Date() },
    { url: `${baseUrl}/visuals`, priority: 0.8, changeFrequency: "weekly", lastModified: latestVisualUpdate ?? new Date() },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: "monthly", lastModified: new Date() },
    { url: `${baseUrl}/contact`, priority: 0.7, changeFrequency: "monthly", lastModified: new Date() }
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
    lastModified: project.updated_at
  }));

  return [...staticPages, ...projectPages];
}
