import { getExchangeRates } from "./exchangeData";
import { getETFs } from "./etfData";
import { getCommodities } from "./commoditiesData";

export interface TickerItem {
  id: string;
  title: string;
  num: string;
  arrow: "up" | "down";
}

export async function getTickerItems(): Promise<TickerItem[]> {
  try {
    const [exchangeData, etfs, commodities] = await Promise.all([
      getExchangeRates("USD"),
      getETFs(),
      getCommodities(),
    ]);

    const items: TickerItem[] = [];

    // ── EXCHANGE RATES ─────────────────────────────────────────────────────
    const egp = exchangeData.rates["EGP"] ?? 0;
    const eur = exchangeData.rates["EUR"] ?? 1;
    const gbp = exchangeData.rates["GBP"] ?? 1;

    items.push(
      {
        id: "usd-egp",
        title: "دولار / جنيه",
        num: egp.toFixed(2),
        arrow: "up",
      },
      {
        id: "eur-egp",
        title: "يورو / جنيه",
        num: (egp / eur).toFixed(2),
        arrow: "up",
      },
      {
        id: "gbp-egp",
        title: "إسترليني / جنيه",
        num: (egp / gbp).toFixed(2),
        arrow: "up",
      },
    );

    // ── EGX INDICES (from ETFs) ────────────────────────────────────────────
    const egx30 = etfs.find((e) => e.slug === "egx30");
    const egx70 = etfs.find((e) => e.slug === "egx70");
    const egx100 = etfs.find((e) => e.slug === "egx100");

    if (egx30)
      items.push({
        id: "egx30",
        title: "EGX30",
        num: egx30.point.toLocaleString("en-US", { maximumFractionDigits: 2 }),
        arrow: egx30.positive ? "up" : "down",
      });
    if (egx70)
      items.push({
        id: "egx70",
        title: "EGX70",
        num: egx70.point.toLocaleString("en-US", { maximumFractionDigits: 2 }),
        arrow: egx70.positive ? "up" : "down",
      });
    if (egx100)
      items.push({
        id: "egx100",
        title: "EGX100",
        num: egx100.point.toLocaleString("en-US", { maximumFractionDigits: 2 }),
        arrow: egx100.positive ? "up" : "down",
      });

    // ── US ETFs ────────────────────────────────────────────────────────────
    const spy = etfs.find((e) => e.slug === "spy");
    const qqq = etfs.find((e) => e.slug === "qqq");

    if (spy)
      items.push({
        id: "spy",
        title: "S&P 500",
        num: spy.point.toLocaleString("en-US", { maximumFractionDigits: 2 }),
        arrow: spy.positive ? "up" : "down",
      });
    if (qqq)
      items.push({
        id: "qqq",
        title: "ناسداك",
        num: qqq.point.toLocaleString("en-US", { maximumFractionDigits: 2 }),
        arrow: qqq.positive ? "up" : "down",
      });

    // ── COMMODITIES ───────────────────────────────────────────────────────
    const gold21 = commodities.find((c) => c.id === "gold-21k");
    const silver = commodities.find((c) => c.id === "silver-999");
    const brent = commodities.find((c) => c.id === "brent");

    if (gold21)
      items.push({
        id: "gold-21k",
        title: "ذهب عيار 21",
        num: `${gold21.priceEGP.toLocaleString()} ج.م`,
        arrow: gold21.change >= 0 ? "up" : "down",
      });
    if (silver)
      items.push({
        id: "silver-999",
        title: "فضة 999",
        num: `${silver.priceEGP.toLocaleString()} ج.م`,
        arrow: silver.change >= 0 ? "up" : "down",
      });
    if (brent)
      items.push({
        id: "brent-crude",
        title: "النفط برنت",
        num: `$${brent.priceUSD.toLocaleString()}`,
        arrow: brent.change >= 0 ? "up" : "down",
      });

    return items;
  } catch {
    return [];
  }
}
