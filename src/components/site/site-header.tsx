"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/visuals", label: "Visuals" },
  { href: "/contact", label: "Contact" }
];

export function SiteHeader({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <header className={cn("sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur", className)}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Gabriel <span className="text-xl text-primary">Greier</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("nav-link text-sm text-foreground/80", pathname === link.href && "nav-link-active")}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
