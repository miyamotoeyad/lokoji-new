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
  sector: string;
  changePercent: number;
  positive: boolean;
  currency: string;
  volume: number;
  prevClose: number;
  openPrice: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  avgVolume: number;
  totalValue: number;
}

interface QuoteData {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  prevClose: number;
  openPrice: number;
  dayHigh: number;
  dayLow: number;
  weekHigh52: number;
  weekLow52: number;
  avgVolume: number;
  totalValue: number;
}

async function fetchQuote(yahooCode: string): Promise<QuoteData | null> {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Origin: "https://finance.yahoo.com",
    Referer: "https://finance.yahoo.com/",
  };

  try {
    const [chartRes, summaryRes] = await Promise.all([
      fetch(
        `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooCode)}?interval=1d&range=1d`,
        { headers }, // ← use query2 as fallback
      ),
      fetch(
        `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(yahooCode)}?modules=summaryDetail`,
        { headers },
      ),
    ]);

    // ← Try query1 if query2 fails
    const finalChartRes = chartRes.ok
      ? chartRes
      : await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooCode)}?interval=1d&range=1d`,
          { headers },
        );

    if (!finalChartRes.ok) return null;

    const json = await finalChartRes.json();
    const result = json?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta) return null;

    const price = (meta.regularMarketPrice ?? 0) as number;
    if (price === 0) return null;

    const prevClose = (meta.chartPreviousClose ??
      meta.previousClose ??
      meta.regularMarketPreviousClose ??
      price) as number;

    const change = parseFloat((price - prevClose).toFixed(2));
    const changePct =
      prevClose !== 0 ? parseFloat(((change / prevClose) * 100).toFixed(2)) : 0;
    const volume = (meta.regularMarketVolume ?? 0) as number;

    const opens: number[] = result?.indicators?.quote?.[0]?.open ?? [];
    const highs: number[] = result?.indicators?.quote?.[0]?.high ?? [];
    const lows: number[] = result?.indicators?.quote?.[0]?.low ?? [];

    const openPrice =
      opens.find((v) => v != null && v > 0) ??
      ((meta.regularMarketOpen ?? 0) as number);
    const dayHigh = Math.max(
      ...highs.filter((v) => v != null && v > 0),
      meta.regularMarketDayHigh ?? 0,
    );
    const filteredLows = lows.filter((v) => v != null && v > 0);
    const dayLow =
      filteredLows.length > 0
        ? Math.min(...filteredLows)
        : ((meta.regularMarketDayLow ?? 0) as number);

    let avgVolume = 0;
    if (summaryRes.ok) {
      try {
        const summaryJson = await summaryRes.json();
        const sd = summaryJson?.quoteSummary?.result?.[0]?.summaryDetail;
        avgVolume = (sd?.averageVolume?.raw ??
          sd?.averageVolume10days?.raw ??
          0) as number;
      } catch {
        /* ignore summary errors */
      }
    }

    return {
      price,
      change,
      changePercent: changePct,
      volume,
      prevClose,
      openPrice: parseFloat((openPrice as number).toFixed(2)),
      dayHigh:
        dayHigh > 0
          ? parseFloat(dayHigh.toFixed(2))
          : ((meta.regularMarketDayHigh ?? 0) as number),
      dayLow:
        dayLow > 0
          ? parseFloat(dayLow.toFixed(2))
          : ((meta.regularMarketDayLow ?? 0) as number),
      weekHigh52: (meta.fiftyTwoWeekHigh ?? 0) as number,
      weekLow52: (meta.fiftyTwoWeekLow ?? 0) as number,
      avgVolume,
      totalValue: parseFloat((price * volume).toFixed(0)),
    };
  } catch {
    return null;
  }
}

function emptyQuote(): QuoteData {
  return {
    price: 0,
    change: 0,
    changePercent: 0,
    volume: 0,
    prevClose: 0,
    openPrice: 0,
    dayHigh: 0,
    dayLow: 0,
    weekHigh52: 0,
    weekLow52: 0,
    avgVolume: 0,
    totalValue: 0,
  };
}

// Replace fetchWithConcurrency call in fetchAllQuotes:
async function fetchAllQuotes(): Promise<Record<string, QuoteData>> {
  const map: Record<string, QuoteData> = {};

  // Process in batches of 3 with 500ms between batches
  for (let i = 0; i < EGX_STOCKS.length; i += 3) {
    const batch = EGX_STOCKS.slice(i, i + 3);
    const results = await Promise.all(
      batch.map((stock) =>
        fetchQuote(stock.yahooCode).then((data) => ({
          symbol: stock.yahooCode,
          data,
        })),
      ),
    );
    for (const result of results) {
      if (result.data) map[result.symbol] = result.data;
    }
    // Small delay between batches to avoid rate limiting
    if (i + 3 < EGX_STOCKS.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return map;
}

const getCachedQuotes = unstable_cache(fetchAllQuotes, ["egx-quotes-v2"], {
  revalidate: 1800,
});

export const getEgyptianMarketData = cache(async (): Promise<EGStock[]> => {
  const quotes = await getCachedQuotes();

  const results: EGStock[] = EGX_STOCKS.map((stock) => {
    const q = quotes[stock.yahooCode] ?? emptyQuote();
    return {
      id: stock.yahooCode,
      code: stock.code,
      yahooCode: stock.yahooCode,
      titleAr: stock.titleAr,
      titleEn: stock.titleEn,
      slug: stock.code.toLowerCase(),
      price: q.price,
      change: Math.abs(q.change),
      sector: stock.sector ?? "عام",
      changePercent: Math.abs(q.changePercent),
      positive: q.changePercent >= 0,
      currency: "EGP",
      volume: q.volume,
      prevClose: q.prevClose,
      openPrice: q.openPrice,
      dayHigh: q.dayHigh,
      dayLow: q.dayLow,
      weekHigh52: q.weekHigh52,
      weekLow52: q.weekLow52,
      avgVolume: q.avgVolume,
      totalValue: q.totalValue,
    };
  });

  return results.sort((a, b) => b.price - a.price);
});
