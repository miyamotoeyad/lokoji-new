import { cache } from "react";
import { unstable_cache } from "next/cache";
import { WORLD_INDICES } from "../Array/worldMarketList";

export interface WorldMarketItem {
  id: string;
  slug: string;
  ticker: string;
  title: string;
  titleEn: string;
  price: number;
  change: number;
  changePercent: number;
  positive: boolean;
}

type RawQuote = {
  price: number;
  change: number;
  changePercent: number;
};

async function fetchSingleIndex(ticker: string): Promise<RawQuote | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
        },
      },
    );
    if (!res.ok) return null;

    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const price = (meta.regularMarketPrice ?? 0) as number;
    const prevClose = (meta.previousClose ??
      meta.chartPreviousClose ??
      price) as number;
    const change = parseFloat((price - prevClose).toFixed(2));
    const changePct =
      prevClose !== 0 ? parseFloat(((change / prevClose) * 100).toFixed(2)) : 0;

    return { price, change, changePercent: changePct };
  } catch {
    return null;
  }
}

// ── Concurrency limiter ───────────────────────────────────────────────────────
async function fetchWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit = 5,
): Promise<T[]> {
  const results: T[] = [];
  let index = 0;
  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

// ── Cached batch — ONE set of requests per 5 min across ALL visitors ──────────
const getCachedIndices = unstable_cache(
  async (): Promise<Record<string, RawQuote>> => {
    const tasks = WORLD_INDICES.map(
      (i) => () =>
        fetchSingleIndex(i.ticker).then((data) => ({ ticker: i.ticker, data })),
    );
    const results = await fetchWithConcurrency(tasks, 5);
    const map: Record<string, RawQuote> = {};
    for (const r of results) {
      if (r.data) map[r.ticker] = r.data;
    }
    return map;
  },
  ["world-market-indices"],
  { revalidate: 300 },
);

// ── Deduplicate within same render ────────────────────────────────────────────
export const getWorldMarketData = cache(
  async (): Promise<WorldMarketItem[]> => {
    const quotes = await getCachedIndices();

    return WORLD_INDICES.map((i) => {
      const q = quotes[i.ticker] ?? { price: 0, change: 0, changePercent: 0 };
      return {
        id: i.ticker,
        slug: i.slug,
        ticker: i.ticker,
        title: i.title,
        titleEn: i.titleEn,
        price: q.price,
        change: q.change,
        changePercent: q.changePercent,
        positive: q.changePercent >= 0,
      };
    });
  },
);

export const getIndexCandles = unstable_cache(
  async (ticker: string): Promise<{ time: string; value: number }[]> => {
    try {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=5m&range=1d`,
        { headers: { "User-Agent": "Mozilla/5.0" } },
      );
      if (!res.ok) return [];

      const json = await res.json();
      const result = json?.chart?.result?.[0];
      const timestamps: number[] = result?.timestamp ?? [];
      const closes: number[] = result?.indicators?.quote?.[0]?.close ?? [];

      return timestamps
        .map((ts, i) => ({
          time: new Date(ts * 1000).toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          value: closes[i] ?? 0,
        }))
        .filter((p) => p.value > 0);
    } catch {
      return [];
    }
  },
  ["world-market-candles"],
  { revalidate: 300 },
);
