import { ETFItem } from "@/lib/Data/etfData";
import { ChangePill } from "./ChangePill";
import Link from "next/link";
import { RiFundsLine } from "@remixicon/react";

export default function ETFSection({ etfs }: { etfs: ETFItem[] }) {
  return (
    <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiFundsLine size={18} />
          </div>
          <h3 className="font-black text-base">صناديق الاستثمار</h3>
        </div>
        <Link
          href="/etfs"
          className="text-[10px] text-muted-foreground hover:text-primary-brand transition-colors font-bold"
        >
          الكل
        </Link>
      </div>
      <div className="divide-y divide-border">
        {etfs.slice(0, 5).map((item: ETFItem) => (
          <Link
            key={item.id}
            href={`/etfs/${item.slug}`}
            className="flex items-center justify-between py-3 gap-3 group"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground group-hover:text-primary-brand transition-colors truncate">
                {item.title}
              </p>
              <p
                className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest"
                dir="ltr"
              >
                {item.ticker}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span
                className="text-xs font-black text-foreground tabular-nums"
                dir="ltr"
              >
                {item.point.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </span>
              <ChangePill
                value={item.positive ? item.changePercent : -item.changePercent}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
