import type { Metadata } from "next";
import { EmptyState } from "@/components/site/empty-state";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { getPublicProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering and software projects by Gabriel Greier."
};

export default async function ProjectsPage() {
  const projects = await getPublicProjects();

  return (
    <section className="container space-y-10 py-16">
      <SectionHeading
        eyebrow="Engineering"
        title="Projects"
        description="Hardware and software case studies focused on execution quality and problem solving."
      />
      {projects.length === 0 ? (
        <EmptyState title="No projects published yet" description="Published projects will appear here." />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
