import Link from "next/link";
import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiFlashlightLine,
  RiFundsLine,
  RiBitCoinLine,
} from "@remixicon/react";
import { CryptoCard } from "@/components/Cards";
import { Metadata } from "next";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import { getCryptoData, type CryptoItem } from "@/lib/Data/getCryptoData";
import { getJsonLdCryptoListing } from "@/lib/Schemas/getJsonLd";

export const metadata: Metadata = generateStaticMetadata({
  title: "سوق العملات الرقمية",
  description:
    "تابع أسعار العملات الرقمية مباشرة، تحليل السوق وحركة الأسعار لحظة بلحظة.",
  url: "/crypto",
});

export default async function CryptoMarketPage() {
  const cryptoList = await getCryptoData();

  const cryptoForSchema = cryptoList.map((c) => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    price: c.quote.USD.price,
    changePercent: c.quote.USD.percent_change_1h,
    positive: c.quote.USD.percent_change_1h >= 0,
    slug: c.slug,
  }));

  return (
    <>
      <main className="container mx-auto px-6 py-10 space-y-12" dir="rtl">
        {/* ── PAGE HEADER ── */}
        <div className="pb-8 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiBitCoinLine size={20} />
            </div>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              العملات الرقمية · Crypto
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2 tracking-tight">
            سوق العملات الرقمية
          </h1>
          <p className="text-muted-foreground text-base md:text-lg font-medium">
            متابعة حية لأسعار أهم {cryptoList.length} عملة مشفرة في السوق
            العالمي.
          </p>
        </div>

        {/* ── TOP 5 FEATURED ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
            <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiFlashlightLine size={16} />
            </div>
            <h2 className="text-xl font-black text-foreground">
              الأكثر نشاطاً اليوم
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cryptoList.slice(0, 5).map((market) => (
              <CryptoCard key={market.id} crypto={market} />
            ))}
          </div>
        </section>

        {/* ── FULL LIST TABLE ── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiFundsLine size={16} />
              </div>
              <h2 className="text-xl font-black text-foreground">
                جميع العملات
              </h2>
            </div>
            <span className="text-xs font-black text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
              {cryptoList.length} عملة
            </span>
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_7rem_6rem] md:grid-cols-[1fr_8rem_10rem_6rem] items-center px-4 md:px-6 py-4 border-b border-border bg-muted/50 gap-3">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                العملة
              </span>
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
                السعر
              </span>
              <span className="hidden md:block text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
                حجم التداول (24س)
              </span>
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
                التغيير
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {cryptoList.map((market: CryptoItem, index) => {
                const quote = market.quote.USD;
                const isNegative = quote.percent_change_1h < 0;

                return (
                  <Link
                    key={market.id}
                    href={`/crypto/${market.slug}`}
                    className="grid grid-cols-[1fr_7rem_6rem] md:grid-cols-[1fr_8rem_10rem_6rem] items-center px-4 md:px-6 py-4 hover:bg-primary-brand/5 transition-colors duration-200 group gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs font-black text-muted-foreground tabular-nums w-5 shrink-0">
                        {index + 1}
                      </span>
                      <div className="w-8 md:flex hidden h-8 md:w-9 md:h-9 rounded-xl bg-primary-brand/10 items-center justify-center font-black text-primary-brand text-xs shrink-0">
                        {market.symbol[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs md:text-sm text-foreground group-hover:text-primary-brand transition-colors truncate">
                          {market.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase mt-0.5">
                          {market.symbol}
                        </p>
                      </div>
                    </div>

                    <div
                      className="text-left font-black text-xs md:text-sm text-foreground tabular-nums"
                      dir="ltr"
                    >
                      $
                      {quote.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>

                    <div
                      className="hidden md:block text-left text-xs text-muted-foreground font-bold tabular-nums"
                      dir="ltr"
                    >
                      ${Math.round(quote.volume_24h).toLocaleString()}
                    </div>

                    <div className="flex justify-end">
                      <div
                        className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] md:text-xs font-black ${
                          isNegative
                            ? "bg-destructive/10 text-destructive"
                            : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {isNegative ? (
                          <RiArrowDownSFill size={12} />
                        ) : (
                          <RiArrowUpSFill size={12} />
                        )}
                        <span dir="ltr">
                          {Math.abs(quote.percent_change_1h).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        id="crypto-listing-schema"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getJsonLdCryptoListing(cryptoForSchema)),
        }}
      />
    </>
  );
}
