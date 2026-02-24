"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Visual } from "@/lib/types";

export function VisualGrid({ visuals, limit }: { visuals: Visual[]; limit?: number }) {
  const items = typeof limit === "number" ? visuals.slice(0, limit) : visuals;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((visual) => (
          <Dialog key={visual.id}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="group relative aspect-[4/5] overflow-hidden rounded-none border border-border/60 bg-card"
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
            </DialogTrigger>
            <DialogContent className="p-0">
              <DialogTitle className="sr-only">{visual.title}</DialogTitle>
              <div className="relative aspect-[16/10] w-full">
                <Image src={visual.image_url} alt={visual.title} fill className="object-contain" sizes="95vw" />
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  );
}
