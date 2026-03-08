import { WorldStock } from "@/lib/Data/worldStocksData";
import Link from "next/link";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";

export default function WorldStockCard({
  stock,
  color,
}: {
  stock: WorldStock;
  color: string;
}) {
  return (
    <Link
      href={`/world-stocks/${stock.slug}`}
      className="shrink-0 w-40 md:w-auto relative bg-card border border-border rounded-2xl p-3.5 flex flex-col gap-2 hover:border-primary-brand/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <div
        className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-10 group-hover:opacity-20 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      {/* Ticker + change */}
      <div className="flex items-center justify-between relative z-10">
        <span
          className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-md border border-border font-mono"
          dir="ltr"
        >
          {stock.ticker}
        </span>
        <span
          className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-lg ${
            stock.positive
              ? "bg-green-500/10 text-green-500"
              : "bg-destructive/10 text-destructive"
          }`}
          dir="ltr"
        >
          {stock.positive ? (
            <RiArrowUpSFill size={10} />
          ) : (
            <RiArrowDownSFill size={10} />
          )}
          {Math.abs(stock.changePercent).toFixed(2)}%
        </span>
      </div>

      <p className="text-xs font-bold text-muted-foreground truncate relative z-10 group-hover:text-primary-brand transition-colors">
        {stock.nameAr}
      </p>
      <p
        className="text-xl text-right md:text-2xl font-black text-foreground tabular-nums relative z-10"
        dir="ltr"
      >
        $
        {stock.price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>

      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-20 group-hover:opacity-50 transition-opacity"
        style={{ backgroundColor: color }}
      />
    </Link>
  );
}
