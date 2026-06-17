import { NextRequest, NextResponse } from "next/server";
import { getWeather } from "@/lib/services/weather";

export async function GET(request: NextRequest) {
  const district = request.nextUrl.searchParams.get("district") ?? "Krishna";
  const weather = await getWeather(district);
  return NextResponse.json(weather);
}
