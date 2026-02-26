import { cache } from "react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sampleProjectImages, sampleProjects, sampleVisuals } from "@/lib/sample-data";
import type { Project, ProjectImage, Visual } from "@/lib/types";

export const getPublicProjects = cache(async (): Promise<Project[]> => {
  const supabase = await createServerSupabaseClient();
  const sortProjects = (projects: Project[]) =>
    projects.sort((a, b) => {
      if (a.featured !== b.featured) {
        return Number(b.featured) - Number(a.featured);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  if (!supabase) {
    return sortProjects(sampleProjects.filter((project) => project.published));
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return sortProjects(sampleProjects.filter((project) => project.published));
  }

  return data as Project[];
});

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const projects = await getPublicProjects();
  return projects.filter((project) => project.featured).slice(0, 3);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return sampleProjects.find((project) => project.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) {
    return sampleProjects.find((project) => project.slug === slug) ?? null;
  }

  return data as Project;
});

export const getProjectImages = cache(async (projectId: string): Promise<ProjectImage[]> => {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return sampleProjectImages.filter((image) => image.project_id === projectId);
  }

  const { data, error } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return sampleProjectImages.filter((image) => image.project_id === projectId);
  }

  return data as ProjectImage[];
});

export const getPublicVisuals = cache(async (): Promise<Visual[]> => {
  const supabase = await createServerSupabaseClient();
  const sortVisuals = (visuals: Visual[]) =>
    visuals.sort((a, b) => {
      if (a.featured !== b.featured) {
        return Number(b.featured) - Number(a.featured);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  if (!supabase) {
    return sortVisuals(sampleVisuals.filter((visual) => visual.published));
  }

  const { data, error } = await supabase
    .from("visuals")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return sortVisuals(sampleVisuals.filter((visual) => visual.published));
  }

  return data as Visual[];
});

export const getFeaturedVisuals = cache(async (): Promise<Visual[]> => {
  const visuals = await getPublicVisuals();
  return visuals.filter((visual) => visual.featured).slice(0, 9);
});
