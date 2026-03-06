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
} from "react-icons/ri";

import { getExchangeRates } from "@/lib/Data/exchangeData";
import { getETFs, type ETFItem } from "@/lib/Data/etfData";
import { getCommodities, type CommodityItem } from "@/lib/Data/commoditiesData";
import { client } from "@/utils/contentful";

import ArtSquCard from "@/components/Articles/ArtSquCard";
import { Entry, Asset, AssetFile } from "contentful";
import { ArticleSkeleton } from "@/types/contentfulType";

async function getHomeData() {
  // ✅ Single Promise.all — no nesting
  const [contentfulRes, exchangeRes, etfs, commodities] = await Promise.all([
    client.getEntries({ content_type: "articles", order: ["-sys.createdAt"] }),
    getExchangeRates("USD"),
    getETFs(),
    getCommodities(),
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

  // ✅ Return commodities
  return { articles: contentfulRes.items, widgetPairs, etfs, commodities };
}

function getEntryImageUrl(image: unknown): string {
  const asset = image as Asset;
  const file = asset?.fields?.file as AssetFile | undefined;
  return file?.url ? `https:${file.url}` : "/no-image.png";
}

export default async function Home() {
  // ✅ Destructure commodities
  const { articles, widgetPairs, etfs, commodities } = await getHomeData();

  return (
    <main className="min-h-screen transition-colors duration-500" dir="rtl">
      <div className="container mx-auto px-4 py-8 space-y-16">
        {/* ── HERO: BENTO MAGAZINE GRID ── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* ❶ MEGA FEATURE */}
          <div className="lg:col-span-7 lg:row-span-2 relative rounded-3xl overflow-hidden min-h-130 group shadow-xl">
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

          {/* ❷ TOP-RIGHT CARD */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden min-h-62 relative group shadow-md">
            <ArtSquCard
              article={articles[1] as Entry<ArticleSkeleton, undefined, string>}
              variant="hero"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          {/* ❸ EXCHANGE WIDGET */}
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

        {/* ── HOT TOPICS ── */}
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

        {/* ── MAIN CONTENT + SIDEBAR ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ── LEFT: NEWS GRID ── */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-1 h-8 bg-primary-brand rounded-full block" />
                <h2 className="text-2xl font-black">آخر الأخبار</h2>
              </div>
              <Link href="/articles" className="btn text-xs py-2 px-4">
                كل الأخبار
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

            {/* ── FEATURED ANALYSIS STRIP ── */}
            <div className="bg-dprimary rounded-3xl p-8 text-white space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-40 h-40 bg-primary-brand/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3 mb-2">
                <RiFlashlightLine className="text-primary-brand" size={22} />
                <h3 className="font-black text-lg text-white">
                  أهم التحليلات الآن
                </h3>
              </div>
              <div className="relative z-10 space-y-4">
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
                      <div className="w-14 h-14 rounded-2xl bg-white/10 overflow-hidden shrink-0">
                        <Image
                          src={imgUrl}
                          alt={title}
                          width={56}
                          height={56}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black leading-snug group-hover/item:text-primary-brand transition-colors line-clamp-2">
                          {title}
                        </p>
                      </div>
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

          {/* ── RIGHT: STICKY SIDEBAR ── */}
          <aside className="lg:col-span-4 lg:sticky lg:top-34 space-y-6">
            {/* ── ETF WIDGET ── */}
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
                    href={`/etfs/${item.slug}`}
                    key={item.id}
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
                      <span
                        className={`inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full ${
                          item.positive
                            ? "bg-green-500/10 text-green-500"
                            : "bg-destructive/10 text-destructive"
                        }`}
                        dir="ltr"
                      >
                        {item.positive ? (
                          <RiArrowUpSFill size={11} />
                        ) : (
                          <RiArrowDownSFill size={11} />
                        )}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── COMMODITIES WIDGET ── */}
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                  <RiLineChartLine size={18} />
                </div>
                <h3 className="font-black text-base">السوق دلوقتي</h3>
              </div>

              <div className="divide-y divide-border">
                {commodities.slice(0, 5).map((item: CommodityItem) => {
                  const positive = item.change >= 0;
                  return (
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
                        <span
                          className={`inline-flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full ${
                            positive
                              ? "bg-green-500/10 text-green-500"
                              : "bg-destructive/10 text-destructive"
                          }`}
                          dir="ltr"
                        >
                          {positive ? (
                            <RiArrowUpSFill size={10} />
                          ) : (
                            <RiArrowDownSFill size={10} />
                          )}
                          {Math.abs(item.change).toFixed(1)}%
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/commodities"
                className="block text-center text-xs font-black text-primary-brand underline underline-offset-4 mt-2"
              >
                كل السلع والمعادن
              </Link>
            </div>

            {/* ── NEWSLETTER ── */}
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
