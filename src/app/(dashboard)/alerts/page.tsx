"use client";

import { useEffect, useState } from "react";
import { PageHeader, EmptyState } from "@/components/layout/PageHeader";
import { Card, Badge } from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n/translations";
import type { EmergencyAlert } from "@/types";
import { AlertTriangle, CloudLightning, Bug } from "lucide-react";

const TYPE_ICONS = {
  weather: CloudLightning,
  cyclone: AlertTriangle,
  pest: Bug,
};

const SEVERITY_VARIANT = {
  info: "info" as const,
  warning: "warning" as const,
  critical: "danger" as const,
};

export default function AlertsPage() {
  const { language } = useLanguage();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alerts")
      .then((r) => r.json())
      .then(setAlerts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title={t(language, "alerts")}
        subtitle="Weather, cyclone & pest outbreak alerts for Andhra Pradesh"
      />

      {loading ? (
        <p className="text-stone-500">{t(language, "loading")}</p>
      ) : alerts.length === 0 ? (
        <EmptyState title="No active alerts" description="All clear in your region" />
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = TYPE_ICONS[alert.type];
            return (
              <Card key={alert.id}>
                <div className="flex items-start gap-3">
                  <Icon className="h-6 w-6 text-forest shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-forest-dark">
                        {language === "te" && alert.title_te
                          ? alert.title_te
                          : alert.title}
                      </h3>
                      <Badge variant={SEVERITY_VARIANT[alert.severity]}>
                        {alert.severity}
                      </Badge>
                      <Badge>{alert.type}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-stone-600">
                      {language === "te" && alert.message_te
                        ? alert.message_te
                        : alert.message}
                    </p>
                    <p className="mt-2 text-xs text-stone-400">
                      Districts: {alert.affected_districts.join(", ")}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
