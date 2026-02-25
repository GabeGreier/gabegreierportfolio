import Link from "next/link";
import { Camera, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="container flex min-h-[calc(100svh-4rem)] items-center py-0">
      <div className="w-full">
        <div className="max-w-4xl animate-fade-up space-y-6">
          <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
            Gabriel <span className="text-primary">Greier</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            Computer Engineering student at the University of Saskatchewan.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="gap-2">
              <Link href="/projects">
                View Projects
                <Cpu className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 border-primary/35 text-primary hover:bg-primary/10">
              <Link href="/visuals">
                View Visuals
                <Camera className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
