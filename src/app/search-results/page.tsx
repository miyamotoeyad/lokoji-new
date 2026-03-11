import Link from "next/link";
import {
  RiSearchLine,
  RiBarChartGroupedLine,
  RiExchangeDollarLine,
  RiArticleLine,
  RiFundsLine,
  RiOilLine,
  RiArrowUpSFill,
  RiArrowDownSFill,
} from "@remixicon/react";

import { client } from "@/utils/contentful";
import { getExchangeRates } from "@/lib/Data/exchangeData";
import { getETFs, type ETFItem } from "@/lib/Data/etfData";
import { getEgyptianMarketData, type EGStock } from "@/lib/Data/egMarketData";
import { getCommodities, type CommodityItem } from "@/lib/Data/commoditiesData";
import ArtSquCard from "@/components/Articles/ArtSquCard";
import SearchNotFound from "@/components/Cards/SearchNotFound";
import { Entry } from "contentful";
import { ArticleSkeleton } from "@/types/contentfulType";
import {
  generateSearchMetadata,
  SearchParams,
} from "@/lib/MetaData/generateSearchMetadata";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return generateSearchMetadata({ searchParams });
}

const SECTIONS = [
  { id: "articles", title: "المقالات", icon: RiArticleLine },
  { id: "etf", title: "الصناديق", icon: RiFundsLine },
  { id: "eg-market", title: "البورصة", icon: RiBarChartGroupedLine },
  { id: "commodities", title: "السلع", icon: RiOilLine },
  { id: "exchange", title: "العملات", icon: RiExchangeDollarLine },
];

function SectionHeader({ id }: { id: string }) {
  const s = SECTIONS.find((x) => x.id === id);
  if (!s) return null;
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-1 h-6 bg-primary-brand rounded-full block shrink-0" />
      <div className="w-7 h-7 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
        <s.icon size={14} />
      </div>
      <h2 className="text-2xl md:text-3xl font-black text-foreground">
        {s.title}
      </h2>
    </div>
  );
}

function ChangePill({ positive, pct }: { positive: boolean; pct: number }) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
        positive
          ? "bg-green-500/10 text-green-500"
          : "bg-destructive/10 text-destructive"
      }`}
      dir="ltr"
    >
      {positive ? <RiArrowUpSFill size={11} /> : <RiArrowDownSFill size={11} />}
      {pct.toFixed(2)}%
    </span>
  );
}

function ETFResultCard({ item }: { item: ETFItem }) {
  return (
    <Link
      href={`/etfs/${item.slug}`}
      className="bg-card border border-border rounded-2xl p-3.5 hover:border-primary-brand/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
          <RiFundsLine size={13} />
        </div>
        <ChangePill positive={item.positive} pct={item.changePercent} />
      </div>
      <p className="text-xs md:text-sm font-black text-foreground leading-snug line-clamp-2">
        {item.title}
      </p>
      <p
        className="text-[10px] text-muted-foreground font-bold uppercase"
        dir="ltr"
      >
        {item.ticker}
      </p>
      <p
        className="text-sm md:text-base font-black text-foreground tabular-nums"
        dir="ltr"
      >
        {item.point.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        <span className="text-[10px] text-muted-foreground font-bold mr-1">
          {item.currency}
        </span>
      </p>
    </Link>
  );
}

function EGStockResultCard({ item }: { item: EGStock }) {
  return (
    <Link
      href={`/eg-market/${item.slug}`}
      className="bg-card border border-border rounded-2xl p-3.5 hover:border-primary-brand/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-[10px] font-black text-primary-brand bg-primary-brand/10 px-2 py-0.5 rounded-full font-mono"
          dir="ltr"
        >
          {item.code}
        </span>
        <ChangePill positive={item.positive} pct={item.changePercent} />
      </div>
      <p className="text-xs md:text-sm font-black text-foreground leading-snug line-clamp-1">
        {item.titleAr}
      </p>
      <p className="text-[10px] text-muted-foreground font-bold line-clamp-1">
        {item.titleEn}
      </p>
      <p
        className="text-sm md:text-base font-black text-foreground tabular-nums"
        dir="ltr"
      >
        {item.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        <span className="text-[10px] text-muted-foreground font-bold mr-1">
          EGP
        </span>
      </p>
    </Link>
  );
}

function CommodityResultCard({ item }: { item: CommodityItem }) {
  const positive = item.change >= 0;
  return (
    <Link
      href="/commodities"
      className="bg-card border border-border rounded-2xl p-3.5 hover:border-primary-brand/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
          <RiOilLine size={13} />
        </div>
        <ChangePill positive={positive} pct={Math.abs(item.change)} />
      </div>
      <p className="text-xs md:text-sm font-black text-foreground leading-snug line-clamp-1">
        {item.nameAr}
      </p>
      <p
        className="text-sm md:text-base font-black text-foreground tabular-nums"
        dir="ltr"
      >
        {item.priceEGP.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        <span className="text-[10px] text-muted-foreground font-bold mr-1">
          EGP
        </span>
      </p>
    </Link>
  );
}

function ExchangeResultCard({ pair, rate }: { pair: string; rate: number }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3.5 flex flex-col gap-2">
      <div className="w-7 h-7 rounded-lg bg-primary-brand/10 flex items-center justify-center text-primary-brand">
        <RiExchangeDollarLine size={13} />
      </div>
      <p
        className="text-[10px] font-black text-muted-foreground uppercase tracking-widest"
        dir="ltr"
      >
        {pair}
      </p>
      <p
        className="text-sm md:text-base font-black text-foreground tabular-nums"
        dir="ltr"
      >
        {rate.toFixed(2)}
      </p>
    </div>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const query = (search ?? "").trim();
  const matches = (text: string) =>
    text.toLowerCase().includes(query.toLowerCase());

  const [contentfulRes, etfs, egStocks, commodities, exchangeData] =
    await Promise.all([
      client.getEntries({ content_type: "articles", query }),
      getETFs(),
      getEgyptianMarketData(),
      getCommodities(),
      getExchangeRates("USD"),
    ]);

  const articles = contentfulRes.items;
  const filteredETFs = etfs.filter(
    (e) => matches(e.title) || matches(e.titleEn) || matches(e.ticker),
  );
  const filteredStocks = egStocks.filter(
    (s) => matches(s.titleAr) || matches(s.titleEn) || matches(s.code),
  );
  const filteredCommodities = commodities.filter(
    (c) => matches(c.nameAr) || matches(c.nameEn),
  );

  const PAIRS = [
    { pair: "USD/EGP", rate: exchangeData.rates["EGP"] ?? 0 },
    {
      pair: "EUR/EGP",
      rate: (exchangeData.rates["EGP"] ?? 0) / (exchangeData.rates["EUR"] ?? 1),
    },
    {
      pair: "GBP/EGP",
      rate: (exchangeData.rates["EGP"] ?? 0) / (exchangeData.rates["GBP"] ?? 1),
    },
    {
      pair: "SAR/EGP",
      rate: (exchangeData.rates["EGP"] ?? 0) / (exchangeData.rates["SAR"] ?? 1),
    },
    {
      pair: "AED/EGP",
      rate: (exchangeData.rates["EGP"] ?? 0) / (exchangeData.rates["AED"] ?? 1),
    },
    {
      pair: "JPY/EGP",
      rate: (exchangeData.rates["EGP"] ?? 0) / (exchangeData.rates["JPY"] ?? 1),
    },
    {
      pair: "CNY/EGP",
      rate: (exchangeData.rates["EGP"] ?? 0) / (exchangeData.rates["CNY"] ?? 1),
    },
  ];
  const filteredPairs = PAIRS.filter((p) => matches(p.pair));

  const totalResults =
    articles.length +
    filteredETFs.length +
    filteredStocks.length +
    filteredCommodities.length +
    filteredPairs.length;

  return (
    <main
      className="container mx-auto px-4 py-8 md:py-10 space-y-12 md:space-y-16"
      dir="rtl"
    >
      {/* ── SEARCH HEADER ── */}
      <section className="bg-card border border-border rounded-3xl p-5 md:p-8 space-y-5 md:space-y-8">
        {/* Title + search bar stacked on mobile */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              نتائج البحث
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-foreground leading-tight">
              نتائج عن:{" "}
              <span className="text-primary-brand">&quot;{query}&quot;</span>
            </h1>
            <p className="text-xs text-muted-foreground font-bold">
              {totalResults} نتيجة
            </p>
          </div>

          <div className="md:flex grid gap-6 justify-between items-end">
            {/* Search bar — full width on mobile */}
            <form action="/search-results" className="max-w-84 md:max-w-md">
              <div className="flex items-center gap-2 bg-muted border-2 border-transparent focus-within:border-primary-brand focus-within:bg-card rounded-2xl px-3 py-2.5 transition-all duration-300">
                <RiSearchLine
                  size={16}
                  className="text-muted-foreground shrink-0"
                />
                <input
                  name="search"
                  defaultValue={query}
                  className="flex-1 bg-transparent border-0 ring-0 text-foreground placeholder:text-muted-foreground font-bold text-sm outline-none min-w-0"
                  placeholder="ابحث مرة أخرى..."
                />
                <button
                  type="submit"
                  className="cursor-pointer shrink-0 bg-primary-brand text-white text-xs font-black lg:px-10 px-3 py-1.5 rounded-xl hover:bg-primary-brand/90 transition-colors"
                >
                  بحث
                </button>
              </div>
            </form>

            {/* Quick-jump pills — horizontal scroll on mobile */}
            <div className="flex overflow-hidden items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
              {SECTIONS.map((s) => (
                <Link
                  key={s.id}
                  href={`#${s.id}`}
                  className="btn shrink-0 inline-flex items-center gap-1.5 text-xs py-1.5 px-3"
                >
                  <s.icon size={13} />
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESULTS ── */}
      <div className="space-y-14 md:space-y-20">
        {/* Articles */}
        <section id="articles" className="scroll-mt-28">
          <SectionHeader id="articles" />
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {articles.map((post) => (
                <ArtSquCard
                  key={post.sys.id}
                  article={post as Entry<ArticleSkeleton, undefined, string>}
                />
              ))}
            </div>
          ) : (
            <SearchNotFound />
          )}
        </section>

        {/* ETFs */}
        <section id="etf" className="scroll-mt-28">
          <SectionHeader id="etf" />
          {filteredETFs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {filteredETFs.map((item) => (
                <ETFResultCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <SearchNotFound />
          )}
        </section>

        {/* EG Market */}
        <section id="eg-market" className="scroll-mt-28">
          <SectionHeader id="eg-market" />
          {filteredStocks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {filteredStocks.map((item) => (
                <EGStockResultCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <SearchNotFound />
          )}
        </section>

        {/* Commodities */}
        <section id="commodities" className="scroll-mt-28">
          <SectionHeader id="commodities" />
          {filteredCommodities.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {filteredCommodities.map((item) => (
                <CommodityResultCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <SearchNotFound />
          )}
        </section>

        {/* Exchange */}
        <section id="exchange" className="scroll-mt-28">
          <SectionHeader id="exchange" />
          {filteredPairs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {filteredPairs.map((p) => (
                <ExchangeResultCard key={p.pair} pair={p.pair} rate={p.rate} />
              ))}
            </div>
          ) : (
            <SearchNotFound />
          )}
        </section>
      </div>
    </main>
  );
}
