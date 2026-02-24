import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Visual } from "@/lib/types";

export function VisualForm({
  action,
  submitLabel,
  initialValues
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  initialValues?: Partial<Visual>;
}) {
  return (
    <form action={action} className="space-y-6 rounded-xl border border-border/70 bg-card/70 p-6" encType="multipart/form-data">
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
        <div className="space-y-2">
          <Label htmlFor="image_url">Display Image URL</Label>
          <Input id="image_url" name="image_url" type="url" defaultValue={initialValues?.image_url ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
          <Input id="thumbnail_url" name="thumbnail_url" type="url" defaultValue={initialValues?.thumbnail_url ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image_file">Upload Display Image (max 8MB)</Label>
          <Input id="image_file" name="image_file" type="file" accept="image/*" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thumbnail_file">Upload Thumbnail (optional)</Label>
          <Input id="thumbnail_file" name="thumbnail_file" type="file" accept="image/*" />
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

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
