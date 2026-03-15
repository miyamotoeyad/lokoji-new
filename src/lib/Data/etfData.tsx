import { unstable_cache } from "next/cache";
import { cache } from "react";
import { ETF_LIST } from "../Array/eftList";

export interface ETFItem {
  id: string;
  title: string;
  titleEn: string;
  ticker: string;
  yahooTicker: string | null;
  point: number;
  change: number;
  changePercent: number;
  positive: boolean;
  slug: string;
  currency: string;
  market: "EGX" | "US" | "EUREX" | "LSE" | "TADAWUL";
  category: "egypt" | "global" | "sector" | "commodities" | "bonds" | "arab";
}

async function fetchYahooQuote(ticker: string) {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const price = (meta.regularMarketPrice ?? 0) as number;
    const prevClose = (meta.previousClose ??
      meta.chartPreviousClose ??
      meta.regularMarketPreviousClose ??
      price) as number;

    if (price === 0) return null;

    const change = parseFloat((price - prevClose).toFixed(2));
    const changePercent =
      prevClose !== 0 ? parseFloat(((change / prevClose) * 100).toFixed(2)) : 0;

    return { price, change, changePercent };
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

const FALLBACK: Record<
  string,
  { price: number; change: number; changePercent: number }
> = {
  "^CASE30": { price: 31975, change: 141, changePercent: 0.44 },
  "^EGX70": { price: 12788, change: 78, changePercent: 0.61 },
  "^EGX100": { price: 17689, change: 128, changePercent: 0.73 },
  EGPT: { price: 22.4, change: 0.31, changePercent: 1.4 },
  "FMEY.EX": { price: 820.0, change: 14.69, changePercent: 1.82 },
  SPY: { price: 524.3, change: 3.1, changePercent: 0.59 },
  QQQ: { price: 445.2, change: 4.5, changePercent: 1.02 },
  VTI: { price: 240.1, change: 1.8, changePercent: 0.75 },
  IWM: { price: 205.4, change: -1.2, changePercent: -0.58 },
  VEA: { price: 49.3, change: 0.4, changePercent: 0.82 },
  VWO: { price: 43.5, change: -0.3, changePercent: -0.68 },
  EEM: { price: 41.8, change: -0.2, changePercent: -0.47 },
  ACWI: { price: 108.9, change: 0.9, changePercent: 0.83 },
  XLK: { price: 214.5, change: 2.1, changePercent: 0.99 },
  XLF: { price: 43.2, change: 0.35, changePercent: 0.82 },
  XLE: { price: 89.1, change: -0.6, changePercent: -0.67 },
  XLV: { price: 142.3, change: 0.8, changePercent: 0.56 },
  XLI: { price: 118.4, change: 0.5, changePercent: 0.42 },
  ARKK: { price: 46.7, change: 1.2, changePercent: 2.64 },
  GLD: { price: 213.4, change: 1.5, changePercent: 0.71 },
  SLV: { price: 24.8, change: 0.3, changePercent: 1.22 },
  USO: { price: 73.2, change: -0.9, changePercent: -1.22 },
  DJP: { price: 26.1, change: -0.1, changePercent: -0.38 },
  TLT: { price: 90.3, change: -0.4, changePercent: -0.44 },
  BND: { price: 72.8, change: -0.1, changePercent: -0.14 },
  EMB: { price: 88.5, change: 0.2, changePercent: 0.23 },
  KSA: { price: 42.1, change: 0.5, changePercent: 1.2 },
  UAE: { price: 16.8, change: 0.1, changePercent: 0.6 },
  QAT: { price: 15.4, change: -0.08, changePercent: -0.52 },
  GULF: { price: 18.2, change: 0.12, changePercent: 0.66 },
  MES: { price: 37.6, change: 0.3, changePercent: 0.8 },
};

// ── Cached batch fetch ────────────────────────────────────────────────────────
const getCachedETFs = unstable_cache(
  async (): Promise<ETFItem[]> => {
    const tasks = ETF_LIST.map((etf) => async () => {
      const live = etf.yahooTicker
        ? await fetchYahooQuote(etf.yahooTicker)
        : null;
      // In getCachedETFs, update the mapping:
      const raw = live ??
        FALLBACK[etf.ticker] ?? { price: 0, change: 0, changePercent: 0 };

      // Guard against null values from Yahoo meta
      const price = raw.price ?? 0;
      const change = raw.change ?? 0;
      const changePercent = raw.changePercent ?? 0;

      return {
        id: etf.id,
        title: etf.titleAr,
        titleEn: etf.titleEn,
        ticker: etf.ticker,
        yahooTicker: etf.yahooTicker,
        point: price,
        change: Math.abs(change),
        changePercent: Math.abs(changePercent),
        positive: changePercent >= 0,
        slug: etf.slug,
        currency: etf.currency,
        market: etf.market,
        category: etf.category,
      } satisfies ETFItem;
    });

    const results = await fetchWithConcurrency(tasks, 5);
    return results.sort((a, b) => b.point - a.point);
  },
  ["etfs"],
  { revalidate: 1800 },
);

// ── Deduplicate within same render ────────────────────────────────────────────
export const getETFs = cache(getCachedETFs);

export function filterByCategory(
  etfs: ETFItem[],
  category: ETFItem["category"],
): ETFItem[] {
  return etfs.filter((e) => e.category === category);
}
