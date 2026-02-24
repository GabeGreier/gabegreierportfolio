import Link from "next/link";
import { createProjectAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProjectForm } from "@/components/admin/project-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";

export default async function NewProjectPage() {
  await requireAdmin();

  return (
    <AdminShell activePath="/admin/projects" title="New Project" description="Create a new project case study entry.">
      <div>
        <Button asChild variant="ghost">
          <Link href="/admin/projects">Back to Projects</Link>
        </Button>
      </div>
      <ProjectForm action={createProjectAction} submitLabel="Create Project" />
    </AdminShell>
  );
}
