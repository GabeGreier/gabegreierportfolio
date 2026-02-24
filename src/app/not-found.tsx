import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container flex min-h-[50vh] flex-col items-start justify-center gap-4 py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-primary">404</p>
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="max-w-md text-muted-foreground">The page you requested does not exist or is no longer available.</p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
