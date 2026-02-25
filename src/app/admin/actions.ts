"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { isAdminEmail } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;

function parseBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function parseToolsStack(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseGalleryUrls(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseTags(value: string) {
  const normalized: string[] = [];
  const seen = new Set<string>();

  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .forEach((tag) => {
      const key = tag.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        normalized.push(tag);
      }
    });

  return normalized;
}

async function requireAdminSupabase() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/admin?error=missing-supabase");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin?error=unauthorized");
  }

  return supabase;
}

async function uploadImage(
  supabase: Awaited<ReturnType<typeof requireAdminSupabase>>,
  bucket: string,
  file: File,
  folder: string
) {
  if (!file || file.size === 0) {
    return null;
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Upload exceeds 15MB. Please upload an optimized image.");
  }

  const hasImageMime = file.type.startsWith("image/");
  const hasKnownImageExtension = /\.(jpe?g|png|webp|avif|heic|heif)$/i.test(file.name);

  if (!hasImageMime && !hasKnownImageExtension) {
    throw new Error("Only image uploads are allowed.");
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return publicUrl;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unexpected error";
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/admin?error=missing-supabase");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin?error=invalid-credentials");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!isAdminEmail(user?.email)) {
    await supabase.auth.signOut();
    redirect("/admin?error=unauthorized");
  }

  redirect("/admin/dashboard");
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/admin");
}

export async function createProjectAction(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const title = String(formData.get("title") ?? "").trim();
  const inputSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(inputSlug || title);

  const coverImageFile = formData.get("cover_image_file");
  const uploadedCoverImage =
    coverImageFile instanceof File ? await uploadImage(supabase, "project-images", coverImageFile, "covers") : null;

  const coverImageUrl = uploadedCoverImage || String(formData.get("cover_image_url") ?? "").trim();

  const payload = {
    title,
    slug,
    short_description: String(formData.get("short_description") ?? "").trim(),
    full_description: String(formData.get("full_description") ?? "").trim(),
    problem_goal: String(formData.get("problem_goal") ?? "").trim(),
    what_built: String(formData.get("what_built") ?? "").trim(),
    tools_stack: parseToolsStack(String(formData.get("tools_stack") ?? "")),
    challenges: String(formData.get("challenges") ?? "").trim(),
    learnings: String(formData.get("learnings") ?? "").trim(),
    github_url: String(formData.get("github_url") ?? "").trim() || null,
    live_url: String(formData.get("live_url") ?? "").trim() || null,
    cover_image_url: coverImageUrl,
    featured: parseBoolean(formData, "featured"),
    published: parseBoolean(formData, "published")
  };

  const { data, error } = await supabase.from("projects").insert(payload).select("id").single();

  if (error) {
    redirect(`/admin/projects?error=${encodeURIComponent(error.message)}`);
  }

  const galleryUrls = parseGalleryUrls(String(formData.get("gallery_urls") ?? ""));
  if (data?.id && galleryUrls.length > 0) {
    const imageRows = galleryUrls.map((url, index) => ({
      project_id: data.id,
      image_url: url,
      alt_text: `${title} image ${index + 1}`,
      sort_order: index
    }));

    await supabase.from("project_images").insert(imageRows);
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?success=created");
}

export async function updateProjectAction(formData: FormData) {
  const supabase = await requireAdminSupabase();

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const inputSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(inputSlug || title);

  const coverImageFile = formData.get("cover_image_file");
  const uploadedCoverImage =
    coverImageFile instanceof File && coverImageFile.size > 0
      ? await uploadImage(supabase, "project-images", coverImageFile, "covers")
      : null;

  const payload = {
    title,
    slug,
    short_description: String(formData.get("short_description") ?? "").trim(),
    full_description: String(formData.get("full_description") ?? "").trim(),
    problem_goal: String(formData.get("problem_goal") ?? "").trim(),
    what_built: String(formData.get("what_built") ?? "").trim(),
    tools_stack: parseToolsStack(String(formData.get("tools_stack") ?? "")),
    challenges: String(formData.get("challenges") ?? "").trim(),
    learnings: String(formData.get("learnings") ?? "").trim(),
    github_url: String(formData.get("github_url") ?? "").trim() || null,
    live_url: String(formData.get("live_url") ?? "").trim() || null,
    cover_image_url: uploadedCoverImage || String(formData.get("cover_image_url") ?? "").trim(),
    featured: parseBoolean(formData, "featured"),
    published: parseBoolean(formData, "published")
  };

  const { error } = await supabase.from("projects").update(payload).eq("id", id);

  if (error) {
    redirect(`/admin/projects?error=${encodeURIComponent(error.message)}`);
  }

  const galleryUrls = parseGalleryUrls(String(formData.get("gallery_urls") ?? ""));
  await supabase.from("project_images").delete().eq("project_id", id);

  if (galleryUrls.length > 0) {
    const imageRows = galleryUrls.map((url, index) => ({
      project_id: id,
      image_url: url,
      alt_text: `${title} image ${index + 1}`,
      sort_order: index
    }));

    await supabase.from("project_images").insert(imageRows);
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/admin/projects");
  redirect("/admin/projects?success=updated");
}

export async function deleteProjectAction(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = String(formData.get("id") ?? "").trim();

  await supabase.from("project_images").delete().eq("project_id", id);
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    redirect(`/admin/projects?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?success=deleted");
}

export async function createVisualAction(formData: FormData) {
  try {
    const supabase = await requireAdminSupabase();

    const imageFile = formData.get("image_file");
    const thumbnailFile = formData.get("thumbnail_file");
    const uploadedImage =
      imageFile instanceof File ? await uploadImage(supabase, "visuals", imageFile, "display") : null;
    const uploadedThumbnail =
      thumbnailFile instanceof File && thumbnailFile.size > 0
        ? await uploadImage(supabase, "visuals", thumbnailFile, "thumbs")
        : null;

    const imageUrl = uploadedImage || String(formData.get("image_url") ?? "").trim();
    const thumbnailUrl =
      uploadedThumbnail || String(formData.get("thumbnail_url") ?? "").trim() || imageUrl || null;

    const payload = {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || null,
      image_url: imageUrl,
      thumbnail_url: thumbnailUrl,
      tags: parseTags(String(formData.get("tags") ?? "")),
      featured: parseBoolean(formData, "featured"),
      published: parseBoolean(formData, "published"),
      shot_date: String(formData.get("shot_date") ?? "").trim() || null
    };

    const { error } = await supabase.from("visuals").insert(payload);

    if (error) {
      redirect(`/admin/visuals?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/");
    revalidatePath("/visuals");
    revalidatePath("/admin/visuals");
    redirect("/admin/visuals?success=created");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    redirect(`/admin/visuals?error=${encodeURIComponent(getErrorMessage(error))}`);
  }
}

export async function updateVisualAction(formData: FormData) {
  try {
    const supabase = await requireAdminSupabase();

    const id = String(formData.get("id") ?? "").trim();

    const imageFile = formData.get("image_file");
    const thumbnailFile = formData.get("thumbnail_file");
    const uploadedImage =
      imageFile instanceof File && imageFile.size > 0
        ? await uploadImage(supabase, "visuals", imageFile, "display")
        : null;
    const uploadedThumbnail =
      thumbnailFile instanceof File && thumbnailFile.size > 0
        ? await uploadImage(supabase, "visuals", thumbnailFile, "thumbs")
        : null;

    const imageUrl = uploadedImage || String(formData.get("image_url") ?? "").trim();
    const thumbnailUrl =
      uploadedThumbnail || String(formData.get("thumbnail_url") ?? "").trim() || imageUrl || null;

    const payload = {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || null,
      image_url: imageUrl,
      thumbnail_url: thumbnailUrl,
      tags: parseTags(String(formData.get("tags") ?? "")),
      featured: parseBoolean(formData, "featured"),
      published: parseBoolean(formData, "published"),
      shot_date: String(formData.get("shot_date") ?? "").trim() || null
    };

    const { error } = await supabase.from("visuals").update(payload).eq("id", id);

    if (error) {
      redirect(`/admin/visuals?error=${encodeURIComponent(error.message)}`);
    }

    revalidatePath("/");
    revalidatePath("/visuals");
    revalidatePath("/admin/visuals");
    redirect("/admin/visuals?success=updated");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    redirect(`/admin/visuals?error=${encodeURIComponent(getErrorMessage(error))}`);
  }
}

export async function deleteVisualAction(formData: FormData) {
  const supabase = await requireAdminSupabase();
  const id = String(formData.get("id") ?? "").trim();

  const { error } = await supabase.from("visuals").delete().eq("id", id);

  if (error) {
    redirect(`/admin/visuals?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/visuals");
  revalidatePath("/admin/visuals");
  redirect("/admin/visuals?success=deleted");
}
