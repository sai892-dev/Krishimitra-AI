import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEMO_SESSION_COOKIE } from "@/lib/auth/demo";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function POST(request: NextRequest) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) await supabase.auth.signOut();
  }

  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);

  return NextResponse.redirect(new URL("/login", request.url));
}
