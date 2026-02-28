import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { env, hasSupabaseEnv } from "@/lib/env";
import type { AppRole } from "@/lib/roles";

type MiddlewareProfile = {
  role: AppRole;
  dealer_id: string | null;
};

export async function updateSession(request: NextRequest) {
  if (!hasSupabaseEnv) {
    return {
      response: NextResponse.next({ request }),
      user: null as User | null,
      profile: null as MiddlewareProfile | null
    };
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  let profile: MiddlewareProfile | null = null;

  if (user) {
    const { data, error } = await supabase.from("profiles").select("role, dealer_id").eq("id", user.id).maybeSingle();

    if (!error && data) {
      profile = data as MiddlewareProfile;
    }
  }

  return { response, user, profile };
}
