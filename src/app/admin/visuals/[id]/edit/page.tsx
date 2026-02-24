import Link from "next/link";
import { notFound } from "next/navigation";
import { updateVisualAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { VisualForm } from "@/components/admin/visual-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sampleVisuals } from "@/lib/sample-data";
import type { Visual } from "@/lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditVisualPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;

  const supabase = await createServerSupabaseClient();
  let visual = sampleVisuals.find((item) => item.id === id) ?? null;

  if (supabase) {
    const { data } = await supabase.from("visuals").select("*").eq("id", id).maybeSingle();
    if (data) {
      visual = data as Visual;
    }
  }

  if (!visual) {
    notFound();
  }

  return (
    <AdminShell activePath="/admin/visuals" title={`Edit ${visual.title}`} description="Update visual metadata and publish status.">
      <div>
        <Button asChild variant="ghost">
          <Link href="/admin/visuals">Back to Visuals</Link>
        </Button>
      </div>
      <VisualForm action={updateVisualAction} submitLabel="Save Changes" initialValues={visual} />
    </AdminShell>
  );
}
