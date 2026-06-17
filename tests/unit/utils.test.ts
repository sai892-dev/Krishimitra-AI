import { formatCurrency, formatDate, cn } from "@/lib/utils";

describe("utils", () => {
  it("formats INR currency", () => {
    expect(formatCurrency(12500)).toMatch(/12,500/);
  });

  it("formats dates", () => {
    const formatted = formatDate("2026-06-15");
    expect(formatted).toContain("2026");
  });

  it("merges class names", () => {
    expect(cn("px-2", "py-1", false && "hidden")).toBe("px-2 py-1");
  });
});

describe("AP data services", () => {
  it("returns alerts filtered by district", async () => {
    const { getAlerts } = await import("@/lib/services/data");
    const alerts = getAlerts("Guntur");
    expect(alerts.every((a) => a.affected_districts.includes("Guntur") || a.affected_districts.length === 0)).toBe(true);
  });

  it("returns market price history", async () => {
    const { getMarketPrices } = await import("@/lib/services/data");
    const data = getMarketPrices("chilli");
    expect(data.history.length).toBe(90);
    expect(data.forecast.length).toBe(7);
  });
});
