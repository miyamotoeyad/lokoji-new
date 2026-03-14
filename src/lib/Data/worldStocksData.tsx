import { WORLD_STOCKS_CONFIG } from "../Array/WorldCompanyList";

export interface WorldStock {
  id: number;
  ticker: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  sector: string;
  exchange: string;
  // Live data — populated by fetch
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  positive: boolean;
}

// ── Fetch one quote from Yahoo Finance ───────────────────────────────────────
async function fetchStockQuote(ticker: string): Promise<{
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
} | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.chartPreviousClose ?? price;
    const change = price - prevClose;
    const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;
    const marketCap = meta.marketCap ?? 0;
    const volume = meta.regularMarketVolume ?? 0;

    return { price, change, changePercent, marketCap, volume };
  } catch {
    return null;
  }
}

export async function getWorldStocksData(): Promise<WorldStock[]> {
  const results = await Promise.all(
    WORLD_STOCKS_CONFIG.map(async (s) => {
      const q = await fetchStockQuote(s.ticker);
      return {
        ...s,
        price: q?.price ?? 0,
        change: q?.change ?? 0,
        changePercent: q?.changePercent ?? 0,
        marketCap: q?.marketCap ?? 0,
        volume: q?.volume ?? 0,
        positive: (q?.changePercent ?? 0) >= 0,
      };
    }),
  );
  return results.sort((a, b) => b.price - a.price);
}

export async function getWorldStockBySlug(
  slug: string,
): Promise<WorldStock | null> {
  const config = WORLD_STOCKS_CONFIG.find((s) => s.slug === slug);
  if (!config) return null;
  const q = await fetchStockQuote(config.ticker);
  return {
    ...config,
    price: q?.price ?? 0,
    change: q?.change ?? 0,
    changePercent: q?.changePercent ?? 0,
    marketCap: q?.marketCap ?? 0,
    volume: q?.volume ?? 0,
    positive: (q?.changePercent ?? 0) >= 0,
  };
}

// ── Fetch intraday candles ────────────────────────────────────────────────────
export async function getStockCandles(
  ticker: string,
): Promise<{ time: string; value: number }[]> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=5m&range=1d`;
    const res = await fetch(url, {
      next: { revalidate: 600 },
      headers: { "User-Agent": "Mozilla/5.0" },
    });
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
}
