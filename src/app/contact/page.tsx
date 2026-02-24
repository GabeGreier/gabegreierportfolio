import type { Metadata } from "next";
import { ContactLinks } from "@/components/site/contact-links";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Gabriel Greier for software engineering and automotive visual work."
};

export default function ContactPage() {
  return (
    <section className="container space-y-8 py-16">
      <SectionHeading
        eyebrow="Contact"
        title="Let’s build something with intent"
        description="Reach out for project collaboration, engineering work, or creative visual partnerships."
      />
      <div className="max-w-2xl rounded-xl border border-border/70 bg-card/70 p-8">
        <ContactLinks />
      </div>
    </section>
  );
}
