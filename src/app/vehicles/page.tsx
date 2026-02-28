import type { Metadata } from "next";
import Link from "next/link";
import { signOutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { requirePortalUser } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "Vehicles"
};

export default async function VehiclesPage() {
  await requirePortalUser({
    requireDealer: true
  });

  return (
    <section className="container py-16">
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Vehicles</p>
          <form action={signOutAction}>
            <Button variant="outline">Sign Out</Button>
          </form>
        </div>
        <h1 className="text-3xl font-semibold">Vehicle Workspace</h1>
        <p className="text-muted-foreground">
          This route is role-guarded and dealer-scoped. Task 4 will replace this with full vehicle list and CRUD.
        </p>
        <Button asChild variant="outline" className="border-primary/35 text-primary hover:bg-primary/10">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </section>
  );
}
