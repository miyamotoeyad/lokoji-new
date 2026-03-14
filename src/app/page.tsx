import Link from "next/link";
import Image from "next/image";
import {
  RiFlashlightLine,
  RiArrowLeftSLine,
  RiLineChartLine,
  RiFireLine,
  RiArticleLine,
} from "@remixicon/react";

import { getServerData } from "@/lib/Data/serverData";

import { WORLD_STOCKS_CONFIG } from "@/lib/Array/WorldCompanyList";

import ArtSquCard from "@/components/Articles/ArtSquCard";
import { Entry, Asset, AssetFile } from "contentful";
import { ArticleSkeleton } from "@/types/contentfulType";

import dynamic from "next/dynamic";
import {
  SectionSkeleton,
  SidebarWidgetSkeleton,
} from "@/components/Home/Skeleton";
import NewsletterHome from "@/components/Client/Newsletter/NewsletterHome";

//  Next Dynamic
const [CryptoSidebar, CryptoTop] = [
  dynamic(
    () =>
      import("@/components/Home/CryptoSection").then(
        (mod) => mod.CryptoSidebar,
      ),
    {
      loading: () => <SidebarWidgetSkeleton />,
    },
  ),
  dynamic(
    () =>
      import("@/components/Home/CryptoSection").then((mod) => mod.CryptoTop),
    {
      loading: () => <SectionSkeleton height="h-48" />,
    },
  ),
];

const EgyMarketIndicesSection = dynamic(
  () => import("@/components/Home/EgyMarketIndicesSection"),
  {
    loading: () => <SectionSkeleton height="h-32" />,
  },
);

const WorldMarketIndicesSection = dynamic(
  () => import("@/components/Home/WorldMarketIndicesSection"),
  {
    loading: () => <SectionSkeleton height="h-16" rows={4} />,
  },
);

const ETFSection = dynamic(() => import("@/components/Home/ETFSection"), {
  loading: () => <SidebarWidgetSkeleton />,
});

const CommoditiesSection = dynamic(
  () => import("@/components/Home/CommoditiesSection"),
  {
    loading: () => <SidebarWidgetSkeleton />,
  },
);

// ── unique sectors list ───────────────────────────────────────────────────────
const SECTORS = Array.from(new Set(WORLD_STOCKS_CONFIG.map((s) => s.sector)));

async function getHomeData() {

  const {
    article,
    exchange,
    crypto,
    commodities,
    etf,
    egMarket,
    worldMarket,
    worldStocks,
  } = await getServerData();

  const egp = exchange.rates["EGP"] ?? 1;
  const widgetPairs = [
    { slug: "usd-egp", first: "USD", second: "EGP", num: egp.toFixed(2) },
    {
      slug: "eur-egp",
      first: "EUR",
      second: "EGP",
      num: (egp / exchange.rates["EUR"]).toFixed(2),
    },
    {
      slug: "gbp-egp",
      first: "GBP",
      second: "EGP",
      num: (egp / exchange.rates["GBP"]).toFixed(2),
    },
  ];

  return {
    articles: article,
    widgetPairs,
    etf,
    commodities,
    cryptoList: crypto.data,
    worldMarket,
    worldStocks,
    egMarket,
  };
}

function getEntryImageUrl(image: unknown, width = 800): string {
  const asset = image as Asset;
  const file = asset?.fields?.file as AssetFile | undefined;
  if (!file?.url) return "/no-image.png";
  return `https:${file.url}?w=${width}&fm=webp&q=75&fit=fill`;
}

export default async function Home() {
  const {
    articles,
    egMarket,
    widgetPairs,
    etf,
    commodities,
    cryptoList,
    // worldIndices,
    worldStocks,
  } = await getHomeData();

  const stocksBySector = SECTORS.map((sector) => ({
    sector,
    stocks: worldStocks.filter((s) => s.sector === sector).slice(0, 3),
  }))
    .filter((g) => g.stocks.length > 0)
    .slice(0, 8);

  const cryptoTop = cryptoList.slice(0, 6);
  const cryptoSidebar = cryptoList.slice(0, 5);

  return (
    <main className="min-h-screen transition-colors duration-500" dir="rtl">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* ══ 1. HERO BENTO ══════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 lg:row-span-2 relative rounded-3xl overflow-hidden md:min-h-130 group shadow-xl">
            <ArtSquCard
              article={articles[0] as Entry<ArticleSkeleton, undefined, string>}
              priority
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
              priority
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

        <CryptoTop cryptoTop={cryptoTop} />

        <EgyMarketIndicesSection egMarketData={egMarket} />

        <WorldMarketIndicesSection stocksBySector={stocksBySector} />

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
                  const imgUrl = getEntryImageUrl(fields.image, 96);
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
                          sizes="48px"
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
              className="flex items-center gap-7 justify-center w-full py-5 border-2 border-dashed border-border rounded-3xl text-muted-foreground font-black text-sm hover:border-primary-brand hover:text-primary-brand transition-all duration-300"
            >
              تحميل المزيد من المقالات <RiArrowLeftSLine size={14} />
            </Link>
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4 lg:sticky lg:top-34 space-y-6">
            {/* Crypto widget */}
            <CryptoSidebar cryptoSidebar={cryptoSidebar} />

            {/* ETF widget */}
            <ETFSection etfs={etf} />

            {/* Commodities widget */}
            <CommoditiesSection commodities={commodities} />

            {/* Newsletter */}
            <NewsletterHome />
          </aside>
        </div>
      </div>
    </main>
  );
}
