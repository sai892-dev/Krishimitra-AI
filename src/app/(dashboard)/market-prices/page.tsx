"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, Badge } from "@/components/ui/Card";
import { PriceChart } from "@/components/charts/PriceChart";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n/translations";
import { AP_MARKETS } from "@/lib/constants/ap";
import { Skeleton } from "@/components/ui/Card";

export default function MarketPricesPage() {
  const { language } = useLanguage();
  const [crop, setCrop] = useState("chilli");
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchData>> | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData(c: string) {
    const res = await fetch(`/api/market-prices?crop=${c}`);
    return res.json();
  }

  useEffect(() => {
    setLoading(true);
    fetchData(crop)
      .then(setData)
      .finally(() => setLoading(false));
  }, [crop]);

  return (
    <div>
      <PageHeader
        title={t(language, "marketPrices")}
        subtitle="Historical prices & 7-day AI forecast for AP mandis"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {AP_MARKETS.map((m) => (
          <button
            key={m.crop}
            type="button"
            onClick={() => setCrop(m.crop)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
              crop === m.crop ? "bg-forest text-white" : "bg-stone-100 text-stone-600"
            }`}
          >
            {m.crop}
          </button>
        ))}
      </div>

      {loading ? (
        <Card>
          <Skeleton className="h-80 w-full" />
        </Card>
      ) : data ? (
        <div className="space-y-6">
          <Card>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-semibold text-forest-dark capitalize">
                  {data.market.crop} — {data.market.name}
                </h2>
                <p className="text-sm text-stone-500">{data.market.district}, AP</p>
              </div>
              <Badge
                variant={
                  data.trend === "up" ? "success" : data.trend === "down" ? "danger" : "default"
                }
              >
                {data.changePct}% this week
              </Badge>
            </div>
            <PriceChart history={data.history} forecast={data.forecast} />
          </Card>
          <Card>
            <h3 className="font-semibold text-forest-dark mb-2">Price Recommendation</h3>
            <p className="text-sm text-stone-600">{data.recommendation}</p>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
