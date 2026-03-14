import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiLineChartLine,
  RiStackLine,
  RiInformationLine,
  RiPieChartLine,
  RiArrowLeftSLine,
  RiBitCoinLine,
} from "@remixicon/react";
import CryptoChart from "@/components/Charts/CryptoChart";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCryptoData } from "@/lib/Data/getCryptoData";
import {
  CryptoParams,
  generateCryptoMetadata,
} from "@/lib/MetaData/generateCryptoMetadata";
import { getJsonLdCrypto } from "@/lib/Schemas/getJsonLd";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const cryptoList = await getCryptoData();
  return cryptoList.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: CryptoParams }) {
  return generateCryptoMetadata({ params });
}

const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export default async function CryptoPage({ params }: PageProps) {
  const { slug } = await params;

  // ── Reuse the same cached list — zero extra API calls ─────────────────────
  const cryptoList = await getCryptoData();
  const crypto = cryptoList.find((c) => c.slug === slug);
  if (!crypto) return notFound();

  const quote = crypto.quote.USD;
  const isNegative = quote.percent_change_1h < 0;
  const accentColor = isNegative ? "var(--color-destructive)" : "#22c55e";

  const historyData = [
    quote.percent_change_90d,
    quote.percent_change_60d,
    quote.percent_change_30d,
    quote.percent_change_7d,
    quote.percent_change_24h,
    quote.percent_change_1h,
  ];

  const stats = [
    {
      label: "رأس المال السوقي",
      value: `$${formatter.format(quote.market_cap)}`,
    },
    {
      label: "حجم التداول (24س)",
      value: `$${formatter.format(quote.volume_24h)}`,
    },
    {
      label: "العرض المتداول",
      value: `${formatter.format(crypto.circulating_supply)} ${crypto.symbol}`,
    },
    {
      label: "الحد الأقصى للعرض",
      value: crypto.max_supply ? formatter.format(crypto.max_supply) : "∞",
    },
  ];

  const changes = [
    { label: "1س", value: quote.percent_change_1h },
    { label: "24س", value: quote.percent_change_24h },
    { label: "7ي", value: quote.percent_change_7d },
    { label: "30ي", value: quote.percent_change_30d },
  ];

  const jsonLd = getJsonLdCrypto({
    id: crypto.id,
    name: crypto.name,
    symbol: crypto.symbol,
    price: quote.price,
    changePercent: quote.percent_change_1h,
    positive: !isNegative,
    slug: crypto.slug,
  });

  return (
    <>
      <main
        className="container mx-auto px-4 py-8 md:py-10 space-y-6"
        dir="rtl"
      >
        {/* ── BREADCRUMB ── */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
          <Link
            href="/crypto"
            className="hover:text-primary-brand transition-colors"
          >
            العملات الرقمية
          </Link>
          <RiArrowLeftSLine size={14} className="shrink-0" />
          <span className="text-foreground font-mono uppercase">
            {crypto.symbol}
          </span>
        </div>

        {/* ── HERO ── */}
        <div className="relative bg-card border border-border rounded-3xl p-5 md:p-8 overflow-hidden">
          <div
            className="absolute -top-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-5 pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />
          <div className="absolute top-4 left-4 text-border/40 pointer-events-none">
            <RiBitCoinLine size={120} />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary-brand/10 border border-primary-brand/20 flex items-center justify-center text-xl md:text-2xl font-black text-primary-brand shrink-0">
                {crypto.symbol[0]}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl md:text-3xl m-0 font-black text-foreground tracking-tight leading-none">
                    {crypto.name}
                  </h1>
                  <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border font-mono">
                    #{crypto.cmc_rank}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1 font-mono">
                  {crypto.symbol} / USD
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2" dir="ltr">
                <span className="text-2xl md:text-4xl font-black text-foreground tabular-nums">
                  $
                  {quote.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <div
                  className={`p-1 rounded-xl ${isNegative ? "bg-destructive/10" : "bg-green-500/10"}`}
                >
                  {isNegative ? (
                    <RiArrowDownSFill size={24} className="text-destructive" />
                  ) : (
                    <RiArrowUpSFill size={24} className="text-green-500" />
                  )}
                </div>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {changes.map((c) => (
                  <div
                    key={c.label}
                    className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-black border ${
                      c.value < 0
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : "bg-green-500/10 text-green-500 border-green-500/20"
                    }`}
                  >
                    {c.value < 0 ? (
                      <RiArrowDownSFill size={11} />
                    ) : (
                      <RiArrowUpSFill size={11} />
                    )}
                    <span dir="ltr">{Math.abs(c.value).toFixed(2)}%</span>
                    <span className="opacity-50 mr-0.5">{c.label}</span>
                  </div>
                ))}
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
                الأداء التاريخي
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
              {isNegative ? "نزولي" : "صعودي"}
            </span>
          </div>
          <div className="h-56 md:h-72 w-full">
            <CryptoChart history={historyData} isNegative={isNegative} />
          </div>
        </div>

        {/* ── STATS + SIDEBAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-5 md:p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiPieChartLine size={15} />
              </div>
              <h2 className="text-sm md:text-base font-black text-foreground">
                الإحصائيات
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-muted/50 border border-border rounded-2xl p-4 space-y-1.5 hover:border-primary-brand/30 transition-colors group"
                >
                  <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
                    <RiStackLine size={11} />
                    {stat.label}
                  </span>
                  <span
                    className="text-sm md:text-base font-black text-foreground tabular-nums group-hover:text-primary-brand transition-colors block"
                    dir="ltr"
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-3xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                  <RiInformationLine size={15} />
                </div>
                <h2 className="text-sm font-black text-foreground">
                  عن {crypto.name}
                </h2>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-black">
                  {crypto.name}
                </strong>{" "}
                أصل رقمي رائد. القيمة السوقية{" "}
                <span className="text-foreground font-black" dir="ltr">
                  ${formatter.format(quote.market_cap)}
                </span>{" "}
                بناءً على العرض الحالي.
              </p>
            </div>

            <div className="dark:bg-card bg-dprimary rounded-3xl p-5 text-white relative overflow-hidden">
              <div className="absolute -top-8 -left-8 w-28 h-28 bg-primary-brand/20 rounded-full blur-3xl pointer-events-none" />
              <RiLineChartLine
                className="absolute -bottom-4 -right-4 text-white/5 pointer-events-none"
                size={80}
              />
              <div className="relative z-10 space-y-3">
                <div className="w-6 h-0.5 bg-primary-brand rounded-full" />
                <h3 className="text-sm font-black">تنبيهات السعر</h3>
                <p className="text-[11px] dark:text-white/50 leading-relaxed">
                  إشعارات فورية عند تغير سعر {crypto.name}.
                </p>
                <button className="cursor-pointer w-full py-2.5 bg-primary-brand hover:bg-primary-brand/90 rounded-xl font-black text-xs transition-all duration-200 active:scale-95">
                  ابدأ المتابعة
                </button>
              </div>
            </div>

            <Link
              href="/crypto"
              className="btn flex items-center justify-center gap-2 text-sm py-2.5 w-full"
            >
              <RiArrowLeftSLine size={16} />
              العودة للعملات الرقمية
            </Link>
          </div>
        </div>
      </main>
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        id="crypto-detail-schema"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
