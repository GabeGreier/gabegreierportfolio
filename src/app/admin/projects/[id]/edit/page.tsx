import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProjectAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectForm } from "@/components/admin/project-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sampleProjectImages, sampleProjects } from "@/lib/sample-data";
import type { Project, ProjectImage } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;

  const supabase = await createServerSupabaseClient();
  let project = sampleProjects.find((item) => item.id === id) ?? null;
  let images: ProjectImage[] = sampleProjectImages.filter((item) => item.project_id === id);

  if (supabase) {
    const [{ data: projectData }, { data: imageData }] = await Promise.all([
      supabase.from("projects").select("*").eq("id", id).maybeSingle(),
      supabase.from("project_images").select("*").eq("project_id", id).order("sort_order", { ascending: true })
    ]);

    if (projectData) {
      project = projectData as Project;
    }

    if (imageData) {
      images = imageData as ProjectImage[];
    }
  }

  if (!project) {
    notFound();
  }

  return (
    <AdminShell activePath="/admin/projects" title={`Edit ${project.title}`} description="Update project copy, publish state, and featured status.">
      <div>
        <Button asChild variant="ghost">
          <Link href="/admin/projects">Back to Projects</Link>
        </Button>
      </div>
      <ProjectForm action={updateProjectAction} submitLabel="Save Changes" initialValues={{ ...project, images }} />
    </AdminShell>
  );
}
