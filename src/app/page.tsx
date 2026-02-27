import Link from "next/link";
import { Camera, Cpu } from "lucide-react";
import { HeroRandomVisual } from "@/components/site/hero-random-visual";
import { Button } from "@/components/ui/button";
import { getPublicVisuals } from "@/lib/content";

export default async function HomePage() {
  const visuals = await getPublicVisuals();

  return (
    <section className="container flex min-h-[calc(100svh-4rem)] items-center py-0">
      <div className="w-full">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_440px]">
          <div className="max-w-4xl animate-fade-up space-y-6">
            <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
              Gabriel <span className="text-primary">Greier</span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              Computer Engineering student at the University of Saskatchewan. I build hardware + software systems and shoot cars.
            </p>
            <p className="text-sm text-muted-foreground/90">
              Saskatoon, SK - Open to internships - Available for photo shoots
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="gap-2">
                <Link href="/projects">
                  See my work
                  <Cpu className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="gap-2 border-primary/35 text-primary hover:bg-primary/10"
              >
                <Link href="/visuals">
                  View my visuals
                  <Camera className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="link" size="lg" className="px-0 font-semibold underline decoration-primary/70 underline-offset-4">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>
          </div>
          <HeroRandomVisual visuals={visuals} />
        </div>
      </div>
    </section>
  );
}
