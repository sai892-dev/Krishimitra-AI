import { NextRequest, NextResponse } from "next/server";
import { analyzeCropImage } from "@/lib/gemini/client";
import {
  DEMO_CROP_ANALYSIS_RESULT,
  demoAnalysesStore,
} from "@/lib/data/seed";
import { getDemoSession } from "@/lib/auth/demo";

export async function POST(request: NextRequest) {
  try {
    const { image, mimeType } = await request.json();
    if (!image || !mimeType) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    let parsed = DEMO_CROP_ANALYSIS_RESULT;
    try {
      const raw = await analyzeCropImage(image, mimeType);
      const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Use demo fallback on parse failure
    }

    const session = await getDemoSession();
    const analysis = {
      id: crypto.randomUUID(),
      farmer_id: session?.id ?? "anonymous",
      image_url: `data:${mimeType};base64,${image.slice(0, 50)}...`,
      crop_type: parsed.crop_type,
      disease_name: parsed.disease_name,
      confidence: parsed.confidence,
      severity: parsed.severity,
      treatment_recommendations: parsed.treatment,
      created_at: new Date().toISOString(),
    };

    demoAnalysesStore.unshift(analysis);

    return NextResponse.json(analysis);
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getDemoSession();
  const analyses = session
    ? demoAnalysesStore.filter((a) => a.farmer_id === session.id)
    : demoAnalysesStore;
  return NextResponse.json(analyses);
}
