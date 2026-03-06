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

const FALLBACK: Record<string, { price: number; change: number; changePercent: number; volume: number }> = {};

async function fetchYahooQuote(yahooCode: string) {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooCode)}?interval=1d&range=1d`,
      {
        next: { revalidate: 1800 },
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
    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.previousClose ?? meta.chartPreviousClose ?? price;
    const change = parseFloat((price - prevClose).toFixed(2));
    const changePercent = parseFloat(((change / prevClose) * 100).toFixed(2));
    const volume = meta.regularMarketVolume ?? 0;
    return { price, change, changePercent, volume };
  } catch {
    return null;
  }
}

export async function getEgyptianMarketData(): Promise<EGStock[]> {
  const results = await Promise.all(
    EGX_STOCKS.map(async (stock) => {
      const live = await fetchYahooQuote(stock.yahooCode); // ✅ use yahooCode
      const data = live ??
        FALLBACK[stock.code] ?? {
          price: 0,
          change: 0,
          changePercent: 0,
          volume: 0,
        };
      const positive = data.changePercent >= 0;

      return {
        id: stock.yahooCode,
        code: stock.code,
        yahooCode: stock.yahooCode, // ✅ pass through
        titleAr: stock.titleAr,
        titleEn: stock.titleEn,
        slug: stock.code.toLowerCase(),
        price: data.price,
        change: Math.abs(data.change),
        changePercent: Math.abs(data.changePercent),
        positive,
        currency: "EGP",
        volume: data.volume,
      } satisfies EGStock;
    }),
  );
  return results.sort((a, b) => b.changePercent - a.changePercent);
}
