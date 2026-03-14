import { InfographicCardData } from "@/app/infographics/InfographicGrid";
import { lokojiOrganization } from "./organizationSchema";
import { TypeArticlesSkeleton, TypeAuthorsSkeleton } from "@/types";
import { Asset, AssetFile, Entry } from "contentful";

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

function getContentfulImageUrl(image: unknown): string {
  if (!image || typeof image !== "object" || !("fields" in image))
    return `${siteUrl}/og-image.png`;
  const asset = image as Asset<undefined, string>;
  const file = asset.fields.file as AssetFile | undefined;
  return file?.url ? `https:${file.url}` : `${siteUrl}/og-image.png`;
}

function getAuthorName(author: unknown): string {
  if (!author || typeof author !== "object" || !("fields" in author))
    return "لوكوجي";
  const fields = (author as Entry<TypeAuthorsSkeleton>).fields;
  return typeof fields.name === "string" ? fields.name : "لوكوجي";
}

function getAuthorSlug(author: unknown): string {
  if (!author || typeof author !== "object" || !("fields" in author)) return "";
  const fields = (author as Entry<TypeAuthorsSkeleton>).fields;
  return typeof fields.slug === "string" ? fields.slug : "";
}

// ── Article JSON-LD ──────────────────────────────────────────────────────────
export function getJsonLdArticle(
  post: Entry<TypeArticlesSkeleton, undefined, string>,
) {
  const fields = post.fields;
  const imageUrl = getContentfulImageUrl(fields.image);
  const slug = fields.slug as string;
  const title = fields.title as string;
  const subtitle = (fields.subtitle as string | undefined) ?? "";
  const category = fields.category as string | string[] | undefined;
  const tags = (fields.tag as string[] | undefined) ?? [];
  const authorName = getAuthorName(fields.author);
  const authorSlug = getAuthorSlug(fields.author);
  const articleUrl = `${siteUrl}/post/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    "@id": articleUrl,
    url: articleUrl,
    datePublished: post.sys.createdAt,
    dateModified: post.sys.updatedAt,
    thumbnailUrl: imageUrl,
    articleSection: Array.isArray(category)
      ? category[0]
      : (category ?? "اقتصاد"),
    keywords: tags,
    inLanguage: "ar",
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      contentUrl: imageUrl,
      width: 1200,
      height: 630,
      caption: title,
    },
    description: subtitle,
    author: {
      "@type": "Person",
      name: authorName,
      url: `${siteUrl}/authors/${authorSlug}`,
    },
    publisher: lokojiOrganization,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
      name: title,
      description: subtitle,
      inLanguage: "ar",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: imageUrl,
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "المقالات",
            item: `${siteUrl}/articles`,
          },
          { "@type": "ListItem", position: 3, name: title, item: articleUrl },
        ],
      },
    },
  };
}

// ── Image JSON-LD ────────────────────────────────────────────────────────────
export function getJsonLdImage(
  post: Entry<TypeArticlesSkeleton, undefined, string>,
) {
  const imageUrl = getContentfulImageUrl(post.fields.image);

  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: imageUrl,
    creditText: "لوكوجي",
    license: `${siteUrl}/privacy-policy`,
    acquireLicensePage: `${siteUrl}/privacy-policy`,
    creator: { "@type": "Organization", name: "لوكوجي" },
    copyrightNotice: `لوكوجي ${new Date().getFullYear()}`,
  };
}

// ── Infographic Listing JSON-LD ───────────────────────────────────────────────
export function getJsonLdInfographicListing(
  infographics: InfographicCardData[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "إنفوجرافيك لوكوجي",
    description:
      "تبسيط البيانات الاقتصادية المعقدة من خلال رسوم بيانية وتوضيحية سهلة الفهم.",
    url: `${siteUrl}/infographics`,
    hasPart: infographics.map((info) => ({
      "@type": "ImageObject",
      name: info.title,
      url: `${siteUrl}/infographics/${info.slug}`,
      contentUrl: info.imageUrl,
      datePublished: info.date,
    })),
  };
}

// ── Infographic Single JSON-LD ────────────────────────────────────────────────
export function getJsonLdInfographic(
  slug: string,
  title: string,
  description: string,
  publicationDate: string,
  imageUrl: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: title,
    description,
    url: `${siteUrl}/infographics/${slug}`,
    contentUrl: imageUrl,
    datePublished: publicationDate,
    creditText: "لوكوجي",
    creator: lokojiOrganization,
    copyrightNotice: `لوكوجي ${new Date().getFullYear()}`,
  };
}

export function getJsonLdWorldMarketListing(
  indices: {
    ticker: string;
    title: string;
    titleEn: string;
    price: number;
    slug: string;
  }[],
) {
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
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "الأسهم العالمية",
          item: `${siteUrl}/world-stocks`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: stock.nameAr,
          item: stockUrl,
        },
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
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "البورصة المصرية",
          item: `${siteUrl}/eg-market`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: stock.titleAr,
          item: stockUrl,
        },
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
  const topCurrencies = [
    "EGP",
    "EUR",
    "GBP",
    "SAR",
    "AED",
    "KWD",
    "JPY",
    "CAD",
  ];

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
