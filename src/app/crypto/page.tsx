import Link from "next/link";
import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiFlashlightLine,
  RiFundsLine,
  RiBitCoinLine,
} from "react-icons/ri";
import { CryptoCard } from "@/components/Cards";
import { Metadata } from "next";

export interface MarketData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  quote: {
    USD: {
      price: number;
      volume_24h: number;
      percent_change_1h: number;
    };
  };
}

interface CMCResponse {
  data: MarketData[];
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
  };
}

export const metadata: Metadata = {
  title: "سوق العملات الرقمية",
  description: "تابع أسعار العملات الرقمية مباشرة، تحليل السوق وحركة الأسعار لحظة بلحظة.",
};

async function getCryptoData(): Promise<CMCResponse> {
  const res = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${process.env.CRYPTO_API}&start=1&limit=20&convert=USD`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch crypto data");
  return res.json();
}

export default async function CryptoMarketPage() {
  const crypto = await getCryptoData();
  const cryptoList: MarketData[] = crypto.data || [];  

  return (
    <main className="container mx-auto px-4 py-10 space-y-12" dir="rtl">

      {/* ── PAGE HEADER ── */}
      <div className="pb-8 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiBitCoinLine size={20} />
          </div>
          <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
            العملات الرقمية · Crypto
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tight">
              سوق العملات الرقمية
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              متابعة حية لأسعار أهم 20 عملة مشفرة في السوق العالمي.
            </p>
          </div>
        </div>
      </div>

      {/* ── TOP 5 FEATURED ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
          <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
            <RiFlashlightLine size={16} />
          </div>
          <h2 className="text-xl font-black text-foreground">الأكثر نشاطاً اليوم</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {cryptoList.slice(0, 5).map((market) => (
            <CryptoCard key={market.id} crypto={market} />
          ))}
        </div>
      </section>

      {/* ── FULL LIST TABLE ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
            <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiFundsLine size={16} />
            </div>
            <h2 className="text-xl font-black text-foreground">جميع العملات</h2>
          </div>
          <span className="text-xs font-black text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
            {cryptoList.length} عملة
          </span>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">

          {/* Table header */}
          <div className="flex items-center px-6 py-4 border-b border-border bg-muted/50 gap-4">
            <span className="flex-1 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
              العملة
            </span>
            <span className="w-32 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center shrink-0">
              السعر (USD)
            </span>
            <span className="w-36 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center shrink-0 hidden md:block">
              حجم التداول (24س)
            </span>
            <span className="w-24 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left shrink-0">
              التغيير (1س)
            </span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {cryptoList.map(async (market, index) => {
              const quote = market.quote.USD;
              const isNegative = quote.percent_change_1h < 0;
              return (
                <Link
                  key={market.id}
                  href={`/crypto/${market.slug}`}
                  className="flex items-center px-6 py-4 hover:bg-primary-brand/5 transition-colors duration-200 group gap-4"
                >
                  {/* Rank + Avatar + Name */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xs font-black text-muted-foreground tabular-nums w-5 shrink-0">
                      {index + 1}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-primary-brand/10 flex items-center justify-center font-black text-primary-brand text-xs shrink-0">
                      {market.symbol[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground group-hover:text-primary-brand transition-colors truncate">
                        {market.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase mt-0.5">
                        {market.symbol}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="w-32 text-center font-black text-sm text-foreground tabular-nums shrink-0" dir="ltr">
                    ${quote.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>

                  {/* Volume */}
                  <div className="w-36 text-center text-xs text-muted-foreground font-bold hidden md:block shrink-0 tabular-nums" dir="ltr">
                    ${Math.round(quote.volume_24h).toLocaleString()}
                  </div>

                  {/* Change pill */}
                  <div className="w-24 flex justify-end shrink-0">
                    <div className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-black ${
                      isNegative
                        ? "bg-destructive/10 text-destructive"
                        : "bg-green-500/10 text-green-500"
                    }`}>
                      {isNegative
                        ? <RiArrowDownSFill size={14} />
                        : <RiArrowUpSFill size={14} />
                      }
                      <span dir="ltr">{quote.percent_change_1h.toFixed(2)}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}