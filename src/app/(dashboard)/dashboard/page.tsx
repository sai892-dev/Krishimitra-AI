import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeader, StatCard } from "@/components/layout/PageHeader";
import { Card, Badge } from "@/components/ui/Card";
import { DEMO_NEWS, DEMO_RECOMMENDATIONS } from "@/lib/data/seed";
import { getAlerts, getMarketPrices } from "@/lib/services/data";
import { getWeather } from "@/lib/services/weather";
import { formatCurrency } from "@/lib/utils";
import { Cloud, Droplets, Wind, TrendingUp, AlertTriangle } from "lucide-react";
import { DashboardWeather } from "@/components/dashboard/DashboardWeather";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  const district = profile?.district ?? "Krishna";

  const [weather, alerts, prices] = await Promise.all([
    getWeather(district),
    Promise.resolve(getAlerts(district)),
    Promise.resolve(getMarketPrices("chilli")),
  ]);

  const latestPrice = prices.history[prices.history.length - 1];

  return (
    <div>
      <PageHeader
        title={`Welcome, ${profile?.full_name ?? "Farmer"}`}
        subtitle={`${district}, Andhra Pradesh · ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}`}
      />

      {alerts.length > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">{alerts[0].title}</span>
            <Badge variant="warning">{alerts[0].severity}</Badge>
          </div>
          <p className="mt-1 text-sm text-amber-800">{alerts[0].message}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {weather && (
          <>
            <StatCard label="Temperature" value={`${weather.current.temperature}°C`} icon={<Cloud className="h-5 w-5" />} subtext={weather.current.description} />
            <StatCard label="Humidity" value={`${weather.current.humidity}%`} icon={<Droplets className="h-5 w-5" />} />
            <StatCard label="Wind" value={`${weather.current.windSpeed} km/h`} icon={<Wind className="h-5 w-5" />} />
          </>
        )}
        {latestPrice && (
          <StatCard
            label="Chilli (Guntur)"
            value={formatCurrency(latestPrice.price_per_quintal)}
            subtext="per quintal"
            icon={<TrendingUp className="h-5 w-5" />}
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <DashboardWeather district={district} initialWeather={weather} />
          <Card>
            <h2 className="font-semibold text-forest-dark mb-4">Latest Agri News</h2>
            <div className="space-y-3">
              {DEMO_NEWS.map((n) => (
                <article key={n.id} className="border-b border-stone-100 pb-3 last:border-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm text-forest-dark">{n.title}</h3>
                    <Badge>{n.category}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">{n.summary}</p>
                  <p className="mt-1 text-xs text-stone-400">{n.district} · {n.source}</p>
                </article>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-forest-dark mb-4">For You</h2>
            <div className="space-y-3">
              {DEMO_RECOMMENDATIONS.map((r) => (
                <div key={r.id} className="rounded-lg bg-stone-50 p-3">
                  <p className="text-sm font-medium text-forest-dark">{r.title}</p>
                  <p className="mt-1 text-xs text-stone-600">{r.description}</p>
                </div>
              ))}
            </div>
          </Card>
          {prices && (
            <Card>
              <h2 className="font-semibold text-forest-dark mb-2">Price Insight</h2>
              <p className="text-sm text-stone-600">{prices.recommendation}</p>
              <Badge variant={prices.trend === "up" ? "success" : prices.trend === "down" ? "danger" : "default"}>
                {prices.changePct}% this week
              </Badge>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
