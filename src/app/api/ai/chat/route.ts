import { NextRequest, NextResponse } from "next/server";
import { chatWithAssistant } from "@/lib/gemini/client";
import { getDemoSession } from "@/lib/auth/demo";
import { DEMO_USERS } from "@/lib/data/seed";

export async function POST(request: NextRequest) {
  try {
    const { messages, language = "en" } = await request.json();
    if (!messages?.length) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const session = await getDemoSession();
    let context = "";
    if (session) {
      const user = Object.values(DEMO_USERS).find((u) => u.id === session.id);
      if (user?.farmer) {
        context = `${session.full_name}, ${user.district}, ${user.farmer.land_size_acres} acres, crops: ${user.farmer.primary_crops.join(", ")}`;
      } else {
        context = `${session.full_name}, ${session.district}, role: ${session.role}`;
      }
    }

    const reply = await chatWithAssistant(messages, language, context);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
