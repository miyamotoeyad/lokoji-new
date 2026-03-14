"use client";

import { useState, useCallback } from "react";
import { convertCurrency, type Rates, type ExchangeResponse } from "@/lib/Data/exchangeData";

interface UseExchangeRatesReturn {
  rates: Rates;
  stableChanges: Record<string, number>;
  loading: boolean;
  error: string | null;
  lastUpdate: string;
  convert: (amount: number, from: string, to: string) => number;
  refresh: () => void;
}

interface InitialData {
  exchangeData: ExchangeResponse;
  changes: Record<string, number>;
}

export function useExchangeRates({ exchangeData, changes }: InitialData): UseExchangeRatesReturn {
  const [rates, setRates] = useState<Rates>(exchangeData.rates);
  const [stableChanges, setStableChanges] = useState<Record<string, number>>(changes);
  const [loading, setLoading] = useState(false);  // ← false — data already loaded from server
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(
    new Date(exchangeData.time_last_update_utc).toLocaleTimeString("ar-EG"),
  );

  // Only called on manual refresh — hits our own API route, not the external API directly
  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/exchange?base=USD");
      if (!res.ok) throw new Error("fetch failed");
      const data: ExchangeResponse = await res.json();

      // Compute changes against the current rates before updating
      const newChanges: Record<string, number> = {};
      Object.keys(data.rates).forEach((code) => {
        const prev = rates[code];
        const curr = data.rates[code];
        newChanges[code] = prev && prev !== 0
          ? parseFloat((((curr - prev) / prev) * 100).toFixed(2))
          : 0;
      });

      setRates(data.rates);
      setStableChanges(newChanges);
      setLastUpdate(new Date(data.time_last_update_utc).toLocaleTimeString("ar-EG"));
    } catch {
      setError("تعذّر تحميل الأسعار. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, [rates]);

  const convert = useCallback(
    (amount: number, from: string, to: string) =>
      convertCurrency(amount, from, to, rates),
    [rates],
  );

  return { rates, stableChanges, loading, error, lastUpdate, convert, refresh };
}