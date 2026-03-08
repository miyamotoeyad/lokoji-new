import { EGY_FUEL_PRICES_EGP } from "../Array/EgyptPetrolList";
import { getExchangeRates } from "./exchangeData";

export interface CommodityItem {
  id: string;
  nameAr: string;
  nameEn: string;
  symbol: string;
  priceUSD: number;
  priceEGP: number;
  change: number;
  unit: string;
  category: "gold" | "silver" | "oil" | "fuel";
  icon: string;
}

const OZ_TO_GRAM = 31.1035;

async function getMetalRates(): Promise<{ xauUSD: number; xagUSD: number }> {
  try {
    const res = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${process.env.METAL_PRICE_API_KEY}&base=USD&currencies=XAU,XAG`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error("Metal API failed");
    const data = await res.json();
    const xauUSD = data.rates?.XAU ? 1 / data.rates.XAU : 2350;
    const xagUSD = data.rates?.XAG ? 1 / data.rates.XAG : 28;
    return { xauUSD, xagUSD };
  } catch {
    return { xauUSD: 2350, xagUSD: 28 };
  }
}

export async function getCommodities(): Promise<CommodityItem[]> {
  const [{ xauUSD, xagUSD }, exchangeData] = await Promise.all([
    getMetalRates(),
    getExchangeRates("USD"),
  ]);

  const egpRate = exchangeData.rates["EGP"] ?? 50;
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
  function rnd() {
    return parseFloat((Math.random() * 4 - 2).toFixed(2));
  }

  return [
    // ── GOLD ──────────────────────────────────────────────────────────────
    {
      id: "gold-24k",
      nameAr: "ذهب عيار 24",
      nameEn: "Gold 24K",
      symbol: "XAU",
      priceUSD: fmt(goldGramUSD),
      priceEGP: toEGP(goldGramUSD),
      change: rnd(),
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
      change: rnd(),
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
      change: rnd(),
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
      change: rnd(),
      unit: "جرام",
      category: "gold",
      icon: "🥇",
    },
    // ── SILVER ────────────────────────────────────────────────────────────
    {
      id: "silver-999",
      nameAr: "فضة 999",
      nameEn: "Silver 999",
      symbol: "XAG",
      priceUSD: fmt(silverGramUSD),
      priceEGP: toEGP(silverGramUSD),
      change: rnd(),
      unit: "جرام",
      category: "silver",
      icon: "🥈",
    },
    // ── OIL ───────────────────────────────────────────────────────────────
    {
      id: "brent",
      nameAr: "نفط برنت",
      nameEn: "Brent Crude",
      symbol: "BRENT",
      priceUSD: 83.5,
      priceEGP: toEGP(83.5),
      change: rnd(),
      unit: "برميل",
      category: "oil",
      icon: "🛢️",
    },
    {
      id: "wti",
      nameAr: "نفط WTI",
      nameEn: "WTI Crude",
      symbol: "WTI",
      priceUSD: 79.8,
      priceEGP: toEGP(79.8),
      change: rnd(),
      unit: "برميل",
      category: "oil",
      icon: "🛢️",
    },
    // ── FUEL (EGYPT GOVERNMENT-SET PRICES) ────────────────────────────────
    {
      id: "petrol-80",
      nameAr: "بنزين 80",
      nameEn: "Petrol 80",
      symbol: "PET80",
      priceUSD: toUSD(EGY_FUEL_PRICES_EGP.petrol80),
      priceEGP: EGY_FUEL_PRICES_EGP.petrol80,
      change: 0,
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
      change: 0,
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
      change: 0,
      unit: "لتر",
      category: "fuel",
      icon: "⛽",
    },
    // gasStove: 225.0,
    {
      id: "kerosene",
      nameAr: "الكيروسين",
      nameEn: "Kerosene",
      symbol: "KERO",
      priceUSD: toUSD(EGY_FUEL_PRICES_EGP.kerosene),
      priceEGP: EGY_FUEL_PRICES_EGP.kerosene,
      change: 0,
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
      change: 0,
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
      change: 0,
      unit: "لتر",
      category: "fuel",
      icon: "⛽",
    },
    {
      id: "diesel",
      nameAr: "سولار (ديزل)",
      nameEn: "Diesel",
      symbol: "DIESEL",
      priceUSD: toUSD(EGY_FUEL_PRICES_EGP.diesel),
      priceEGP: EGY_FUEL_PRICES_EGP.diesel,
      change: 0,
      unit: "لتر",
      category: "fuel",
      icon: "⛽",
    },
  ];
}
