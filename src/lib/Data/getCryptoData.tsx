import { MarketData } from "@/app/crypto/page";

interface CMCResponse {
  data: MarketData[];
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
  };
}

export async function getCryptoData(): Promise<CMCResponse> {
  const res = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=${process.env.CRYPTO_API}&start=1&limit=20&convert=USD`,
    { next: { revalidate: 60 } },
  );
  if (!res.ok) throw new Error("Failed to fetch crypto data");
  return res.json();
}
