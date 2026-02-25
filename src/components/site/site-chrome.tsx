"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname === "/" || pathname === "/contact";

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className={hideFooter ? "flex-1 overflow-hidden" : "flex-1"}>{children}</main>
      {!hideFooter ? <SiteFooter /> : null}
    </div>
  );
}
