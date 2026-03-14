import { lokojiOrganization } from "./organizationSchema";

// ── Types shared across market schemas ───────────────────────────────────────
interface StockData {
  ticker: string;
  nameAr: string;
  nameEn: string;
  price: number;
  change: number;
  changePercent: number;
  positive: boolean;
  exchange: string;
  sector?: string;
  marketCap?: number;
  volume?: number;
  slug: string;
}

interface EGStockData {
  code: string;
  titleAr: string;
  titleEn: string;
  price: number;
  changePercent: number;
  positive: boolean;
  volume?: number;
  slug: string;
}

interface CryptoData {
  id: string | number;
  name: string;
  symbol: string;
  price: number;
  changePercent: number;
  positive: boolean;
  slug?: string;
}

interface ETFData {
  ticker: string;
  nameAr: string;
  nameEn: string;
  price: number;
  changePercent: number;
  positive: boolean;
}

interface ETFDataSlug {
  titleEn: string;
  title: string;
  ticker: string;
  slug: string;
  point: number;
  currency: string;
}

interface CommodityData {
  id: string;
  nameAr: string;
  nameEn: string;
  symbol: string;
  priceUSD: number;
  priceEGP: number;
  change: number;
  unit: string;
  category: string;
}

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.com";

export function getJsonLdWorldMarketListing(indices: { ticker: string; title: string; titleEn: string; price: number; slug: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "المؤشرات العالمية — لوكوجي",
    description: "تابع أداء أهم المؤشرات المالية حول العالم.",
    url: `${siteUrl}/world-market`,
    hasPart: indices.map((i) => ({
      "@type": "FinancialProduct",
      name: i.titleEn,
      alternateName: i.title,
      tickerSymbol: i.ticker,
      url: `${siteUrl}/world-market/${i.slug}`,
      offers: { "@type": "Offer", price: i.price, priceCurrency: "USD" },
    })),
  };
}

// ── World Stock Single Page ───────────────────────────────────────────────────
export function getJsonLdWorldStock(stock: StockData) {
  const stockUrl = `${siteUrl}/world-stocks/${stock.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: stock.nameEn,
    alternateName: stock.nameAr,
    tickerSymbol: stock.ticker,
    url: stockUrl,
    "@id": stockUrl,
    description: `سعر سهم ${stock.nameAr} (${stock.ticker}) مباشرة — ${stock.exchange}`,
    offers: {
      "@type": "Offer",
      price: stock.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    provider: lokojiOrganization,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية",        item: siteUrl },
        { "@type": "ListItem", position: 2, name: "الأسهم العالمية", item: `${siteUrl}/world-stocks` },
        { "@type": "ListItem", position: 3, name: stock.nameAr,      item: stockUrl },
      ],
    },
  };
}

// ── World Stocks Listing ──────────────────────────────────────────────────────
export function getJsonLdWorldStocksListing(stocks: StockData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "أسهم الشركات العالمية — لوكوجي",
    description: "تابع أسعار أكبر الشركات العالمية مباشرة.",
    url: `${siteUrl}/world-stocks`,
    hasPart: stocks.map((s) => ({
      "@type": "FinancialProduct",
      name: s.nameEn,
      alternateName: s.nameAr,
      tickerSymbol: s.ticker,
      url: `${siteUrl}/world-stocks/${s.slug}`,
      offers: {
        "@type": "Offer",
        price: s.price,
        priceCurrency: "USD",
      },
    })),
  };
}

// ── Egyptian Market (EGX) Single Stock ───────────────────────────────────────
export function getJsonLdEGXStock(stock: EGStockData) {
  const stockUrl = `${siteUrl}/eg-market/${stock.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: stock.titleEn,
    alternateName: stock.titleAr,
    tickerSymbol: stock.code,
    url: stockUrl,
    "@id": stockUrl,
    description: `سعر سهم ${stock.titleAr} (${stock.code}) في البورصة المصرية`,
    offers: {
      "@type": "Offer",
      price: stock.price,
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
    },
    provider: lokojiOrganization,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية",      item: siteUrl },
        { "@type": "ListItem", position: 2, name: "البورصة المصرية", item: `${siteUrl}/eg-market` },
        { "@type": "ListItem", position: 3, name: stock.titleAr,   item: stockUrl },
      ],
    },
  };
}

// ── Egyptian Market Listing ───────────────────────────────────────────────────
export function getJsonLdEGXListing(stocks: EGStockData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "البورصة المصرية — لوكوجي",
    description: "تابع أسعار أسهم الشركات المدرجة في البورصة المصرية.",
    url: `${siteUrl}/eg-market`,
    hasPart: stocks.map((s) => ({
      "@type": "FinancialProduct",
      name: s.titleEn,
      alternateName: s.titleAr,
      tickerSymbol: s.code,
      url: `${siteUrl}/eg-market/${s.slug}`,
      offers: {
        "@type": "Offer",
        price: s.price,
        priceCurrency: "EGP",
      },
    })),
  };
}

// ── Crypto Single ─────────────────────────────────────────────────────────────
export function getJsonLdCrypto(coin: CryptoData) {
  const coinUrl = `${siteUrl}/crypto/${coin.slug ?? coin.symbol.toLowerCase()}`;
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: coin.name,
    tickerSymbol: coin.symbol,
    url: coinUrl,
    "@id": coinUrl,
    description: `سعر ${coin.name} (${coin.symbol}) مقابل الدولار واليوم`,
    offers: {
      "@type": "Offer",
      price: coin.price,
      priceCurrency: "USD",
    },
    provider: lokojiOrganization,
  };
}

// ── Crypto Listing ────────────────────────────────────────────────────────────
export function getJsonLdCryptoListing(coins: CryptoData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "أسعار العملات الرقمية — لوكوجي",
    description: "تابع أسعار البيتكوين والإيثيريوم وأكثر من 100 عملة رقمية.",
    url: `${siteUrl}/crypto`,
    hasPart: coins.map((c) => ({
      "@type": "FinancialProduct",
      name: c.name,
      tickerSymbol: c.symbol,
      url: `${siteUrl}/crypto/${c.slug ?? c.symbol.toLowerCase()}`,
      offers: {
        "@type": "Offer",
        price: c.price,
        priceCurrency: "USD",
      },
    })),
  };
}

// ── ETFs Listing ──────────────────────────────────────────────────────────────
export function getJsonLdETFsListing(etfs: ETFData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "صناديق الاستثمار المتداولة — لوكوجي",
    description: "تابع أسعار صناديق ETF العالمية مباشرة.",
    url: `${siteUrl}/etfs`,
    hasPart: etfs.map((e) => ({
      "@type": "FinancialProduct",
      name: e.nameEn,
      alternateName: e.nameAr,
      tickerSymbol: e.ticker,
      offers: {
        "@type": "Offer",
        price: e.price,
        priceCurrency: "USD",
      },
    })),
  };
}

// ── ETF Single Page ───────────────────────────────────────────────────────────
export function getJsonLdETFSlug(item: ETFDataSlug) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: item.titleEn,
    alternateName: item.title,
    tickerSymbol: item.ticker,
    url: `${siteUrl}/etfs/${item.slug}`,
    "@id": `${siteUrl}/etfs/${item.slug}`,
    description: `تابع سعر ${item.titleEn} (${item.ticker}) مباشرة`,
    offers: {
      "@type": "Offer",
      price: item.point,
      priceCurrency: item.currency,
    },
    provider: lokojiOrganization,
  };
}

// ── Commodities Listing ───────────────────────────────────────────────────────
export function getJsonLdCommoditiesListing(commodities: CommodityData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "أسعار السلع والمعادن — لوكوجي",
    description: "أسعار الذهب والفضة والنفط والوقود مقابل الجنيه المصري.",
    url: `${siteUrl}/commodities`,
    hasPart: commodities.map((c) => ({
      "@type": "Product",
      name: c.nameEn,
      alternateName: c.nameAr,
      description: `سعر ${c.nameAr} · ${c.unit}`,
      offers: {
        "@type": "Offer",
        price: c.priceEGP,
        priceCurrency: "EGP",
      },
    })),
  };
}

// ── Exchange Rates Page ───────────────────────────────────────────────────────
export function getJsonLdExchangeRates(
  rates: Record<string, number>,
  base = "USD",
) {
  const topCurrencies = ["EGP", "EUR", "GBP", "SAR", "AED", "KWD", "JPY", "CAD"];

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "أسعار العملات الأجنبية — لوكوجي",
    description: "تابع أسعار صرف العملات الأجنبية مقابل الجنيه المصري.",
    url: `${siteUrl}/exchange`,
    mainEntity: {
      "@type": "ItemList",
      name: `أسعار الصرف مقابل ${base}`,
      itemListElement: topCurrencies
        .filter((code) => rates[code])
        .map((code, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${base}/${code}`,
          item: {
            "@type": "ExchangeRateSpecification",
            currency: code,
            currentExchangeRate: {
              "@type": "UnitPriceSpecification",
              price: rates[code],
              priceCurrency: code,
            },
          },
        })),
    },
    provider: lokojiOrganization,
  };
}