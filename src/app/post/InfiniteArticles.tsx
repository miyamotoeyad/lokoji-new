"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Entry } from "contentful";
import { TypeArticlesSkeleton } from "@/types";
import { getNextArticles } from "@/actions/articleActions";
import ArticleUnit from "@/components/Articles/ArticleUnit";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";

interface Props {
  initial: Entry<TypeArticlesSkeleton, undefined, string>;
}

export default function InfiniteArticleFeed({ initial }: Props) {
  const [articles, setArticles] = useState([initial]);
  const [loadedSlugs, setLoadedSlugs] = useState(
    new Set([initial.fields.slug as string]),
  );
  const [exhausted, setExhausted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load next batch, skip already-loaded slugs
  const loadNext = useCallback(() => {
    const lastSlug = articles[articles.length - 1].fields.slug as string;

    startTransition(async () => {
      const next = await getNextArticles(lastSlug, 5);

      // Filter out any already shown
      const fresh = next.filter(
        (a) => !loadedSlugs.has(a.fields.slug as string),
      );

      if (fresh.length === 0) {
        setExhausted(true);
        return;
      }

      // Only append the first one at a time for a natural reading feel
      const nextArticle = fresh[0];
      setArticles((prev) => [...prev, nextArticle]);
      setLoadedSlugs(
        (prev) => new Set([...prev, nextArticle.fields.slug as string]),
      );
    });
  }, [articles, loadedSlugs]);

  // Watch sentinel at bottom of last article
  useEffect(() => {
    if (exhausted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPending) loadNext();
      },
      { rootMargin: "400px" }, // start fetching 400px before bottom
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loadNext, exhausted, isPending]);

  // Update URL + tab title as user reads each article
  const handleVisible = useCallback((slug: string, title: string) => {
    const newUrl = `/post/${slug}`;
    if (window.location.pathname !== newUrl) {
      window.history.replaceState({ slug }, title, newUrl);
      document.title = `${title} — لوكوجي`;
    }
  }, []);

  return (
    <div className="space-y-16">
      {articles.map((article) => (
        <ArticleUnit
          key={article.sys.id}
          data={article}
          onVisible={handleVisible}
        />
      ))}

      {/* Loading skeleton */}
      {isPending && (
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-muted rounded-2xl w-2/3" />
          <div className="h-64 bg-muted rounded-3xl" />
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded-xl" />
            <div className="h-4 bg-muted rounded-xl w-5/6" />
            <div className="h-4 bg-muted rounded-xl w-4/6" />
          </div>
        </div>
      )}

      {/* Sentinel */}
      {!exhausted && <div ref={sentinelRef} className="h-1" />}

      {/* End of feed */}
      {exhausted && (
        <div
          className="group flex flex-col items-center py-12 space-y-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-1 bg-primary-brand rounded-full" />
          <p className="text-sm text-muted-foreground font-bold">
            لا توجد مقالات أخرى
          </p>
          <Link
            href={"/articles"}
            className="group btn flex items-center justify-center gap-2 text-sm font-black"
          >
            <span>تصفح كل المقالات</span>
            <RiArrowLeftLine
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
          </Link>
        </div>
      )}
    </div>
  );
}
