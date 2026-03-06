import { Metadata } from "next";
import Link from "next/link";
import { RiArchiveLine } from "react-icons/ri";
import { CatMenu } from "@/lib/Menus/categoryMenu";
import ArtSquCard from "@/components/Articles/ArtSquCard";
import getArticles from "@/utils/Content/getArticles";
import { Entry } from "contentful";
import { ArticleSkeleton } from "@/types/contentfulType";

const desc =
  "كل المقالات والآراء الاقتصادية هتلاقيها عندنا وبشكل مبسط وأخبار أول بأول - لوكوجي نبض الاقتصاد.";
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
const title = "الأرشيف الاقتصادي | مقالات لوكوجي";

export const metadata: Metadata = {
  title: "المقالات",
  description: desc,
  openGraph: { title, description: desc },
  alternates: { canonical: `${siteUrl}/articles` },
};

export default async function Page() {
  const data = await getArticles();

  return (
    <section className="max-w-7xl mx-auto px-4 py-10" dir="rtl">
      {/* ── PAGE HEADER ── */}
      <div className="mb-10 pb-8 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiArchiveLine size={20} />
          </div>
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
            الأرشيف الاقتصادي
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
          كل المقالات
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          استكشف أرشيفنا الكامل من التحليلات والتقارير الاقتصادية. من البورصة
          المصرية إلى سوق الكريبتو العالمي.
        </p>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
        <Link
          href="/articles"
          className="shrink-0 px-5 py-2 rounded-full font-black text-xs transition-all border-2 border-primary-brand bg-primary-brand text-white"
        >
          الكل
        </Link>
        {CatMenu.map((menu) => (
          <Link
            key={menu.id}
            href={`/articles/category/${menu.link}`}
            aria-label={menu.title}
            className="shrink-0 btn text-xs py-2 px-5 whitespace-nowrap"
          >
            {menu.title}
          </Link>
        ))}
      </div>

      {/* ── ARTICLE GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((article) => (
          <ArtSquCard
            key={article.sys.id}
            article={article as Entry<ArticleSkeleton, undefined, string>}
          />
        ))}
      </div>

      {/* ── LOAD MORE ── */}
      {data.length > 9 && (
        <div className="mt-16 flex justify-center">
          <button className="btn px-10 py-4 text-sm">
            تحميل المزيد من المقالات
          </button>
        </div>
      )}
    </section>
  );
}
