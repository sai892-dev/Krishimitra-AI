import Link from "next/link";
import { Sprout, ArrowRight, Cloud, Leaf, Store, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { isSupabaseConfigured } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8faf6] to-[#e8f5e9]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-forest" />
          <span className="font-serif text-xl font-semibold text-forest-dark">
            KrishiMitra AI
          </span>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-forest">
              Andhra Pradesh · తెలుగు + English
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-forest-dark md:text-5xl">
              Smart farming ecosystem for every AP farmer
            </h1>
            <p className="mt-4 text-lg text-stone-600">
              Crop disease detection, government schemes, market intelligence,
              weather alerts, and direct selling — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg">
                  Start free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Demo login
                </Button>
              </Link>
            </div>
            {!isSupabaseConfigured() && (
              <p className="mt-4 text-sm text-amber-700 bg-amber-50 inline-block px-3 py-1 rounded-lg">
                Demo: farmer@demo.ap / demo1234
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Leaf, title: "Crop Health AI", te: "పంట వ్యాధి గుర్తింపు", href: "/crop-health" },
              { icon: Cloud, title: "Weather Intel", te: "వాతావరణ సమాచారం", href: "/dashboard" },
              { icon: Store, title: "Direct Market", te: "నేరుగా విక్రయం", href: "/marketplace" },
              { icon: MessageCircle, title: "AI Assistant", te: "AI సహాయకుడు", href: "/assistant" },
            ].map(({ icon: Icon, title, te, href }) => (
              <Link
                key={title}
                href={href}
                className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm hover:border-forest hover:shadow-md transition-all cursor-pointer"
              >
                <Icon className="h-8 w-8 text-forest" />
                <p className="mt-3 font-semibold text-forest-dark">{title}</p>
                <p className="text-sm text-stone-500">{te}</p>
              </Link>
            ))}
          </div>
        </div>

        <section className="mt-20">
          <h2 className="font-serif text-2xl font-semibold text-forest-dark">
            Built for Andhra Pradesh agriculture
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "YSR Rythu Bharosa & PM-KISAN guidance",
              "Guntur chilli & Krishna paddy market prices",
              "Heat wave, cyclone & pest outbreak alerts",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-700"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
