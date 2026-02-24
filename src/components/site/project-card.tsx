import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group overflow-hidden border-border/70 bg-card/90 transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/projects/${project.slug}`}>
        <div className="relative h-52 overflow-hidden">
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          {project.featured ? <Badge>Featured</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">{project.short_description}</p>
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
        >
          Read case study
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </Card>
  );
}
