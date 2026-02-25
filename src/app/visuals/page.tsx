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

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function VisualsPage({ searchParams }: Props) {
  const visuals = await getPublicVisuals();
  const params = await searchParams;
  const selectedTag = getSingleValue(params.tag)?.trim() ?? "";

  const tags = Array.from(
    new Map(
      visuals
        .flatMap((visual) => visual.tags ?? [])
        .map((tag) => [tag.toLowerCase(), tag] as const)
    ).values()
  ).sort((a, b) => a.localeCompare(b));

  const filteredVisuals = selectedTag
    ? visuals.filter((visual) => (visual.tags ?? []).some((tag) => tag.toLowerCase() === selectedTag.toLowerCase()))
    : visuals;

  return (
    <section className="container space-y-10 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Automotive Photography" title="Visuals" />
        <Button asChild variant="outline" className="border-primary/35 text-primary hover:bg-primary/10">
          <Link href="https://www.instagram.com/gabegreiervisuals/" target="_blank" rel="noreferrer">
            View Instagram
          </Link>
        </Button>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant={selectedTag ? "outline" : "default"}
            className={selectedTag ? "border-primary/35 text-primary hover:bg-primary/10" : ""}
          >
            <Link href="/visuals">All</Link>
          </Button>
          {tags.map((tag) => {
            const isActive = tag.toLowerCase() === selectedTag.toLowerCase();
            return (
              <Button
                key={tag}
                asChild
                size="sm"
                variant={isActive ? "default" : "outline"}
                className={isActive ? "" : "border-primary/35 text-primary hover:bg-primary/10"}
              >
                <Link href={`/visuals?tag=${encodeURIComponent(tag)}`}>{tag}</Link>
              </Button>
            );
          })}
        </div>
      ) : null}

      {filteredVisuals.length === 0 ? (
        <EmptyState
          title={selectedTag ? `No visuals found for "${selectedTag}"` : "No visuals published yet"}
          description={selectedTag ? "Try a different tag or view all visuals." : "Published visuals will appear here."}
        />
      ) : (
        <VisualGrid visuals={filteredVisuals} />
      )}
    </section>
  );
}
