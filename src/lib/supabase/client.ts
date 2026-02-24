"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env, hasSupabaseEnv } from "@/lib/env";

export function createBrowserSupabaseClient() {
  if (!hasSupabaseEnv) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createBrowserClient(env.supabaseUrl!, env.supabaseAnonKey!);
}
