"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { Card, Alert } from "@/components/ui/Card";
import { registerSchema } from "@/lib/validators/auth";
import { AP_DISTRICTS, USER_ROLES } from "@/lib/constants/ap";
import { Language, LANGUAGES_LIST } from "@/lib/i18n/translations";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "farmer" as "farmer" | "buyer" | "admin",
    district: "Krishna" as (typeof AP_DISTRICTS)[number],
    preferred_language: "te" as Language,
    land_size_acres: "",
    business_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = registerSchema.safeParse({
      ...form,
      land_size_acres: form.land_size_acres ? Number(form.land_size_acres) : undefined,
      primary_crops: form.role === "farmer" ? ["paddy"] : undefined,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faf6] px-4 py-8">
      <Card className="w-full max-w-lg">
        <div className="mb-6 flex flex-col items-center">
          <Sprout className="h-10 w-10 text-forest" />
          <h1 className="mt-2 font-serif text-2xl font-semibold text-forest-dark">
            Join KrishiMitra
          </h1>
          <p className="text-sm text-stone-500">Register as farmer or buyer in AP</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="full_name" required>Full name</Label>
              <Input id="full_name" value={form.full_name} onChange={(e) => update("full_name", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email" required>Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password" required>Password</Label>
              <Input id="password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="role" required>I am a</Label>
              <Select id="role" value={form.role} onChange={(e) => update("role", e.target.value)}>
                {USER_ROLES.filter((r) => r !== "admin").map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </Select>
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
              <Label htmlFor="language">Language</Label>
              <Select id="language" value={form.preferred_language} onChange={(e) => update("preferred_language", e.target.value)}>
                {LANGUAGES_LIST.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </Select>
            </div>
            {form.role === "farmer" && (
              <div>
                <Label htmlFor="land">Land (acres)</Label>
                <Input id="land" type="number" step="0.1" value={form.land_size_acres} onChange={(e) => update("land_size_acres", e.target.value)} />
              </div>
            )}
            {form.role === "buyer" && (
              <div>
                <Label htmlFor="business">Business name</Label>
                <Input id="business" value={form.business_name} onChange={(e) => update("business_name", e.target.value)} />
              </div>
            )}
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-forest hover:underline">
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
