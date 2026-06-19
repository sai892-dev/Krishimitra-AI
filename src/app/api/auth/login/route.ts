import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginSchema } from "@/lib/validators/auth";
import { getDemoUserByEmail, DEMO_SESSION_COOKIE } from "@/lib/auth/demo";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Auth unavailable" }, { status: 500 });
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json({ success: true });
  }

  const user = await getDemoUserByEmail(email);
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({ success: true, role: user.role });
}
