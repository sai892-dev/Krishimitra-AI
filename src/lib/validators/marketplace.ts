import { z } from "zod";
import { AP_DISTRICTS } from "@/lib/constants/ap";

export const listingSchema = z.object({
  crop_name: z.string().min(2, "Crop name required"),
  variety: z.string().optional(),
  quantity_kg: z.coerce.number().positive("Quantity must be positive"),
  expected_price_per_kg: z.coerce.number().positive("Price must be positive"),
  description: z.string().max(500).optional(),
  district: z.enum(AP_DISTRICTS),
});

export const inquirySchema = z.object({
  listing_id: z.string().min(1),
  message: z.string().min(10, "Message must be at least 10 characters"),
  contact_phone: z.string().optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
