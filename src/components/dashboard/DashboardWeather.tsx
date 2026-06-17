"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Card";
import type { WeatherData } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n/translations";

export function DashboardWeather({
  district,
  initialWeather,
}: {
  district: string;
  initialWeather: WeatherData | null;
}) {
  const { language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(initialWeather);
  const [loading, setLoading] = useState(!initialWeather);

  useEffect(() => {
    if (initialWeather) return;
    fetch(`/api/weather?district=${district}`)
      .then((r) => r.json())
      .then(setWeather)
      .finally(() => setLoading(false));
  }, [district, initialWeather]);

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card>
      <h2 className="font-semibold text-forest-dark mb-4">
        {t(language, "forecast")} — {district}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {weather.forecast.map((day) => (
          <div
            key={day.date}
            className="rounded-lg bg-stone-50 p-3 text-center text-sm"
          >
            <p className="text-xs text-stone-500">
              {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short" })}
            </p>
            <p className="mt-1 font-semibold text-forest-dark">
              {day.tempMax}° / {day.tempMin}°
            </p>
            <p className="mt-1 text-xs text-stone-500 truncate">{day.description}</p>
            {day.precipitation > 0 && (
              <p className="text-xs text-blue-600">{day.precipitation}mm</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
