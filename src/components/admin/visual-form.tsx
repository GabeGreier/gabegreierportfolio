"use client";

import { type FormEvent, useRef, useState, useTransition } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Visual } from "@/lib/types";

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;

function getExtension(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ext && ext.length <= 6 ? ext : "jpg";
}

async function uploadVisualFile(file: File, folder: "display" | "thumbs") {
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Upload exceeds 15MB. Please upload an optimized image.");
  }

  const hasImageMime = file.type.startsWith("image/");
  const hasKnownImageExtension = /\.(jpe?g|png|webp|avif|heic|heif)$/i.test(file.name);

  if (!hasImageMime && !hasKnownImageExtension) {
    throw new Error("Only image uploads are allowed.");
  }

  const supabase = createBrowserSupabaseClient();
  const path = `${folder}/${crypto.randomUUID()}.${getExtension(file.name)}`;

  const { error } = await supabase.storage.from("visuals").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from("visuals").getPublicUrl(path);

  return publicUrl;
}

export function VisualForm({
  action,
  submitLabel,
  initialValues
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  initialValues?: Partial<Visual>;
}) {
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const tagsValue = Array.isArray(initialValues?.tags) ? initialValues.tags.join(", ") : "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadError(null);

    const form = formRef.current;
    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const imageFile = formData.get("image_file");
    const thumbnailFile = formData.get("thumbnail_file");

    try {
      if (imageFile instanceof File && imageFile.size > 0) {
        const imageUrl = await uploadVisualFile(imageFile, "display");
        formData.set("image_url", imageUrl);
      }

      if (thumbnailFile instanceof File && thumbnailFile.size > 0) {
        const thumbnailUrl = await uploadVisualFile(thumbnailFile, "thumbs");
        formData.set("thumbnail_url", thumbnailUrl);
      }

      formData.delete("image_file");
      formData.delete("thumbnail_file");

      startTransition(() => {
        void action(formData);
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      setUploadError(message);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border/70 bg-card/70 p-6">
      {initialValues?.id ? <Input type="hidden" name="id" defaultValue={initialValues.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required defaultValue={initialValues?.title ?? ""} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={initialValues?.description ?? ""} rows={4} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" name="tags" defaultValue={tagsValue} placeholder="Lambo, Night, Rolling" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image_url">Display Image URL</Label>
          <Input id="image_url" name="image_url" type="url" defaultValue={initialValues?.image_url ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
          <Input id="thumbnail_url" name="thumbnail_url" type="url" defaultValue={initialValues?.thumbnail_url ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image_file">Upload Display Image (max 15MB)</Label>
          <Input id="image_file" name="image_file" type="file" accept="image/*,.heic,.heif" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thumbnail_file">Upload Thumbnail (optional)</Label>
          <Input id="thumbnail_file" name="thumbnail_file" type="file" accept="image/*,.heic,.heif" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shot_date">Shot Date</Label>
          <Input
            id="shot_date"
            name="shot_date"
            type="date"
            defaultValue={initialValues?.shot_date ? initialValues.shot_date.slice(0, 10) : ""}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={Boolean(initialValues?.featured)} />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={Boolean(initialValues?.published)} />
          Published
        </label>
      </div>

      {uploadError ? (
        <p className="rounded-md border border-red-300/80 bg-red-50 px-3 py-2 text-sm text-red-900">{uploadError}</p>
      ) : null}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
