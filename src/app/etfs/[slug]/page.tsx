import { notFound } from "next/navigation";
import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiFundsLine,
  RiLineChartLine,
  RiInformationLine,
  RiArrowLeftSLine,
  RiPieChartLine,
  RiStackLine,
} from "@remixicon/react";
import Link from "next/link";
import { getETFs, type ETFItem } from "@/lib/Data/etfData";
import ETFChart from "@/components/Charts/ETFChart";
import { getIntradayCandles } from "@/lib/Data/chartData";
import {
  ETFParams,
  generateETFMetadata,
} from "@/lib/MetaData/generateETFMetadata";
import { getJsonLdETFSlug } from "@/lib/Schemas/getJsonLd";

export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const etfs = await getETFs();
  return etfs.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: ETFParams }) {
  return generateETFMetadata({ params });
}

function fmt(n: number, decimals = 2) {
  return n > 0
    ? n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : "—";
}

function buildStats(item: ETFItem) {
  const c = item.currency;
  return [
    {
      group: "بيانات السعر",
      label: "سعر الافتتاح",
      value: item.prevClose > 0 ? `${fmt(item.prevClose)} ${c}` : "—",
    },
    {
      group: "بيانات السعر",
      label: "أعلى سعر اليوم",
      value: item.dayHigh > 0 ? `${fmt(item.dayHigh)} ${c}` : "—",
    },
    {
      group: "بيانات السعر",
      label: "أدنى سعر اليوم",
      value: item.dayLow > 0 ? `${fmt(item.dayLow)} ${c}` : "—",
    },
    {
      group: "بيانات السعر",
      label: "إغلاق أمس",
      value: item.prevClose > 0 ? `${fmt(item.prevClose)} ${c}` : "—",
    },
    {
      group: "التداول",
      label: "حجم التداول",
      value: item.volume > 0 ? item.volume.toLocaleString("en-US") : "—",
    },
    {
      group: "النطاق السنوي",
      label: "الأعلى 52 أسبوع",
      value: item.weekHigh52 > 0 ? `${fmt(item.weekHigh52)} ${c}` : "—",
    },
    {
      group: "النطاق السنوي",
      label: "الأدنى 52 أسبوع",
      value: item.weekLow52 > 0 ? `${fmt(item.weekLow52)} ${c}` : "—",
    },
    { group: "معلومات", label: "رمز التداول", value: item.ticker },
    { group: "معلومات", label: "السوق", value: item.market },
    ...(item.longName && item.longName !== item.titleEn
      ? [{ group: "معلومات", label: "الاسم الرسمي", value: item.longName }]
      : []),
  ];
}

export default async function ETFDetailPage({ params }: Props) {
  const { slug } = await params;

  const etfs = await getETFs();
  const item = etfs.find((e) => e.slug === slug);
  if (!item) return notFound();

  const chartData = item.yahooTicker
    ? await getIntradayCandles(item.yahooTicker, "1d")
    : [];

  const related = etfs
    .filter((e) => e.category === item.category && e.slug !== slug)
    .slice(0, 5);

  const stats = buildStats(item);
  const accentColor = item.positive ? "#22c55e" : "var(--color-destructive)";
  const jsonLd = getJsonLdETFSlug(item);

  return (
    <main className="container mx-auto px-4 py-8 md:py-10 space-y-6" dir="rtl">
      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
        <Link
          href="/etfs"
          className="hover:text-primary-brand transition-colors"
        >
          صناديق الاستثمار
        </Link>
        <RiArrowLeftSLine size={14} className="shrink-0" />
        <span className="text-foreground font-mono" dir="ltr">
          {item.ticker}
        </span>
      </div>

      {/* ── HERO ── */}
      <div className="relative bg-card border border-border rounded-3xl p-5 md:p-8 overflow-hidden">
        <div
          className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
        <div className="absolute top-4 left-4 text-border/30 pointer-events-none">
          <RiFundsLine size={100} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Identity */}
          <div className="flex gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary-brand/10 border border-primary-brand/20 flex items-center justify-center text-primary-brand shrink-0">
              <RiFundsLine size={28} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-3xl m-0 font-black text-foreground tracking-tight leading-none">
                  {item.title}
                </h1>
                <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border font-mono">
                  {item.market}
                </span>
              </div>
              <p
                className="text-xs text-muted-foreground text-right font-bold tracking-wide mt-1"
                dir="ltr"
              >
                {item.titleEn} · {item.ticker}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex lg:flex-col items-center lg:items-end flex-wrap justify-between gap-2">
            <div className="flex items-center gap-2" dir="ltr">
              <span className="text-2xl md:text-4xl font-black text-foreground tabular-nums">
                {item.point.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                <span className="text-sm text-muted-foreground font-bold mr-1">
                  {item.currency}
                </span>
              </span>
              <div
                className={`p-1 rounded-xl ${item.positive ? "bg-green-500/10" : "bg-destructive/10"}`}
              >
                {item.positive ? (
                  <RiArrowUpSFill size={24} className="text-green-500" />
                ) : (
                  <RiArrowDownSFill size={24} className="text-destructive" />
                )}
              </div>
            </div>
            <div
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-black w-fit ${
                item.positive
                  ? "bg-green-500/10 text-green-500"
                  : "bg-destructive/10 text-destructive"
              }`}
              dir="ltr"
            >
              {item.positive ? (
                <RiArrowUpSFill size={16} />
              ) : (
                <RiArrowDownSFill size={16} />
              )}
              {item.positive ? "+" : "-"}
              {(item.change ?? 0).toFixed(2)}
              <span className="opacity-60 text-xs">
                ({(item.changePercent ?? 0).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CHART ── */}
      <div className="bg-card border border-border rounded-3xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiLineChartLine size={15} />
            </div>
            <h2 className="text-sm md:text-base font-black text-foreground">
              أداء اليوم
            </h2>
          </div>
          <span
            className="text-[10px] font-black px-2.5 py-1 rounded-lg border"
            style={{
              color: accentColor,
              borderColor: `${accentColor}30`,
              backgroundColor: `${accentColor}10`,
            }}
          >
            {chartData.length > 0 ? "بيانات مباشرة" : "السوق مغلق"}
          </span>
        </div>
        <div className="h-48 sm:h-56 md:h-72 w-full">
          <ETFChart item={item} initialData={chartData} />
        </div>
      </div>

      {/* ── STATS + SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-5 md:p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiPieChartLine size={15} />
            </div>
            <h2 className="text-sm md:text-base font-black text-foreground">
              بيانات الصندوق
            </h2>
          </div>

          {["بيانات السعر", "التداول", "النطاق السنوي", "معلومات"].map(
            (group) => {
              const groupStats = stats.filter((s) => s.group === group);
              if (groupStats.length === 0) return null;
              return (
                <div key={group} className="mb-5 last:mb-0">
                  <p className="text-[10px] font-black text-primary-brand uppercase tracking-widest mb-2 border-b border-border pb-1">
                    {group}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {groupStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-muted/50 border border-border rounded-2xl p-3 space-y-1 hover:border-primary-brand/30 transition-colors group"
                      >
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wide">
                          <RiStackLine size={10} />
                          {stat.label}
                        </span>
                        <span
                          className="text-xs md:text-sm font-black text-foreground tabular-nums group-hover:text-primary-brand transition-colors block break-all"
                          dir="ltr"
                        >
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            },
          )}

          {/* ── 52-week range bar ── */}
          {item.weekHigh52 > 0 &&
            item.weekLow52 > 0 &&
            item.weekHigh52 !== item.weekLow52 && (
              <div className="mt-4 bg-muted/50 border border-border rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  <span>نطاق 52 أسبوع</span>
                  <span dir="ltr">
                    {fmt(item.weekLow52)} — {fmt(item.weekHigh52)}{" "}
                    {item.currency}
                  </span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-primary-brand/30 rounded-full"
                    style={{
                      width: `${Math.min(Math.max(((item.point - item.weekLow52) / (item.weekHigh52 - item.weekLow52)) * 100, 0), 100)}%`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary-brand border-2 border-card shadow"
                    style={{
                      left: `calc(${Math.min(Math.max(((item.point - item.weekLow52) / (item.weekHigh52 - item.weekLow52)) * 100, 0), 100)}% - 6px)`,
                    }}
                  />
                </div>
                <div
                  className="flex justify-between text-[10px] text-muted-foreground font-bold"
                  dir="ltr"
                >
                  <span>
                    أدنى {fmt(item.weekLow52)} {item.currency}
                  </span>
                  <span className="text-primary-brand font-black">
                    {fmt(item.point)} {item.currency}
                  </span>
                  <span>
                    أعلى {fmt(item.weekHigh52)} {item.currency}
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* About */}
          <div className="bg-card border border-border rounded-3xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiInformationLine size={15} />
              </div>
              <h2 className="text-sm font-black text-foreground">
                نبذة عن الصندوق
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-black text-foreground">{item.titleEn}</span>{" "}
              صندوق مؤشر متداول يتتبع أداء{" "}
              <span className="font-bold text-foreground">{item.title}</span>.
              يتداول تحت الرمز{" "}
              <span className="font-black text-primary-brand" dir="ltr">
                {item.ticker}
              </span>{" "}
              على منصة{" "}
              <span className="font-bold text-foreground">{item.market}</span>.
              البيانات للأغراض الإعلامية فقط وليست نصيحة استثمارية.
            </p>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="bg-card border border-border rounded-3xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
                  <RiFundsLine size={15} />
                </div>
                <h2 className="text-sm font-black text-foreground">
                  صناديق مشابهة
                </h2>
              </div>
              <div className="space-y-1">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/etfs/${r.slug}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-primary-brand/5 border border-transparent hover:border-primary-brand/20 transition-all group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-foreground group-hover:text-primary-brand transition-colors truncate">
                        {r.title}
                      </p>
                      <p
                        className="text-[10px] text-muted-foreground font-mono"
                        dir="ltr"
                      >
                        {r.ticker}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className="text-xs font-black text-foreground tabular-nums"
                        dir="ltr"
                      >
                        {r.point.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                        <span className="text-[10px] text-muted-foreground font-bold ml-0.5">
                          {r.currency}
                        </span>
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
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
          )}

          {/* Back */}
          <Link
            href="/etfs"
            className="btn flex items-center justify-center gap-2 text-sm py-2.5 w-full"
          >
            <RiArrowLeftSLine size={16} />
            العودة لصناديق الاستثمار
          </Link>
        </div>
      </div>

      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        id="etf-detail-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
