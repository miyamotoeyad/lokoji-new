import { unstable_cache } from "next/cache";

export interface CandlePoint {
  time: string;
  value: number;
}

export type ChartRange = "1d" | "5d" | "1mo" | "3mo" | "1y";

const RANGE_CONFIG: Record<ChartRange, { interval: string; range: string }> = {
  "1d": { interval: "5m", range: "1d" },
  "5d": { interval: "60m", range: "5d" },
  "1mo": { interval: "1d", range: "1mo" },
  "3mo": { interval: "1d", range: "3mo" },
  "1y": { interval: "1wk", range: "1y" },
};

function formatTime(ts: number, range: ChartRange): string {
  const date = new Date(ts * 1000);
  if (range === "1d") {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  if (range === "5d") {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Wrapped with unstable_cache — one fetch per ticker+range per revalidate ───
export const getIntradayCandles = unstable_cache(
  async (ticker: string, range: ChartRange = "1d"): Promise<CandlePoint[]> => {
    if (!ticker) return [];
    const config = RANGE_CONFIG[range];

    try {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${config.interval}&range=${config.range}`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            Accept: "application/json",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      );
      if (!res.ok) return [];

      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) return [];

      const timestamps: number[] = result.timestamp ?? [];
      const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];
      if (!timestamps.length || !closes.length) return [];

      return timestamps
        .map((ts, i) => ({
          time: formatTime(ts, range),
          value: parseFloat((closes[i] ?? 0).toFixed(2)),
        }))
        .filter((p) => p.value > 0);
    } catch {
      return [];
    }
  },
  ["intraday-candles"],
  { revalidate: 300 },
);
