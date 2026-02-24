import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user;
}

export function isAdminEmail(email: string | undefined | null) {
  if (!email) {
    return false;
  }

  if (env.adminEmails.length === 0) {
    return false;
  }

  return env.adminEmails.includes(email.toLowerCase());
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/admin?error=unauthorized");
  }

  return user;
}
