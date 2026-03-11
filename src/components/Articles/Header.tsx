"use client";

import Image from "next/image";
import {
  RiBallPenFill,
  RiTimeLine,
  RiCalendarCheckLine,
  RiRefreshLine,
} from "@remixicon/react";
import { Entry, Asset } from "contentful";
import { TypeArticlesSkeleton } from "@/types";
import { Document, Text, Block, Inline } from "@contentful/rich-text-types";
import Link from "next/link";

interface HeaderProps {
  articles: Entry<TypeArticlesSkeleton, undefined, string>;
}

function calculateReadingTime(richText: Document | undefined): string {
  if (!richText) return "قراءة سريعة";

  const getWords = (node: Block | Inline | Text | Document): string => {
    if ("nodeType" in node && node.nodeType === "text")
      return (node as Text).value ?? "";
    if ("content" in node && Array.isArray(node.content))
      return node.content.map(getWords).join(" ");
    return "";
  };

  const allText = getWords(richText);
  const minutes = Math.ceil(allText.split(/\s+/).filter(Boolean).length / 200);
  return minutes < 2 ? "دقيقة واحدة" : `${minutes} دقائق`;
}

const formatDate = (iso: string, weekday = false) =>
  new Date(iso).toLocaleDateString("ar-EG", {
    ...(weekday && { weekday: "long" }),
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function Header({ articles }: HeaderProps) {
  const { title, subtitle, category, image, author, content } = articles.fields;

  const imageAsset = image as unknown as Asset<undefined, string>;
  const imageUrl = imageAsset?.fields?.file?.url
    ? `https:${imageAsset.fields.file.url}`
    : "/no-image.png";

  const isAuthorResolved = author && "fields" in author;
  const authorName = isAuthorResolved
    ? (author.fields.name as string)
    : "أسرة لوكوجي";
  const authorSlug = isAuthorResolved ? (author.fields.slug as string) : "";

  const readingTime = content ? calculateReadingTime(content) : "قراءة سريعة";
  const publishDate = formatDate(
    articles.fields.publicationDate as string,
    true,
  );
  const updatedAt = articles.sys.updatedAt;

  // Only show updated date if it's meaningfully later than publish date (>1 day)
  const publishMs = new Date(
    articles.fields.publicationDate as string,
  ).getTime();
  const updatedMs = new Date(updatedAt).getTime();
  const showUpdated = updatedMs - publishMs > 86_400_000;
  const updatedDate = formatDate(updatedAt);

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      {/* CATEGORY BADGE */}
      <span className="inline-flex w-fit items-center bg-primary-brand/10 text-primary-brand border border-primary-brand/20 rounded-full px-4 py-1 text-[11px] font-black uppercase tracking-widest">
        {category as string}
      </span>

      {/* TITLE */}
      <h1 className="text-3xl md:text-5xl font-black leading-tight text-foreground">
        {title as string}
      </h1>

      {/* SUBTITLE */}
      {subtitle && (
        <p className="text-xl md:text-2xl font-medium text-muted-foreground leading-relaxed italic border-r-4 border-primary-brand/30 pr-6">
          {subtitle as string}
        </p>
      )}

      {/* META BAR */}
      <div className="flex flex-wrap items-center gap-y-4 gap-x-6 py-5 border-y border-border">
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary-brand">
            <RiBallPenFill size={18} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
              الكاتب
            </p>
            {isAuthorResolved ? (
              <Link
                href={`/author/${authorSlug}`}
                className="text-sm text-primary-brand font-black hover:underline transition-colors"
              >
                {authorName}
              </Link>
            ) : (
              <span className="text-sm font-black text-foreground">
                {authorName}
              </span>
            )}
          </div>
        </div>

        {/* Publish date */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary-brand">
            <RiCalendarCheckLine size={18} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
              تاريخ النشر
            </p>
            <p className="text-sm font-black text-foreground">{publishDate}</p>
          </div>
        </div>

        {/* Updated date — only shown when article was meaningfully updated */}
        {showUpdated && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-muted border border-border flex items-center justify-center text-primary-brand">
              <RiRefreshLine size={18} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                آخر تحديث
              </p>
              <p className="text-sm font-black text-foreground">
                {updatedDate}
              </p>
            </div>
          </div>
        )}

        {/* Reading time */}
        <div className="flex items-center gap-2 mr-auto bg-primary-brand/10 border border-primary-brand/20 px-4 py-2 rounded-2xl">
          <RiTimeLine className="text-primary-brand" size={16} />
          <span className="text-xs font-black text-primary-brand">
            وقت القراءة: {readingTime}
          </span>
        </div>
      </div>

      {/* FEATURED IMAGE */}
      <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-xl">
        <Image
          src={imageUrl}
          alt={(title as string) || "Blog Image"}
          fill
          priority
          className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          sizes="(max-width: 1280px) 100vw, 1150px"
        />
      </div>
    </div>
  );
}
