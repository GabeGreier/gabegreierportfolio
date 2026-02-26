"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Visual } from "@/lib/types";

export function VisualGrid({ visuals, limit }: { visuals: Visual[]; limit?: number }) {
  const items = useMemo(() => (typeof limit === "number" ? visuals.slice(0, limit) : visuals), [limit, visuals]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hasActive = activeIndex !== null;
  const activeVisual = hasActive ? items[activeIndex] : null;

  const previousVisual = () => {
    if (activeIndex === null) {
      return;
    }

    setActiveIndex((activeIndex - 1 + items.length) % items.length);
  };

  const nextVisual = () => {
    if (activeIndex === null) {
      return;
    }

    setActiveIndex((activeIndex + 1) % items.length);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((visual, index) => (
          <button
            key={visual.id}
            type="button"
            className="tag-fade-item group relative aspect-[4/5] overflow-hidden rounded-none border border-border/60 bg-card"
            style={{ animationDelay: `${Math.min(index * 45, 320)}ms` }}
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={visual.thumbnail_url ?? visual.image_url}
              alt={visual.title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-left text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
              {visual.title}
            </div>
          </button>
        ))}
      </div>

      <Dialog open={hasActive} onOpenChange={(open) => (!open ? setActiveIndex(null) : null)}>
        {activeVisual ? (
          <DialogContent className="max-w-[95vw] border-0 bg-transparent p-0 shadow-none">
            <DialogTitle className="sr-only">{activeVisual.title}</DialogTitle>
            <div className="relative mx-auto w-full max-w-6xl">
              <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/20 bg-black/55">
                <Image src={activeVisual.image_url} alt={activeVisual.title} fill className="object-contain" sizes="95vw" />

                {items.length > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous visual"
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/35 p-2 text-white transition-colors hover:bg-black/55"
                      onClick={previousVisual}
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Next visual"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-black/35 p-2 text-white transition-colors hover:bg-black/55"
                      onClick={nextVisual}
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </>
                ) : null}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm text-white">
                  {activeVisual.title}
                </div>
              </div>

              {items.length > 1 ? (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {items.map((visual, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={`${visual.id}-film`}
                        type="button"
                        className={`relative h-16 w-24 shrink-0 overflow-hidden border transition-all ${
                          isActive ? "border-primary" : "border-white/25 opacity-70 hover:opacity-100"
                        }`}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`View ${visual.title}`}
                      >
                        <Image
                          src={visual.thumbnail_url ?? visual.image_url}
                          alt={visual.title}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  );
}
