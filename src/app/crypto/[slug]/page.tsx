import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiLineChartLine,
  RiStackLine,
  RiInformationLine,
  RiPieChartLine,
  RiArrowLeftSLine,
} from "react-icons/ri";
import CryptoChart from "@/components/Charts/CryptoChart";
import { Metadata } from "next";
import Link from "next/link";

interface CryptoDetail {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  circulating_supply: number;
  max_supply: number | null;
  total_supply: number;
  quote: {
    USD: {
      price: number;
      market_cap: number;
      volume_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
    };
  };
}

interface CMCResponse {
  data: CryptoDetail[];
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `سعر عملة ${slug.toUpperCase()} المباشر | لوكوجي`,
    description: `تحليل مباشر لعملة ${slug} مع الرسوم البيانية والمعلومات المالية الدقيقة.`,
  };
}

async function getCryptoDetail(
  slug: string,
): Promise<CryptoDetail | undefined> {
  const res = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${process.env.CRYPTO_API}&convert=USD`,
    { next: { revalidate: 60 } },
  );
  const data: CMCResponse = await res.json();
  return data.data.find((item) => item.slug === slug);
}

const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export default async function CryptoPage({ params }: PageProps) {
  const { slug } = await params;
  const crypto = await getCryptoDetail(slug);

  if (!crypto) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-4">
        <p className="text-4xl font-black text-foreground">العملة غير موجودة</p>
        <Link href="/crypto" className="btn text-sm px-6 py-2.5 inline-flex">
          العودة للسوق
        </Link>
      </div>
    );
  }

  const quote = crypto.quote.USD;
  const isNegative = quote.percent_change_1h < 0;

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
    { label: "1 ساعة", value: quote.percent_change_1h },
    { label: "24 ساعة", value: quote.percent_change_24h },
    { label: "7 أيام", value: quote.percent_change_7d },
    { label: "30 يوم", value: quote.percent_change_30d },
  ];

  return (
    <main className="container mx-auto px-4 py-10 space-y-8" dir="rtl">
      {/* ── BREADCRUMB ── */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
        <Link
          href="/crypto"
          className="hover:text-primary-brand transition-colors"
        >
          العملات الرقمية
        </Link>
        <RiArrowLeftSLine size={14} />
        <span className="text-foreground uppercase">{crypto.symbol}</span>
      </div>

      {/* ── HERO HEADER ── */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-brand/10 border border-primary-brand/20 flex items-center justify-center text-2xl font-black text-primary-brand shrink-0">
            {crypto.symbol[0]}
          </div>
          <div className="grid">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight leading-none">
                {crypto.name}
              </h1>
              <span className="text-[10px] font-black text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                #{crypto.cmc_rank}
              </span>
            </div>
            <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">
              {crypto.symbol} / USD
            </p>
          </div>
        </div>

        {/* Price + change */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1" dir="ltr">
            <span className="text-3xl md:text-4xl font-black text-foreground tabular-nums">
              $
              {quote.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
            {isNegative ? (
              <RiArrowDownSFill size={36} className="text-destructive" />
            ) : (
              <RiArrowUpSFill size={36} className="text-green-500" />
            )}
          </div>

          {/* Multi-period change pills */}
          <div className="flex gap-2 flex-wrap justify-end">
            {changes.map((c) => (
              <div
                key={c.label}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
                  c.value < 0
                    ? "bg-destructive/10 text-destructive"
                    : "bg-green-500/10 text-green-500"
                }`}
              >
                {c.value < 0 ? (
                  <RiArrowDownSFill size={12} />
                ) : (
                  <RiArrowUpSFill size={12} />
                )}
                <span dir="ltr">{c.value.toFixed(2)}%</span>
                <span className="opacity-60">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Chart + About — 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                  <RiLineChartLine size={16} />
                </div>
                <h2 className="text-base font-black text-foreground">
                  تحليل الأداء التاريخي
                </h2>
              </div>
              <span className="text-[10px] font-black text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
                تحديث حي
              </span>
            </div>
            <div className="h-72 w-full">
              <CryptoChart history={historyData} isNegative={isNegative} />
            </div>
          </div>

          {/* About */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiInformationLine size={16} />
              </div>
              <h2 className="text-base font-black text-foreground">
                عن عملة {crypto.name}
              </h2>
            </div>
            <p className="text-muted-foreground leading-loose text-sm">
              تعتبر{" "}
              <strong className="text-foreground font-black">
                {crypto.name}
              </strong>{" "}
              أصلًا رقميًا رائدًا. القيمة السوقية تبلغ حالياً{" "}
              <span className="text-foreground font-black" dir="ltr">
                ${formatter.format(quote.market_cap)}
              </span>{" "}
              بناءً على العرض المتداول الحالي.
            </p>
          </div>
        </div>

        {/* RIGHT: Stats + CTA */}
        <div className="space-y-6 col-span-1 lg:col-span-2 grid gird-cols-1 lg:grid-cols-2 gap-6">
          {/* Stats */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiPieChartLine size={16} />
              </div>
              <h2 className="text-base font-black text-foreground">
                الإحصائيات
              </h2>
            </div>
            <div className="divide-y divide-border">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex justify-between items-center py-3 group"
                >
                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <RiStackLine size={12} />
                    {stat.label}
                  </span>
                  <span
                    className="text-sm font-black text-foreground tabular-nums group-hover:text-primary-brand transition-colors"
                    dir="ltr"
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            {/* Alert CTA */}
            <div className="dark:bg-card h-full bg-dprimary rounded-3xl p-6 text-white relative overflow-hidden space-y-4">
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary-brand/20 rounded-full blur-3xl pointer-events-none" />
              <RiLineChartLine
                className="absolute -bottom-6 -right-6 text-white/5 pointer-events-none"
                size={120}
              />
              <div className="relative z-10 space-y-3">
                <div className="w-8 h-1 bg-primary-brand rounded-full" />
                <h3 className="text-base font-black text-white">
                  تنبيهات السعر
                </h3>
                <p className="text-xs dark:text-white/50 leading-relaxed">
                  اشترك لتصلك إشعارات فورية عند تغير سعر {crypto.name}.
                </p>
                <button className="cursor-pointer w-full py-3 bg-primary-brand hover:bg-primary-brand/90 rounded-2xl font-black text-sm transition-all duration-200 active:scale-95 shadow-lg shadow-primary-brand/30">
                  ابدأ المتابعة
                </button>
              </div>
            </div>

            <Link
              href="/crypto"
              className="btn h-fit flex items-center justify-center gap-2 text-sm py-3 w-full"
            >
              <RiArrowLeftSLine size={16} />
              العودة للعملات الرقمية
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
