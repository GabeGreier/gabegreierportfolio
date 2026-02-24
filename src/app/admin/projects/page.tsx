import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteProjectAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sampleProjects } from "@/lib/sample-data";
import type { Project } from "@/lib/types";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parseSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProjectsPage({ searchParams }: Props) {
  await requireAdmin();

  const params = await searchParams;
  const success = parseSingle(params.success);
  const error = parseSingle(params.error);

  const supabase = await createServerSupabaseClient();
  let projects: Project[] = sampleProjects;

  if (supabase) {
    const { data } = await supabase.from("projects").select("*").order("updated_at", { ascending: false });
    if (data) {
      projects = data as Project[];
    }
  }

  return (
    <AdminShell activePath="/admin/projects" title="Projects" description="Create, update, publish, and feature project case studies.">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {success ? (
            <p className="rounded-md border border-emerald-300/80 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              Project {success}.
            </p>
          ) : null}
          {error ? (
            <p className="rounded-md border border-red-300/80 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p>
          ) : null}
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">New Project</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{project.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={project.published ? "default" : "muted"}>
                    {project.published ? "Published" : "Draft"}
                  </Badge>
                  <Badge variant={project.featured ? "default" : "outline"}>
                    {project.featured ? "Featured" : "Not featured"}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" className="border-primary/35 text-primary hover:bg-primary/10">
                  <Link href={`/admin/projects/${project.id}/edit`}>Edit</Link>
                </Button>
                <form action={deleteProjectAction}>
                  <input type="hidden" name="id" value={project.id} />
                  <Button type="submit" variant="destructive">
                    Delete
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
