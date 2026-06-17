import { z } from "zod";
import { AP_DISTRICTS, USER_ROLES } from "@/lib/constants/ap";

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  role: z.enum(USER_ROLES),
  district: z.enum(AP_DISTRICTS, { message: "Select a district" }),
  preferred_language: z.enum(["en", "te", "hi", "ta", "kn", "ml", "mr", "bn", "gu", "pa", "or", "as"]),
  land_size_acres: z.coerce.number().positive().optional(),
  primary_crops: z.array(z.string()).optional(),
  business_name: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
