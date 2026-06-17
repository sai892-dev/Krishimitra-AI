"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatDate } from "@/lib/utils";
import type { MarketPrice, PriceForecast } from "@/types";
import { Badge } from "@/components/ui/Card";

interface PriceChartProps {
  history: MarketPrice[];
  forecast: PriceForecast[];
}

export function PriceChart({ history, forecast }: PriceChartProps) {
  const historyData = history.slice(-30).map((p) => ({
    date: p.recorded_date,
    historical: p.price_per_quintal,
    forecast: null as number | null,
  }));

  const forecastData = forecast.map((f) => ({
    date: f.forecast_date,
    historical: null as number | null,
    forecast: f.predicted_price,
  }));

  const lastHistorical = historyData[historyData.length - 1];
  if (lastHistorical) {
    lastHistorical.forecast = lastHistorical.historical;
  }

  const chartData = [...historyData, ...forecastData.slice(1)];

  const lastForecast = forecast[forecast.length - 1];
  const firstHistorical = history[history.length - 7];
  const lastHistoricalPrice = history[history.length - 1]?.price_per_quintal ?? 0;
  const trend =
    lastForecast && firstHistorical
      ? lastForecast.predicted_price > firstHistorical.price_per_quintal
        ? "up"
        : lastForecast.predicted_price < firstHistorical.price_per_quintal
          ? "down"
          : "stable"
      : "stable";

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-sm text-stone-600">7-day trend:</span>
        <Badge
          variant={
            trend === "up" ? "success" : trend === "down" ? "danger" : "default"
          }
        >
          {trend === "up" ? "↑ Rising" : trend === "down" ? "↓ Falling" : "→ Stable"}
        </Badge>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => formatDate(d).split(",")[0] ?? d}
            tick={{ fontSize: 11 }}
          />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value) =>
              value != null && typeof value === "number"
                ? `₹${value.toLocaleString("en-IN")}`
                : "—"
            }
            labelFormatter={(d) => formatDate(String(d))}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="historical"
            stroke="#2D6A4F"
            strokeWidth={2}
            dot={false}
            name="Historical"
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#F4A261"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Forecast"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
