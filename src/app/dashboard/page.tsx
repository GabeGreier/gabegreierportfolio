import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard"
};

export default function DashboardPage() {
  return (
    <section className="container py-16">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">MVP Setup</p>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          Task 1 baseline is ready. Next tasks will add vehicle CRUD, checklist workflow, uploads, and exports.
        </p>
      </div>
    </section>
  );
}
