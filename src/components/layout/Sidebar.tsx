"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Leaf,
  Landmark,
  Newspaper,
  Store,
  TrendingUp,
  MessageCircle,
  Bell,
  User,
  Shield,
  LogOut,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { t, Language, LANGUAGES_LIST } from "@/lib/i18n/translations";
import type { UserRole } from "@/lib/constants/ap";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" as const },
  { href: "/crop-health", icon: Leaf, key: "cropHealth" as const },
  { href: "/schemes", icon: Landmark, key: "schemes" as const },
  { href: "/news", icon: Newspaper, key: "news" as const },
  { href: "/marketplace", icon: Store, key: "marketplace" as const },
  { href: "/market-prices", icon: TrendingUp, key: "marketPrices" as const },
  { href: "/assistant", icon: MessageCircle, key: "assistant" as const },
  { href: "/alerts", icon: Bell, key: "alerts" as const },
  { href: "/profile", icon: User, key: "profile" as const },
];

export function Sidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();

  const items =
    role === "admin"
      ? [...navItems, { href: "/admin", icon: Shield, key: "admin" as const }]
      : navItems;

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-stone-200 lg:bg-white">
      <div className="flex items-center gap-2 border-b border-stone-200 px-6 py-5">
        <Sprout className="h-8 w-8 text-forest" aria-hidden />
        <div>
          <p className="font-serif font-semibold text-forest-dark">
            {t(language, "appName")}
          </p>
          <p className="text-xs text-stone-500">Andhra Pradesh</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main navigation">
        {items.map(({ href, icon: Icon, key }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-forest text-white"
                  : "text-stone-600 hover:bg-stone-100 hover:text-forest-dark"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              {t(language, key)}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-stone-200 p-4 space-y-2">
        <div className="w-full">
          <label htmlFor="sidebar-language" className="sr-only">
            Select Language
          </label>
          <select
            id="sidebar-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-forest hover:bg-stone-50 focus:outline-none focus:ring-1 focus:ring-forest cursor-pointer"
          >
            {LANGUAGES_LIST.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            {t(language, "logout")}
          </button>
        </form>
      </div>
    </aside>
  );
}

export function MobileNav({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const { language } = useLanguage();

  const mobileItems = navItems.slice(0, 4);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-stone-200 bg-white lg:hidden"
      aria-label="Mobile navigation"
    >
      {mobileItems.map(({ href, icon: Icon, key }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-xs",
              active ? "text-forest" : "text-stone-500"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
            <span className="truncate px-1">{t(language, key)}</span>
          </Link>
        );
      })}
      <form action="/api/auth/logout" method="POST" className="flex flex-1">
        <button
          type="submit"
          className="flex flex-1 flex-col items-center gap-0.5 py-2 text-xs text-red-500 hover:text-red-700 active:bg-red-50"
        >
          <LogOut className="h-5 w-5" aria-hidden />
          <span className="truncate px-1">{t(language, "logout")}</span>
        </button>
      </form>
    </nav>
  );
}
