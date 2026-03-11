import { WorldMarketItem } from "@/lib/Data/worldMarketData";
import Link from "next/link";
import { RiArrowDownSFill, RiArrowUpSFill } from "@remixicon/react";

export default function WorldMarketCard({ item }: { item: WorldMarketItem }) {
  const color = item.positive ? "#22c55e" : "var(--color-destructive)";

  return (
    <Link href={`/world-market/${item.slug}`} className="block group">
      <div className="relative bg-card border border-border rounded-2xl p-4 h-full overflow-hidden transition-all duration-300 hover:border-primary-brand/30 hover:shadow-xl hover:shadow-primary-brand/5 hover:-translate-y-0.5 flex flex-col gap-2">
        {/* Glow */}
        <div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
          style={{ backgroundColor: color }}
        />

        {/* Top row: ticker chip + change pill */}
        <div className="flex items-center justify-between relative z-10">
          <span
            className="text-[10px] font-black tracking-widest text-muted-foreground bg-muted px-2.5 py-1 rounded-lg border border-border font-mono"
            dir="ltr"
          >
            {item.slug.toUpperCase()}
          </span>
          <div
            className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-black ${
              item.positive
                ? "bg-green-500/10 text-green-500"
                : "bg-destructive/10 text-destructive"
            }`}
            dir="ltr"
          >
            {item.positive ? (
              <RiArrowUpSFill size={11} />
            ) : (
              <RiArrowDownSFill size={11} />
            )}
            {Math.abs(item.changePercent).toFixed(2)}%
          </div>
        </div>

        {/* Arabic name */}
        <p className="text-xs font-bold text-muted-foreground relative z-10 line-clamp-1 group-hover:text-primary-brand transition-colors">
          {item.title}
        </p>

        <div className="flex items-end justify-between mt-auto relative z-10">
          {/* Price */}
          <p
            className="text-lg md:text-xl text-right font-black text-foreground tabular-nums relative z-10 group-hover:text-primary-brand transition-colors duration-200"
            dir="ltr"
          >
            {item.price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          {/* Absolute change */}
          <p
            className={`text-[10px] font-bold tabular-nums relative z-10 ${
              item.positive ? "text-green-500" : "text-destructive"
            }`}
            dir="ltr"
          >
            {item.positive ? "+" : ""}
            {item.change.toFixed(2)}
          </p>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-30 group-hover:opacity-60 transition-opacity duration-300"
          style={{ backgroundColor: color }}
        />
      </div>
    </Link>
  );
}
