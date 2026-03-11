import { translateToArabic } from "@/lib/translateToArabic";
import Link from "next/link";
import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiExternalLinkLine,
} from "@remixicon/react";

export interface CryptoData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  quote: {
    USD: {
      price: number;
      percent_change_1h: number;
    };
  };
}

export default async function CryptoCard({ crypto }: { crypto: CryptoData }) {
  const percentChange = crypto.quote.USD.percent_change_1h;
  const isNegative = percentChange < 0;
  const absChange = Math.abs(Math.round(percentChange * 100) / 100);
  const arabicTitle = await translateToArabic(crypto.name);

  const formattedPrice = crypto.quote.USD.price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <Link href={`/crypto/${crypto.slug}`} className="block group">
      <div className="bg-card border border-border rounded-2xl md:rounded-3xl p-4 md:p-5 h-full hover:border-primary-brand/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col gap-2.5">
      
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-primary-brand bg-primary-brand/10 px-2.5 py-1 rounded-full uppercase">
            {crypto.symbol}
          </span>

          {/* Change pill */}
          <div
            className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] md:text-xs font-black w-fit ${
              isNegative
                ? "bg-destructive/10 text-destructive"
                : "bg-green-500/10 text-green-500"
            }`}
          >
            {isNegative ? (
              <RiArrowDownSFill size={12} />
            ) : (
              <RiArrowUpSFill size={12} />
            )}
            <span dir="ltr">
              {isNegative ? "-" : "+"}
              {absChange}%
            </span>
            <span className="opacity-50 text-[9px]">1س</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-black text-xs md:text-sm text-muted-foreground group-hover:text-primary-brand transition-colors line-clamp-1 leading-snug">
          {arabicTitle || crypto.name}
        </h3>

        {/* Price */}
        <div className="flex justify-between items-end">
          
        <p
          className="text-2xl text-right md:text-xl font-black text-foreground tabular-nums"
          dir="ltr"
        >
          ${formattedPrice}
        </p>
        <RiExternalLinkLine
          size={12}
          className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        />
        </div>
      </div>
    </Link>
  );
}
