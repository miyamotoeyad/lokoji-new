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

async function fetchYahooQuote(
  ticker: string,
): Promise<{ price: number; change: number; changePercent: number } | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`,
      {
        next: { revalidate: 1800 },
        headers: { "User-Agent": "Mozilla/5.0" },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.previousClose ?? meta.chartPreviousClose ?? price;
    const change = parseFloat((price - prevClose).toFixed(2));
    const changePercent = parseFloat(((change / prevClose) * 100).toFixed(2));

    return { price, change, changePercent };
  } catch {
    return null;
  }
}



const FALLBACK: Record<
  string,
  { price: number; change: number; changePercent: number }
> = {
  // Egypt
  "^CASE30": { price: 28450.5, change: 310.2, changePercent: 1.1 },
  "^EGX70": { price: 6650.15, change: -45.3, changePercent: -0.68 },
  "^EGX100": { price: 9120.8, change: 88.6, changePercent: 0.98 },
  EGPT: { price: 22.4, change: 0.31, changePercent: 1.4 },
  "FMEY.EX": { price: 820.0, change: 14.69, changePercent: 1.82 },
  // Global
  SPY: { price: 524.3, change: 3.1, changePercent: 0.59 },
  QQQ: { price: 445.2, change: 4.5, changePercent: 1.02 },
  VTI: { price: 240.1, change: 1.8, changePercent: 0.75 },
  IWM: { price: 205.4, change: -1.2, changePercent: -0.58 },
  VEA: { price: 49.3, change: 0.4, changePercent: 0.82 },
  VWO: { price: 43.5, change: -0.3, changePercent: -0.68 },
  EEM: { price: 41.8, change: -0.2, changePercent: -0.47 },
  ACWI: { price: 108.9, change: 0.9, changePercent: 0.83 },
  // Sector
  XLK: { price: 214.5, change: 2.1, changePercent: 0.99 },
  XLF: { price: 43.2, change: 0.35, changePercent: 0.82 },
  XLE: { price: 89.1, change: -0.6, changePercent: -0.67 },
  XLV: { price: 142.3, change: 0.8, changePercent: 0.56 },
  XLI: { price: 118.4, change: 0.5, changePercent: 0.42 },
  ARKK: { price: 46.7, change: 1.2, changePercent: 2.64 },
  // Commodities
  GLD: { price: 213.4, change: 1.5, changePercent: 0.71 },
  SLV: { price: 24.8, change: 0.3, changePercent: 1.22 },
  USO: { price: 73.2, change: -0.9, changePercent: -1.22 },
  DJP: { price: 26.1, change: -0.1, changePercent: -0.38 },
  // Bonds
  TLT: { price: 90.3, change: -0.4, changePercent: -0.44 },
  BND: { price: 72.8, change: -0.1, changePercent: -0.14 },
  EMB: { price: 88.5, change: 0.2, changePercent: 0.23 },
  // Arab
  KSA: { price: 42.1, change: 0.5, changePercent: 1.2 },
  UAE: { price: 16.8, change: 0.1, changePercent: 0.6 },
  QAT: { price: 15.4, change: -0.08, changePercent: -0.52 },
  GULF: { price: 18.2, change: 0.12, changePercent: 0.66 },
  MES: { price: 37.6, change: 0.3, changePercent: 0.8 },
};

export async function getETFs(): Promise<ETFItem[]> {
  const results = await Promise.all(
    ETF_LIST.map(async (etf) => {
      const live = await fetchYahooQuote(etf.yahooTicker);
      const data = live ?? FALLBACK[etf.ticker];
      const positive = data.changePercent >= 0;

      return {
        id: etf.id,
        title: etf.titleAr,
        titleEn: etf.titleEn,
        ticker: etf.ticker, // ✅ display ticker e.g. "^CASE30"
        yahooTicker: etf.yahooTicker, // ✅ used for API calls
        point: data.price,
        change: Math.abs(data.change),
        changePercent: Math.abs(data.changePercent),
        positive,
        slug: etf.slug,
        currency: etf.currency,
        market: etf.market,
        category: etf.category,
      } satisfies ETFItem;
    }),
  );
  return results;
}

// ── Helpers for filtering by category ───────────────────────────────────────
export function filterByCategory(
  etfs: ETFItem[],
  category: ETFItem["category"],
): ETFItem[] {
  return etfs.filter((e) => e.category === category);
}
