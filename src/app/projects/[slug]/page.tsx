import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectBySlug, getProjectImages } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project"
    };
  }

  return {
    title: project.title,
    description: project.short_description,
    openGraph: {
      title: project.title,
      description: project.short_description,
      images: [project.cover_image_url]
    }
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const images = await getProjectImages(project.id);

  return (
    <article className="container space-y-10 py-16">
      <div className="space-y-4">
        <Badge>Case Study</Badge>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{project.title}</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">{project.short_description}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          {project.github_url ? (
            <Button asChild variant="outline" className="border-primary/35 text-primary hover:bg-primary/10">
              <Link href={project.github_url} target="_blank" rel="noreferrer">
                GitHub
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          ) : null}
          {project.live_url ? (
            <Button asChild>
              <Link href={project.live_url} target="_blank" rel="noreferrer">
                Live Demo
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="relative h-[45vh] min-h-[280px] overflow-hidden rounded-xl border border-border/80">
        <Image src={project.cover_image_url} alt={project.title} fill sizes="100vw" className="object-cover" priority />
      </div>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 rounded-xl border border-border/70 bg-card/70 p-6">
          <h2 className="text-lg font-semibold">Summary</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.full_description}</p>
        </div>
        <div className="space-y-2 rounded-xl border border-border/70 bg-card/70 p-6">
          <h2 className="text-lg font-semibold">Problem / Goal</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.problem_goal}</p>
        </div>
        <div className="space-y-2 rounded-xl border border-border/70 bg-card/70 p-6">
          <h2 className="text-lg font-semibold">What Was Built</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.what_built}</p>
        </div>
        <div className="space-y-2 rounded-xl border border-border/70 bg-card/70 p-6">
          <h2 className="text-lg font-semibold">Tools / Stack</h2>
          <div className="flex flex-wrap gap-2">
            {project.tools_stack.map((tool) => (
              <Badge key={tool} variant="outline" className="bg-background/80">
                {tool}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2 rounded-xl border border-border/70 bg-card/70 p-6">
          <h2 className="text-lg font-semibold">Challenges</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.challenges}</p>
        </div>
        <div className="space-y-2 rounded-xl border border-border/70 bg-card/70 p-6">
          <h2 className="text-lg font-semibold">What Was Learned</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{project.learnings}</p>
        </div>
      </section>

      {images.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Gallery</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((image) => (
              <div key={image.id} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border/70">
                <Image src={image.image_url} alt={image.alt_text} fill sizes="50vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
