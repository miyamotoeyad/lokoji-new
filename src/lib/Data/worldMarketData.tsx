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
  // ── Extended fields ──────────────────────────────────────────────────────
  prevClose: number;
  openPrice: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  volume: number;
  currency: string;
}

interface RawQuote {
  price: number;
  change: number;
  changePercent: number;
  prevClose: number;
  openPrice: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  volume: number;
  currency: string;
}

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  Origin: "https://finance.yahoo.com",
  Referer: "https://finance.yahoo.com/",
};

async function fetchSingleIndex(ticker: string): Promise<RawQuote | null> {
  try {
    const res = await fetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
      { headers: HEADERS },
    );

    const finalRes = res.ok
      ? res
      : await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
          { headers: HEADERS },
        );

    if (!finalRes.ok) return null;

    const json = await finalRes.json();
    const result = json?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta) return null;

    const price = (meta.regularMarketPrice ?? 0) as number;
    const prevClose = (meta.chartPreviousClose ??
      meta.previousClose ??
      meta.regularMarketPreviousClose ??
      price) as number;

    if (price === 0) return null;

    const change = parseFloat((price - prevClose).toFixed(2));
    const changePct =
      prevClose !== 0 ? parseFloat(((change / prevClose) * 100).toFixed(2)) : 0;

    // ── Extract from indicators array ─────────────────────────────────────
    const opens: number[] = result?.indicators?.quote?.[0]?.open ?? [];
    const highs: number[] = result?.indicators?.quote?.[0]?.high ?? [];
    const lows: number[] = result?.indicators?.quote?.[0]?.low ?? [];

    const openPrice =
      opens.find((v) => v != null && v > 0) ??
      ((meta.regularMarketOpen ?? 0) as number);
    const highFromArr = highs.filter((v) => v != null && v > 0);
    const lowFromArr = lows.filter((v) => v != null && v > 0);
    const dayHigh =
      highFromArr.length > 0
        ? Math.max(...highFromArr)
        : ((meta.regularMarketDayHigh ?? 0) as number);
    const dayLow =
      lowFromArr.length > 0
        ? Math.min(...lowFromArr)
        : ((meta.regularMarketDayLow ?? 0) as number);

    return {
      price,
      change,
      changePercent: changePct,
      prevClose,
      openPrice: parseFloat((openPrice as number).toFixed(2)),
      dayHigh: parseFloat(dayHigh.toFixed(2)),
      dayLow: parseFloat(dayLow.toFixed(2)),
      weekHigh52: (meta.fiftyTwoWeekHigh ?? 0) as number,
      weekLow52: (meta.fiftyTwoWeekLow ?? 0) as number,
      volume: (meta.regularMarketVolume ?? 0) as number,
      currency: (meta.currency ?? "USD") as string,
    };
  } catch {
    return null;
  }
}

function emptyQuote(): RawQuote {
  return {
    price: 0,
    change: 0,
    changePercent: 0,
    prevClose: 0,
    openPrice: 0,
    dayHigh: 0,
    dayLow: 0,
    weekHigh52: 0,
    weekLow52: 0,
    volume: 0,
    currency: "USD",
  };
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

// ── Cached batch ──────────────────────────────────────────────────────────────
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
  ["world-market-indices-v2"], // ← bumped to invalidate old cache
  { revalidate: 300 },
);

// ── Deduplicate within same render ────────────────────────────────────────────
export const getWorldMarketData = cache(
  async (): Promise<WorldMarketItem[]> => {
    const quotes = await getCachedIndices();

    return WORLD_INDICES.map((i) => {
      const q = quotes[i.ticker] ?? emptyQuote();
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
        prevClose: q.prevClose,
        openPrice: q.openPrice,
        dayHigh: q.dayHigh,
        dayLow: q.dayLow,
        weekHigh52: q.weekHigh52,
        weekLow52: q.weekLow52,
        volume: q.volume,
        currency: q.currency,
      };
    });
  },
);

// ── Candles ───────────────────────────────────────────────────────────────────
export const getIndexCandles = unstable_cache(
  async (ticker: string): Promise<{ time: string; value: number }[]> => {
    try {
      const res = await fetch(
        `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=5m&range=1d`,
        { headers: HEADERS },
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
