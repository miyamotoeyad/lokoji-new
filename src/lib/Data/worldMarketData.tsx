import { WORLD_INDICES } from "../Array/worldMarketList";

export interface WorldMarketItem {
  region: string;
  id: number;
  title: string;
  titleEn: string;
  ticker: string; // Yahoo Finance ticker
  slug: string;
  price: number;
  change: number;
  changePercent: number;
  positive: boolean;
}

async function fetchYahooQuote(ticker: string): Promise<{
  price: number;
  change: number;
  changePercent: number;
} | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      next: { revalidate: 300 }, // ✅ cache 5 minutes
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return null;

    const json = await res.json();
    const meta = json?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - prevClose;
    const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

    return { price, change, changePercent };
  } catch {
    return null;
  }
}

export async function getWorldMarketData(): Promise<WorldMarketItem[]> {
  const results = await Promise.all(
    WORLD_INDICES.map(async (index) => {
      const quote = await fetchYahooQuote(index.ticker);
      return {
        ...index,
        price: quote?.price ?? 0,
        change: quote?.change ?? 0,
        changePercent: quote?.changePercent ?? 0,
        positive: (quote?.changePercent ?? 0) >= 0,
      };
    }),
  );
  return results.sort((a, b) => b.price - a.price);
}
