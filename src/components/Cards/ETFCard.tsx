import Link from "next/link";
import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiFundsLine,
  RiBarChartLine,
  RiArrowLeftSLine,
} from "@remixicon/react";
import type { ETFItem } from "@/lib/Data/etfData";

const marketBadge: Record<
  ETFItem["market"],
  { label: string; color: string; bg: string }
> = {
  EGX: {
    label: "بورصة مصر",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  US: {
    label: "NYSE",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  EUREX: {
    label: "EUREX",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  LSE: {
    label: "لندن",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
  TADAWUL: {
    label: "تداول",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
};

// ── CARD ─────────────────────────────────────────────────────────────────────
export function ETFCard({ item }: { item: ETFItem }) {
  const badge = marketBadge[item.market];

  return (
    <Link
      href={`/etfs/${item.slug}`}
      className="group bg-card border border-border rounded-3xl p-5 flex flex-col gap-4 hover:border-primary-brand/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
          <RiFundsLine size={20} />
        </div>
        <div
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${
            item.positive
              ? "bg-green-500/10 text-green-500"
              : "bg-destructive/10 text-destructive"
          }`}
          dir="ltr"
        >
          {item.positive ? (
            <RiArrowUpSFill size={12} />
          ) : (
            <RiArrowDownSFill size={12} />
          )}
          {item.changePercent.toFixed(2)}%
        </div>
      </div>

      {/* Name */}
      <div>
        <h3 className="font-black text-foreground text-sm leading-snug mb-1 group-hover:text-primary-brand transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p
          className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"
          dir="ltr"
        >
          {item.ticker}
        </p>
      </div>

      {/* Prices */}
      <div className="border-t border-border pt-3 space-y-2 mt-auto">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-muted-foreground shrink-0">
            القيمة
          </span>
          <span
            className="text-sm font-black text-foreground tabular-nums"
            dir="ltr"
          >
            {item.point.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
            <span className="text-[10px] text-muted-foreground font-bold">
              {item.currency}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-muted-foreground shrink-0">
            التغيير
          </span>
          <span
            className={`text-xs font-black tabular-nums ${item.positive ? "text-green-500" : "text-destructive"}`}
            dir="ltr"
          >
            {item.positive ? "+" : "-"}
            {item.change.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span
            className={`inline-flex items-center text-[10px] font-black px-2.5 py-1 rounded-full border ${badge.bg} ${badge.color}`}
          >
            {badge.label}
          </span>
          <span className="text-[10px] font-black text-muted-foreground flex items-center gap-0.5 group-hover:text-primary-brand transition-colors">
            التفاصيل <RiArrowLeftSLine size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── ROW ───────────────────────────────────────────────────────────────────────
export function ETFRow({ item, rank }: { item: ETFItem; rank: number }) {
  const badge = marketBadge[item.market];

  return (
    <Link
      href={`/etfs/${item.slug}`}
      className="grid grid-cols-[2rem_1fr_auto] md:grid-cols-[2rem_1fr_7rem_9rem_7rem_2rem] items-center px-6 py-4 gap-4 hover:bg-primary-brand/5 transition-colors duration-200 group"
    >
      {/* Rank */}
      <span className="text-xs font-black text-muted-foreground tabular-nums">
        {rank}
      </span>

      {/* Name + ticker */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
          <RiBarChartLine size={16} />
        </div>
        <div className="min-w-0 text-right">
          <p className="font-black text-sm text-foreground group-hover:text-primary-brand transition-colors truncate">
            {item.title}
          </p>
          <p
            className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest"
            dir="ltr"
          >
            {item.ticker}
          </p>
        </div>
      </div>

      {/* Market badge — desktop */}
      <div
        className={`hidden md:inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-black border ${badge.bg} ${badge.color}`}
      >
        {badge.label}
      </div>

      {/* Price — desktop */}
      <div className="hidden md:flex items-center justify-end gap-1" dir="ltr">
        <span className="text-sm font-black text-foreground tabular-nums">
          {item.point.toLocaleString("en-US", { maximumFractionDigits: 2 })}
        </span>
        <span className="text-[10px] text-muted-foreground font-bold">
          {item.currency}
        </span>
      </div>

      {/* Change pill */}
      <div
        className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-black w-fit mr-auto md:mr-0 ${
          item.positive
            ? "bg-green-500/10 text-green-500"
            : "bg-destructive/10 text-destructive"
        }`}
        dir="ltr"
      >
        {item.positive ? (
          <RiArrowUpSFill size={13} />
        ) : (
          <RiArrowDownSFill size={13} />
        )}
        {item.changePercent.toFixed(2)}%
      </div>

      {/* Arrow — desktop */}
      <RiArrowLeftSLine
        size={18}
        className="hidden md:block text-muted-foreground/40 group-hover:text-primary-brand transition-colors justify-self-end"
      />
    </Link>
  );
}
