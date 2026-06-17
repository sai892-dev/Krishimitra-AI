"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, Badge, Alert } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DEMO_SCHEMES } from "@/lib/data/seed";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n/translations";

export default function SchemesPage() {
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [explaining, setExplaining] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  const categories = ["all", ...new Set(DEMO_SCHEMES.map((s) => s.category).filter(Boolean))];

  const filtered = DEMO_SCHEMES.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.title_te?.includes(q) ||
      s.category?.toLowerCase().includes(q);
    const matchCat = category === "all" || s.category === category;
    return matchSearch && matchCat && s.is_active;
  });

  async function explainScheme(id: string) {
    setExplaining(id);
    try {
      const res = await fetch("/api/ai/scheme-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeId: id, language }),
      });
      const data = await res.json();
      setExplanations((prev) => ({ ...prev, [id]: data.explanation }));
    } finally {
      setExplaining(null);
    }
  }

  return (
    <div>
      <PageHeader
        title={t(language, "schemes")}
        subtitle="Search AP & central agriculture schemes with AI explanations"
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <Input
          placeholder={t(language, "searchSchemes")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((scheme) => (
          <Card key={scheme.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-forest-dark">
                  {language === "te" && scheme.title_te ? scheme.title_te : scheme.title}
                </h3>
                <p className="text-xs text-stone-500">{scheme.ministry}</p>
              </div>
              <Badge>{scheme.category}</Badge>
            </div>
            <p className="mt-2 text-sm text-stone-600">{scheme.benefits}</p>
            {scheme.application_url && (
              <a
                href={scheme.application_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-forest hover:underline"
              >
                Apply online →
              </a>
            )}
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              loading={explaining === scheme.id}
              onClick={() => explainScheme(scheme.id)}
            >
              {t(language, "explainScheme")}
            </Button>
            {explanations[scheme.id] && (
              <Alert variant="info">
                <p className="whitespace-pre-wrap text-sm">{explanations[scheme.id]}</p>
              </Alert>
            )}
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-stone-500 py-8">{t(language, "noData")}</p>
      )}
    </div>
  );
}
