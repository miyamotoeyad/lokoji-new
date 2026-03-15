import { RiArrowLeftSLine, RiBitCoinLine } from "@remixicon/react";
import Link from "next/link";
import { ChangePill } from "./ChangePill";
import type { CryptoItem } from "@/lib/Data/getCryptoData"; // ← import from data file not types

interface CryptoSectionProps {
  cryptoTop?: CryptoItem[];
  cryptoSidebar?: CryptoItem[];
}

export function CryptoTop({ cryptoTop = [] }: CryptoSectionProps) { // ← remove async
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
          <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiBitCoinLine size={16} />
          </div>
          <h2 className="text-xl font-black">العملات الرقمية</h2>
        </div>
        <Link href="/crypto" className="btn text-xs py-2 px-4 flex items-center gap-1">
          كل العملات الرقمية <RiArrowLeftSLine size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {cryptoTop.map((coin) => {
          const change = coin.quote.USD.percent_change_1h;
          const isUp   = change >= 0;
          const color  = isUp ? "#22c55e" : "var(--color-destructive)";
          return (
            <Link
              key={coin.id}
              href={`/crypto/${coin.slug}`}
              className="relative bg-card border border-border rounded-2xl p-3.5 flex flex-col gap-2 hover:border-primary-brand/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 overflow-hidden group"
            >
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-10 group-hover:opacity-20 pointer-events-none"
                style={{ backgroundColor: color }}
              />
              <div className="flex items-center justify-between gap-1 relative z-10">
                <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-mono border border-border">
                  {coin.symbol}
                </span>
                <ChangePill value={change} />
              </div>
              <p className="text-xs font-bold text-foreground truncate relative z-10 group-hover:text-primary-brand transition-colors">
                {coin.name}
              </p>
              <p className="text-sm font-black text-foreground tabular-nums relative z-10" dir="ltr">
                ${coin.quote.USD.price.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: coin.quote.USD.price >= 1 ? 2 : 4,
                })}
              </p>
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-20 group-hover:opacity-50 transition-opacity"
                style={{ backgroundColor: color }}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function CryptoSidebar({ cryptoSidebar = [] }: CryptoSectionProps) {
  return (
    <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiBitCoinLine size={18} />
          </div>
          <h3 className="font-black text-base">العملات الرقمية</h3>
        </div>
        <Link href="/crypto" className="text-[10px] text-muted-foreground hover:text-primary-brand transition-colors font-bold">
          الكل
        </Link>
      </div>
      <div className="divide-y divide-border">
        {cryptoSidebar.slice(0, 5).map((coin) => {
          const change = coin.quote.USD.percent_change_1h;
          return (
            <Link
              key={coin.id}
              href={`/crypto/${coin.slug}`}
              className="flex items-center justify-between py-3 gap-3 group"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-primary-brand/10 flex items-center justify-center font-black text-primary-brand text-[10px] shrink-0">
                  {coin.symbol[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground group-hover:text-primary-brand transition-colors truncate">
                    {coin.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">
                    {coin.symbol}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs font-black text-foreground tabular-nums" dir="ltr">
                  ${coin.quote.USD.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: coin.quote.USD.price >= 1 ? 2 : 4,
                  })}
                </span>
                <ChangePill value={change} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}