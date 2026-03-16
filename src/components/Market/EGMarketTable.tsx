"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiSearchLine,
} from "@remixicon/react";
import type { EGStock } from "@/lib/Data/egMarketData";

export default function EGMarketTable({
  stocks,
  sectors,
}: {
  stocks: EGStock[];
  sectors: string[];
}) {
  const [search, setSearch] = useState("");
  const [activeSector, setSector] = useState("الكل");

  const filtered = useMemo(
    () =>
      stocks.filter((s) => {
        const matchSector =
          activeSector === "الكل" || s.sector === activeSector;
        const matchSearch =
          s.titleAr.includes(search) ||
          s.titleEn.toLowerCase().includes(search.toLowerCase()) ||
          s.code.toLowerCase().includes(search.toLowerCase());
        return matchSector && matchSearch;
      }),
    [stocks, search, activeSector],
  );

  return (
    <div className="space-y-4">
      {/* ── SEARCH + SECTOR FILTER ── */}
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="flex items-center gap-3 bg-muted border-2 border-transparent focus-within:border-primary-brand focus-within:bg-card rounded-2xl px-4 py-2.5 flex-1 transition-all duration-300">
          <RiSearchLine size={16} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="ابحث عن شركة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-0 focus-within:ring-0 bg-transparent outline-none text-sm font-bold text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Sector filter — scrollable on mobile */}
        <div className="relative">
          {/* Right fade */}
          <div className="absolute -left-1 top-0 bottom-1 w-20 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                className={`cursor-pointer shrink-0 px-4 py-2 rounded-full font-black text-xs transition-all border-2 whitespace-nowrap ${
                  activeSector === s
                    ? "border-primary-brand bg-primary-brand text-white"
                    : "btn"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── COUNT ── */}
      <p className="text-xs text-muted-foreground font-bold">
        {filtered.length} شركة
        {activeSector !== "الكل" && ` في ${activeSector}`}
        {search && ` · نتائج "${search}"`}
      </p>

      {/* ── TABLE ── */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center px-4 md:px-6 py-4 border-b border-border bg-muted/50 gap-2 md:gap-3">
          <span className="w-5 md:w-6 shrink-0 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center">
            #
          </span>
          <span className="w-8 shrink-0 hidden md:block" />
          <span className="flex-1 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-right">
            الشركة
          </span>
          <span className="w-24 shrink-0 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center hidden md:block">
            القطاع
          </span>
          <span className="w-32 md:w-40 shrink-0 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
            السعر
          </span>
          <span className="w-16 md:w-20 shrink-0 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
            %
          </span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm font-bold">
            لا توجد نتائج لـ &quot;{search}&quot;
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((stock, index) => (
              <Link
                key={stock.id}
                href={`/eg-market/${stock.slug}`}
                className="flex items-center px-4 md:px-6 py-3.5 hover:bg-primary-brand/5 transition-colors duration-200 group gap-2 md:gap-3"
              >
                <span className="w-5 md:w-6 text-xs font-black text-muted-foreground tabular-nums shrink-0 text-center">
                  {index + 1}
                </span>

                <div className="hidden md:flex w-8 h-8 rounded-xl bg-primary-brand/10 items-center justify-center text-primary-brand text-xs font-black shrink-0">
                  {stock.titleAr[0]}
                </div>

                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary-brand transition-colors truncate leading-tight">
                    {stock.titleAr}
                  </p>
                  <p
                    className="text-[10px] text-muted-foreground font-mono"
                    dir="ltr"
                  >
                    {stock.code}
                  </p>
                </div>

                {/* Sector badge — desktop only */}
                <div className="w-24 shrink-0 hidden md:flex justify-center">
                  <span className="text-[10px] font-black text-primary-brand bg-primary-brand/10 px-2.5 py-1 rounded-full truncate max-w-full">
                    {stock.sector}
                  </span>
                </div>

                <div className="w-32 md:w-40 shrink-0 text-left" dir="ltr">
                  <p className="text-xs md:text-sm font-black text-foreground tabular-nums leading-tight">
                    {stock.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    <span className="text-[10px] text-muted-foreground font-bold ml-0.5">
                      EGP
                    </span>
                  </p>
                  <p
                    className={`text-[10px] font-bold tabular-nums ${stock.positive ? "text-green-500" : "text-destructive"}`}
                  >
                    {stock.positive ? "+" : "-"}
                    {stock.change.toFixed(2)}
                  </p>
                </div>

                <div className="w-16 md:w-20 flex justify-end shrink-0">
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 md:px-2 py-1 rounded-full whitespace-nowrap ${
                      stock.positive
                        ? "bg-green-500/10 text-green-500"
                        : "bg-destructive/10 text-destructive"
                    }`}
                    dir="ltr"
                  >
                    {stock.positive ? (
                      <RiArrowUpSFill size={11} />
                    ) : (
                      <RiArrowDownSFill size={11} />
                    )}
                    {Math.abs(stock.changePercent).toFixed(2)}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
