import { Metadata } from "next";
import Link from "next/link";
import {
  RiFundsLine,
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiRefreshLine,
  RiExternalLinkLine,
  RiFlashlightLine,
  RiBarChartLine,
  RiArrowLeftSLine,
} from "react-icons/ri";
import { getETFs, type ETFItem } from "@/lib/Data/etfData";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

export const metadata: Metadata = {
  title: "صناديق الاستثمار",
  description:
    "تابع أداء صناديق الاستثمار المرتبطة بالسوق المصري والمؤشرات الرئيسية في البورصة المصرية.",
  alternates: { canonical: `${siteUrl}/etfs` },
};

const marketBadge: Record<
  ETFItem["market"],
  { label: string; color: string; bg: string }
> = {
  EGX: {
    label: "بورصة مصر",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  US: {
    label: "NYSE",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  EUREX: {
    label: "EUREX",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  LSE: {
    label: "لندن",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
  TADAWUL: {
    label: "تداول",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
};

// ── CARD ─────────────────────────────────────────────────────────────────────
function ETFCard({ item }: { item: ETFItem }) {
  const badge = marketBadge[item.market];

  return (
    <Link
      href={`/etfs/${item.slug}`}
      className="group bg-card border border-border rounded-3xl p-5 flex flex-col gap-4 hover:border-primary-brand/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
          <RiFundsLine size={20} />
        </div>
        <div
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
            item.positive
              ? "bg-green-500/10 text-green-500"
              : "bg-destructive/10 text-destructive"
          }`}
          dir="ltr"
        >
          {item.positive ? <RiArrowUpSFill size={12} /> : <RiArrowDownSFill size={12} />}
          {item.changePercent.toFixed(2)}%
        </div>
      </div>

      {/* Name */}
      <div>
        <h3 className="font-black text-foreground text-sm leading-snug mb-1 group-hover:text-primary-brand transition-colors">
          {item.title}
        </h3>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest" dir="ltr">
          {item.ticker}
        </p>
      </div>

      {/* Prices */}
      <div className="border-t border-border pt-3 space-y-2 mt-auto">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-muted-foreground shrink-0">القيمة</span>
          <span className="text-sm font-black text-foreground tabular-nums" dir="ltr">
            {item.point.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
            <span className="text-[10px] text-muted-foreground font-bold">{item.currency}</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-muted-foreground shrink-0">التغيير</span>
          <span
            className={`text-xs font-black tabular-nums ${
              item.positive ? "text-green-500" : "text-primary-brand"
            }`}
            dir="ltr"
          >
            {item.positive ? "+" : "-"}{item.change.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className={`inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border ${badge.bg} ${badge.color}`}>
            {badge.label}
          </span>
          <span className="text-[10px] font-black text-muted-foreground flex items-center gap-0.5 group-hover:text-primary-brand transition-colors">
            التفاصيل <RiArrowLeftSLine size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── TABLE ROW ─────────────────────────────────────────────────────────────────
function ETFRow({ item, rank }: { item: ETFItem; rank: number }) {
  const badge = marketBadge[item.market];

  return (
    <Link
      href={`/etfs/${item.slug}`}
      className="grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_7rem_9rem_7rem_2rem] items-center px-6 py-4 gap-4 hover:bg-primary-brand/5 transition-colors duration-200 group"
    >
      {/* # */}
      <span className="text-xs font-black text-muted-foreground tabular-nums">
        {rank}
      </span>

      {/* Name + ticker */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
          <RiBarChartLine size={16} />
        </div>
        <div className="min-w-0 text-right">
          <p className="font-black text-sm text-foreground group-hover:text-primary-brand transition-colors truncate">
            {item.title}
          </p>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest" dir="ltr">
            {item.ticker}
          </p>
        </div>
      </div>

      {/* Market badge — desktop only */}
      <div className={`hidden md:inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-black border ${badge.bg} ${badge.color}`}>
        {badge.label}
      </div>

      {/* Price — desktop only */}
      <div className="hidden md:flex items-center justify-end gap-1" dir="ltr">
        <span className="text-sm font-black text-foreground tabular-nums">
          {item.point.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </span>
        <span className="text-[10px] text-muted-foreground font-bold">
          {item.currency}
        </span>
      </div>

      {/* Change pill */}
      <div
        className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-black w-fit mr-auto md:mr-0 ${
          item.positive
            ? "bg-green-500/10 text-green-500"
            : "bg-destructive/10 text-destructive"
        }`}
        dir="ltr"
      >
        {item.positive ? <RiArrowUpSFill size={13} /> : <RiArrowDownSFill size={13} />}
        {item.changePercent.toFixed(2)}%
      </div>

      {/* Arrow — desktop only */}
      <RiArrowLeftSLine
        size={18}
        className="hidden md:block text-muted-foreground/40 group-hover:text-primary-brand transition-colors justify-self-end"
      />
    </Link>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default async function ETFPage() {
  const etfs  = await getETFs();
  const now   = new Date().toLocaleTimeString("ar-EG");
  const top3  = etfs.slice(0, 3);
  const egx30 = etfs.find((e) => e.slug === "egx30");

  return (
    <main className="container mx-auto px-4 py-10 space-y-12" dir="rtl">

      {/* ── HEADER ── */}
      <div className="pb-8 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiFundsLine size={20} />
            </div>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              البورصة المصرية
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-2">
            صناديق الاستثمار
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            تابع أداء صناديق الاستثمار والمؤشرات المصرية لحظة بلحظة.
          </p>
        </div>

        {egx30 && (
          <Link
            href={`/etfs/${egx30.slug}`}
            className="bg-card border border-border rounded-2xl px-6 py-4 shrink-0 space-y-1 h-fit hover:border-primary-brand/30 transition-colors group"
          >
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              مؤشر EGX30
            </p>
            <p className="text-2xl font-black text-foreground tabular-nums group-hover:text-primary-brand transition-colors" dir="ltr">
              {egx30.point.toLocaleString("en-US", { maximumFractionDigits: 2 })}
            </p>
            <p
              className={`text-xs font-black flex items-center gap-1 ${
                egx30.positive ? "text-green-500" : "text-primary-brand"
              }`}
              dir="ltr"
            >
              {egx30.positive ? <RiArrowUpSFill size={14} /> : <RiArrowDownSFill size={14} />}
              {egx30.changePercent.toFixed(2)}%
            </p>
          </Link>
        )}
      </div>

      {/* ── TOP 3 CARDS ── */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
          <h2 className="text-xl font-black text-foreground">الأكثر نشاطاً</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {top3.map((item) => (
            <ETFCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ── FULL TABLE ── */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
          <h2 className="text-xl font-black text-foreground">جميع الصناديق والمؤشرات</h2>
          <span className="text-xs font-black text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
            {etfs.length} صندوق
          </span>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_7rem_9rem_7rem_2rem] items-center px-6 py-4 border-b border-border bg-muted/50 gap-4">
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">#</span>
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">الصندوق</span>
            <span className="hidden md:block text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center">السوق</span>
            <span className="hidden md:block text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">القيمة</span>
            <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">التغيير</span>
            <span className="hidden md:block" /> {/* spacer for arrow col */}
          </div>

          <div className="divide-y divide-border">
            {etfs.map((item, i) => (
              <ETFRow key={item.id} item={item} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ── */}
      <div className="bg-card border border-border rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0 mt-0.5">
            <RiFlashlightLine size={18} />
          </div>
          <div>
            <p className="text-sm font-black text-foreground mb-1">مصادر البيانات</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              البيانات من{" "}
              <span className="font-bold text-foreground">Finnhub</span>{" "}
              · تُحدَّث كل 30 دقيقة · للأغراض الإعلامية فقط · ليست نصيحة استثمارية.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <RiRefreshLine size={11} className="text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground font-bold">
              آخر تحديث: {now}
            </span>
          </div>
          <Link
            href="https://finnhub.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-primary-brand transition-colors"
          >
            <RiExternalLinkLine size={11} />
            Finnhub
          </Link>
        </div>
      </div>
    </main>
  );
}