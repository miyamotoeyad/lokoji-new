import { ChangePill } from "./ChangePill";
import { CommodityItem } from "@/lib/Data/commoditiesData";
import { RiLineChartLine } from "@remixicon/react";
import Link from "next/link";

export default function CommoditiesSection({
  commodities,
}: {
  commodities: CommodityItem[];
}) {
  return (
    <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
          <RiLineChartLine size={18} />
        </div>
        <h3 className="font-black text-base">السوق دلوقتي</h3>
      </div>
      <div className="divide-y divide-border">
        {commodities.slice(0, 5).map((item: CommodityItem) => (
          <Link
            key={item.id}
            href="/commodities"
            className="flex items-center justify-between py-3 group"
          >
            <span className="text-sm font-bold text-foreground group-hover:text-primary-brand transition-colors truncate max-w-[55%]">
              {item.nameAr}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className="text-sm font-black text-foreground tabular-nums"
                dir="ltr"
              >
                {item.priceEGP.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
                <span className="text-[10px] text-muted-foreground font-bold mr-1">
                  ج.م
                </span>
              </span>
              <ChangePill value={item.change} />
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/commodities"
        className="block text-center text-xs font-black text-primary-brand underline underline-offset-4"
      >
        كل السلع والمعادن
      </Link>
    </div>
  );
}
