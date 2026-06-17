import { DISTRICT_COORDS } from "@/lib/constants/ap";
import type { WeatherData } from "@/types";

const WEATHER_CODES: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  80: "Rain showers",
  95: "Thunderstorm",
};

export async function getWeather(district = "Krishna"): Promise<WeatherData> {
  const coords = DISTRICT_COORDS[district] ?? DISTRICT_COORDS.Krishna;

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(coords.lat));
    url.searchParams.set("longitude", String(coords.lng));
    url.searchParams.set(
      "current",
      "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code"
    );
    url.searchParams.set(
      "daily",
      "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code"
    );
    url.searchParams.set("timezone", "Asia/Kolkata");
    url.searchParams.set("forecast_days", "7");

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    const data = await res.json();

    return {
      district,
      current: {
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code,
        description: WEATHER_CODES[data.current.weather_code] ?? "Unknown",
      },
      forecast: data.daily.time.map((date: string, i: number) => ({
        date,
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        tempMin: Math.round(data.daily.temperature_2m_min[i]),
        precipitation: data.daily.precipitation_sum[i],
        description: WEATHER_CODES[data.daily.weather_code[i]] ?? "Unknown",
      })),
    };
  } catch {
    return {
      district,
      current: {
        temperature: 34,
        humidity: 65,
        windSpeed: 12,
        weatherCode: 2,
        description: "Partly cloudy",
      },
      forecast: Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
          date: d.toISOString().split("T")[0],
          tempMax: 36 - i,
          tempMin: 26,
          precipitation: i % 3 === 0 ? 2.5 : 0,
          description: i % 3 === 0 ? "Light rain" : "Partly cloudy",
        };
      }),
    };
  }
}
