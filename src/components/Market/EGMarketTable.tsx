"use client";

import { useState } from "react";
import Link from "next/link";
import { RiArrowUpSFill, RiArrowDownSFill, RiSearchLine } from "@remixicon/react";
import type { EGStock } from "@/lib/Data/egMarketData";

export default function EGMarketTable({ stocks }: { stocks: EGStock[] }) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? stocks.filter(
        (s) =>
          s.titleAr.includes(query) ||
          s.titleEn.toLowerCase().includes(query.toLowerCase()) ||
          s.code.toLowerCase().includes(query.toLowerCase()),
      )
    : stocks;

  return (
    <div className="space-y-4">
      {/* ── Search bar ── */}
      <div className="flex items-center gap-3 bg-muted border border-border rounded-2xl px-4 py-3 focus-within:border-primary-brand/50 focus-within:bg-card transition-all duration-200">
        <RiSearchLine size={16} className="text-muted-foreground shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث باسم الشركة أو الرمز..."
          className="flex-1 border-0 focus-within:border-card ring-0 bg-transparent text-sm font-bold text-foreground placeholder:text-muted-foreground outline-none"
          dir="rtl"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-[10px] font-black text-muted-foreground hover:text-primary-brand transition-colors cursor-pointer shrink-0"
          >
            مسح
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="grid grid-cols-[2rem_1fr_6rem] md:grid-cols-[2rem_1fr_5rem_7rem_7rem] items-center px-4 md:px-6 py-4 border-b border-border bg-muted/50 gap-3 md:gap-4">
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
            #
          </span>
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
            الشركة
          </span>
          {/* Mobile: just "التغيير" | Desktop: رمز + سعر + تغيير */}
          <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left md:hidden">
            التغيير
          </span>
          <span className="hidden md:block text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
            الرمز
          </span>
          <span className="hidden md:block text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
            السعر
          </span>
          <span className="hidden md:block text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left">
            التغيير
          </span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground font-bold">
                لا توجد نتائج لـ &quot;{query}&quot;
              </p>
            </div>
          ) : (
            filtered.map((stock, index) => (
              <Link
                key={stock.id}
                href={`/eg-market/${stock.slug}`}
                className="grid grid-cols-[2rem_1fr_6rem] md:grid-cols-[2rem_1fr_5rem_7rem_7rem] items-center px-4 md:px-6 py-4 hover:bg-primary-brand/5 transition-colors duration-200 group gap-3 md:gap-4"
              >
                {/* Index */}
                <span className="text-xs font-black text-muted-foreground tabular-nums">
                  {index + 1}
                </span>

                {/* Avatar + Name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-primary-brand/10 flex items-center justify-center font-black text-primary-brand text-xs md:text-sm shrink-0">
                    {stock.titleAr[0]}
                  </div>
                  <div className="min-w-0 text-right">
                    <p className="text-xs md:text-sm font-bold text-foreground group-hover:text-primary-brand transition-colors truncate">
                      {stock.titleAr}
                    </p>
                    <p
                      className="text-[10px] text-muted-foreground font-mono mt-0.5"
                      dir="ltr"
                    >
                      {stock.code}
                      <span className="md:hidden font-black text-foreground">
                        {" · "}
                        {stock.price.toLocaleString("en-US", {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Mobile: change pill only ── Desktop: hidden (rendered separately below) */}
                <div className="md:hidden flex justify-end">
                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-black ${
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
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>

                {/* Ticker badge — desktop only */}
                <div className="hidden md:flex justify-end">
                  <span
                    className="text-[10px] text-right font-black text-muted-foreground bg-muted px-2 py-1 rounded-lg font-mono"
                    dir="ltr"
                  >
                    {stock.code}
                  </span>
                </div>

                {/* Price — desktop only */}
                <div className="hidden md:flex justify-end">
                  <p
                    className="text-sm font-black text-foreground tabular-nums text-right"
                    dir="ltr"
                  >
                    {stock.price.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                    <span className="text-[10px] text-muted-foreground font-bold mr-1">
                      EGP
                    </span>
                  </p>
                </div>

                {/* Change pill — desktop only */}
                <div className="hidden md:inline-flex justify-end">
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black w-fit ${
                      stock.positive
                        ? "bg-green-500/10 text-green-500"
                        : "bg-destructive/10 text-destructive"
                    }`}
                    dir="ltr"
                  >
                    {stock.positive ? (
                      <RiArrowUpSFill size={13} />
                    ) : (
                      <RiArrowDownSFill size={13} />
                    )}
                    {stock.changePercent.toFixed(2)}%
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Row count */}
      {query && (
        <p className="text-xs text-muted-foreground font-bold text-center">
          {filtered.length} نتيجة من أصل {stocks.length} شركة
        </p>
      )}
    </div>
  );
}
