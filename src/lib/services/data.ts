import { DEMO_ALERTS } from "@/lib/data/seed";
import { AP_MARKETS } from "@/lib/constants/ap";
import {
  generateMarketHistory,
  generatePriceForecast,
} from "@/lib/data/seed";

export function getAlerts(district?: string) {
  let alerts = DEMO_ALERTS.filter((a) =>
    a.valid_until ? new Date(a.valid_until) > new Date() : true
  );

  if (district) {
    alerts = alerts.filter(
      (a) =>
        a.affected_districts.length === 0 ||
        a.affected_districts.includes(district)
    );
  }

  return alerts;
}

export function getMarketPrices(crop = "chilli") {
  const marketEntry = AP_MARKETS.find((m) => m.crop === crop) ?? AP_MARKETS[0];
  const basePrices: Record<string, number> = {
    chilli: 12500,
    paddy: 2200,
    cotton: 6800,
  };

  const history = generateMarketHistory(
    marketEntry.crop,
    marketEntry.name,
    marketEntry.district,
    basePrices[crop] ?? 5000
  );
  const forecast = generatePriceForecast(
    marketEntry.crop,
    marketEntry.name,
    history[history.length - 1].price_per_quintal
  );

  const lastPrice = history[history.length - 1].price_per_quintal;
  const weekAgo = history[history.length - 7]?.price_per_quintal ?? lastPrice;
  const changePct = (((lastPrice - weekAgo) / weekAgo) * 100).toFixed(1);

  return {
    history,
    forecast,
    market: marketEntry,
    recommendation:
      Number(changePct) > 2
        ? "Prices trending up — consider holding harvest if storage available."
        : Number(changePct) < -2
          ? "Prices softening — sell soon or explore direct marketplace buyers."
          : "Prices stable — monitor market for weekly updates.",
    trend: Number(changePct) > 1 ? "up" : Number(changePct) < -1 ? "down" : "stable",
    changePct,
  };
}
