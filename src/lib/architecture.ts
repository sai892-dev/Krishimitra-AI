/**
 * KrishiMitra AI — Architecture Overview
 *
 * Layer structure:
 * - app/(auth)        → Public login/register pages
 * - app/(dashboard)   → Protected feature pages (middleware + layout guard)
 * - app/api           → Route handlers (AI, weather, auth)
 * - components/ui     → Reusable primitives (Button, Card, Input)
 * - components/*      → Feature-specific UI
 * - lib/services      → Server-side data fetching (weather, alerts, prices)
 * - lib/data/seed     → Demo fallback data when Supabase is not configured
 * - lib/supabase      → Supabase client factories (browser + server)
 * - lib/gemini        → Google Gemini AI integration
 * - lib/i18n          → English + Telugu translations
 *
 * Auth flow:
 * - Production: Supabase Auth + profiles table + RLS
 * - Demo mode: Cookie session with seeded AP demo accounts
 *
 * Deployment: Vercel (frontend) + Supabase (DB/Auth/Storage)
 */

export {};
