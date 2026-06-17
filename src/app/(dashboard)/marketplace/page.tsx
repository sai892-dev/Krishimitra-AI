"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, EmptyState } from "@/components/layout/PageHeader";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea, Input, Label } from "@/components/ui/Input";
import { DEMO_LISTINGS } from "@/lib/data/seed";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n/translations";
import { formatCurrency, formatDate } from "@/lib/utils";
import { inquirySchema } from "@/lib/validators/marketplace";
import { Phone, Plus } from "lucide-react";

export default function MarketplacePage() {
  const { language } = useLanguage();
  const [district, setDistrict] = useState("all");
  const [inquiryFor, setInquiryFor] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);

  const listings =
    district === "all"
      ? DEMO_LISTINGS.filter((l) => l.status === "active")
      : DEMO_LISTINGS.filter(
          (l) => l.status === "active" && l.district === district
        );

  const districts = [...new Set(DEMO_LISTINGS.map((l) => l.district).filter(Boolean))];

  async function sendInquiry(listingId: string) {
    const parsed = inquirySchema.safeParse({
      listing_id: listingId,
      message,
      contact_phone: phone,
    });
    if (!parsed.success) return;

    setSent(true);
    setInquiryFor(null);
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div>
      <PageHeader
        title={t(language, "marketplace")}
        subtitle="Direct farmer-to-buyer crop listings across AP"
        action={
          <Link href="/marketplace/new">
            <Button size="sm">
              <Plus className="h-4 w-4" />
              {t(language, "postListing")}
            </Button>
          </Link>
        }
      />

      {sent && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          Inquiry sent successfully!
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDistrict("all")}
          className={`rounded-full px-3 py-1 text-sm ${district === "all" ? "bg-forest text-white" : "bg-stone-100"}`}
        >
          All districts
        </button>
        {districts.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDistrict(d!)}
            className={`rounded-full px-3 py-1 text-sm ${district === d ? "bg-forest text-white" : "bg-stone-100"}`}
          >
            {d}
          </button>
        ))}
      </div>

      {listings.length === 0 ? (
        <EmptyState
          title={t(language, "noData")}
          description="No active listings in this district"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-forest-dark">{listing.crop_name}</h3>
                <Badge variant="success">{listing.status}</Badge>
              </div>
              {listing.variety && (
                <p className="text-xs text-stone-500">{listing.variety}</p>
              )}
              <p className="mt-2 text-lg font-semibold text-forest">
                {formatCurrency(listing.expected_price_per_kg)}/kg
              </p>
              <p className="text-sm text-stone-600">
                {(listing.quantity_kg / 100).toFixed(1)} quintals available
              </p>
              <p className="mt-2 text-sm text-stone-500 line-clamp-2">
                {listing.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-stone-400">
                <span>{listing.district}</span>
                <span>{formatDate(listing.created_at)}</span>
              </div>
              <p className="mt-2 text-sm font-medium">{listing.farmer_name}</p>

              {inquiryFor === listing.id ? (
                <div className="mt-3 space-y-2">
                  <Label>Message</Label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="I'm interested in buying..." />
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => sendInquiry(listing.id)}>
                      {t(language, "sendInquiry")}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setInquiryFor(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setInquiryFor(listing.id)}>
                    {t(language, "sendInquiry")}
                  </Button>
                  {listing.farmer_phone && (
                    <a href={`tel:${listing.farmer_phone}`}>
                      <Button size="sm" variant="ghost">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
