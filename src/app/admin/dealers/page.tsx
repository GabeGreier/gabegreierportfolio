import type { Metadata } from "next";
import Link from "next/link";
import { signOutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { requirePortalUser } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "Dealers Admin"
};

export default async function AdminDealersPage() {
  await requirePortalUser({
    roles: ["SUPER_ADMIN"],
    requireDealer: false
  });

  return (
    <section className="container py-16">
      <div className="max-w-3xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">SUPER_ADMIN</p>
          <form action={signOutAction}>
            <Button variant="outline">Sign Out</Button>
          </form>
        </div>
        <h1 className="text-3xl font-semibold">Dealers Management</h1>
        <p className="text-muted-foreground">
          Super-admin route guard is active. Task 10 will implement full dealer creation and invite flows.
        </p>
        <Button asChild variant="outline" className="border-primary/35 text-primary hover:bg-primary/10">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </section>
  );
}
