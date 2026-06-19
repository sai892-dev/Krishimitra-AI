import { cookies } from "next/headers";
import type { Profile } from "@/types";
import { DEMO_USERS } from "@/lib/data/seed";

const DEMO_SESSION_COOKIE = "km_demo_session";

export async function getDemoSession(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  if (!email) return null;
  const user = await getDemoUserByEmail(email);
  if (!user) return null;
  const { password: _, farmer: __, ...profile } = user;
  return profile;
}

export async function getDemoUserByEmail(email: string) {
  if (DEMO_USERS[email]) return DEMO_USERS[email];

  const cookieStore = await cookies();
  const cookieVal = cookieStore.get(`km_user_${encodeURIComponent(email)}`)?.value;
  if (!cookieVal) return null;
  try {
    return JSON.parse(cookieVal);
  } catch {
    return null;
  }
}

export async function getCurrentDemoUser() {
  const cookieStore = await cookies();
  const email = cookieStore.get(DEMO_SESSION_COOKIE)?.value;
  if (!email) return null;
  return getDemoUserByEmail(email);
}

export { DEMO_SESSION_COOKIE };
