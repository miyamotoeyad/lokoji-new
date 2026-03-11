// components/Infographics/InfographicGrid.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiArrowLeftUpLine } from "@remixicon/react";

const CATEGORIES = [
  "الكل",
  "البورصة المصرية",
  "البورصة العالمية",
  "الكريبتو",
  "الأسهم",
  "الذهب",
  "العملات",
];

// Plain serializable type — no Contentful Entry objects
export interface InfographicCardData {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
}

export default function InfographicGrid({ infographics }: { infographics: InfographicCardData[] }) {
  const [active, setActive] = useState("الكل");

  const filtered =
    active === "الكل"
      ? infographics
      : infographics.filter((i) => i.category === active);

  return (
    <>
      {/* ── CATEGORY FILTER ── */}
      <div className="flex justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`cursor-pointer shrink-0 px-6 py-2.5 rounded-full font-black text-sm transition-all border-2 ${
              active === cat
                ? "border-primary-brand bg-primary-brand text-white"
                : "btn"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── GRID ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((info, index) => (
            <article key={info.id} className="group">
              <Link href={`/infographics/${info.slug}`} className="block">
                <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted border border-border shadow-md hover:shadow-xl hover:border-primary-brand/30 transition-all duration-500">
                  <Image
                    src={info.imageUrl}
                    alt={info.title}
                    fill
                    priority={index < 3}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 right-0 left-0 p-6 z-10">
                    <span className="inline-block text-[10px] font-black tracking-widest bg-primary-brand text-white px-3 py-1 rounded-full mb-3">
                      {info.category}
                    </span>
                    <h3 className="text-lg font-black text-white leading-snug mb-4 group-hover:text-primary-brand transition-colors duration-300 line-clamp-2">
                      {info.title}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-xs font-bold">{info.date}</span>
                      <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-primary-brand backdrop-blur-sm flex items-center justify-center transition-all duration-300">
                        <RiArrowLeftUpLine size={16} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <p className="text-foreground font-black text-xl">لا يوجد إنفوجرافيك في هذا القسم بعد</p>
          <button onClick={() => setActive("الكل")} className="btn text-sm px-6 py-2.5">
            عرض الكل
          </button>
        </div>
      )}
    </>
  );
}