import Link from "next/link";
import { ArrowRight, Camera, Cpu } from "lucide-react";
import { ContactLinks } from "@/components/site/contact-links";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { VisualGrid } from "@/components/site/visual-grid";
import { Button } from "@/components/ui/button";
import { getFeaturedProjects, getFeaturedVisuals } from "@/lib/content";

export default async function HomePage() {
  const [featuredProjects, featuredVisuals] = await Promise.all([getFeaturedProjects(), getFeaturedVisuals()]);

  return (
    <>
      <section className="container py-20 md:py-28">
        <div className="max-w-4xl animate-fade-up space-y-6">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">Computer Engineering + Automotive Visuals</p>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
            Gabriel <span className="font-display text-primary">Greier</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
            I build reliable hardware and software systems, then apply the same precision to cinematic automotive
            photography.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="gap-2">
              <Link href="/projects">
                View Projects
                <Cpu className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 border-primary/35 text-primary hover:bg-primary/10">
              <Link href="/visuals">
                View Visuals
                <Camera className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container pb-16">
        <div className="max-w-3xl rounded-xl border border-border/70 bg-card/70 p-6 md:p-8">
          <p className="text-base leading-relaxed text-muted-foreground">
            I am a computer engineering student focused on making ideas tangible, from FPGA audio tooling and embedded
            systems to polished web products. Outside the build process, I shoot and grade automotive imagery with the
            same obsession for detail, pacing, and final execution.
          </p>
        </div>
      </section>

      <section className="container space-y-8 py-16">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Selected Work"
            title="Featured Projects"
            description="A few projects across hardware and software that reflect how I build."
          />
          <Button asChild variant="link" className="hidden md:inline-flex">
            <Link href="/projects" className="inline-flex items-center gap-1">
              All Projects
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="container space-y-8 py-16">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Photography"
            title="Featured Visuals"
            description="Cinematic automotive stills with intentional composition, light, and mood."
          />
          <Button asChild variant="link" className="hidden md:inline-flex">
            <Link href="/visuals" className="inline-flex items-center gap-1">
              Full Gallery
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <VisualGrid visuals={featuredVisuals} limit={8} />
      </section>

      <section className="container py-16">
        <div className="rounded-2xl border border-primary/20 bg-card p-8 md:p-10">
          <SectionHeading
            title="Open to collaborative builds and visual projects"
            description="If you want to ship something thoughtful, from product work to visual direction, let’s talk."
          />
          <div className="mt-6">
            <ContactLinks />
          </div>
        </div>
      </section>
    </>
  );
}
