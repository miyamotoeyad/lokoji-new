import { NextRequest, NextResponse } from "next/server";
import { getIntradayCandles, type ChartRange } from "@/lib/Data/chartData";

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker") ?? "";
  const range  = (req.nextUrl.searchParams.get("range") ?? "1d") as ChartRange;

  const data = await getIntradayCandles(ticker, range);
  return NextResponse.json({ data }, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}