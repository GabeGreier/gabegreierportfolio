import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/env";
import { ROUTE_ACCESS_RULES } from "@/lib/roles";
import { updateSession } from "@/lib/supabase/middleware";

const AUTH_PATHS = ["/login"];

function pathMatches(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function getAccessRule(pathname: string) {
  return ROUTE_ACCESS_RULES.find((rule) => pathMatches(pathname, rule.basePath));
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((basePath) => pathMatches(pathname, basePath));
}

export async function middleware(request: NextRequest) {
  const { response, user, profile } = await updateSession(request);

  if (!hasSupabaseEnv) {
    return response;
  }

  const { pathname, search } = request.nextUrl;
  const accessRule = getAccessRule(pathname);
  const nextPath = `${pathname}${search}`;

  if (accessRule && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  if (accessRule && !profile) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "profile-missing");
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  if (accessRule && profile && !accessRule.roles.includes(profile.role)) {
    return NextResponse.redirect(new URL("/dashboard?error=forbidden", request.url));
  }

  if (accessRule && profile && accessRule.requireDealer && profile.role !== "SUPER_ADMIN" && !profile.dealer_id) {
    return NextResponse.redirect(new URL("/dashboard?error=dealer-required", request.url));
  }

  if (isAuthPath(pathname) && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
