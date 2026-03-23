import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicVisuals } from "@/lib/content";

export default async function NotFound() {
  const visuals = await getPublicVisuals();
  const randomVisual = visuals[Math.floor(Math.random() * visuals.length)];
  const visualUrl = randomVisual?.thumbnail_url ?? randomVisual?.image_url ?? null;

  return (
    <section className="container py-10 md:py-16">
      <div className="grid items-stretch gap-6 border border-border/70 bg-card/45 p-5 md:grid-cols-[minmax(0,1fr)_380px] md:p-7">
        <div className="flex flex-col justify-center gap-5">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">404 - Missed Apex</p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-5xl">This page took the wrong turn.</h1>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            The link may be broken, expired, or moved. Head back to the main routes and keep exploring.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild className="gap-2">
              <Link href="/">
                <ArrowLeft className="size-4" />
                Back to home
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2 border-primary/35 text-primary hover:bg-primary/10">
              <Link href="/visuals">
                <Camera className="size-4" />
                Browse visuals
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden border border-border/70 bg-black/70">
          {visualUrl ? (
            <>
              <Image
                src={visualUrl}
                alt={randomVisual?.title ?? "Random visual"}
                fill
                sizes="(max-width: 768px) 100vw, 380px"
                quality={100}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/80">Random Visual</p>
                <p className="mt-1 text-sm text-white">{randomVisual?.title}</p>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-white/80">
              A random visual preview appears here when published visuals are available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
