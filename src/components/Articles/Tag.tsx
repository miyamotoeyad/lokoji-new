"use client";

import Link from "next/link";
import { RiHashtag } from "@remixicon/react";
import { Entry } from "contentful";
import { TypeArticlesSkeleton } from "@/types";

interface TagProps {
  articles: Entry<TypeArticlesSkeleton, undefined, string>;
}

export default function Tag({ articles }: TagProps) {
  const tags = articles.fields.tag as string[] | undefined;

  if (!tags || tags.length === 0) return null;

  return (
    <div className="py-6" dir="rtl">

      {/* ── HEADER ── */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
          <RiHashtag size={14} />
        </div>
        <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          الكلمات الدالة
        </h2>
      </div>

      {/* ── TAGS ── */}
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="btn text-xs py-1.5 px-4"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </div>
  );
}