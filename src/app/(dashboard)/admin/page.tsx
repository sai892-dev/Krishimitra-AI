import { getCurrentProfile } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { PageHeader, StatCard } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { DEMO_LISTINGS, DEMO_SCHEMES, DEMO_ALERTS, DEMO_USERS } from "@/lib/data/seed";
import { Users, Store, Landmark, Bell } from "lucide-react";

export default async function AdminPage() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") redirect("/dashboard");

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview — Andhra Pradesh KrishiMitra AI"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Registered users" value={String(Object.keys(DEMO_USERS).length)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Active listings" value={String(DEMO_LISTINGS.filter((l) => l.status === "active").length)} icon={<Store className="h-5 w-5" />} />
        <StatCard label="Gov schemes" value={String(DEMO_SCHEMES.length)} icon={<Landmark className="h-5 w-5" />} />
        <StatCard label="Active alerts" value={String(DEMO_ALERTS.length)} icon={<Bell className="h-5 w-5" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-forest-dark mb-4">Recent Listings</h2>
          <ul className="space-y-2 text-sm">
            {DEMO_LISTINGS.map((l) => (
              <li key={l.id} className="flex justify-between border-b border-stone-100 pb-2">
                <span>{l.crop_name} — {l.farmer_name}</span>
                <span className="text-stone-500">{l.district}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-semibold text-forest-dark mb-4">System Status</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Supabase</span>
              <span className="text-green-600">Configure in production</span>
            </li>
            <li className="flex justify-between">
              <span>Gemini AI</span>
              <span className="text-green-600">Configure GEMINI_API_KEY</span>
            </li>
            <li className="flex justify-between">
              <span>Weather API</span>
              <span className="text-green-600">Open-Meteo (active)</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
