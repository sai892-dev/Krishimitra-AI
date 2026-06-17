"use client";

import { useState, useRef } from "react";
import { Upload, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, Badge, Alert } from "@/components/ui/Card";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/i18n/translations";
import type { CropAnalysis } from "@/types";

export function CropUploadForm({
  onAnalysisComplete,
}: {
  onAnalysisComplete: (analysis: CropAnalysis) => void;
}) {
  const { language } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CropAnalysis | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAnalyze(file: File) {
    setLoading(true);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        const res = await fetch("/api/ai/crop-detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: base64,
            mimeType: file.type,
          }),
        });
        if (!res.ok) throw new Error("Analysis failed");
        const data = await res.json();
        setResult(data);
        onAnalysisComplete(data);
      } catch {
        setError(t(language, "error"));
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    handleAnalyze(file);
  }

  return (
    <div className="space-y-4">
      <div
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 p-8 cursor-pointer hover:border-forest hover:bg-forest/5 transition-colors"
        onClick={() => fileRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={t(language, "uploadLeaf")}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Leaf preview"
            className="max-h-48 rounded-lg object-contain"
          />
        ) : (
          <>
            <Upload className="h-10 w-10 text-stone-400" />
            <p className="mt-2 text-sm font-medium text-forest-dark">
              {t(language, "uploadLeaf")}
            </p>
            <p className="text-xs text-stone-500">JPG, PNG up to 5MB</p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      <Button
        onClick={() => fileRef.current?.click()}
        loading={loading}
        className="w-full"
      >
        <Camera className="h-4 w-4" />
        {loading ? t(language, "loading") : t(language, "analyze")}
      </Button>

      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-forest-dark">
                {result.disease_name}
              </h3>
              <p className="text-sm text-stone-500">{result.crop_type}</p>
            </div>
            <Badge variant="warning">{result.confidence}% confidence</Badge>
          </div>
          {result.treatment_recommendations && (
            <div className="mt-4 space-y-3 text-sm">
              {(["immediate", "preventive", "organic"] as const).map((key) => (
                <div key={key}>
                  <p className="font-medium capitalize text-forest">{key}</p>
                  <ul className="mt-1 list-disc pl-5 text-stone-600">
                    {result.treatment_recommendations![key].map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export function AnalysisHistory({ analyses }: { analyses: CropAnalysis[] }) {
  const { language } = useLanguage();

  if (analyses.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="mb-3 font-semibold text-forest-dark">Previous Analyses</h3>
      <div className="space-y-2">
        {analyses.map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-3"
          >
            <div>
              <p className="font-medium text-sm">{a.disease_name}</p>
              <p className="text-xs text-stone-500">
                {new Date(a.created_at).toLocaleDateString()}
              </p>
            </div>
            <Badge>{a.confidence}%</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
