import Link from "next/link";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

const links = [
  {
    href: "mailto:gabegreier@gmail.com",
    label: "gabegreier@gmail.com",
    icon: Mail
  },
  {
    href: "https://www.instagram.com/gabegreiervisuals/",
    label: "Instagram",
    icon: Instagram
  },
  {
    href: "https://github.com/GabeGreier",
    label: "GitHub",
    icon: Github
  },
  {
    href: "https://www.linkedin.com/in/gabrielgreier",
    label: "LinkedIn",
    icon: Linkedin
  }
];

export function ContactLinks() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
          className="inline-flex items-center gap-3 rounded-lg border border-border/70 bg-card/70 px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <Icon className="size-4 text-primary" />
          <span>{label}</span>
        </Link>
      ))}
    </div>
  );
}
