import type { Metadata } from "next";
import { signOutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { requirePortalUser } from "@/lib/portal-auth";

export const metadata: Metadata = {
  title: "Dashboard"
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parseSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function errorLabel(error: string | undefined) {
  switch (error) {
    case "forbidden":
      return "Your account does not have access to that page.";
    case "dealer-required":
      return "Your profile is missing a dealer assignment.";
    default:
      return null;
  }
}

export default async function DashboardPage({ searchParams }: Props) {
  const { user, profile } = await requirePortalUser({
    requireDealer: true
  });
  const params = await searchParams;
  const error = errorLabel(parseSingle(params.error));

  return (
    <section className="container py-16">
      <div className="max-w-3xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Dealership Portal</p>
          <form action={signOutAction}>
            <Button variant="outline">Sign Out</Button>
          </form>
        </div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Auth, profile bootstrap, and role guards are active. Next tasks will add vehicle CRUD, checklist workflow,
          uploads, and exports.
        </p>
        {error ? (
          <p className="rounded-md border border-red-300/80 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</p>
        ) : null}
        <div className="rounded-lg border border-border bg-card p-4 text-sm">
          <p>
            <strong>User:</strong> {user.email ?? user.id}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
          <p>
            <strong>Dealer:</strong> {profile.dealer_id ?? "Unassigned"}
          </p>
        </div>
      </div>
    </section>
  );
}
