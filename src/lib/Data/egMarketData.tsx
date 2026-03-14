import { cache } from "react";
import { unstable_cache } from "next/cache";
import { EGX_STOCKS } from "../Array/egyStocks";

export interface EGStock {
  id: string;
  code: string;
  yahooCode: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  price: number;
  change: number;
  changePercent: number;
  positive: boolean;
  currency: string;
  volume?: number;
}

type QuoteData = {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
};

// ── Fetch single symbol via chart endpoint (no auth needed) ───────────────────
async function fetchQuote(yahooCode: string): Promise<QuoteData | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooCode)}?interval=1d&range=1d`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
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

    return {
      price,
      change,
      changePercent: changePct,
      volume: (meta.regularMarketVolume ?? 0) as number,
    };
  } catch {
    return null;
  }
}

// ── Concurrency limiter — max N requests at once ──────────────────────────────
async function fetchWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit = 5, // max 5 simultaneous requests — was 30
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

// ── Fetch all quotes with concurrency control ─────────────────────────────────
async function fetchAllQuotes(): Promise<Record<string, QuoteData>> {
  const tasks = EGX_STOCKS.map(
    (stock) => () =>
      fetchQuote(stock.yahooCode).then((data) => ({
        symbol: stock.yahooCode,
        data,
      })),
  );

  const results = await fetchWithConcurrency(tasks, 5);
  const map: Record<string, QuoteData> = {};

  for (const result of results) {
    if (result.data) {
      map[result.symbol] = result.data;
    }
  }

  return map;
}

// ── Cache result for 30 min across all requests ───────────────────────────────
const getCachedQuotes = unstable_cache(fetchAllQuotes, ["egx-quotes"], {
  revalidate: 1800,
});

// ── Deduplicate within same render ────────────────────────────────────────────
export const getEgyptianMarketData = cache(async (): Promise<EGStock[]> => {
  const quotes = await getCachedQuotes();

  const results: EGStock[] = EGX_STOCKS.map((stock) => {
    const data = quotes[stock.yahooCode] ?? {
      price: 0,
      change: 0,
      changePercent: 0,
      volume: 0,
    };

    return {
      id: stock.yahooCode,
      code: stock.code,
      yahooCode: stock.yahooCode,
      titleAr: stock.titleAr,
      titleEn: stock.titleEn,
      slug: stock.code.toLowerCase(),
      price: data.price,
      change: Math.abs(data.change),
      changePercent: Math.abs(data.changePercent),
      positive: data.changePercent >= 0,
      currency: "EGP",
      volume: data.volume,
    };
  });

  return results.sort((a, b) => b.price - a.price);
});
