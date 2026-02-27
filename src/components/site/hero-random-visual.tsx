"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Visual } from "@/lib/types";

function formatShotDate(value: string | null) {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function HeroRandomVisual({ visuals }: { visuals: Visual[] }) {
  const [selected, setSelected] = useState<Visual | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [lightPosition, setLightPosition] = useState({ x: 50, y: 50 });

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
    setIsVisible(false);

    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [visuals]);

  if (!selected) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div
        className="group relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-border/70 bg-card/70"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setLightPosition({ x, y });
        }}
      >
        <Image
          src={selected.thumbnail_url ?? selected.image_url}
          alt={selected.title}
          fill
          sizes="(max-width: 1024px) 70vw, 440px"
          className={`object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] ${
            isVisible ? "hero-image-enter-active" : "hero-image-enter"
          }`}
          priority
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${lightPosition.x}% ${lightPosition.y}%, rgba(255,255,255,0.2), rgba(255,255,255,0) 45%)`
          }}
        />
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">Shot by me - {formatShotDate(selected.shot_date)}</p>
    </div>
  );
}
