export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://gabrielgreier.ca",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  adminEmails: (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
};

export const hasSupabaseEnv = Boolean(env.supabaseUrl && env.supabaseAnonKey);
