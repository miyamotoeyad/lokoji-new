import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  EGY_FUEL_PRICES_EGP,
  EGY_FUEL_OLD_PRICES_EGP,
} from "../Array/EgyptPetrolList";
import { getExchangeRates } from "./exchangeData";

export interface CommodityItem {
  id: string;
  nameAr: string;
  nameEn: string;
  symbol: string;
  priceUSD: number;
  priceEGP: number;
  change: number;
  oldPriceEGP?: number; // for fuel: previous gov price
  unit: string;
  category: "gold" | "silver" | "oil" | "fuel";
  icon: string;
}

const OZ_TO_GRAM = 31.1035;

// ── Fuel change % ─────────────────────────────────────────────────────────────
function fuelChange(current: number, old: number): number {
  if (!old || old === 0) return 0;
  return parseFloat((((current - old) / old) * 100).toFixed(2));
}

// ── Deterministic metal change (no re-randomize on every render) ──────────────
function metalChange(currentUSD: number, swingPct = 0.8): number {
  const seed = Math.floor(currentUSD) % 100;
  const raw = ((seed * 9301 + 49297) % 233280) / 233280;
  return parseFloat((raw * swingPct * 2 - swingPct).toFixed(2));
}

// ── Metal rates — cached 12h, fallback to realistic values ───────────────────
const getMetalRates = unstable_cache(
  async (): Promise<{ xauUSD: number; xagUSD: number }> => {
    try {
      const res = await fetch(
        `https://api.metalpriceapi.com/v1/latest?api_key=${process.env.METAL_PRICE_API_KEY}&base=USD&currencies=XAU,XAG`,
      );
      if (!res.ok) throw new Error("Metal API failed");
      const data = await res.json();
      const xauUSD = data.rates?.XAU ? 1 / data.rates.XAU : 5190;
      const xagUSD = data.rates?.XAG ? 1 / data.rates.XAG : 34;
      return { xauUSD, xagUSD };
    } catch {
      return { xauUSD: 5190, xagUSD: 34 };
    }
  },
  ["metal-rates"],
  { revalidate: 43200 }, // 12 hours — 2 requests/day max
);

export const getCommodities = cache(async (): Promise<CommodityItem[]> => {
  const [{ xauUSD, xagUSD }, exchangeData] = await Promise.all([
    getMetalRates(),
    getExchangeRates("USD"),
  ]);

  const egpRate = exchangeData.rates["EGP"] ?? 52;
  const goldGramUSD = xauUSD / OZ_TO_GRAM;
  const silverGramUSD = xagUSD / OZ_TO_GRAM;

  function toEGP(usd: number) {
    return parseFloat((usd * egpRate).toFixed(2));
  }
  function toUSD(egp: number) {
    return parseFloat((egp / egpRate).toFixed(4));
  }
  function fmt(n: number) {
    return parseFloat(n.toFixed(2));
  }
  function goldCarat(k: number) {
    return fmt(goldGramUSD * (k / 24));
  }

  return [
    // ── GOLD ─────────────────────────────────────────────────────────────
    {
      id: "gold-24k",
      nameAr: "ذهب عيار 24",
      nameEn: "Gold 24K",
      symbol: "XAU",
      priceUSD: fmt(goldGramUSD),
      priceEGP: toEGP(goldGramUSD),
      change: metalChange(goldGramUSD),
      unit: "جرام",
      category: "gold",
      icon: "🥇",
    },
    {
      id: "gold-21k",
      nameAr: "ذهب عيار 21",
      nameEn: "Gold 21K",
      symbol: "XAU",
      priceUSD: goldCarat(21),
      priceEGP: toEGP(goldCarat(21)),
      change: metalChange(goldCarat(21)),
      unit: "جرام",
      category: "gold",
      icon: "🥇",
    },
    {
      id: "gold-18k",
      nameAr: "ذهب عيار 18",
      nameEn: "Gold 18K",
      symbol: "XAU",
      priceUSD: goldCarat(18),
      priceEGP: toEGP(goldCarat(18)),
      change: metalChange(goldCarat(18)),
      unit: "جرام",
      category: "gold",
      icon: "🥇",
    },
    {
      id: "gold-14k",
      nameAr: "ذهب عيار 14",
      nameEn: "Gold 14K",
      symbol: "XAU",
      priceUSD: goldCarat(14),
      priceEGP: toEGP(goldCarat(14)),
      change: metalChange(goldCarat(14)),
      unit: "جرام",
      category: "gold",
      icon: "🥇",
    },
    // ── SILVER ───────────────────────────────────────────────────────────
    {
      id: "silver-999",
      nameAr: "فضة 999",
      nameEn: "Silver 999",
      symbol: "XAG",
      priceUSD: fmt(silverGramUSD),
      priceEGP: toEGP(silverGramUSD),
      change: metalChange(silverGramUSD, 1.2),
      unit: "جرام",
      category: "silver",
      icon: "🥈",
    },
    // ── OIL ──────────────────────────────────────────────────────────────
    {
      id: "brent",
      nameAr: "نفط برنت",
      nameEn: "Brent Crude",
      symbol: "BRENT",
      priceUSD: 74.0,
      priceEGP: toEGP(74.0),
      change: metalChange(74.0, 1.5),
      unit: "برميل",
      category: "oil",
      icon: "🛢️",
    },
    {
      id: "wti",
      nameAr: "نفط WTI",
      nameEn: "WTI Crude",
      symbol: "WTI",
      priceUSD: 70.5,
      priceEGP: toEGP(70.5),
      change: metalChange(70.5, 1.5),
      unit: "برميل",
      category: "oil",
      icon: "🛢️",
    },
    // ── FUEL (EGYPT GOVERNMENT-SET PRICES) ───────────────────────────────
    {
      id: "petrol-80",
      nameAr: "بنزين 80",
      nameEn: "Petrol 80",
      symbol: "PET80",
      priceUSD: toUSD(EGY_FUEL_PRICES_EGP.petrol80),
      priceEGP: EGY_FUEL_PRICES_EGP.petrol80,
      oldPriceEGP: EGY_FUEL_OLD_PRICES_EGP.petrol80,
      change: fuelChange(
        EGY_FUEL_PRICES_EGP.petrol80,
        EGY_FUEL_OLD_PRICES_EGP.petrol80,
      ),
      unit: "لتر",
      category: "fuel",
      icon: "⛽",
    },
    {
      id: "petrol-92",
      nameAr: "بنزين 92",
      nameEn: "Petrol 92",
      symbol: "PET92",
      priceUSD: toUSD(EGY_FUEL_PRICES_EGP.petrol92),
      priceEGP: EGY_FUEL_PRICES_EGP.petrol92,
      oldPriceEGP: EGY_FUEL_OLD_PRICES_EGP.petrol92,
      change: fuelChange(
        EGY_FUEL_PRICES_EGP.petrol92,
        EGY_FUEL_OLD_PRICES_EGP.petrol92,
      ),
      unit: "لتر",
      category: "fuel",
      icon: "⛽",
    },
    {
      id: "petrol-95",
      nameAr: "بنزين 95",
      nameEn: "Petrol 95",
      symbol: "PET95",
      priceUSD: toUSD(EGY_FUEL_PRICES_EGP.petrol95),
      priceEGP: EGY_FUEL_PRICES_EGP.petrol95,
      oldPriceEGP: EGY_FUEL_OLD_PRICES_EGP.petrol95,
      change: fuelChange(
        EGY_FUEL_PRICES_EGP.petrol95,
        EGY_FUEL_OLD_PRICES_EGP.petrol95,
      ),
      unit: "لتر",
      category: "fuel",
      icon: "⛽",
    },
    {
      id: "kerosene",
      nameAr: "الكيروسين",
      nameEn: "Kerosene",
      symbol: "KERO",
      priceUSD: toUSD(EGY_FUEL_PRICES_EGP.kerosene),
      priceEGP: EGY_FUEL_PRICES_EGP.kerosene,
      oldPriceEGP: EGY_FUEL_OLD_PRICES_EGP.kerosene,
      change: fuelChange(
        EGY_FUEL_PRICES_EGP.kerosene,
        EGY_FUEL_OLD_PRICES_EGP.kerosene,
      ),
      unit: "لتر",
      category: "fuel",
      icon: "⛽",
    },
    {
      id: "solar",
      nameAr: "سولار",
      nameEn: "Solar",
      symbol: "SOLAR",
      priceUSD: toUSD(EGY_FUEL_PRICES_EGP.solar),
      priceEGP: EGY_FUEL_PRICES_EGP.solar,
      oldPriceEGP: EGY_FUEL_OLD_PRICES_EGP.solar,
      change: fuelChange(
        EGY_FUEL_PRICES_EGP.solar,
        EGY_FUEL_OLD_PRICES_EGP.solar,
      ),
      unit: "لتر",
      category: "fuel",
      icon: "⛽",
    },
    {
      id: "gas-stove",
      nameAr: "الغاز الطبيعي",
      nameEn: "Gas Stove",
      symbol: "GASS",
      priceUSD: toUSD(EGY_FUEL_PRICES_EGP.gasStove),
      priceEGP: EGY_FUEL_PRICES_EGP.gasStove,
      oldPriceEGP: EGY_FUEL_OLD_PRICES_EGP.gasStove,
      change: fuelChange(
        EGY_FUEL_PRICES_EGP.gasStove,
        EGY_FUEL_OLD_PRICES_EGP.gasStove,
      ),
      unit: "أسطوانة",
      category: "fuel",
      icon: "🔵",
    }
  ];
});