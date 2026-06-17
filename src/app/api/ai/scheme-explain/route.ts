import { NextRequest, NextResponse } from "next/server";
import { explainScheme } from "@/lib/gemini/client";
import { DEMO_SCHEMES } from "@/lib/data/seed";
import { getDemoSession } from "@/lib/auth/demo";
import { DEMO_USERS } from "@/lib/data/seed";

export async function POST(request: NextRequest) {
  try {
    const { schemeId, language = "en" } = await request.json();
    const scheme = DEMO_SCHEMES.find((s) => s.id === schemeId);
    if (!scheme) {
      return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
    }

    const session = await getDemoSession();
    let farmerProfile = "";
    if (session) {
      const user = Object.values(DEMO_USERS).find((u) => u.id === session.id);
      if (user?.farmer) {
        farmerProfile = `${user.district} district, ${user.farmer.land_size_acres} acres, crops: ${user.farmer.primary_crops.join(", ")}`;
      }
    }

    const explanation = await explainScheme(
      scheme.title,
      `${scheme.benefits}. Eligibility: ${JSON.stringify(scheme.eligibility_criteria)}`,
      language,
      farmerProfile
    );

    return NextResponse.json({ explanation });
  } catch {
    return NextResponse.json({ error: "Explanation failed" }, { status: 500 });
  }
}
