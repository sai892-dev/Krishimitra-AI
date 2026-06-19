import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/utils";
import { DEMO_SESSION_COOKIE } from "@/lib/auth/demo";

const PUBLIC_PATHS = ["/", "/login", "/register"];
const ADMIN_PATHS = ["/admin"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isSupabaseConfigured()) {
    let response = NextResponse.next({ request });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isPublic) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (user && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (user && ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return response;
  }

  // Demo mode auth via cookie
  const demoSession = request.cookies.get(DEMO_SESSION_COOKIE)?.value;

  if (!demoSession && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (demoSession) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
      const email = demoSession;
      const cookieVal = request.cookies.get(`km_user_${encodeURIComponent(email)}`)?.value;
      let role = "farmer";
      if (cookieVal) {
        try {
          const u = JSON.parse(cookieVal);
          role = u.role;
        } catch {}
      } else {
        if (email === "admin@demo.ap") {
          role = "admin";
        } else if (email === "buyer@demo.ap") {
          role = "buyer";
        }
      }

      if (role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
