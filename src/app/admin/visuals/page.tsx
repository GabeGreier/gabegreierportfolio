import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteVisualAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sampleVisuals } from "@/lib/sample-data";
import { formatDate } from "@/lib/utils";
import type { Visual } from "@/lib/types";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parseSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminVisualsPage({ searchParams }: Props) {
  await requireAdmin();

  const params = await searchParams;
  const success = parseSingle(params.success);
  const error = parseSingle(params.error);

  const supabase = await createServerSupabaseClient();
  let visuals: Visual[] = sampleVisuals;

  if (supabase) {
    const { data } = await supabase.from("visuals").select("*").order("updated_at", { ascending: false });
    if (data) {
      visuals = data as Visual[];
    }
  }

  return (
    <AdminShell activePath="/admin/visuals" title="Visuals" description="Upload and manage automotive photography entries.">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          {success ? (
            <p className="rounded-md border border-emerald-300/80 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              Visual {success}.
            </p>
          ) : null}
          {error ? (
            <p className="rounded-md border border-red-300/80 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p>
          ) : null}
        </div>
        <Button asChild>
          <Link href="/admin/visuals/new">New Visual</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {visuals.map((visual) => (
          <Card key={visual.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">{visual.title}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={visual.published ? "default" : "muted"}>
                    {visual.published ? "Published" : "Draft"}
                  </Badge>
                  <Badge variant={visual.featured ? "default" : "outline"}>
                    {visual.featured ? "Featured" : "Not featured"}
                  </Badge>
                  {(visual.tags ?? []).map((tag) => (
                    <Badge key={`${visual.id}-${tag}`} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {visual.shot_date ? (
                    <span className="text-xs text-muted-foreground">Shot {formatDate(visual.shot_date)}</span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" className="border-primary/35 text-primary hover:bg-primary/10">
                  <Link href={`/admin/visuals/${visual.id}/edit`}>Edit</Link>
                </Button>
                <form action={deleteVisualAction}>
                  <input type="hidden" name="id" value={visual.id} />
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
