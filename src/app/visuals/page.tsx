import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/empty-state";
import { SectionHeading } from "@/components/site/section-heading";
import { VisualGrid } from "@/components/site/visual-grid";
import { Button } from "@/components/ui/button";
import { getPublicVisuals } from "@/lib/content";

export const metadata: Metadata = {
  description: "Cinematic automotive photography by Gabriel Greier."
};

export default async function VisualsPage() {
  const visuals = await getPublicVisuals();

  return (
    <section className="container space-y-10 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Automotive Photography" title="Visuals" />
        <Button asChild variant="outline" className="border-primary/35 text-primary hover:bg-primary/10">
          <Link href="https://instagram.com/gabrielgreier" target="_blank" rel="noreferrer">
            View Instagram
          </Link>
        </Button>
      </div>
      {visuals.length === 0 ? (
        <EmptyState title="No visuals published yet" description="Published visuals will appear here." />
      ) : (
        <VisualGrid visuals={visuals} />
      )}
    </section>
  );
}
