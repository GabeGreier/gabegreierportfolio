import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { APP_ROLES, type AppRole } from "@/lib/roles";

export type PortalProfile = {
  id: string;
  dealer_id: string | null;
  role: AppRole;
  display_name: string | null;
};

const APP_ROLE_SET = new Set<string>(APP_ROLES);
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeRole(value: unknown): AppRole {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase();

  if (APP_ROLE_SET.has(normalized)) {
    return normalized as AppRole;
  }

  return "DEALER_STAFF";
}

function normalizeDealerId(value: unknown): string | null {
  const raw = String(value ?? "").trim();
  if (!raw || !UUID_REGEX.test(raw)) {
    return null;
  }
  return raw;
}

function deriveDisplayName(user: User) {
  const metadata = user.user_metadata ?? {};
  const fullName = String(metadata.full_name ?? metadata.name ?? "").trim();
  if (fullName) {
    return fullName;
  }
  if (user.email) {
    return user.email.split("@")[0];
  }
  return "Dealer User";
}

function isMissingProfilesTableError(error: { code?: string } | null) {
  return error?.code === "42P01";
}

async function readProfileForUser(userId: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, dealer_id, role, display_name")
    .eq("id", userId)
    .maybeSingle();

  if (error && !isMissingProfilesTableError(error)) {
    throw new Error(error.message);
  }

  return (data as PortalProfile | null) ?? null;
}

export async function ensureProfileForUser(user: User) {
  const existing = await readProfileForUser(user.id);
  if (existing) {
    return existing;
  }

  const payload = {
    id: user.id,
    dealer_id: normalizeDealerId(user.app_metadata?.dealer_id),
    role: normalizeRole(user.app_metadata?.role),
    display_name: deriveDisplayName(user)
  };

  try {
    const admin = createServiceRoleSupabaseClient();
    const { error } = await admin.from("profiles").upsert(payload, { onConflict: "id" });
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    const fallbackSupabase = await createServerSupabaseClient();
    if (!fallbackSupabase) {
      throw error;
    }

    const { error: insertError } = await fallbackSupabase.from("profiles").insert(payload);

    if (insertError?.code === "42501") {
      const { error: limitedInsertError } = await fallbackSupabase.from("profiles").insert({
        id: payload.id,
        dealer_id: null,
        role: "DEALER_STAFF" satisfies AppRole,
        display_name: payload.display_name
      });

      if (
        limitedInsertError &&
        limitedInsertError.code !== "23505" &&
        !isMissingProfilesTableError(limitedInsertError)
      ) {
        throw new Error(limitedInsertError.message);
      }

      return readProfileForUser(user.id);
    }

    if (insertError && insertError.code !== "23505" && !isMissingProfilesTableError(insertError)) {
      throw new Error(insertError.message);
    }
  }

  return readProfileForUser(user.id);
}

export async function requirePortalUser(options?: {
  roles?: AppRole[];
  requireDealer?: boolean;
}) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/login?error=missing-supabase");
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await ensureProfileForUser(user);

  if (!profile) {
    redirect("/login?error=profile-missing");
  }

  if (options?.roles && !options.roles.includes(profile.role)) {
    redirect("/dashboard?error=forbidden");
  }

  if ((options?.requireDealer ?? false) && profile.role !== "SUPER_ADMIN" && !profile.dealer_id) {
    redirect("/dashboard?error=dealer-required");
  }

  return { user, profile, supabase };
}
