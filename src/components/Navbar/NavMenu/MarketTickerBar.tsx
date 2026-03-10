"use client";

import { RiRadioButtonLine } from "react-icons/ri";
import type { TickerItem } from "@/lib/Data/tickerData";

interface Props {
  scrolled: boolean;
  items: TickerItem[];
}

export default function MarketTickerBar({ scrolled, items }: Props) {
  // If no items, return a skeleton to prevent CLS (Cumulative Layout Shift)
  if (!items || items.length === 0) {
    return <div className="h-10.25 w-full border-b border-border bg-card" />;
  }

  // Duplicate items for a seamless infinite loop
  const duplicatedItems = [...items, ...items];

  return (
    <div
      className={`w-full border-b border-border bg-card sticky z-40 transition-transform duration-300 h-10.25 overflow-hidden ${
        scrolled ? "top-15.25" : "top-16"
      }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center gap-3">
        
        {/* Live badge — High contrast for visibility */}
        <div className="shrink-0 flex items-center gap-1.5 bg-destructive/10 border border-destructive/20 px-3 py-1 rounded-full z-20">
          <RiRadioButtonLine className="text-destructive animate-pulse" size={10} />
          <span className="text-[10px] font-black text-destructive hidden sm:inline">مباشر</span>
        </div>

        {/* The Ticker Wrapper */}
        <div className="relative flex-1 overflow-hidden h-full flex items-center">
          
          {/* Fade masks for better aesthetics */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-card to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-card to-transparent z-10 pointer-events-none" />

          {/* Animated Row */}
          <div 
            className="flex items-center gap-0 animate-marquee hover:[animation-play-state:paused]"
            style={{ 
              // Adjust timing based on number of items
              animationDuration: `${items.length * 5}s` 
            }}
          >
            {duplicatedItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex items-center gap-2 px-6 whitespace-nowrap border-r border-border last:border-r-0"
              >
                <span className="text-[11px] font-bold text-muted-foreground">
                  {item.title}
                </span>
                <span
                  className={`text-[11px] font-black tabular-nums ${
                    item.arrow === "up" ? "text-green-500" : "text-destructive"
                  }`}
                  dir="ltr"
                >
                  {/* Common Fix: Use Arabic/Egyptian market standard (Green Up, Red Down) */}
                  {item.arrow === "up" ? "▲" : "▼"} {item.num}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); } /* Halfway because items are duplicated */
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee linear infinite;
        }
        /* Handle RTL: Invert the scroll direction for Arabic if needed */
        [dir="rtl"] .animate-marquee {
          animation: marquee-rtl linear infinite;
        }
        @keyframes marquee-rtl {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}