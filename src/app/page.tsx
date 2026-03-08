import Link from "next/link";
import Image from "next/image";
import {
  RiFlashlightLine,
  RiFundsLine,
  RiArrowLeftSLine,
  RiLineChartLine,
  RiNewspaperLine,
  RiFireLine,
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiBitCoinLine,
  RiGlobalLine,
  RiBuildingLine,
  RiArticleLine,
} from "react-icons/ri";

import { getExchangeRates } from "@/lib/Data/exchangeData";
import { getETFs, type ETFItem } from "@/lib/Data/etfData";
import { getCommodities, type CommodityItem } from "@/lib/Data/commoditiesData";
import { client } from "@/utils/contentful";
import { getCryptoData } from "@/lib/Data/getCryptoData";
import {
  getWorldMarketData,
  type WorldMarketItem,
} from "@/lib/Data/worldMarketData";
import {
  getWorldStocksData,
  type WorldStock,
} from "@/lib/Data/worldStocksData";
import { WORLD_STOCKS_CONFIG } from "@/lib/Array/WorldCompanyList";
import { MarketData } from "@/app/crypto/page";

import ArtSquCard from "@/components/Articles/ArtSquCard";
import { Entry, Asset, AssetFile } from "contentful";
import { ArticleSkeleton } from "@/types/contentfulType";

// ── unique sectors list ───────────────────────────────────────────────────────
const SECTORS = Array.from(new Set(WORLD_STOCKS_CONFIG.map((s) => s.sector)));

async function getHomeData() {
  const [
    contentfulRes,
    exchangeRes,
    etfs,
    commodities,
    cryptoRes,
    worldIndices,
    worldStocks,
  ] = await Promise.all([
    client.getEntries({ content_type: "articles", order: ["-sys.createdAt"] }),
    getExchangeRates("USD"),
    getETFs(),
    getCommodities(),
    getCryptoData(),
    getWorldMarketData(),
    getWorldStocksData(),
  ]);

  const egp = exchangeRes.rates["EGP"] ?? 1;
  const widgetPairs = [
    { slug: "usd-egp", first: "USD", second: "EGP", num: egp.toFixed(2) },
    {
      slug: "eur-egp",
      first: "EUR",
      second: "EGP",
      num: (egp / exchangeRes.rates["EUR"]).toFixed(2),
    },
    {
      slug: "gbp-egp",
      first: "GBP",
      second: "EGP",
      num: (egp / exchangeRes.rates["GBP"]).toFixed(2),
    },
  ];

  return {
    articles: contentfulRes.items,
    widgetPairs,
    etfs,
    commodities,
    cryptoList: cryptoRes.data,
    worldIndices,
    worldStocks,
  };
}

function getEntryImageUrl(image: unknown): string {
  const asset = image as Asset;
  const file = asset?.fields?.file as AssetFile | undefined;
  return file?.url ? `https:${file.url}` : "/no-image.png";
}

function ChangePill({
  value,
  suffix = "%",
}: {
  value: number;
  suffix?: string;
}) {
  const isUp = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
        isUp
          ? "bg-green-500/10 text-green-500"
          : "bg-destructive/10 text-destructive"
      }`}
      dir="ltr"
    >
      {isUp ? <RiArrowUpSFill size={10} /> : <RiArrowDownSFill size={10} />}
      {Math.abs(value).toFixed(2)}
      {suffix}
    </span>
  );
}

const REGION_FLAG: Record<string, string> = {
  أمريكا: "🇺🇸",
  أوروبا: "🇪🇺",
  آسيا: "🌏",
  "الشرق الأوسط": "MENA",
  أفريقيا: "AF",
  "أمريكا اللاتينية": "LA",
};

export default async function Home() {
  const {
    articles,
    widgetPairs,
    etfs,
    commodities,
    cryptoList,
    worldIndices,
    worldStocks,
  } = await getHomeData();

  const stocksBySector = SECTORS.map((sector) => ({
    sector,
    stocks: worldStocks.filter((s) => s.sector === sector).slice(0, 3),
  }))
    .filter((g) => g.stocks.length > 0)
    .slice(0, 8);

  return (
    <main className="min-h-screen transition-colors duration-500" dir="rtl">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* ══ 1. HERO BENTO ══════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 lg:row-span-2 relative rounded-3xl overflow-hidden md:min-h-130 group shadow-xl">
            <ArtSquCard
              article={articles[0] as Entry<ArticleSkeleton, undefined, string>}
            />
            <div className="absolute top-5 right-5 flex gap-2 pointer-events-none">
              <span className="bg-primary-brand text-white px-3 py-1 rounded-full text-[10px] font-black shadow">
                تحليل اليوم
              </span>
              <span className="bg-black/40 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-bold">
                حصري
              </span>
            </div>
          </div>
          <div className="lg:col-span-5 rounded-3xl overflow-hidden min-h-62 relative group shadow-md">
            <ArtSquCard
              article={articles[1] as Entry<ArticleSkeleton, undefined, string>}
              variant="hero"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
          </div>
          <div className="lg:col-span-5">
            <div className="bg-dprimary rounded-3xl p-5 text-white relative overflow-hidden shadow-lg h-full">
              <div className="absolute -top-8 -left-8 w-28 h-28 bg-primary-brand/20 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-white text-sm flex items-center gap-1.5">
                    <RiLineChartLine className="text-primary-brand" size={16} />
                    أسعار العملات
                  </h3>
                  <Link
                    href="/exchange"
                    className="text-[10px] text-white/60 hover:text-primary-brand flex items-center gap-0.5 transition-colors"
                  >
                    المزيد <RiArrowLeftSLine size={12} />
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {widgetPairs.map((item) => (
                    <Link
                      key={item.slug}
                      href="/exchange"
                      className="bg-white/10 hover:bg-primary-brand/30 transition-colors p-3 rounded-2xl text-center border border-white/5"
                    >
                      <p className="text-[9px] text-white/50 mb-1">
                        {item.first}/{item.second}
                      </p>
                      <p className="text-base font-black">{item.num}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 2. HOT TOPICS ══════════════════════════════════════════════════ */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
          <span className="shrink-0 flex items-center gap-1 text-primary-brand font-black text-sm">
            <RiFireLine size={16} /> الأكثر تداولاً:
          </span>
          {[
            "البنوك",
            "العقارات",
            "الطاقة",
            "الاتصالات",
            "الأسمنت",
            "الغذائية",
          ].map((tag) => (
            <Link
              key={tag}
              href={`/search-results?search=${tag}`}
              className="shrink-0 btn text-xs py-1.5 px-4"
            >
              {tag}
            </Link>
          ))}
        </div>

        {/* ══ 3. CRYPTO STRIP ════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiBitCoinLine size={16} />
              </div>
              <h2 className="text-xl font-black">العملات الرقمية</h2>
            </div>
            <Link
              href="/crypto"
              className="btn text-xs py-2 px-4 flex items-center gap-1"
            >
              كل العملات الرقمية <RiArrowLeftSLine size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {cryptoList.slice(0, 6).map((coin: MarketData) => {
              const change = coin.quote.USD.percent_change_1h;
              const isUp = change >= 0;
              const color = isUp ? "#22c55e" : "var(--color-destructive)";
              return (
                <Link
                  key={coin.id}
                  href={`/crypto/${coin.slug}`}
                  className="relative bg-card border border-border rounded-2xl p-3.5 flex flex-col gap-2 hover:border-primary-brand/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 overflow-hidden group"
                >
                  <div
                    className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-10 group-hover:opacity-20 pointer-events-none"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex items-center justify-between gap-1 relative z-10">
                    <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-mono border border-border">
                      {coin.symbol}
                    </span>
                    <ChangePill value={change} />
                  </div>
                  <p className="text-xs font-bold text-foreground truncate relative z-10 group-hover:text-primary-brand transition-colors">
                    {coin.name}
                  </p>
                  <p
                    className="text-sm font-black text-foreground tabular-nums relative z-10"
                    dir="ltr"
                  >
                    $
                    {coin.quote.USD.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: coin.quote.USD.price >= 1 ? 2 : 4,
                    })}
                  </p>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5 opacity-20 group-hover:opacity-50 transition-opacity"
                    style={{ backgroundColor: color }}
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ══ 4. WORLD MARKET INDICES ════════════════════════════════════════
             Layout: full-width "Bloomberg terminal" strip — dark bg, big numbers,
             horizontal scroll with region flags and heat-map rows           */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiGlobalLine size={16} />
              </div>
              <h2 className="text-xl font-black">المؤشرات العالمية</h2>
            </div>
            <Link
              href="/world-market"
              className="btn text-xs py-2 px-4 flex items-center gap-1"
            >
              كل المؤشرات <RiArrowLeftSLine size={14} />
            </Link>
          </div>

          <div className="relative bg-muted/30 dark:bg-dprimary rounded-3xl overflow-hidden border border-border dark:border-white/5 shadow-xl">
            {/* Scrollable indices */}
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex divide-x divide-border dark:divide-white/10 min-w-max">
                {worldIndices.slice(0, 10).map((item: WorldMarketItem) => (
                  <Link
                    key={item.id}
                    href={`/world-market/${item.slug}`}
                    className="group flex flex-col gap-2 px-5 py-4 hover:bg-primary-brand/5 dark:hover:bg-white/5 transition-colors min-w-35"
                  >
                    {/* Ticker + flag */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-bold text-muted-foreground font-mono uppercase tracking-widest">
                        {item.ticker.replace("^", "")}
                      </span>
                      <span className="text-[10px]">
                        {REGION_FLAG[item.region ?? ""] ?? "🌐"}
                      </span>
                    </div>

                    {/* Name */}
                    <p className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors truncate">
                      {item.title}
                    </p>

                    {/* Price */}
                    <p
                      className="text-lg font-black text-foreground tabular-nums group-hover:text-primary-brand transition-colors"
                      dir="ltr"
                    >
                      {item.price.toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}
                    </p>

                    {/* Change */}
                    <div className="flex items-center gap-1.5" dir="ltr">
                      <span
                        className={`text-[10px] font-black ${
                          item.positive
                            ? "text-green-500 dark:text-green-400"
                            : "text-destructive dark:text-red-400"
                        }`}
                      >
                        {item.positive ? "▲" : "▼"}{" "}
                        {Math.abs(item.changePercent).toFixed(2)}%
                      </span>
                    </div>

                    {/* Mini heat bar */}
                    <div className="h-0.5 rounded-full bg-border dark:bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.positive
                            ? "bg-green-500 dark:bg-green-400"
                            : "bg-destructive dark:bg-red-400"
                        }`}
                        style={{
                          width: `${Math.min(Math.abs(item.changePercent) * 20, 100)}%`,
                        }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Left fade */}
            <div className="absolute top-0 left-0 bottom-0 w-12 bg-linear-to-r from-muted/30 dark:from-dprimary to-transparent pointer-events-none" />
            {/* Right fade */}
            <div className="absolute top-0 right-0 bottom-0 w-12 bg-linear-to-l from-muted/30 dark:from-dprimary to-transparent pointer-events-none" />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiBuildingLine size={16} />
              </div>
              <h2 className="text-xl font-black">أسهم الشركات العالمية</h2>
            </div>
            <Link
              href="/world-stocks"
              className="btn text-xs py-2 px-4 flex items-center gap-1"
            >
              كل الأسهم <RiArrowLeftSLine size={14} />
            </Link>
          </div>

          {/* Sector grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stocksBySector.map(({ sector, stocks }, sectorIdx) => {
              // Alternate accent colours per sector for visual variety
              const accents = [
                "from-blue-500/10",
                "from-green-500/10",
                "from-orange-500/10",
                "from-purple-500/10",
                "from-cyan-500/10",
                "from-pink-500/10",
                "from-yellow-500/10",
                "from-teal-500/10",
              ];
              const accent = accents[sectorIdx % accents.length];
              return (
                <div
                  key={sector}
                  className={`relative bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary-brand/30 hover:shadow-md transition-all duration-200`}
                >
                  {/* Sector header */}
                  <div
                    className={`bg-linear-to-bl ${accent} to-transparent px-4 py-3 border-b border-border flex items-center justify-between`}
                  >
                    <span className="text-xs font-black text-foreground">
                      {sector}
                    </span>
                    <Link
                      href={`/world-stocks?sector=${encodeURIComponent(sector)}`}
                      className="text-[10px] font-black text-muted-foreground hover:text-primary-brand transition-colors flex items-center gap-0.5"
                    >
                      الكل <RiArrowLeftSLine size={12} />
                    </Link>
                  </div>

                  {/* Stock rows */}
                  <div className="divide-y divide-border">
                    {stocks.map((stock: WorldStock) => (
                      <Link
                        key={stock.id}
                        href={`/world-stocks/${stock.slug}`}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-primary-brand/5 transition-colors group/row"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-lg bg-primary-brand/10 flex items-center justify-center font-black text-primary-brand text-[9px] shrink-0">
                            {stock.ticker.replace(/\..+/, "").slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold text-foreground truncate group-hover/row:text-primary-brand transition-colors">
                              {stock.nameAr}
                            </p>
                            <p
                              className="text-[9px] text-right text-muted-foreground font-mono"
                              dir="ltr"
                            >
                              {stock.ticker}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 shrink-0">
                          <span
                            className="text-[11px] font-black text-foreground tabular-nums"
                            dir="ltr"
                          >
                            $
                            {stock.price.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <ChangePill value={stock.changePercent} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ 6. MAIN CONTENT + SIDEBAR ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ── Articles ── */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center justify-between">
    
              <div className="flex items-center gap-3">
              <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                <RiArticleLine size={16} />
              </div>
              <h2 className="text-2xl font-black">آخر الأخبار</h2>
            </div>
              <Link href="/articles" className="btn text-xs py-2 px-4">
                كل الأخبار <RiArrowLeftSLine size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.slice(2, 10).map((post) => (
                <ArtSquCard
                  key={post.sys.id}
                  article={post as Entry<ArticleSkeleton, undefined, string>}
                />
              ))}
            </div>
            <div className="bg-dprimary rounded-3xl p-6 md:p-8 text-white space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-primary-brand/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3">
                <RiFlashlightLine className="text-primary-brand" size={22} />
                <h3 className="font-black text-lg">أهم التحليلات الآن</h3>
              </div>
              <div className="relative z-10 space-y-2">
                {articles.slice(10, 14).map((post) => {
                  const fields = post.fields as Record<string, unknown>;
                  const imgUrl = getEntryImageUrl(fields.image);
                  const slug = fields.slug as string;
                  const title = fields.title as string;
                  return (
                    <Link
                      key={post.sys.id}
                      href={`/post/${slug}`}
                      className="flex items-center gap-4 group/item p-3 rounded-2xl hover:bg-white/5 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/10 overflow-hidden shrink-0">
                        <Image
                          src={imgUrl}
                          alt={title}
                          width={48}
                          height={48}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <p className="flex-1 text-sm font-black leading-snug group-hover/item:text-primary-brand transition-colors line-clamp-2">
                        {title}
                      </p>
                      <RiArrowLeftSLine
                        className="text-white/30 group-hover/item:text-primary-brand shrink-0 transition-colors"
                        size={20}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
            <Link
              href="/articles"
              className="flex items-center justify-center w-full py-5 border-2 border-dashed border-border rounded-3xl text-muted-foreground font-black text-sm hover:border-primary-brand hover:text-primary-brand transition-all duration-300"
            >
              ← تحميل المزيد من المقالات
            </Link>
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4 lg:sticky lg:top-34 space-y-6">
            {/* Crypto widget */}
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                    <RiBitCoinLine size={18} />
                  </div>
                  <h3 className="font-black text-base">العملات الرقمية</h3>
                </div>
                <Link
                  href="/crypto"
                  className="text-[10px] text-muted-foreground hover:text-primary-brand transition-colors font-bold"
                >
                  الكل
                </Link>
              </div>
              <div className="divide-y divide-border">
                {cryptoList.slice(0, 5).map((coin: MarketData) => {
                  const change = coin.quote.USD.percent_change_1h;
                  return (
                    <Link
                      key={coin.id}
                      href={`/crypto/${coin.slug}`}
                      className="flex items-center justify-between py-3 gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-7 h-7 rounded-lg bg-primary-brand/10 flex items-center justify-center font-black text-primary-brand text-[10px] shrink-0">
                          {coin.symbol[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground group-hover:text-primary-brand transition-colors truncate">
                            {coin.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className="text-xs font-black text-foreground tabular-nums"
                          dir="ltr"
                        >
                          $
                          {coin.quote.USD.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits:
                              coin.quote.USD.price >= 1 ? 2 : 4,
                          })}
                        </span>
                        <ChangePill value={change} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ETF widget */}
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                    <RiFundsLine size={18} />
                  </div>
                  <h3 className="font-black text-base">صناديق الاستثمار</h3>
                </div>
                <Link
                  href="/etfs"
                  className="text-[10px] text-muted-foreground hover:text-primary-brand transition-colors font-bold"
                >
                  الكل
                </Link>
              </div>
              <div className="divide-y divide-border">
                {etfs.slice(0, 5).map((item: ETFItem) => (
                  <Link
                    key={item.id}
                    href={`/etfs/${item.slug}`}
                    className="flex items-center justify-between py-3 gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground group-hover:text-primary-brand transition-colors truncate">
                        {item.title}
                      </p>
                      <p
                        className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest"
                        dir="ltr"
                      >
                        {item.ticker}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className="text-xs font-black text-foreground tabular-nums"
                        dir="ltr"
                      >
                        {item.point.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <ChangePill
                        value={
                          item.positive
                            ? item.changePercent
                            : -item.changePercent
                        }
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Commodities widget */}
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                  <RiLineChartLine size={18} />
                </div>
                <h3 className="font-black text-base">السوق دلوقتي</h3>
              </div>
              <div className="divide-y divide-border">
                {commodities.slice(0, 5).map((item: CommodityItem) => (
                  <Link
                    key={item.id}
                    href="/commodities"
                    className="flex items-center justify-between py-3 group"
                  >
                    <span className="text-sm font-bold text-foreground group-hover:text-primary-brand transition-colors truncate max-w-[55%]">
                      {item.nameAr}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className="text-sm font-black text-foreground tabular-nums"
                        dir="ltr"
                      >
                        {item.priceEGP.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                        <span className="text-[10px] text-muted-foreground font-bold mr-1">
                          ج.م
                        </span>
                      </span>
                      <ChangePill value={item.change} />
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                href="/commodities"
                className="block text-center text-xs font-black text-primary-brand underline underline-offset-4"
              >
                كل السلع والمعادن
              </Link>
            </div>

            {/* Newsletter */}
            <div className="bg-dprimary rounded-3xl p-6 text-white text-center relative overflow-hidden space-y-4">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-brand/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="w-10 h-10 bg-primary-brand/20 rounded-2xl flex items-center justify-center mx-auto">
                  <RiNewspaperLine className="text-primary-brand" size={20} />
                </div>
                <div>
                  <h4 className="font-black text-base">النشرة الإخبارية</h4>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    أهم ملخصات السوق المصري تصلك صباح كل يوم
                  </p>
                </div>
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary-brand placeholder:text-white/30 transition-colors"
                />
                <button className="cursor-pointer w-full bg-primary-brand hover:bg-primary-brand/90 py-3 rounded-2xl font-black text-sm transition-colors shadow-lg shadow-primary-brand/30">
                  اشترك الآن
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
