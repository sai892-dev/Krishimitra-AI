import { cookies } from "next/headers";
import type { Profile } from "@/types";
import { DEMO_USERS } from "@/lib/data/seed";
import { demoUsersRuntime } from "@/lib/auth/demo-store";

const DEMO_SESSION_COOKIE = "km_demo_session";

export async function getDemoSession(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  if (!email) return null;
  const user = DEMO_USERS[email] ?? demoUsersRuntime[email];
  if (!user) return null;
  const { password: _, farmer: __, ...profile } = user;
  return profile;
}

export function getDemoUserByEmail(email: string) {
  return DEMO_USERS[email] ?? demoUsersRuntime[email] ?? null;
}

export { DEMO_SESSION_COOKIE };
