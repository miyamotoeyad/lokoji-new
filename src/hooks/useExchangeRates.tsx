"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getExchangeRates,
  convertCurrency,
  type Rates,
} from "@/lib/Data/exchangeData";

interface UseExchangeRatesReturn {
  rates: Rates;
  stableChanges: Record<string, number>;
  loading: boolean;
  error: string | null;
  lastUpdate: string;
  convert: (amount: number, from: string, to: string) => number;
  refresh: () => void;
}

export function useExchangeRates(base = "USD"): UseExchangeRatesReturn {
  const [rates, setRates] = useState<Rates>({});
  const [stableChanges, setStableChanges] = useState<Record<string, number>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExchangeRates(base);
      setRates(data.rates);
      setLastUpdate(new Date().toLocaleTimeString("ar-EG"));

      // ✅ Math.random() here — inside async callback, NOT in render or effect body
      const changes: Record<string, number> = {};
      Object.keys(data.rates).forEach((c) => {
        changes[c] = Math.random() * 2 - 1;
      });
      setStableChanges(changes);
    } catch (e) {
      setError("تعذّر تحميل الأسعار. حاول مرة أخرى.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [base]);

  useEffect(() => {
    load();
  }, [load]);

  const convert = useCallback(
    (amount: number, from: string, to: string) =>
      convertCurrency(amount, from, to, rates),
    [rates],
  );

  return {
    rates,
    stableChanges,
    loading,
    error,
    lastUpdate,
    convert,
    refresh: load,
  };
}
