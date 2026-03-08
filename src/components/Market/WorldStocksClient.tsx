"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiSearchLine,
  RiCloseLine,
} from "react-icons/ri";
import { type WorldStock } from "@/lib/Data/worldStocksData";

const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 2,
});

interface Props {
  stocks: WorldStock[];
  sectors: string[];
}

export default function WorldStocksClient({ stocks, sectors }: Props) {
  const [query, setQuery] = useState("");
  const [activesector, setActiveSector] = useState("الكل");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stocks.filter((s) => {
      const matchSector = activesector === "الكل" || s.sector === activesector;
      const matchQuery =
        !q ||
        s.nameAr.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.ticker.toLowerCase().includes(q);
      return matchSector && matchQuery;
    });
  }, [stocks, query, activesector]);

  return (
    <div className="space-y-6">
      {/* ── SEARCH BAR ── */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-muted-foreground">
          <RiSearchLine size={16} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن شركة أو رمز سهم..."
          className="w-full bg-card border border-border rounded-2xl py-3 pr-10 pl-10 text-sm font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-brand/30 focus:border-primary-brand/50 transition-all"
          dir="rtl"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RiCloseLine size={16} />
          </button>
        )}
      </div>

      {/* ── SECTOR PILLS ── */}
      <div className="relative">
        {/* Right fade */}
        <div className="absolute left-0 top-0 bottom-1 w-8 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`shrink-0 cursor-pointer text-xs font-black px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                activesector === sector
                  ? "bg-primary-brand text-white border-primary-brand shadow-sm"
                  : "bg-muted border-border text-muted-foreground hover:border-primary-brand/40 hover:text-foreground"
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULTS COUNT ── */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-bold">
          {filtered.length === stocks.length
            ? `${stocks.length} شركة`
            : `${filtered.length} نتيجة من ${stocks.length}`}
        </p>
        {(query || activesector !== "الكل") && (
          <button
            onClick={() => {
              setQuery("");
              setActiveSector("الكل");
            }}
            className="text-xs cursor-pointer font-black text-primary-brand hover:underline"
          >
            أمسح الفلاتر
          </button>
        )}
      </div>

      {/* ── TABLE ── */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-[1fr_6rem_5rem] md:grid-cols-[1fr_8rem_8rem_7rem_6rem] items-center px-4 md:px-6 py-3 border-b border-border bg-muted/50 gap-2 md:gap-4">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
            الشركة
          </span>
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
            السعر
          </span>
          <span className="hidden md:block text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
            رأس المال
          </span>
          <span className="hidden md:block text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
            القطاع
          </span>
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
            التغيير
          </span>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
              <RiSearchLine size={20} />
            </div>
            <p className="text-sm font-black text-muted-foreground">
              لا توجد نتائج لـ &quot;{query}&quot;
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActiveSector("الكل");
              }}
              className="text-xs font-black text-primary-brand hover:underline"
            >
              مسح البحث
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((stock, index) => (
              <Link
                key={stock.id}
                href={`/world-stocks/${stock.slug}`}
                className="grid grid-cols-[1fr_6rem_5rem] md:grid-cols-[1fr_8rem_8rem_7rem_6rem] items-center px-4 md:px-6 py-3 md:py-4 hover:bg-primary-brand/5 transition-colors duration-200 group gap-2 md:gap-4"
              >
                {/* Company */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-black text-muted-foreground tabular-nums w-5 shrink-0">
                    {index + 1}
                  </span>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center font-black text-primary-brand text-[10px] shrink-0">
                    {stock.ticker.replace(/\..+/, "").slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary-brand transition-colors truncate">
                      {stock.nameAr}
                    </p>
                    <p
                      className="text-[10px] text-right text-muted-foreground font-mono"
                      dir="ltr"
                    >
                      {stock.ticker} · {stock.exchange}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <p
                  className="text-xs md:text-sm font-black text-foreground tabular-nums"
                  dir="ltr"
                >
                  $
                  {stock.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

                {/* Market cap */}
                <p
                  className="hidden md:block text-xs text-muted-foreground font-bold tabular-nums"
                  dir="ltr"
                >
                  {stock.marketCap > 0
                    ? `$${formatter.format(stock.marketCap)}`
                    : "—"}
                </p>

                {/* Sector */}
                <div className="hidden md:flex justify-end">
                  <span className="text-[10px] text-left font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-lg border border-border">
                    {stock.sector}
                  </span>
                </div>

                {/* Change % */}
                <div className="flex justify-end">
                  <span
                    className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${
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
