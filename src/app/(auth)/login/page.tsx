"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card, Alert } from "@/components/ui/Card";
import { loginSchema } from "@/lib/validators/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed");
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
    <div className="flex min-h-screen items-center justify-center bg-[#f8faf6] px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center">
          <Sprout className="h-10 w-10 text-forest" />
          <h1 className="mt-2 font-serif text-2xl font-semibold text-forest-dark">
            Welcome back
          </h1>
          <p className="text-sm text-stone-500">KrishiMitra AI · Andhra Pradesh</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" required>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password" required>
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <Button type="submit" loading={loading} className="w-full">
            Login
          </Button>
        </form>


        <p className="mt-2 text-center text-sm">
          No account?{" "}
          <Link href="/register" className="font-medium text-forest hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}
