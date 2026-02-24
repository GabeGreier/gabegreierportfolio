import Link from "next/link";
import { FolderKanban, ImageIcon, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAdmin } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sampleProjects, sampleVisuals } from "@/lib/sample-data";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const supabase = await createServerSupabaseClient();

  let projectCount = sampleProjects.length;
  let visualCount = sampleVisuals.length;

  if (supabase) {
    const [{ count: dbProjectCount }, { count: dbVisualCount }] = await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("visuals").select("id", { count: "exact", head: true })
    ]);

    projectCount = dbProjectCount ?? 0;
    visualCount = dbVisualCount ?? 0;
  }

  return (
    <AdminShell
      activePath="/admin/dashboard"
      title="Dashboard"
      description="Manage published work, featured content, and portfolio visuals."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="size-5 text-primary" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold">{projectCount}</p>
            <Button asChild variant="outline" className="border-primary/35 text-primary hover:bg-primary/10">
              <Link href="/admin/projects">Manage Projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="size-5 text-primary" />
              Visuals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold">{visualCount}</p>
            <Button asChild variant="outline" className="border-primary/35 text-primary hover:bg-primary/10">
              <Link href="/admin/visuals">Manage Visuals</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/admin/projects/new" className="inline-flex items-center gap-2">
            <Plus className="size-4" />
            New Project
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-primary/35 text-primary hover:bg-primary/10">
          <Link href="/admin/visuals/new" className="inline-flex items-center gap-2">
            <Plus className="size-4" />
            New Visual
          </Link>
        </Button>
      </div>
    </AdminShell>
  );
}
