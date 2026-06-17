"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CropUploadForm, AnalysisHistory } from "@/components/crop-health/CropUpload";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n/translations";
import type { CropAnalysis } from "@/types";

export default function CropHealthPage() {
  const { language } = useLanguage();
  const [analyses, setAnalyses] = useState<CropAnalysis[]>([]);

  useEffect(() => {
    fetch("/api/ai/crop-detect")
      .then((r) => r.json())
      .then(setAnalyses)
      .catch(() => {});
  }, []);

  function handleComplete(analysis: CropAnalysis) {
    setAnalyses((prev) => [analysis, ...prev]);
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={t(language, "cropHealth")}
        subtitle="Upload a leaf photo for AI disease detection (Gemini Vision)"
      />
      <CropUploadForm onAnalysisComplete={handleComplete} />
      <AnalysisHistory analyses={analyses} />
    </div>
  );
}
