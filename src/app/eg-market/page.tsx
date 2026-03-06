import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiBarChartGroupedLine,
  RiExternalLinkLine,
  RiRefreshLine,
  RiFlashlightLine,
} from "react-icons/ri";
import Link from "next/link";
import { getEgyptianMarketData, type EGStock } from "@/lib/Data/egMarketData";
import EGMarketTable from "@/components/Market/EGMarketTable";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import { Metadata } from "next";

const title = "البورصة المصرية | متابعة حية للأسهم";
const description = "تابع أسعار الأسهم والشركات المدرجة في البورصة المصرية لحظة بلحظة.";

export const metadata: Metadata = generateStaticMetadata({
  title,
  description,
  url: "/eg-market",
});

export default async function MarketPage() {
  const stocks = await getEgyptianMarketData();
  const now = new Date().toLocaleTimeString("ar-EG");
  const top5 = stocks.slice(0, 5);

  return (
    <main className="container mx-auto px-4 py-10 space-y-12" dir="rtl">
      {/* ── PAGE HEADER ── */}
      <div className="pb-8 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiBarChartGroupedLine size={20} />
            </div>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              EGX
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tight">
            البورصة المصرية
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            بيانات من Yahoo Finance · تُحدَّث كل 30 دقيقة
          </p>
        </div>

        {/* Live badge + time */}
        <div className="bg-card border border-border rounded-2xl px-5 py-4 shrink-0 h-fit space-y-1">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            آخر تحديث
          </p>
          <div className="flex items-center gap-2">
            <RiRefreshLine size={13} className="text-primary-brand" />
            <span className="text-sm font-black text-foreground">{now}</span>
          </div>
          <p className="text-[10px] text-muted-foreground font-bold">
            {stocks.length} شركة مدرجة
          </p>
        </div>
      </div>

      {/* ── TOP 5 BENTO CARDS ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
          <h2 className="text-xl font-black text-foreground">الأكثر نشاطاً</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {top5.map((stock: EGStock) => (
            <Link
              key={stock.id}
              href={`/eg-market/${stock.slug}`}
              className="group bg-card border border-border p-5 rounded-3xl hover:border-primary-brand/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col gap-3 h-full"
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-black text-primary-brand bg-primary-brand/10 px-2.5 py-1 rounded-full"
                  dir="ltr"
                >
                  {stock.code}
                </span>
                <RiExternalLinkLine
                  size={13}
                  className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Name */}
              <h3 className="font-black text-sm text-foreground group-hover:text-primary-brand transition-colors line-clamp-2 leading-snug flex-1">
                {stock.titleAr}
              </h3>

              {/* Price */}
              <p
                className="text-base font-black text-foreground tabular-nums"
                dir="ltr"
              >
                {stock.price.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
                <span className="text-[10px] text-muted-foreground font-bold mr-1">
                  EGP
                </span>
              </p>

              {/* Change pill */}
              <div
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black w-fit ${
                  stock.positive
                    ? "bg-green-500/10 text-green-500"
                    : "bg-destructive/10 text-destructive"
                }`}
                dir="ltr"
              >
                {stock.positive ? (
                  <RiArrowUpSFill size={14} />
                ) : (
                  <RiArrowDownSFill size={14} />
                )}
                {stock.positive ? "+" : "-"}
                {stock.changePercent.toFixed(2)}%
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FULL COMPANY LIST ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
            <h2 className="text-xl font-black text-foreground">
              قائمة الشركات
            </h2>
          </div>
          <span className="text-xs font-black text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
            {stocks.length} شركة
          </span>
        </div>

        <EGMarketTable stocks={stocks} />
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
              <span className="font-bold text-foreground">Yahoo Finance</span> ·
              تُحدَّث كل 30 دقيقة · للأغراض الإعلامية فقط · ليست نصيحة
              استثمارية.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <RiRefreshLine size={11} className="text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground font-bold">
            آخر تحديث: {now}
          </span>
        </div>
      </div>
    </main>
  );
}
