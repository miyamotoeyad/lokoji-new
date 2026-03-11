import { ChangePill } from "./ChangePill";
import { WorldStock } from "@/lib/Data/worldStocksData";
import { RiArrowLeftSLine, RiBuildingLine } from "@remixicon/react";
import Link from "next/link";

export default function WorldMarketIndicesSection({
  stocksBySector = [],
}: {
  stocksBySector: { sector: string; stocks: WorldStock[] }[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
          <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiBuildingLine size={16} />
          </div>
          <h2 className="text-xl font-black">أسهم الشركات العالمية</h2>
        </div>
        <Link
          href="/world-stocks"
          className="btn text-xs py-2 px-4 flex items-center gap-1"
        >
          كل الأسهم <RiArrowLeftSLine size={14} />
        </Link>
      </div>

      {/* Sector grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stocksBySector.map(({ sector, stocks }, sectorIdx) => {
          // Alternate accent colours per sector for visual variety
          const accents = [
            "from-blue-500/10",
            "from-green-500/10",
            "from-orange-500/10",
            "from-purple-500/10",
            "from-cyan-500/10",
            "from-pink-500/10",
            "from-yellow-500/10",
            "from-teal-500/10",
          ];
          const accent = accents[sectorIdx % accents.length];
          return (
            <div
              key={sector}
              className={`relative bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary-brand/30 hover:shadow-md transition-all duration-200`}
            >
              {/* Sector header */}
              <div
                className={`bg-linear-to-bl ${accent} to-transparent px-4 py-3 border-b border-border flex items-center justify-between`}
              >
                <span className="text-xs font-black text-foreground">
                  {sector}
                </span>
                <Link
                  href={`/world-stocks?sector=${encodeURIComponent(sector)}`}
                  className="text-[10px] font-black text-muted-foreground hover:text-primary-brand transition-colors flex items-center gap-0.5"
                >
                  الكل <RiArrowLeftSLine size={12} />
                </Link>
              </div>

              {/* Stock rows */}
              <div className="divide-y divide-border">
                {stocks.map((stock: WorldStock) => (
                  <Link
                    key={stock.id}
                    href={`/world-stocks/${stock.slug}`}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-primary-brand/5 transition-colors group/row"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-primary-brand/10 flex items-center justify-center font-black text-primary-brand text-[9px] shrink-0">
                        {stock.ticker.replace(/\..+/, "").slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-foreground truncate group-hover/row:text-primary-brand transition-colors">
                          {stock.nameAr}
                        </p>
                        <p
                          className="text-[9px] text-right text-muted-foreground font-mono"
                          dir="ltr"
                        >
                          {stock.ticker}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 shrink-0">
                      <span
                        className="text-[11px] font-black text-foreground tabular-nums"
                        dir="ltr"
                      >
                        $
                        {stock.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <ChangePill value={stock.changePercent} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
