import Link from "next/link";
import { signOutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/visuals", label: "Visuals" }
];

export function AdminShell({
  title,
  description,
  children,
  activePath
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  activePath: string;
}) {
  return (
    <section className="container space-y-8 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <form action={signOutAction}>
          <Button variant="outline">Sign Out</Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={activePath === item.href ? "default" : "outline"}
            className={cn(activePath === item.href ? "" : "border-primary/35 text-primary hover:bg-primary/10")}
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </div>

      {children}
    </section>
  );
}
