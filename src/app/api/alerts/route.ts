import { NextRequest, NextResponse } from "next/server";
import { getAlerts } from "@/lib/services/data";

export async function GET(request: NextRequest) {
  const district = request.nextUrl.searchParams.get("district") ?? undefined;
  return NextResponse.json(getAlerts(district));
}
