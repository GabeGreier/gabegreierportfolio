import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="container flex flex-col gap-3 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          <span className="text-foreground">Gabriel Greier</span> | Engineering and automotive visuals portfolio
        </p>
        <div className="flex gap-4">
          <Link href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </Link>
          <Link href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
            Instagram
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
