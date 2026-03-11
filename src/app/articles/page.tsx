import { Metadata } from "next";
import Link from "next/link";
import { RiArchiveLine } from "@remixicon/react";
import { CatMenu } from "@/lib/Menus/categoryMenu";
import ArtSquCard from "@/components/Articles/ArtSquCard";
import { getArticlesPaginated } from "@/utils/Content/getArticles"; // ← remove getArticles
import { Entry } from "contentful";
import { ArticleSkeleton } from "@/types/contentfulType";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import { Pagination } from "@/components/Articles/Pagination/Pagination";
import { PaginationSchema } from "@/components/Articles/Pagination/PaginationSchema";
import { redirect } from "next/navigation";

const description =
  "كل المقالات والآراء الاقتصادية هتلاقيها عندنا وبشكل مبسط وأخبار أول بأول - لوكوجي نبض الاقتصاد.";
const title = "الأرشيف الاقتصادي | مقالات لوكوجي";

// app/articles/page.tsx
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const { totalPages } = await getArticlesPaginated(
    currentPage,
    ARTICLES_PER_PAGE,
  );

  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "http://localhost:3000";
  const baseUrl = `${siteUrl}/articles`;

  // Clamp: if someone requests ?page=999 but only 5 pages exist, canonical points to last real page
  const clampedPage = Math.min(currentPage, totalPages);
  const canonicalUrl =
    clampedPage === 1 ? baseUrl : `${baseUrl}?page=${clampedPage}`;

  return {
    ...generateStaticMetadata({ title, description, url: "/articles" }),
    alternates: {
      canonical: canonicalUrl, // ← tells Google the real URL
    },
    // prev/next tell Google the pagination chain
    ...(currentPage > 1 && {
      other: {
        "link-prev":
          currentPage === 2 ? baseUrl : `${baseUrl}?page=${currentPage - 1}`,
      },
    }),
    ...(currentPage < totalPages && {
      other: {
        "link-next": `${baseUrl}?page=${currentPage + 1}`,
      },
    }),
  };
}

const ARTICLES_PER_PAGE = 12;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));

  const { items, totalPages } = await getArticlesPaginated(currentPage, ARTICLES_PER_PAGE);

  // Redirect out-of-range requests — Googlebot won't index phantom pages
  if (currentPage > totalPages) {
    redirect(`/articles?page=${totalPages}`);
  }

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
        {items.map(
          (
            article,
            index, // ← items, not data
          ) => (
            <ArtSquCard
              key={article.sys.id}
              article={article as Entry<ArticleSkeleton, undefined, string>}
              priority={index < 3} // ← only first row preloads
            />
          ),
        )}
      </div>

      {/* ── PAGINATION ── */}
      <Pagination currentPage={currentPage} totalPages={totalPages} />

      {/* ── SCHEMA ── */}
      <PaginationSchema
        articles={items as Entry<ArticleSkeleton, undefined, string>[]}
        currentPage={currentPage}
      />
    </section>
  );
}
