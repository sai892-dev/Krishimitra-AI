import { NextRequest, NextResponse } from "next/server";
import { chatWithAssistant } from "@/lib/gemini/client";
import { getCurrentProfile } from "@/lib/auth/session";
import { getCurrentDemoUser } from "@/lib/auth/demo";
import { isSupabaseConfigured } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, language = "en" } = await request.json();
    if (!messages?.length) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    const session = await getCurrentProfile();
    let context = "";
    if (session) {
      if (isSupabaseConfigured()) {
        const supabase = await createClient();
        if (supabase) {
          const { data: farmer } = await supabase
            .from("farmer_profiles")
            .select("*")
            .eq("user_id", session.id)
            .single();
          if (farmer) {
            context = `${session.full_name}, ${session.district}, ${farmer.land_size_acres} acres, crops: ${(farmer.primary_crops || []).join(", ")}`;
          } else {
            context = `${session.full_name}, ${session.district}, role: ${session.role}`;
          }
        }
      } else {
        const demoUser = await getCurrentDemoUser();
        if (demoUser?.farmer) {
          context = `${session.full_name}, ${session.district}, ${demoUser.farmer.land_size_acres} acres, crops: ${demoUser.farmer.primary_crops.join(", ")}`;
        } else {
          context = `${session.full_name}, ${session.district}, role: ${session.role}`;
        }
      }
    }

    const reply = await chatWithAssistant(messages, language, context);
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
