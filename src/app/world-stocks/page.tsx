import { Metadata } from "next";
import {
  RiFlashlightLine,
  RiBuildingLine,
} from "react-icons/ri";
import { getWorldStocksData } from "@/lib/Data/worldStocksData";
import { WORLD_STOCKS_CONFIG } from "@/lib/Array/WorldCompanyList";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import WorldStocksClient from "@/components/Market/WorldStocksClient";
import WorldStockCard from "@/components/Cards/WorldStockCard";

export const metadata: Metadata = generateStaticMetadata({
  title: "أسهم الشركات العالمية",
  description:
    "تابع أسعار أكبر الشركات العالمية — آبل، مايكروسوفت، أرامكو، تسلا وأكثر.",
  url: "/world-stocks",
});

export const revalidate = 300;

const SECTORS = [
  "الكل",
  ...Array.from(new Set(WORLD_STOCKS_CONFIG.map((s) => s.sector))),
];

export default async function WorldStocksPage() {
  const stocks = await getWorldStocksData();
  const featured = stocks.slice(0, 6);

  return (
    <main
      className="container mx-auto px-4 py-8 md:py-10 space-y-10 md:space-y-12"
      dir="rtl"
    >
      {/* ── PAGE HEADER ── */}
      <div className="pb-6 md:pb-8 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiBuildingLine size={18} />
          </div>
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
            الأسواق العالمية
          </span>
        </div>
        <h1 className="text-2xl md:text-5xl font-black text-foreground tracking-tight mb-2">
          أسهم الشركات العالمية
        </h1>
        <p className="text-muted-foreground text-sm md:text-lg font-medium">
          أسعار مباشرة لأكبر {stocks.length} شركة حول العالم — تقنية، مالية،
          طاقة وأكثر.
        </p>
      </div>

      {/* ── FEATURED TOP 6 ── */}
      <section>
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <span className="w-1 h-6 md:h-7 bg-primary-brand rounded-full block shrink-0" />
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiFlashlightLine size={15} />
          </div>
          <h2 className="text-base md:text-xl font-black text-foreground">
            الأكثر تداولاً
          </h2>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 md:grid md:grid-cols-3 lg:grid-cols-6 md:overflow-visible">
          {featured.map((stock) => {
            const color = stock.positive
              ? "#22c55e"
              : "var(--color-destructive)";
            return (
              <WorldStockCard key={stock.id} stock={stock} color={color} />
            );
          })}
        </div>
      </section>

      {/* ── CLIENT: SEARCH + FILTER + TABLE ── */}
      <section>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-3">
            <span className="w-1 h-6 md:h-7 bg-primary-brand rounded-full block shrink-0" />
            <h2 className="text-base md:text-xl font-black text-foreground">
              جميع الأسهم
            </h2>
          </div>
        </div>
        <WorldStocksClient stocks={stocks} sectors={SECTORS} />
      </section>
    </main>
  );
}
