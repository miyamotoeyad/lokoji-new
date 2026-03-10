"use client";

import { useEffect, useRef } from "react";
import { Entry } from "contentful";
import { TypeArticlesSkeleton, TypeAuthorsSkeleton } from "@/types";
import Header from "@/components/Articles/Header";
import Content from "@/components/Articles/Content";
import Share from "@/components/Articles/Share";
import Tag from "@/components/Articles/Tag";
import { AuthorDetailsCard } from "@/components/Articles/AuthorDetailsCard";

interface Props {
  data: Entry<TypeArticlesSkeleton, undefined, string>;
  onVisible?: (slug: string, title: string) => void; // fires when article scrolls into view
}

export default function ArticleUnit({ data, onVisible }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isAuthorResolved = data.fields.author && "fields" in data.fields.author;

  // Update URL + tab title as user scrolls into each article
  useEffect(() => {
    const el = ref.current;
    if (!el || !onVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onVisible(data.fields.slug as string, data.fields.title as string);
        }
      },
      { threshold: 0.2 } // fires when 20% of article is visible
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [data.fields.slug, data.fields.title, onVisible]);

  return (
    <article
      ref={ref}
      data-slug={data.fields.slug}
      className="space-y-10 border-t-4 border-primary-brand/20 pt-10 first:border-t-0 first:pt-0"
    >
      <header>
        <Header articles={data} />
      </header>

      <div
        className="prose prose-lg dark:prose-invert max-w-none
          prose-headings:font-black prose-headings:text-foreground
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-a:text-primary-brand prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-primary-brand prose-blockquote:text-muted-foreground
          prose-strong:text-foreground prose-img:rounded-3xl prose-img:shadow-lg"
      >
        <Content articles={data} />
      </div>

      <div className="border-t border-border pt-8 space-y-8">
        <Share articles={data.fields} />
        <Tag articles={data} />
        {isAuthorResolved ? (
          <AuthorDetailsCard
            authorEntry={data.fields.author as Entry<TypeAuthorsSkeleton, undefined, string>}
          />
        ) : (
          <div className="p-4 bg-muted rounded-xl text-center text-sm">
            أسرة تحرير لوكوجي
          </div>
        )}
      </div>
    </article>
  );
}