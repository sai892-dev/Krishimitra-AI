import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/layout/PageHeader";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getCurrentProfile } from "@/lib/auth/session";
import { DEMO_LISTINGS } from "@/lib/data/seed";
import { formatCurrency, isSupabaseConfigured } from "@/lib/utils";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function MyListingsPage() {
  const profile = await getCurrentProfile();
  if (profile?.role === "buyer") redirect("/marketplace");

  let listings = [];
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase
        .from("crop_listings")
        .select("*")
        .order("created_at", { ascending: false });
      listings = data || [];
    }
  } else {
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
    listings = [...customListings, ...DEMO_LISTINGS];
  }

  const myListings = listings.filter((l) => l.farmer_id === profile?.id);

  return (
    <div>
      <PageHeader
        title="My Listings"
        subtitle="Manage your crop listings"
        action={
          <Link href="/marketplace/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New listing
            </Button>
          </Link>
        }
      />

      {myListings.length === 0 ? (
        <EmptyState
          title="No listings yet"
          description="Post your first crop for sale"
          action={
            <Link href="/marketplace/new">
              <Button>Post listing</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {myListings.map((l) => (
            <Card key={l.id}>
              <div className="flex justify-between">
                <h3 className="font-semibold">{l.crop_name}</h3>
                <Badge>{l.status}</Badge>
              </div>
              <p className="text-forest font-semibold mt-1">
                {formatCurrency(l.expected_price_per_kg)}/kg · {(l.quantity_kg / 100).toFixed(1)} qtl
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
