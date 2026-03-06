import Link from "next/link";
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";

interface MarketProps {
  title: string;
  num: string;
  slug: string;
  arrow: "up" | "down";
}

export const MarketCard = ({ title, num, slug, arrow }: MarketProps) => {
  const isUp = arrow === "up";

  return (
    <Link href={`/market/${slug}`} className="group">
      <div className="p-5 bg-white dark:bg-dlight/10 border border-slate-100 dark:border-dlight/20 rounded-3xl transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">{title}</h3>
          <div className={`flex items-center ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
            {isUp ? <RiArrowUpSFill size={20} /> : <RiArrowDownSFill size={20} />}
          </div>
        </div>
        <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
          {num}
        </p>
      </div>
    </Link>
  );
};