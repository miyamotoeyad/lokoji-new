"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiCalendar2Line, RiArrowLeftSLine } from "@remixicon/react";

export interface RelatedArticleData {
  id: string;
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
  date: string;
  relevanceScore: number;
}

const INITIAL_COUNT = 5;
const LOAD_MORE_COUNT = 3;

export default function AlsoReadClient({ articles }: { articles: RelatedArticleData[] }) {
  const [visible, setVisible] = useState(INITIAL_COUNT);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = visible < articles.length;
  const shown = articles.slice(0, visible);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible((prev) => Math.min(prev + LOAD_MORE_COUNT, articles.length));
        }
      },
      { rootMargin: "100px" }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [hasMore, articles.length]);

  return (
    <div className="flex flex-col gap-3">
      {shown.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.slug}`}
          className="group flex gap-3 p-3 rounded-2xl bg-card border border-border hover:border-primary-brand/30 hover:shadow-md transition-all duration-300"
          dir="rtl"
        >
          {/* Thumbnail */}
          <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl">
            <Image
              alt={post.title}
              src={post.imageUrl}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-1 right-1 bg-primary-brand text-[8px] font-black text-white px-2 py-0.5 rounded-md lg:hidden">
              {post.category}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col justify-between py-1 grow min-w-0">
            <div>
              <span className="hidden lg:block text-[10px] font-black text-primary-brand uppercase tracking-widest mb-1">
                {post.category}
              </span>
              <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary-brand transition-colors duration-200 line-clamp-2">
                {post.title}
              </h3>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                <RiCalendar2Line size={12} />
                <span>{post.date}</span>
              </div>
              {/* Relevance indicator — shows fire for highly related */}
              {post.relevanceScore > 0 && (
                <span className="text-[9px] font-black text-primary-brand bg-primary-brand/10 px-1.5 py-0.5 rounded-md">
                  ذات صلة
                </span>
              )}
              <RiArrowLeftSLine
                size={16}
                className="text-primary-brand opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              />
            </div>
          </div>
        </Link>
      ))}

      {/* Loading skeletons */}
      {hasMore && (
        <>
          <div ref={sentinelRef} className="h-1" />
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-2xl border border-border animate-pulse">
                <div className="w-20 h-20 shrink-0 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-muted rounded-lg w-1/3" />
                  <div className="h-3 bg-muted rounded-lg" />
                  <div className="h-3 bg-muted rounded-lg w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* End state */}
      {!hasMore && articles.length > INITIAL_COUNT && (
        <p className="text-center text-[10px] text-muted-foreground font-bold py-2">
          تم عرض كل المقالات ذات الصلة
        </p>
      )}
    </div>
  );
}