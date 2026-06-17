"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Card";
import { listingSchema } from "@/lib/validators/marketplace";
import { AP_DISTRICTS } from "@/lib/constants/ap";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n/translations";

export default function NewListingPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    crop_name: "",
    variety: "",
    quantity_kg: "",
    expected_price_per_kg: "",
    description: "",
    district: "Krishna" as (typeof AP_DISTRICTS)[number],
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = listingSchema.safeParse({
      ...form,
      quantity_kg: Number(form.quantity_kg),
      expected_price_per_kg: Number(form.expected_price_per_kg),
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    // Demo: simulate success — in production, POST to Supabase
    await new Promise((r) => setTimeout(r, 800));
    router.push("/marketplace");
  }

  return (
    <div className="max-w-lg">
      <PageHeader title={t(language, "postListing")} subtitle="List your crop for direct buyers in AP" />

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="crop_name" required>Crop name</Label>
            <Input id="crop_name" value={form.crop_name} onChange={(e) => update("crop_name", e.target.value)} placeholder="e.g. Sona Masuri Paddy" />
          </div>
          <div>
            <Label htmlFor="variety">Variety</Label>
            <Input id="variety" value={form.variety} onChange={(e) => update("variety", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="qty" required>Quantity (kg)</Label>
              <Input id="qty" type="number" value={form.quantity_kg} onChange={(e) => update("quantity_kg", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="price" required>Price per kg (₹)</Label>
              <Input id="price" type="number" value={form.expected_price_per_kg} onChange={(e) => update("expected_price_per_kg", e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="district" required>District</Label>
            <Select id="district" value={form.district} onChange={(e) => update("district", e.target.value)}>
              {AP_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <Button type="submit" loading={loading} className="w-full">
            Post listing
          </Button>
        </form>
      </Card>
    </div>
  );
}
