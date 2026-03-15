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
  prevClose: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  volume: number;
  longName: string;
}

interface YahooQuote {
  price: number;
  change: number;
  changePercent: number;
  prevClose: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  volume: number;
  longName: string;
}

async function fetchYahooQuote(ticker: string): Promise<YahooQuote | null> {
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
    const prevClose = (meta.chartPreviousClose ??
      meta.previousClose ??
      meta.regularMarketPreviousClose ??
      price) as number;

    if (price === 0) return null;

    const change = parseFloat((price - prevClose).toFixed(2));
    const changePercent =
      prevClose !== 0 ? parseFloat(((change / prevClose) * 100).toFixed(2)) : 0;

    return {
      price,
      change,
      changePercent,
      prevClose,
      dayHigh: (meta.regularMarketDayHigh ?? 0) as number,
      dayLow: (meta.regularMarketDayLow ?? 0) as number,
      weekHigh52: (meta.fiftyTwoWeekHigh ?? 0) as number,
      weekLow52: (meta.fiftyTwoWeekLow ?? 0) as number,
      volume: (meta.regularMarketVolume ?? 0) as number,
      longName: (meta.longName ?? meta.shortName ?? ticker) as string,
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

// ── Fallback now fully typed as YahooQuote ────────────────────────────────────
const FALLBACK: Record<string, YahooQuote> = {
  // ── Egypt ──────────────────────────────────────────────────────────────────
  "^CASE30": {
    price: 45926,
    change: -1268.5,
    changePercent: -2.69,
    prevClose: 47195,
    dayHigh: 46958,
    dayLow: 45903,
    weekHigh52: 46958,
    weekLow52: 28000,
    volume: 371872000,
    longName: "EGX 30 Price Return Index",
  },
  "^EGX70EWI": {
    price: 12788,
    change: 78,
    changePercent: 0.61,
    prevClose: 12710,
    dayHigh: 12820,
    dayLow: 12700,
    weekHigh52: 13200,
    weekLow52: 9800,
    volume: 0,
    longName: "EGX 70 Equal Weight Index",
  },
  "^EGX100EWI": {
    price: 17689,
    change: 128,
    changePercent: 0.73,
    prevClose: 17561,
    dayHigh: 17750,
    dayLow: 17550,
    weekHigh52: 18100,
    weekLow52: 13000,
    volume: 0,
    longName: "EGX 100 Equal Weight Index",
  },
  EGPT: {
    price: 22.4,
    change: 0.31,
    changePercent: 1.4,
    prevClose: 22.09,
    dayHigh: 22.6,
    dayLow: 22.1,
    weekHigh52: 24.5,
    weekLow52: 16.2,
    volume: 85000,
    longName: "VanEck Egypt Index ETF",
  },
  "FMEY.EX": {
    price: 820.0,
    change: 14.69,
    changePercent: 1.82,
    prevClose: 805.3,
    dayHigh: 825.0,
    dayLow: 805.0,
    weekHigh52: 860.0,
    weekLow52: 620.0,
    volume: 12000,
    longName: "Franklin MSCI Egypt ETF",
  },
  // ── US ─────────────────────────────────────────────────────────────────────
  SPY: {
    price: 524.3,
    change: 3.1,
    changePercent: 0.59,
    prevClose: 521.2,
    dayHigh: 526.1,
    dayLow: 520.8,
    weekHigh52: 613.2,
    weekLow52: 480.1,
    volume: 52000000,
    longName: "SPDR S&P 500 ETF Trust",
  },
  QQQ: {
    price: 445.2,
    change: 4.5,
    changePercent: 1.02,
    prevClose: 440.7,
    dayHigh: 447.3,
    dayLow: 439.8,
    weekHigh52: 540.8,
    weekLow52: 396.2,
    volume: 38000000,
    longName: "Invesco QQQ Trust",
  },
  VTI: {
    price: 240.1,
    change: 1.8,
    changePercent: 0.75,
    prevClose: 238.3,
    dayHigh: 241.2,
    dayLow: 238.0,
    weekHigh52: 294.6,
    weekLow52: 218.3,
    volume: 4200000,
    longName: "Vanguard Total Stock Market",
  },
  IWM: {
    price: 205.4,
    change: -1.2,
    changePercent: -0.58,
    prevClose: 206.6,
    dayHigh: 207.1,
    dayLow: 204.8,
    weekHigh52: 244.9,
    weekLow52: 185.4,
    volume: 18000000,
    longName: "iShares Russell 2000 ETF",
  },
  VEA: {
    price: 49.3,
    change: 0.4,
    changePercent: 0.82,
    prevClose: 48.9,
    dayHigh: 49.6,
    dayLow: 48.8,
    weekHigh52: 54.2,
    weekLow52: 43.1,
    volume: 8500000,
    longName: "Vanguard FTSE Developed Mkts",
  },
  VWO: {
    price: 43.5,
    change: -0.3,
    changePercent: -0.68,
    prevClose: 43.8,
    dayHigh: 43.9,
    dayLow: 43.3,
    weekHigh52: 47.2,
    weekLow52: 38.6,
    volume: 7200000,
    longName: "Vanguard FTSE Emerging Mkts",
  },
  EEM: {
    price: 41.8,
    change: -0.2,
    changePercent: -0.47,
    prevClose: 42.0,
    dayHigh: 42.1,
    dayLow: 41.6,
    weekHigh52: 45.8,
    weekLow52: 37.2,
    volume: 32000000,
    longName: "iShares MSCI Emerging Markets",
  },
  ACWI: {
    price: 108.9,
    change: 0.9,
    changePercent: 0.83,
    prevClose: 108.0,
    dayHigh: 109.4,
    dayLow: 107.8,
    weekHigh52: 123.5,
    weekLow52: 97.6,
    volume: 3100000,
    longName: "iShares MSCI ACWI ETF",
  },
  // ── Sector ─────────────────────────────────────────────────────────────────
  XLK: {
    price: 214.5,
    change: 2.1,
    changePercent: 0.99,
    prevClose: 212.4,
    dayHigh: 215.8,
    dayLow: 212.1,
    weekHigh52: 255.0,
    weekLow52: 185.2,
    volume: 6800000,
    longName: "Technology Select Sector SPDR",
  },
  XLF: {
    price: 43.2,
    change: 0.35,
    changePercent: 0.82,
    prevClose: 42.85,
    dayHigh: 43.5,
    dayLow: 42.8,
    weekHigh52: 51.2,
    weekLow52: 38.4,
    volume: 28000000,
    longName: "Financial Select Sector SPDR",
  },
  XLE: {
    price: 89.1,
    change: -0.6,
    changePercent: -0.67,
    prevClose: 89.7,
    dayHigh: 89.9,
    dayLow: 88.8,
    weekHigh52: 99.8,
    weekLow52: 78.3,
    volume: 9400000,
    longName: "Energy Select Sector SPDR",
  },
  XLV: {
    price: 142.3,
    change: 0.8,
    changePercent: 0.56,
    prevClose: 141.5,
    dayHigh: 142.9,
    dayLow: 141.2,
    weekHigh52: 162.4,
    weekLow52: 128.6,
    volume: 5200000,
    longName: "Health Care Select Sector SPDR",
  },
  XLI: {
    price: 118.4,
    change: 0.5,
    changePercent: 0.42,
    prevClose: 117.9,
    dayHigh: 118.8,
    dayLow: 117.6,
    weekHigh52: 140.2,
    weekLow52: 106.3,
    volume: 4800000,
    longName: "Industrial Select Sector SPDR",
  },
  ARKK: {
    price: 46.7,
    change: 1.2,
    changePercent: 2.64,
    prevClose: 45.5,
    dayHigh: 47.1,
    dayLow: 45.3,
    weekHigh52: 62.8,
    weekLow52: 35.4,
    volume: 9600000,
    longName: "ARK Innovation ETF",
  },
  // ── Commodities ────────────────────────────────────────────────────────────
  GLD: {
    price: 213.4,
    change: 1.5,
    changePercent: 0.71,
    prevClose: 211.9,
    dayHigh: 214.2,
    dayLow: 211.5,
    weekHigh52: 259.8,
    weekLow52: 178.4,
    volume: 7800000,
    longName: "SPDR Gold Shares",
  },
  SLV: {
    price: 24.8,
    change: 0.3,
    changePercent: 1.22,
    prevClose: 24.5,
    dayHigh: 25.0,
    dayLow: 24.4,
    weekHigh52: 30.2,
    weekLow52: 19.8,
    volume: 14000000,
    longName: "iShares Silver Trust",
  },
  USO: {
    price: 73.2,
    change: -0.9,
    changePercent: -1.22,
    prevClose: 74.1,
    dayHigh: 74.3,
    dayLow: 72.9,
    weekHigh52: 88.4,
    weekLow52: 60.2,
    volume: 3200000,
    longName: "United States Oil Fund",
  },
  DJP: {
    price: 26.1,
    change: -0.1,
    changePercent: -0.38,
    prevClose: 26.2,
    dayHigh: 26.3,
    dayLow: 25.9,
    weekHigh52: 29.8,
    weekLow52: 22.4,
    volume: 180000,
    longName: "iPath Bloomberg Commodity",
  },
  // ── Bonds ──────────────────────────────────────────────────────────────────
  TLT: {
    price: 90.3,
    change: -0.4,
    changePercent: -0.44,
    prevClose: 90.7,
    dayHigh: 90.9,
    dayLow: 90.0,
    weekHigh52: 102.4,
    weekLow52: 82.6,
    volume: 18000000,
    longName: "iShares 20+ Year Treasury Bond",
  },
  BND: {
    price: 72.8,
    change: -0.1,
    changePercent: -0.14,
    prevClose: 72.9,
    dayHigh: 73.0,
    dayLow: 72.7,
    weekHigh52: 77.8,
    weekLow52: 69.4,
    volume: 4200000,
    longName: "Vanguard Total Bond Market",
  },
  EMB: {
    price: 88.5,
    change: 0.2,
    changePercent: 0.23,
    prevClose: 88.3,
    dayHigh: 88.8,
    dayLow: 88.2,
    weekHigh52: 96.2,
    weekLow52: 82.4,
    volume: 2800000,
    longName: "iShares JP Morgan USD EM Bond",
  },
  // ── Arab ───────────────────────────────────────────────────────────────────
  KSA: {
    price: 42.1,
    change: 0.5,
    changePercent: 1.2,
    prevClose: 41.6,
    dayHigh: 42.4,
    dayLow: 41.5,
    weekHigh52: 48.2,
    weekLow52: 36.8,
    volume: 620000,
    longName: "iShares MSCI Saudi Arabia",
  },
  UAE: {
    price: 16.8,
    change: 0.1,
    changePercent: 0.6,
    prevClose: 16.7,
    dayHigh: 16.9,
    dayLow: 16.7,
    weekHigh52: 18.4,
    weekLow52: 14.2,
    volume: 42000,
    longName: "iShares MSCI UAE ETF",
  },
  QAT: {
    price: 15.4,
    change: -0.08,
    changePercent: -0.52,
    prevClose: 15.48,
    dayHigh: 15.5,
    dayLow: 15.3,
    weekHigh52: 17.2,
    weekLow52: 13.6,
    volume: 38000,
    longName: "iShares MSCI Qatar ETF",
  },
  GULF: {
    price: 18.2,
    change: 0.12,
    changePercent: 0.66,
    prevClose: 18.08,
    dayHigh: 18.3,
    dayLow: 18.0,
    weekHigh52: 20.4,
    weekLow52: 15.8,
    volume: 95000,
    longName: "WisdomTree Middle East Dividend",
  },
  MES: {
    price: 37.6,
    change: 0.3,
    changePercent: 0.8,
    prevClose: 37.3,
    dayHigh: 37.8,
    dayLow: 37.2,
    weekHigh52: 42.1,
    weekLow52: 32.4,
    volume: 210000,
    longName: "iShares MSCI Arabian ETF",
  },
};

// ── Cached batch fetch ────────────────────────────────────────────────────────
const getCachedETFs = unstable_cache(
  async (): Promise<ETFItem[]> => {
    const tasks = ETF_LIST.map((etf) => async () => {
      const live = etf.yahooTicker
        ? await fetchYahooQuote(etf.yahooTicker)
        : null;

      const raw: YahooQuote = live ??
        FALLBACK[etf.ticker] ?? {
          price: 0,
          change: 0,
          changePercent: 0,
          prevClose: 0,
          dayHigh: 0,
          dayLow: 0,
          weekHigh52: 0,
          weekLow52: 0,
          volume: 0,
          longName: etf.titleEn,
        };

      return {
        id: etf.id,
        title: etf.titleAr,
        titleEn: etf.titleEn,
        ticker: etf.ticker,
        yahooTicker: etf.yahooTicker,
        point: raw.price ?? 0,
        change: Math.abs(raw.change ?? 0),
        changePercent: Math.abs(raw.changePercent ?? 0),
        positive: (raw.changePercent ?? 0) >= 0,
        slug: etf.slug,
        currency: etf.currency,
        market: etf.market,
        category: etf.category,
        prevClose: raw.prevClose ?? 0,
        dayHigh: raw.dayHigh ?? 0,
        dayLow: raw.dayLow ?? 0,
        weekHigh52: raw.weekHigh52 ?? 0,
        weekLow52: raw.weekLow52 ?? 0,
        volume: raw.volume ?? 0,
        longName: raw.longName || etf.titleEn,
      } satisfies ETFItem;
    });

    const results = await fetchWithConcurrency(tasks, 5);
    return results.sort((a, b) => b.point - a.point);
  },
  ["etfs"],
  { revalidate: 1800 },
);

export const getETFs = cache(getCachedETFs);

export function filterByCategory(
  etfs: ETFItem[],
  category: ETFItem["category"],
): ETFItem[] {
  return etfs.filter((e) => e.category === category);
}
