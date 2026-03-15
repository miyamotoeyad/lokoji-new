import { unstable_cache } from "next/cache";
import { cache } from "react";
import { WORLD_STOCKS_CONFIG } from "../Array/WorldCompanyList";

export interface WorldStock {
  id: number;
  ticker: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  sector: string;
  exchange: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  positive: boolean;
  prevClose: number;
  openPrice: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  avgVolume: number;
  totalValue: number;
  peRatio: number;
  eps: number;
  dividendYield: number;
  longName: string;
  currency: string;
}

interface YahooStockQuote {
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  prevClose: number;
  openPrice: number; // ← new
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  avgVolume: number; // ← new: متوسط القيمة
  totalValue: number; // ← new: إجمالي القيمة المتداولة (price × volume)
  peRatio: number; // ← new: العائد على
  eps: number; // ← new: العائد على السهم
  dividendYield: number; // ← new: العائد على الأرباح
  longName: string;
  currency: string;
}

async function fetchStockQuote(
  ticker: string,
): Promise<YahooStockQuote | null> {
  try {
    // ── Fetch chart + quoteSummary in parallel ──────────────────────────────
    const [chartRes, summaryRes] = await Promise.all([
      fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
        { headers: { "User-Agent": "Mozilla/5.0" } },
      ),
      fetch(
        `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(ticker)}?modules=summaryDetail,defaultKeyStatistics`,
        { headers: { "User-Agent": "Mozilla/5.0" } },
      ),
    ]);

    if (!chartRes.ok) return null;
    const chartJson = await chartRes.json();
    const meta = chartJson?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const price = (meta.regularMarketPrice ?? 0) as number;
    const prevClose = (meta.chartPreviousClose ??
      meta.previousClose ??
      meta.regularMarketPreviousClose ??
      price) as number;

    if (price === 0) return null;

    const change = parseFloat((price - prevClose).toFixed(2));
    const changePercent =
      prevClose !== 0 ? parseFloat(((change / prevClose) * 100).toFixed(2)) : 0;

    const volume = (meta.regularMarketVolume ?? 0) as number;
    const openPrice = (meta.regularMarketOpen ?? 0) as number;

    // ── Parse quoteSummary for fundamentals ───────────────────────────────
    let peRatio = 0;
    let eps = 0;
    let dividendYield = 0;
    let avgVolume = 0;

    if (summaryRes.ok) {
      const summaryJson = await summaryRes.json();
      const detail = summaryJson?.quoteSummary?.result?.[0];
      const sd = detail?.summaryDetail;
      const ks = detail?.defaultKeyStatistics;

      peRatio = (sd?.trailingPE?.raw ?? ks?.forwardPE?.raw ?? 0) as number;
      eps = (ks?.trailingEps?.raw ?? 0) as number;
      dividendYield = (sd?.dividendYield?.raw ??
        sd?.trailingAnnualDividendYield?.raw ??
        0) as number;
      avgVolume = (sd?.averageVolume?.raw ??
        sd?.averageVolume10days?.raw ??
        0) as number;
    }

    return {
      price,
      change,
      changePercent,
      marketCap: (meta.marketCap ?? 0) as number,
      volume,
      prevClose,
      openPrice,
      dayHigh: (meta.regularMarketDayHigh ?? 0) as number,
      dayLow: (meta.regularMarketDayLow ?? 0) as number,
      weekHigh52: (meta.fiftyTwoWeekHigh ?? 0) as number,
      weekLow52: (meta.fiftyTwoWeekLow ?? 0) as number,
      avgVolume,
      totalValue: parseFloat((price * volume).toFixed(0)),
      peRatio: parseFloat(peRatio.toFixed(2)),
      eps: parseFloat(eps.toFixed(2)),
      dividendYield: parseFloat((dividendYield * 100).toFixed(2)), // as %
      longName: (meta.longName ?? meta.shortName ?? ticker) as string,
      currency: (meta.currency ?? "USD") as string,
    };
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

function emptyQuote(ticker: string): YahooStockQuote {
  return {
    price: 0,
    change: 0,
    changePercent: 0,
    marketCap: 0,
    volume: 0,
    prevClose: 0,
    openPrice: 0,
    dayHigh: 0,
    dayLow: 0,
    weekHigh52: 0,
    weekLow52: 0,
    avgVolume: 0,
    totalValue: 0,
    peRatio: 0,
    eps: 0,
    dividendYield: 0,
    longName: ticker,
    currency: "USD",
  };
}

// ── Cached batch — ONE set of requests per 30 min across ALL visitors ─────────
const getCachedWorldStocks = unstable_cache(
  async (): Promise<WorldStock[]> => {
    const tasks = WORLD_STOCKS_CONFIG.map((s) => async () => {
      const q = (await fetchStockQuote(s.ticker)) ?? emptyQuote(s.ticker);
      return {
        ...s,
        price: q.price,
        change: q.change,
        changePercent: q.changePercent,
        marketCap: q.marketCap,
        volume: q.volume,
        positive: q.changePercent >= 0,
        prevClose: q.prevClose,
        openPrice: q.openPrice,
        dayHigh: q.dayHigh,
        dayLow: q.dayLow,
        weekHigh52: q.weekHigh52,
        weekLow52: q.weekLow52,
        avgVolume: q.avgVolume,
        totalValue: q.totalValue,
        peRatio: q.peRatio,
        eps: q.eps,
        dividendYield: q.dividendYield,
        longName: q.longName || s.nameEn,
        currency: q.currency,
      } satisfies WorldStock;
    });

    const results = await fetchWithConcurrency(tasks, 5);
    return results.sort((a, b) => b.price - a.price);
  },
  ["world-stocks"],
  { revalidate: 1800 },
);

// ── Deduplicate within same render ────────────────────────────────────────────
export const getWorldStocksData = cache(getCachedWorldStocks);

// ── Single stock by slug — reuses cached list, zero extra requests ────────────
export const getWorldStockBySlug = cache(
  async (slug: string): Promise<WorldStock | null> => {
    const stocks = await getWorldStocksData();
    return stocks.find((s) => s.slug === slug) ?? null;
  },
);

// ── Candles — cached per ticker ───────────────────────────────────────────────
export const getStockCandles = unstable_cache(
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
  ["world-stock-candles"],
  { revalidate: 300 },
);
