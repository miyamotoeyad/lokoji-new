"use client";

import { RiRadioButtonLine } from "react-icons/ri";
import type { TickerItem } from "@/lib/Data/tickerData";

interface Props {
  scrolled: boolean;
  items:    TickerItem[];
}

export default function MarketTickerBar({ scrolled, items }: Props) {
  return (
    <div
      className={`w-full border-b border-border bg-card sticky z-40 transition-all duration-300 ${
        scrolled ? "top-15.25" : "top-16"
      }`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center gap-3">

        {/* Live badge — always visible, never scrolls */}
        <div className="shrink-0 flex items-center gap-1.5 bg-destructive/10 border border-destructive/20 px-3 py-1 rounded-full">
          <RiRadioButtonLine className="text-destructive animate-pulse" size={10} />
          <span className="text-[10px] font-black text-destructive hidden sm:inline">مباشر</span>
        </div>

        {/* Scrollable ticker + fade masks */}
        <div className="relative flex-1 min-w-0">

          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-card to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-card to-transparent z-10 pointer-events-none" />

          {/* Scrollable row */}
          <div className="flex items-center divide-x divide-border overflow-x-auto no-scrollbar">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 px-5 whitespace-nowrap"
              >
                <span className="text-[11px] font-bold text-muted-foreground">
                  {item.title}
                </span>
                <span
                  className={`text-[11px] font-black tabular-nums ${
                    item.arrow === "up" ? "text-destructive" : "text-green-500"
                  }`}
                  dir="ltr"
                >
                  {item.num}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}