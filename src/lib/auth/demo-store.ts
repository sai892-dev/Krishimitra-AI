import type { Profile } from "@/types";

/** Runtime demo users created via registration (demo mode only) */
export const demoUsersRuntime: Record<
  string,
  Profile & { password: string; farmer?: { land_size_acres: number; primary_crops: string[]; village: string; mandal: string } }
> = {};
