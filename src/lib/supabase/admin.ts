import "server-only";

import { createClient } from "@supabase/supabase-js";
import { env, hasSupabaseEnv } from "@/lib/env";

export function createServiceRoleSupabaseClient() {
  if (!hasSupabaseEnv || !env.supabaseServiceRoleKey) {
    throw new Error("Missing service-role Supabase environment variables.");
  }

  return createClient(env.supabaseUrl!, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
