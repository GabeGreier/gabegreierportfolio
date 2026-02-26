"use client";

import { type ChangeEvent, useMemo, useRef, useState, useTransition } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BulkVisualEntry = {
  id: string;
  file: File;
  title: string;
  tags: string;
  description: string;
  shotDate: string;
};

const MAX_UPLOAD_SIZE = 15 * 1024 * 1024;

function getExtension(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return ext && ext.length <= 6 ? ext : "jpg";
}

function defaultTitleFromFile(fileName: string) {
  return fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

async function uploadVisualFile(file: File) {
  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error(`\"${file.name}\" exceeds 15MB.`);
  }

  const hasImageMime = file.type.startsWith("image/");
  const hasKnownImageExtension = /\.(jpe?g|png|webp|avif|heic|heif)$/i.test(file.name);

  if (!hasImageMime && !hasKnownImageExtension) {
    throw new Error(`\"${file.name}\" is not a supported image file.`);
  }

  const supabase = createBrowserSupabaseClient();
  const path = `display/${crypto.randomUUID()}.${getExtension(file.name)}`;

  const { error } = await supabase.storage.from("visuals").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined
  });

  if (error) {
    throw new Error(`Failed to upload \"${file.name}\": ${error.message}`);
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from("visuals").getPublicUrl(path);

  return publicUrl;
}

export function BulkVisualUploadForm({
  action
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [entries, setEntries] = useState<BulkVisualEntry[]>([]);
  const [commonTags, setCommonTags] = useState("");
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const isBusy = isPending || uploadingCount > 0;

  const hasEntries = useMemo(() => entries.length > 0, [entries.length]);

  function onFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const newEntries: BulkVisualEntry[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      title: defaultTitleFromFile(file.name),
      tags: "",
      description: "",
      shotDate: ""
    }));

    setEntries((previous) => [...previous, ...newEntries]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function updateEntry(id: string, updates: Partial<Omit<BulkVisualEntry, "id" | "file">>) {
    setEntries((previous) =>
      previous.map((entry) => {
        if (entry.id !== id) {
          return entry;
        }
        return { ...entry, ...updates };
      })
    );
  }

  function removeEntry(id: string) {
    setEntries((previous) => previous.filter((entry) => entry.id !== id));
  }

  async function submitBulk() {
    if (!hasEntries || isBusy) {
      return;
    }

    setError(null);

    try {
      setUploadingCount(entries.length);

      const uploaded = [] as Array<{
        title: string;
        description: string;
        image_url: string;
        thumbnail_url: string;
        tags: string[];
        shot_date: string | null;
        featured: boolean;
        published: boolean;
      }>;

      for (const entry of entries) {
        const imageUrl = await uploadVisualFile(entry.file);

        const tags = [
          ...commonTags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          ...entry.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        ];

        const dedupedTags = Array.from(new Map(tags.map((tag) => [tag.toLowerCase(), tag])).values());

        uploaded.push({
          title: entry.title.trim() || defaultTitleFromFile(entry.file.name),
          description: entry.description.trim(),
          image_url: imageUrl,
          thumbnail_url: imageUrl,
          tags: dedupedTags,
          shot_date: entry.shotDate || null,
          featured,
          published
        });

        setUploadingCount((count) => Math.max(0, count - 1));
      }

      const formData = new FormData();
      formData.set("entries", JSON.stringify(uploaded));

      startTransition(() => {
        void action(formData);
      });
    } catch (uploadError) {
      setUploadingCount(0);
      const message = uploadError instanceof Error ? uploadError.message : "Bulk upload failed.";
      setError(message);
    }
  }

  return (
    <div className="space-y-5 rounded-xl border border-border/70 bg-card/70 p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Bulk Upload</h2>
        <p className="text-sm text-muted-foreground">
          Select multiple files, rename each visual, and apply shared tags in one pass.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="bulk_files">Select Files</Label>
          <Input ref={inputRef} id="bulk_files" type="file" accept="image/*,.heic,.heif" multiple onChange={onFilesSelected} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="common_tags">Shared Tags (comma separated)</Label>
          <Input
            id="common_tags"
            value={commonTags}
            onChange={(event) => setCommonTags(event.target.value)}
            placeholder="Lambo, Night"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
          Published
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
          Featured
        </label>
      </div>

      {hasEntries ? (
        <div className="space-y-3">
          {entries.map((entry, index) => (
            <div key={entry.id} className="grid gap-3 border border-border/70 p-3 md:grid-cols-[1fr_1fr_150px_auto]">
              <div className="space-y-1">
                <Label htmlFor={`title_${entry.id}`}>Title</Label>
                <Input
                  id={`title_${entry.id}`}
                  value={entry.title}
                  onChange={(event) => updateEntry(entry.id, { title: event.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`tags_${entry.id}`}>Tags</Label>
                <Input
                  id={`tags_${entry.id}`}
                  value={entry.tags}
                  onChange={(event) => updateEntry(entry.id, { tags: event.target.value })}
                  placeholder="Rolling, Sunset"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`shot_${entry.id}`}>Shot Date</Label>
                <Input
                  id={`shot_${entry.id}`}
                  type="date"
                  value={entry.shotDate}
                  onChange={(event) => updateEntry(entry.id, { shotDate: event.target.value })}
                />
              </div>
              <div className="flex items-end">
                <Button type="button" variant="destructive" onClick={() => removeEntry(entry.id)}>
                  Remove
                </Button>
              </div>
              <div className="space-y-1 md:col-span-4">
                <Label htmlFor={`desc_${entry.id}`}>Description (optional)</Label>
                <Textarea
                  id={`desc_${entry.id}`}
                  rows={2}
                  value={entry.description}
                  onChange={(event) => updateEntry(entry.id, { description: event.target.value })}
                />
              </div>
              <p className="text-xs text-muted-foreground md:col-span-4">
                File {index + 1}: {entry.file.name}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="rounded-md border border-red-300/80 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p> : null}

      <Button type="button" onClick={submitBulk} disabled={!hasEntries || isBusy}>
        {uploadingCount > 0 ? `Uploading ${uploadingCount}...` : isPending ? "Saving..." : "Create Bulk Visuals"}
      </Button>
    </div>
  );
}
