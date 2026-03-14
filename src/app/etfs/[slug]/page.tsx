import { notFound } from "next/navigation";
import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiFundsLine,
  RiBarChartLine,
  RiInformationLine,
  RiRefreshLine,
  RiArrowLeftSLine,
} from "@remixicon/react";
import Link from "next/link";
import { getETFs } from "@/lib/Data/etfData";
import ETFChart from "@/components/Charts/ETFChart";
import { getIntradayCandles } from "@/lib/Data/chartData";
import {
  ETFParams,
  generateETFMetadata,
} from "@/lib/MetaData/generateETFMetadata";
import { getJsonLdETFSlug } from "@/lib/Schemas/getJsonLd";

export const dynamicParams = true;
// ← no revalidate — unstable_cache handles it

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const etfs = await getETFs();
  return etfs.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: ETFParams }) {
  return generateETFMetadata({ params });
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-1">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
      <p
        className="text-base font-black text-foreground tabular-nums"
        dir="ltr"
      >
        {value}
      </p>
    </div>
  );
}

export default async function ETFDetailPage({ params }: Props) {
  const { slug } = await params;

  // ── Single fetch — React.cache deduplicates if called elsewhere ──────────
  const [etfs] = await Promise.all([getETFs()]);

  const item = etfs.find((e) => e.slug === slug);
  if (!item) return notFound();

  // ── Candle fetch only after we know item exists ───────────────────────────
  const chartData = item.yahooTicker
    ? await getIntradayCandles(item.yahooTicker, "1d")
    : [];

  const now = new Date().toLocaleTimeString("ar-EG");
  const related = etfs
    .filter((e) => e.category === item.category && e.slug !== slug)
    .slice(0, 4);

  const jsonLd = getJsonLdETFSlug(item);

  return (
    <>
      <main className="container mx-auto px-4 py-10 space-y-10" dir="rtl">
        {/* ── BREADCRUMB ── */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
          <Link href="/" className="hover:text-primary-brand transition-colors">
            الرئيسية
          </Link>
          <RiArrowLeftSLine size={14} />
          <Link
            href="/etfs"
            className="hover:text-primary-brand transition-colors"
          >
            صناديق الاستثمار
          </Link>
          <RiArrowLeftSLine size={14} />
          <span className="text-foreground">{item.title}</span>
        </nav>

        {/* ── HEADER ── */}
        <div className="pb-8 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
              <RiFundsLine size={28} />
            </div>
            <div className="text-right">
              <h1 className="text-3xl md:text-4xl mt-0 font-black text-foreground tracking-tight mb-1">
                {item.title}
              </h1>
              <p className="text-sm text-muted-foreground font-bold" dir="ltr">
                {item.titleEn} · {item.ticker}
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl px-5 py-4 shrink-0 space-y-1.5 h-fit w-full md:w-auto">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              السعر الحالي
            </p>
            <div className="flex justify-between items-center gap-3 flex-wrap">
              <p
                className="text-2xl md:text-3xl font-black text-foreground tabular-nums"
                dir="ltr"
              >
                {item.point.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
                <span className="text-sm text-muted-foreground font-bold mr-1.5">
                  {item.currency}
                </span>
              </p>
              <div
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-black shrink-0 ${
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
                {item.change.toFixed(2)}
                <span className="opacity-70">
                  ({item.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CHART ── */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiBarChartLine size={16} />
            </div>
            <h2 className="text-base font-black text-foreground">
              الأداء خلال اليوم
            </h2>
            <div className="flex items-center gap-1.5 mr-auto">
              <RiRefreshLine size={11} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-bold">
                آخر تحديث: {now}
              </span>
            </div>
          </div>
          <ETFChart item={item} initialData={chartData} />
        </div>

        {/* ── STATS GRID ── */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
            <h2 className="text-xl font-black text-foreground">
              أرقام الصندوق
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="السعر الحالي"
              value={`${item.point.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${item.currency}`}
            />
            <StatCard
              label="التغيير اليومي"
              value={`${item.positive ? "+" : "-"}${item.change.toFixed(2)}`}
            />
            <StatCard
              label="نسبة التغيير"
              value={`${item.positive ? "+" : "-"}${item.changePercent.toFixed(2)}%`}
            />
            <StatCard label="رمز التداول" value={item.ticker} />
          </div>
        </section>

        {/* ── ABOUT + RELATED ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiInformationLine size={16} />
              </div>
              <h2 className="text-base font-black text-foreground">
                نبذة عن الصندوق
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-loose">
              {item.titleEn} هو صندوق مؤشر متداول يتتبع أداء{" "}
              <span className="font-bold text-foreground">{item.title}</span>.
              يتداول تحت الرمز{" "}
              <span className="font-black text-primary-brand" dir="ltr">
                {item.ticker}
              </span>{" "}
              على منصة{" "}
              <span className="font-bold text-foreground">{item.market}</span>.
              البيانات المعروضة للأغراض الإعلامية فقط وليست نصيحة استثمارية.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
                <RiFundsLine size={16} />
              </div>
              <h2 className="text-base font-black text-foreground">
                صناديق مشابهة
              </h2>
            </div>

            {related.length > 0 ? (
              <div className="space-y-2">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/etfs/${r.slug}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-primary-brand/5 border border-transparent hover:border-primary-brand/20 transition-all duration-200 group"
                  >
                    <div className="text-right min-w-0 flex-1">
                      <p className="text-sm font-black text-foreground group-hover:text-primary-brand transition-colors truncate">
                        {r.title}
                      </p>
                      <p
                        className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5"
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
                        <span className="text-[10px] text-muted-foreground font-bold mr-1">
                          {r.currency}
                        </span>
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-0.5 ${
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
            ) : (
              <p className="text-sm text-muted-foreground font-medium text-center py-4">
                لا توجد صناديق مشابهة.
              </p>
            )}
          </div>
        </div>
      </main>
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        id="etf-detail-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
