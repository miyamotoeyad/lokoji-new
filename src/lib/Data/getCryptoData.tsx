import { unstable_cache } from "next/cache";
import { cache } from "react";

export interface CryptoItem {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  circulating_supply: number;
  max_supply: number | null;
  total_supply: number;
  quote: {
    USD: {
      price: number;
      market_cap: number;
      volume_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
    };
  };
}

const getCachedCryptoData = unstable_cache(
  async (): Promise<CryptoItem[]> => {
    const res = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${process.env.CRYPTO_API}&convert=USD&limit=100`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  },
  ["crypto-listings"],
  { revalidate: 300 }, // 5 min — was firing on every request
);

// Deduplicate within same render
export const getCryptoData = cache(getCachedCryptoData);