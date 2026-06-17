import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DEMO_SESSION_COOKIE } from "@/lib/auth/demo";

// Auto-login with demo farmer account and redirect to dashboard
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, "farmer@demo.ap", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  const url = new URL("/dashboard", request.url);
  return NextResponse.redirect(url);
}
