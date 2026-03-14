import { ETFCard } from "@/components/Cards";
import { ETFRow } from "@/components/Cards/ETFCard";
import { getETFs } from "@/lib/Data/etfData";
import { getJsonLdETFsListing } from "@/lib/Schemas/getJsonLd";
import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiExternalLinkLine,
  RiFlashlightLine,
  RiFundsLine,
  RiRefreshLine,
} from "@remixicon/react";
import Link from "next/link";

export default async function ETFPage() {
  const etfs = await getETFs();
  const now = new Date().toLocaleTimeString("ar-EG");
  const top3 = etfs.slice(0, 3);
  const egx30 = etfs.find((e) => e.slug === "egx30");

  // Map ETFItem → ETFData shape expected by getJsonLdETFsListing
  const etfsForSchema = etfs.map((e) => ({
    ticker: e.ticker,
    nameAr: e.title, // ← ETFItem.title → ETFData.nameAr
    nameEn: e.titleEn,
    price: e.point, // ← ETFItem.point → ETFData.price
    changePercent: e.changePercent,
    positive: e.positive,
  }));

  return (
    <>
      <main className="container mx-auto px-4 py-10 space-y-12" dir="rtl">
        {" "}
        {/* ← removed fragment */}
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
              <p
                className="text-2xl font-black text-foreground tabular-nums group-hover:text-primary-brand transition-colors"
                dir="ltr"
              >
                {egx30.point.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </p>
              <p
                className={`text-xs font-black flex items-center gap-1 ${egx30.positive ? "text-green-500" : "text-primary-brand"}`}
                dir="ltr"
              >
                {egx30.positive ? (
                  <RiArrowUpSFill size={14} />
                ) : (
                  <RiArrowDownSFill size={14} />
                )}
                {egx30.changePercent.toFixed(2)}%
              </p>
            </Link>
          )}
        </div>
        {/* ── TOP 3 CARDS ── */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
            <h2 className="text-xl font-black text-foreground">
              الأكثر نشاطاً
            </h2>
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
            <h2 className="text-xl font-black text-foreground">
              جميع الصناديق والمؤشرات
            </h2>
            <span className="text-xs font-black text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
              {etfs.length} صندوق
            </span>
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_7rem_9rem_7rem_2rem] items-center px-6 py-4 border-b border-border bg-muted/50 gap-4">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                #
              </span>
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                الصندوق
              </span>
              <span className="hidden md:block text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center">
                السوق
              </span>
              <span className="hidden md:block text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">
                القيمة
              </span>
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">
                التغيير
              </span>
              <span className="hidden md:block" />
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
              <p className="text-sm font-black text-foreground mb-1">
                مصادر البيانات
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                البيانات من{" "}
                <span className="font-bold text-foreground">Yahoo Finance</span>{" "}
                · تُحدَّث كل 30 دقيقة · للأغراض الإعلامية فقط · ليست نصيحة
                استثمارية.
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
              href="https://finance.yahoo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-primary-brand transition-colors"
            >
              <RiExternalLinkLine size={11} />
              Yahoo Finance
            </Link>
          </div>
        </div>
      </main>
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        id="etfs-listing-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getJsonLdETFsListing(etfsForSchema)),
        }}
      />
    </>
  );
}
