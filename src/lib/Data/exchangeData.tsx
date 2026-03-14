import { cache } from "react";
import { unstable_cache } from "next/cache";

export interface Rates {
  [key: string]: number;
}

export interface ExchangeResponse {
  rates: Rates;
  base: string;
  time_last_update_utc: string;
}

// ── Server-only (React cache — deduplicates within one render) ────────────────
export const getExchangeRates = cache(async (base = "USD"): Promise<ExchangeResponse> => {
  const res = await fetch(`https://open.er-api.com/v6/latest/${base}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`Failed to fetch exchange rates for ${base}`);
  return res.json();
});

// ── Persist previous day's rates across requests ──────────────────────────────
// Called once, cached for 24h — gives us yesterday's snapshot to compute change %
export const getPreviousExchangeRates = unstable_cache(
  async (base = "USD"): Promise<Rates> => {
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
      if (!res.ok) return {};
      const data: ExchangeResponse = await res.json();
      return data.rates;
    } catch {
      return {};
    }
  },
  ["exchange-rates-previous"],
  { revalidate: 86400 }, // snapshot refreshes once per day
);

// ── Compute change % between two rate snapshots ───────────────────────────────
export function computeChanges(
  currentRates: Rates,
  previousRates: Rates,
): Record<string, number> {
  const changes: Record<string, number> = {};
  Object.keys(currentRates).forEach((code) => {
    const current = currentRates[code];
    const previous = previousRates[code];
    if (previous && previous !== 0) {
      changes[code] = parseFloat((((current - previous) / previous) * 100).toFixed(2));
    } else {
      changes[code] = 0;
    }
  });
  return changes;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function convertCurrency(amount: number, from: string, to: string, rates: Rates): number {
  if (!rates[from] || !rates[to]) return 0;
  return parseFloat(((amount * rates[to]) / rates[from]).toFixed(4));
}

export function toEGP(code: string, rates: Rates): number {
  const egp = rates["EGP"] ?? 1;
  return parseFloat((egp / rates[code]).toFixed(4));
}

export function toUSD(code: string, rates: Rates): number {
  return parseFloat((1 / rates[code]).toFixed(4));
}