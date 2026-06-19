import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listingSchema } from "@/lib/validators/marketplace";
import { getCurrentProfile } from "@/lib/auth/session";
import { DEMO_LISTINGS } from "@/lib/data/seed";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      if (!supabase) {
        return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
      }
      const { data, error } = await supabase
        .from("crop_listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json(data);
    }

    // Demo mode: combine seed data with cookie data
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("km_listings")?.value;
    let customListings = [];
    if (cookieVal) {
      try {
        customListings = JSON.parse(cookieVal);
      } catch {
        customListings = [];
      }
    }

    return NextResponse.json([...customListings, ...DEMO_LISTINGS]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = listingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid listing details" }, { status: 400 });
    }

    const listingData = {
      crop_name: parsed.data.crop_name,
      variety: parsed.data.variety || "",
      quantity_kg: parsed.data.quantity_kg,
      expected_price_per_kg: parsed.data.expected_price_per_kg,
      description: parsed.data.description || "",
      district: parsed.data.district,
    };

    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      if (!supabase) {
        return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
      }
      const { data, error } = await supabase
        .from("crop_listings")
        .insert({
          ...listingData,
          farmer_id: profile.id,
          farmer_name: profile.full_name,
          farmer_phone: profile.phone || "",
          status: "active",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, listing: data });
    }

    // Demo mode: save in cookie
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("km_listings")?.value;
    let customListings = [];
    if (cookieVal) {
      try {
        customListings = JSON.parse(cookieVal);
      } catch {
        customListings = [];
      }
    }

    const newListing = {
      id: `listing-${crypto.randomUUID().slice(0, 8)}`,
      farmer_id: profile.id,
      farmer_name: profile.full_name,
      farmer_phone: profile.phone || "+91 9999999999",
      status: "active",
      created_at: new Date().toISOString(),
      ...listingData,
    };

    customListings.unshift(newListing);

    cookieStore.set("km_listings", JSON.stringify(customListings), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true, listing: newListing });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create listing" }, { status: 500 });
  }
}
