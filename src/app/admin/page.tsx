import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signInAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser, isAdminEmail } from "@/lib/auth";
import { hasSupabaseEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "Admin Login"
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function errorLabel(error: string | undefined) {
  switch (error) {
    case "invalid-credentials":
      return "Invalid email or password.";
    case "unauthorized":
      return "This account is not in your admin allowlist.";
    case "missing-supabase":
      return "Supabase environment variables are missing.";
    default:
      return null;
  }
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const user = await getCurrentUser();

  if (user && isAdminEmail(user.email)) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;
  const rawError = params.error;
  const error = Array.isArray(rawError) ? rawError[0] : rawError;

  return (
    <section className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border/70 bg-card/80 p-8">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold">Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in with your authorized admin account.</p>
        </div>

        {!hasSupabaseEnv ? (
          <p className="rounded-md border border-amber-300/70 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Supabase is not configured yet. Add environment variables before using admin auth.
          </p>
        ) : null}

        {errorLabel(error) ? (
          <p className="rounded-md border border-red-300/70 bg-red-50 px-3 py-2 text-sm text-red-900">{errorLabel(error)}</p>
        ) : null}

        <form action={signInAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>
          <Button type="submit" className="w-full" disabled={!hasSupabaseEnv}>
            Sign In
          </Button>
        </form>
      </div>
    </section>
  );
}
