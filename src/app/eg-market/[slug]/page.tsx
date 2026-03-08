import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiLineChartLine,
  RiInformationLine,
  RiNewspaperLine,
  RiArrowLeftSLine,
  RiRefreshLine,
} from "react-icons/ri";
import { getEgyptianMarketData, type EGStock } from "@/lib/Data/egMarketData";
import { getIntradayCandles, type CandlePoint } from "@/lib/Data/chartData";
import { notFound } from "next/navigation";
import MarketChart from "@/components/Charts/MarketChart";

import Link from "next/link";
import {
  generateStockMetadata,
  StockParams,
} from "@/lib/MetaData/generateStockMetadata";

export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const stocks = await getEgyptianMarketData();
    return stocks.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: StockParams }) {
  return generateStockMetadata({ params });
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3">
      <span className="text-sm text-muted-foreground font-bold">{label}</span>
      <span
        className="text-sm font-black text-foreground tabular-nums"
        dir="ltr"
      >
        {value}
      </span>
    </div>
  );
}

export default async function MarketDetailPage({ params }: Props) {
  const { slug } = await params;

  let stocks: EGStock[] = [];
  try {
    stocks = await getEgyptianMarketData();
  } catch {
    notFound();
  }

  const stock = stocks.find((s) => s.slug === slug);
  if (!stock) notFound();

  // ✅ Fetch live candle data for this specific stock
  const yahooTicker = stock.yahooCode;
  const chartData: CandlePoint[] = await getIntradayCandles(
    stock.yahooCode,
    "1d",
  );
  const now = new Date().toLocaleTimeString("ar-EG");

  // Related — same sector (other stocks), top 4
  const related = stocks.filter((s) => s.slug !== slug).slice(0, 4);

  return (
    <main className="container mx-auto px-4 py-10 space-y-8" dir="rtl">
      {/* ── BREADCRUMB ── */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
        <Link href="/" className="hover:text-primary-brand transition-colors">
          الرئيسية
        </Link>
        <RiArrowLeftSLine size={14} />
        <Link
          href="/eg-market"
          className="hover:text-primary-brand transition-colors"
        >
          السوق المصري
        </Link>
        <RiArrowLeftSLine size={14} />
        <span className="text-foreground">{stock.code}</span>
      </nav>

      {/* ── HERO HEADER ── */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-brand/10 border border-primary-brand/20 rounded-2xl flex items-center justify-center text-2xl font-black text-primary-brand shrink-0">
            {stock.titleAr[0]}
          </div>
          <div className="grid">
            <h1 className="text-2xl mb-2 mt-0 md:text-3xl font-black text-foreground tracking-tight">
              {stock.titleAr}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground font-bold">
                {stock.titleEn}
              </p>
              <span
                className="text-[10px] font-black text-primary-brand bg-primary-brand/10 px-2.5 py-1 rounded-full font-mono uppercase"
                dir="ltr"
              >
                {stock.code}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                EGX
              </span>
            </div>
          </div>
        </div>

        {/* Price hero */}
        <div className="bg-muted border border-border rounded-2xl px-5 py-4 space-y-1.5 shrink-0 w-full md:w-auto">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            السعر الحالي
          </p>

          {/* Price + pill on same row */}
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <p
              className="text-2xl md:text-3xl font-black text-foreground tabular-nums"
              dir="ltr"
            >
              {stock.price.toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
              <span className="text-sm font-bold text-muted-foreground mr-1.5">
                EGP
              </span>
            </p>

            <div
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-black shrink-0 ${
                stock.positive
                  ? "bg-green-500/10 text-green-500"
                  : "bg-destructive/10 text-destructive"
              }`}
              dir="ltr"
            >
              {stock.positive ? (
                <RiArrowUpSFill size={16} />
              ) : (
                <RiArrowDownSFill size={16} />
              )}
              {stock.positive ? "+" : "-"}
              {stock.change.toFixed(2)}
              <span className="opacity-70">
                ({stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHART ── */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiLineChartLine size={16} />
          </div>
          <h2 className="text-base font-black text-foreground">أداء السهم</h2>
          <div className="flex items-center gap-1.5 mr-auto">
            <RiRefreshLine size={11} className="text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-bold">
              آخر تحديث: {now}
            </span>
          </div>
        </div>

        <MarketChart
          ticker={yahooTicker}
          isUp={stock.positive}
          initialData={chartData}
        />
      </div>

      {/* ── STATS + ABOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-black text-foreground mb-2">
            البيانات المالية
          </h2>
          <div className="divide-y divide-border">
            <StatRow
              label="السعر الحالي"
              value={`${stock.price.toLocaleString("en-US", { maximumFractionDigits: 2 })} EGP`}
            />
            <StatRow
              label="التغيير اليومي"
              value={`${stock.positive ? "+" : "-"}${stock.change.toFixed(2)} EGP`}
            />
            <StatRow
              label="نسبة التغيير"
              value={`${stock.positive ? "+" : "-"}${stock.changePercent.toFixed(2)}%`}
            />
            <StatRow label="رمز التداول" value={stock.code} />
            <StatRow label="العملة" value="جنيه مصري (EGP)" />
            {stock.volume && (
              <StatRow
                label="حجم التداول"
                value={stock.volume.toLocaleString("en-US")}
              />
            )}
          </div>
        </div>

        {/* About */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiInformationLine size={16} />
            </div>
            <h2 className="text-base font-black text-foreground">عن الشركة</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-loose">
            <span className="font-black text-foreground">{stock.titleAr}</span>{" "}
            ({stock.titleEn}) شركة مدرجة في البورصة المصرية تحت الرمز{" "}
            <span className="font-black text-primary-brand" dir="ltr">
              {stock.id}
            </span>
            . البيانات المعروضة من Yahoo Finance وتُحدَّث كل 30 دقيقة. هذه
            البيانات للأغراض الإعلامية فقط وليست نصيحة استثمارية.
          </p>
        </div>
      </div>

      {/* ── RELATED STOCKS ── */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiNewspaperLine size={16} />
          </div>
          <h2 className="text-base font-black text-foreground">أسهم أخرى</h2>
        </div>
        <div className="divide-y divide-border">
          {related.map((r) => (
            <Link
              key={r.id}
              href={`/eg-market/${r.slug}`}
              className="flex items-center justify-between p-3 rounded-2xl hover:bg-primary-brand/5 border border-transparent hover:border-primary-brand/20 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center font-black text-primary-brand text-xs shrink-0">
                  {r.titleAr[0]}
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-foreground group-hover:text-primary-brand transition-colors">
                    {r.titleAr}
                  </p>
                  <p
                    className="text-[10px] text-muted-foreground font-mono"
                    dir="ltr"
                  >
                    {r.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-black text-foreground tabular-nums"
                  dir="ltr"
                >
                  {r.price.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                    r.positive
                      ? "bg-green-500/10 text-green-500"
                      : "bg-destructive/10 text-destructive"
                  }`}
                  dir="ltr"
                >
                  {r.positive ? (
                    <RiArrowUpSFill size={10} />
                  ) : (
                    <RiArrowDownSFill size={10} />
                  )}
                  {r.changePercent.toFixed(2)}%
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Back */}
      <Link
        href="/eg-market"
        className="btn flex items-center justify-center gap-2 text-sm py-3 w-full max-w-xs mx-auto"
      >
        <RiArrowLeftSLine size={16} />
        العودة للسوق المصري
      </Link>
    </main>
  );
}
