import type { Profile } from "@/types";
import { getDemoSession } from "@/lib/auth/demo";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

/** Resolves current user profile from Supabase or demo session */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (!supabase) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return data as Profile | null;
  }

  return getDemoSession();
}
