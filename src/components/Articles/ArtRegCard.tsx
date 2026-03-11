"use client";

import { ArticleSkeleton } from "@/types/contentfulType";
import { Asset, AssetFile, Entry } from "contentful";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { RiCalendar2Line, RiArrowLeftLine } from "@remixicon/react";

interface ArtRegCardProps {
  article: Entry<ArticleSkeleton, undefined, string>;
  priority?: boolean;
}

export default function ArtRegCard({
  article,
  priority = false,
}: ArtRegCardProps) {
  // Safety check to prevent crash if data is still loading or missing
  if (!article || !article.fields) return null;

  const { title, slug, image, category, subtitle } = article.fields;

  const asset = image as Asset;
  const file = asset?.fields?.file as AssetFile | undefined;
  const rawUrl = file?.url ? `https:${file.url}` : null;
  const imageUrl = rawUrl
    ? `${rawUrl}?w=900&fm=webp&q=75&fit=fill`
    : "/no-image.png";

  return (
    <Link
      href={`/post/${slug}`}
      className="group flex flex-col lg:flex-row gap-8 p-6 lg:p-8 rounded-[2.5rem] bg-white dark:bg-dprimary shadow-xl hover:shadow-2xl border border-slate-100 dark:border-dlight/30 transition-all duration-500"
      dir="rtl"
    >
      {/* 1. Image Section - Takes 45% of width on desktop */}
      <div className="relative w-full lg:w-[45%] aspect-video lg:aspect-square xl:aspect-video overflow-hidden rounded-[2rem] shrink-0">
        <Image
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          alt={title || "صورة المقال"}
          src={imageUrl}
          fill
          priority={priority} // 👈 was hardcoded true
          sizes="(max-width: 1024px) 100vw, 45vw"
        />
        {/* Category Overlay for Mobile */}
        <div className="absolute top-4 right-4 lg:hidden bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold">
          {category}
        </div>
      </div>

      {/* 2. Content Section */}
      <div className="flex flex-col justify-between py-2 grow">
        <div>
          {/* Category Badge - Desktop */}
          <div className="hidden lg:inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl px-5 py-2 mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
            <span className="w-2 h-2 rounded-full bg-primary group-hover:bg-white animate-pulse" />
            <span className="text-sm font-black uppercase tracking-widest">
              {category}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-slate-900 dark:text-white mb-6 group-hover:text-primary transition-colors duration-300">
            {title}
          </h2>

          {/* Optional: Summary (if you have this field in Contentful) */}
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed line-clamp-3 mb-8">
            {subtitle ||
              "تابع آخر التطورات والتحليلات الحصرية حول هذا الموضوع عبر لوكوجي، حيث نقدم لك الرؤية الكاملة للسوق المصري والعالمي."}
          </p>
        </div>

        {/* Footer: Date & Call to Action */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-dlight pt-6">
          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 font-bold">
            <RiCalendar2Line size={20} className="text-primary" />
            <span>
              {new Date(article.fields.publicationDate).toLocaleDateString(
                "ar-EG",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-primary font-black group-hover:gap-4 transition-all">
            <span className="hidden sm:inline">اقرأ التفاصيل</span>
            <RiArrowLeftLine size={24} />
          </div>
        </div>
      </div>
    </Link>
  );
}
