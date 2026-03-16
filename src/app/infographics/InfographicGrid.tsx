"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RiArrowLeftUpLine } from "@remixicon/react";

export interface InfographicCardData {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
}

export default function InfographicGrid({
  infographics,
  categories = ["الكل"],
}: {
  infographics: InfographicCardData[];
  categories?: string[];
}) {
  const [active, setActive] = useState("الكل");

  const filtered =
    active === "الكل"
      ? infographics
      : infographics.filter((i) => i.category === active);

  return (
    <div className="space-y-8">

      {/* ── CATEGORY FILTER ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`cursor-pointer shrink-0 px-4 md:px-6 py-2 md:py-2.5 rounded-full font-black text-xs md:text-sm transition-all border-2 whitespace-nowrap ${
              active === cat
                ? "border-primary-brand bg-primary-brand text-white"
                : "btn"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── COUNT ── */}
      <p className="text-xs text-muted-foreground font-bold text-center">
        {filtered.length} إنفوجرافيك
        {active !== "الكل" && ` في ${active}`}
      </p>

      {/* ── GRID ── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
          {filtered.map((info, index) => (
            <article key={info.id} className="group">
              <Link href={`/infographics/${info.slug}`} className="block">
                <div className="relative aspect-3/4 md:aspect-4/5 overflow-hidden rounded-2xl md:rounded-3xl bg-muted border border-border shadow-md hover:shadow-xl hover:border-primary-brand/30 transition-all duration-500">
                  <Image
                    src={info.imageUrl}
                    alt={info.title}
                    fill
                    priority={index < 4}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 right-0 left-0 p-3 md:p-6 z-10">
                    {/* Category badge */}
                    <span className="inline-block text-[9px] md:text-[10px] font-black tracking-widest bg-primary-brand text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full mb-2 md:mb-3">
                      {info.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-sm md:text-lg font-black text-white leading-snug mb-2 md:mb-4 group-hover:text-primary-brand transition-colors duration-300 line-clamp-2">
                      {info.title}
                    </h3>

                    {/* Footer */}
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-[10px] md:text-xs font-bold hidden sm:block">
                        {info.date}
                      </span>
                      <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/10 group-hover:bg-primary-brand backdrop-blur-sm flex items-center justify-center transition-all duration-300 mr-auto sm:mr-0">
                        <RiArrowLeftUpLine size={14} className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center gap-4">
          <p className="text-foreground font-black text-lg md:text-xl">
            لا يوجد إنفوجرافيك في هذا القسم بعد
          </p>
          <button onClick={() => setActive("الكل")} className="btn text-sm px-6 py-2.5">
            عرض الكل
          </button>
        </div>
      )}
    </div>
  );
}