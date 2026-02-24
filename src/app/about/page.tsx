import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Gabriel Greier, a computer engineering student building hardware/software projects and cinematic automotive visuals."
};

export default function AboutPage() {
  return (
    <section className="container space-y-8 py-16">
      <SectionHeading
        eyebrow="About"
        title="Intentional build process across engineering and visuals"
        description="A concise look at background, process, and creative direction."
      />
      <div className="max-w-3xl space-y-4 rounded-xl border border-border/70 bg-card/70 p-8 text-muted-foreground">
        <p>
          I am a computer engineering student with a builder mindset focused on delivering complete, polished outcomes.
          My core work spans hardware and software projects, from low-level systems and prototyping to web applications
          that are fast, clear, and reliable.
        </p>
        <p>
          In parallel, I create cinematic automotive photography. The same principles drive both disciplines: attention
          to detail, deliberate composition, and high execution standards from concept through final output.
        </p>
      </div>
    </section>
  );
}
