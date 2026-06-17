import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { registerSchema } from "@/lib/validators/auth";
import { DEMO_SESSION_COOKIE } from "@/lib/auth/demo";
import { demoUsersRuntime } from "@/lib/auth/demo-store";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message },
      { status: 400 }
    );
  }

  const data = parsed.data;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Auth unavailable" }, { status: 500 });
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          role: data.role,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (authData.user) {
      await supabase.from("profiles").upsert({
        id: authData.user.id,
        role: data.role,
        full_name: data.full_name,
        phone: data.phone,
        district: data.district,
        preferred_language: data.preferred_language,
        state: "Andhra Pradesh",
      });

      if (data.role === "farmer") {
        await supabase.from("farmer_profiles").upsert({
          user_id: authData.user.id,
          land_size_acres: data.land_size_acres,
          primary_crops: data.primary_crops ?? [],
        });
      } else if (data.role === "buyer") {
        await supabase.from("buyer_profiles").upsert({
          user_id: authData.user.id,
          business_name: data.business_name,
        });
      }
    }

    return NextResponse.json({ success: true });
  }

  // Demo mode: store user and auto-login
  demoUsersRuntime[data.email] = {
    id: `demo-${crypto.randomUUID().slice(0, 8)}`,
    role: data.role,
    full_name: data.full_name,
    phone: data.phone,
    district: data.district,
    state: "Andhra Pradesh",
    preferred_language: data.preferred_language,
    created_at: new Date().toISOString(),
    password: data.password,
    ...(data.role === "farmer"
      ? {
          farmer: {
            land_size_acres: data.land_size_acres ?? 1,
            primary_crops: data.primary_crops ?? ["paddy"],
            village: data.district,
            mandal: data.district,
          },
        }
      : {}),
  };

  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, data.email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({
    success: true,
    demo: true,
    message: "Demo mode: use farmer@demo.ap / demo1234 for full demo data",
  });
}
