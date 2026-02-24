import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Project, ProjectImage } from "@/lib/types";

type ProjectFormValues = Partial<Project> & {
  gallery_urls?: string;
  images?: ProjectImage[];
};

export function ProjectForm({
  action,
  submitLabel,
  initialValues
}: {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  initialValues?: ProjectFormValues;
}) {
  const toolsStackValue = Array.isArray(initialValues?.tools_stack) ? initialValues.tools_stack.join(", ") : "";
  const galleryValue =
    initialValues?.gallery_urls ||
    (initialValues?.images?.length
      ? initialValues.images
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((image) => image.image_url)
          .join("\n")
      : "");

  return (
    <form action={action} className="space-y-6 rounded-xl border border-border/70 bg-card/70 p-6">
      {initialValues?.id ? <Input type="hidden" name="id" defaultValue={initialValues.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required defaultValue={initialValues?.title ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={initialValues?.slug ?? ""} placeholder="auto-generated-if-empty" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tools_stack">Tools / Stack (comma separated)</Label>
          <Input id="tools_stack" name="tools_stack" defaultValue={toolsStackValue} placeholder="Verilog, FPGA, React" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="short_description">Short Description</Label>
          <Textarea
            id="short_description"
            name="short_description"
            required
            defaultValue={initialValues?.short_description ?? ""}
            rows={3}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="full_description">Full Description</Label>
          <Textarea id="full_description" name="full_description" required defaultValue={initialValues?.full_description ?? ""} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="problem_goal">Problem / Goal</Label>
          <Textarea id="problem_goal" name="problem_goal" required defaultValue={initialValues?.problem_goal ?? ""} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="what_built">What Was Built</Label>
          <Textarea id="what_built" name="what_built" required defaultValue={initialValues?.what_built ?? ""} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="challenges">Challenges</Label>
          <Textarea id="challenges" name="challenges" required defaultValue={initialValues?.challenges ?? ""} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="learnings">What Was Learned</Label>
          <Textarea id="learnings" name="learnings" required defaultValue={initialValues?.learnings ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input id="github_url" name="github_url" type="url" defaultValue={initialValues?.github_url ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="live_url">Live Demo URL</Label>
          <Input id="live_url" name="live_url" type="url" defaultValue={initialValues?.live_url ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cover_image_url">Cover Image URL</Label>
          <Input id="cover_image_url" name="cover_image_url" type="url" defaultValue={initialValues?.cover_image_url ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cover_image_file">Or Upload Cover Image (max 8MB)</Label>
          <Input id="cover_image_file" name="cover_image_file" type="file" accept="image/*" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="gallery_urls">Gallery Image URLs (one per line)</Label>
          <Textarea id="gallery_urls" name="gallery_urls" rows={6} defaultValue={galleryValue} />
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
