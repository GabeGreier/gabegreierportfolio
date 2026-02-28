import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/env";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_PATHS = ["/dashboard", "/vehicles", "/admin/dealers"];
const AUTH_PATHS = ["/login"];

function pathMatches(pathname: string, basePath: string) {
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((basePath) => pathMatches(pathname, basePath));
}

function isAuthPath(pathname: string) {
  return AUTH_PATHS.some((basePath) => pathMatches(pathname, basePath));
}

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);

  if (!hasSupabaseEnv) {
    return response;
  }

  const { pathname, search } = request.nextUrl;

  if (isProtectedPath(pathname) && !user) {
    const loginUrl = new URL("/login", request.url);
    const nextPath = `${pathname}${search}`;
    loginUrl.searchParams.set("next", nextPath);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath(pathname) && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
