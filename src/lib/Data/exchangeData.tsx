export interface Rates {
  [key: string]: number;
}

export interface ExchangeResponse {
  rates: Rates;
  base: string;
  time_last_update_utc: string;
}

export async function getExchangeRates(base = "USD"): Promise<ExchangeResponse> {
  const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
    next: { revalidate: 3600 }, // cache for 1 hour in server components
  });

  if (!res.ok) throw new Error(`Failed to fetch exchange rates for ${base}`);
  return res.json();
}

// Helper: convert between two currencies
export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: Rates
): number {
  if (!rates[from] || !rates[to]) return 0;
  return parseFloat(((amount * rates[to]) / rates[from]).toFixed(4));
}

// Helper: get EGP rate for a given currency code
export function toEGP(code: string, rates: Rates): number {
  const egp = rates["EGP"] ?? 1;
  return parseFloat((egp / rates[code]).toFixed(4));
}

// Helper: get USD rate for a given currency code
export function toUSD(code: string, rates: Rates): number {
  return parseFloat((1 / rates[code]).toFixed(4));
}