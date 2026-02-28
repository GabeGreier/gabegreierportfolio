"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

function normalizeNextPath(value: string | null) {
  if (!value) {
    return "/dashboard";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const nextPath = normalizeNextPath(String(formData.get("next") ?? ""));

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect(`/login?error=missing-supabase&next=${encodeURIComponent(nextPath)}`);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=invalid-credentials&next=${encodeURIComponent(nextPath)}`);
  }

  redirect(nextPath);
}
