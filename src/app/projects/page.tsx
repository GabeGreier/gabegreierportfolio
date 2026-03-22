import type { Metadata } from "next";
import { EmptyState } from "@/components/site/empty-state";
import { ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { getPublicProjects } from "@/lib/content";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Projects",
  description: "Engineering and software projects by Gabriel Greier.",
  alternates: {
    canonical: "/projects"
  },
  openGraph: {
    title: "Projects | Gabriel Greier",
    description: "Engineering and software projects by Gabriel Greier.",
    url: "/projects",
    images: ["/og-image.svg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Gabriel Greier",
    description: "Engineering and software projects by Gabriel Greier.",
    images: ["/og-image.svg"]
  }
};

export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects",
    url: `${env.siteUrl}/projects`,
    numberOfItems: projects.length,
    hasPart: projects.map((project) => ({
      "@type": "CreativeWork",
      name: project.title,
      url: `${env.siteUrl}/projects/${project.slug}`
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="container space-y-10 py-16">
        <SectionHeading eyebrow="Engineering" title="Projects" />
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
    </>
  );
}
