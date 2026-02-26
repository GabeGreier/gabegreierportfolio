"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Visual } from "@/lib/types";

export function HeroRandomVisual({ visuals }: { visuals: Visual[] }) {
  const [selected, setSelected] = useState<Visual | null>(null);

  useEffect(() => {
    if (visuals.length === 0) {
      setSelected(null);
      return;
    }

    if (visuals.length === 1) {
      setSelected(visuals[0]);
      return;
    }

    const previousId = window.sessionStorage.getItem("hero_visual_id");
    const candidates = visuals.filter((visual) => visual.id !== previousId);
    const pool = candidates.length > 0 ? candidates : visuals;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const nextVisual = pool[randomIndex];

    window.sessionStorage.setItem("hero_visual_id", nextVisual.id);
    setSelected(nextVisual);
  }, [visuals]);

  if (!selected) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="group relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-border/70 bg-card/70">
        <Image
          src={selected.thumbnail_url ?? selected.image_url}
          alt={selected.title}
          fill
          sizes="(max-width: 1024px) 70vw, 440px"
          className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          priority
        />
      </div>
    </div>
  );
}
