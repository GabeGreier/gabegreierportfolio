import Link from "next/link";
import { createVisualAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { VisualForm } from "@/components/admin/visual-form";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";

export default async function NewVisualPage() {
  await requireAdmin();

  return (
    <AdminShell activePath="/admin/visuals" title="New Visual" description="Upload a new automotive visual entry.">
      <div>
        <Button asChild variant="ghost">
          <Link href="/admin/visuals">Back to Visuals</Link>
        </Button>
      </div>
      <VisualForm action={createVisualAction} submitLabel="Create Visual" />
    </AdminShell>
  );
}
