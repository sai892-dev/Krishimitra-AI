import { NextRequest, NextResponse } from "next/server";
import { getMarketPrices } from "@/lib/services/data";

export async function GET(request: NextRequest) {
  const crop = request.nextUrl.searchParams.get("crop") ?? "chilli";
  return NextResponse.json(getMarketPrices(crop));
}
