"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Visual } from "@/lib/types";

export function HeroRandomVisual({ visuals }: { visuals: Visual[] }) {
  const [selected, setSelected] = useState<Visual | null>(visuals[0] ?? null);

  useEffect(() => {
    if (visuals.length === 0) {
      setSelected(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * visuals.length);
    setSelected(visuals[randomIndex]);
  }, [visuals]);

  if (!selected) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-border/70 bg-card/70">
        <Image
          src={selected.thumbnail_url ?? selected.image_url}
          alt={selected.title}
          fill
          sizes="(max-width: 1024px) 70vw, 440px"
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
