"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, Badge } from "@/components/ui/Card";
import { DEMO_NEWS } from "@/lib/data/seed";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n/translations";
import { formatDate } from "@/lib/utils";

const CATEGORIES = ["All", "Procurement", "Market", "Pest Alert", "Policy"];

export default function NewsPage() {
  const { language } = useLanguage();
  const [category, setCategory] = useState("All");

  const filtered =
    category === "All"
      ? DEMO_NEWS
      : DEMO_NEWS.filter((n) => n.category === category);

  return (
    <div>
      <PageHeader
        title={t(language, "news")}
        subtitle="Andhra Pradesh agriculture news with Telugu summaries"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              category === c
                ? "bg-forest text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((article) => (
          <Card key={article.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="font-semibold text-forest-dark">
                {language === "te" && article.title_te
                  ? article.title_te
                  : article.title}
              </h3>
              <Badge>{article.category}</Badge>
            </div>
            <p className="mt-2 text-sm text-stone-600">
              {language === "te" && article.summary_te
                ? article.summary_te
                : article.summary}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-400">
              <span>{article.source}</span>
              {article.district && <span>{article.district}</span>}
              {article.published_at && (
                <span>{formatDate(article.published_at)}</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
