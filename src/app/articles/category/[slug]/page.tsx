import { notFound } from "next/navigation";
import { Entry } from "contentful";
import { RiPriceTag3Line } from "react-icons/ri";
import Link from "next/link";

import { CatMenu } from "@/lib/Menus/categoryMenu";
import { ArticleSkeleton } from "@/types/contentfulType";
import ArtSquCard from "@/components/Articles/ArtSquCard";
import getArticles from "@/utils/Content/getArticles";
import { CategoryParams, generateCategoryMetadata } from "@/lib/MetaData/generateCategoryMetadata";

type Params = Promise<{ slug: string }>;

// ── Static paths ──
export async function generateStaticParams() {
  return CatMenu.map((item) => ({ slug: item.link.toString() }));
}

// ── Metadata ──
export async function generateMetadata({ params }: { params: CategoryParams }) {
  return generateCategoryMetadata({ params });
}

// ── Page ──
export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;

  const navTitle = CatMenu.find((item) => item.link.toString() === slug);
  if (!navTitle) return notFound();

  const allArticles = await getArticles();

  const filtered = allArticles.filter((article) =>
    ((article.fields.category as string) ?? "").includes(navTitle.title)
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-10" dir="rtl">

      {/* ── PAGE HEADER ── */}
      <div className="mb-10 pb-8 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiPriceTag3Line size={20} />
          </div>
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
            تصفح القسم
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
          {navTitle.title}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          كل المقالات والتحليلات الخاصة بقسم{" "}
          <span className="text-primary-brand font-black">{navTitle.title}</span>
        </p>
      </div>

      {/* ── CATEGORY FILTER ── */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
        <Link
          href="/articles"
          className="shrink-0 btn text-xs py-2 px-5 whitespace-nowrap"
        >
          الكل
        </Link>
        {CatMenu.map((menu) => (
          <Link
            key={menu.id}
            href={`/articles/category/${menu.link}`}
            aria-label={menu.title}
            className={`shrink-0 text-xs py-2 px-5 whitespace-nowrap rounded-full font-black transition-all border-2 ${
              menu.link.toString() === slug
                ? "border-primary-brand bg-primary-brand text-white"
                : "btn"
            }`}
          >
            {menu.title}
          </Link>
        ))}
      </div>

      {/* ── ARTICLE GRID ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArtSquCard
              key={article.sys.id}
              article={article as Entry<ArticleSkeleton, undefined, string>}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center">
            <RiPriceTag3Line size={28} className="text-muted-foreground" />
          </div>
          <p className="text-foreground font-black text-xl">لا يوجد مقالات في هذا القسم بعد</p>
          <p className="text-muted-foreground text-sm">جرب قسم تاني أو ارجع للأرشيف الكامل</p>
          <Link href="/articles" className="btn text-sm px-6 py-2.5 mt-2">
            كل المقالات
          </Link>
        </div>
      )}
    </section>
  );
}