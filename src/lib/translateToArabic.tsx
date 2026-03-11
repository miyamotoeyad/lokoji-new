import translate from "translate";

translate.engine = "google";

export async function translateToArabic(englishText: string): Promise<string> {
  if (!englishText || englishText === "Unknown") return "غير معروف";

  const commonStocks: Record<string, string> = {
    // Top Banking & Finance
    "Commercial International Bank": "البنك التجاري الدولي",
    "Commercial International Bank-Egypt (CIB)": "البنك التجاري الدولي",
    "Fawry For Banking Technology And Electronic Payment": "فوري لتكنولوجيا البنوك",
    "Abu Dhabi Islamic Bank- Egypt": "مصرف أبوظبي الإسلامي",
    "EFG Holding": "إي اف جي هيرميس",
    "EFG Hermes": "إي اف جي هيرميس",
    "Faisal Islamic Bank of Egypt": "بنك فيصل الإسلامي",
    "Credit Agricole Egypt": "كريدي أجريكول مصر",
    "Housing & Development Bank": "بنك التعمير والإسكان",
    "Qatar National Bank Alahly": "بنك قطر الوطني",
    "e-finance For Digital and Financial Investments": "إي فاينانس للاستثمارات",

    // Real Estate & Construction
    "Talaat Moustafa Group": "مجموعة طلعت مصطفى",
    "T M G Holding": "مجموعة طلعت مصطفى",
    "Palm Hills Development Company": "بالم هيلز للتعمير",
    "Emaar Misr for Development": "إعمار مصر للتنمية",
    "Madinet Masr": "مدينة مصر للإسكان",
    "Heliopolis Housing": "مصر الجديدة للإسكان",
    "Orascom Construction PLC": "أوراسكوم للإنشاءات",
    "Orascom Development Egypt": "أوراسكوم للتنمية مصر",

    // Industrial, Energy & Materials
    "Abou Kir Fertilizers": "أبو قير للأسمدة",
    "Misr Fertilizers Production Company - Mopco": "موبكو للأسمدة",
    "Eastern Company": "الشرقية - إيسترن كومباني",
    "Elsewedy Electric": "السويدي إليكتريك",
    "Egypt Aluminum": "مصر للألومنيوم",
    "Sidi Kerir Petrochemicals": "سيدي كرير للبتروكيماويات",
    "Alexandria Mineral Oils Company": "الإسكندرية للزيوت المعدنية (أموك)",
    "Egyptian Chemical Industries (Kima)": "كيما - الصناعات الكيماوية",

    // Telecom & Others
    "Telecom Egypt": "المصرية للاتصالات",
    "Juhayna Food Industries": "جهينة للصناعات الغذائية",
    "Edita Food Industries S.A.E": "إيديتا للصناعات الغذائية",
    "Oriental Weavers": "النساجون الشرقيون",
    "Ibnsina Pharma": "ابن سينا فارما",
  };

  // Check if we have the translation locally
  const normalizedKey = englishText.trim();
  if (commonStocks[normalizedKey]) {
    return commonStocks[normalizedKey];
  }

  // 2. Global Translate (Fallback for less common stocks)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const result = await translate(normalizedKey, { 
      from: "en", 
      to: "ar",
    });
    
    clearTimeout(timeout);
    return result;
  } catch (error) {
    // If the API fails or times out, return the original English text
    console.warn(`Translation failed for: ${englishText}. Falling back to original.`);
    return englishText;
  }
}

export const CURRENCY_NAMES_AR: Record<string, { ar: string; symbol: string }> = {
  // Major
  USD: { ar: "دولار أمريكي",        symbol: "$"  },
  EUR: { ar: "يورو",                symbol: "€"  },
  GBP: { ar: "جنيه إسترليني",       symbol: "£"  },
  JPY: { ar: "ين ياباني",           symbol: "¥"  },
  CHF: { ar: "فرنك سويسري",         symbol: "Fr" },
  CNY: { ar: "يوان صيني",           symbol: "¥"  },
  CAD: { ar: "دولار كندي",          symbol: "C$" },
  AUD: { ar: "دولار أسترالي",       symbol: "A$" },
  NZD: { ar: "دولار نيوزيلندي",     symbol: "NZ$"},
  HKD: { ar: "دولار هونج كونج",     symbol: "HK$"},
  SGD: { ar: "دولار سنغافوري",      symbol: "S$" },
  KRW: { ar: "وون كوري",            symbol: "₩"  },
  INR: { ar: "روبية هندية",         symbol: "₹"  },
  BRL: { ar: "ريال برازيلي",        symbol: "R$" },
  MXN: { ar: "بيزو مكسيكي",        symbol: "$"  },
  SEK: { ar: "كرون سويدي",          symbol: "kr" },
  NOK: { ar: "كرون نرويجي",         symbol: "kr" },
  DKK: { ar: "كرون دنماركي",        symbol: "kr" },

  // Arab & Middle East
  EGP: { ar: "جنيه مصري",          symbol: "ج.م" },
  SAR: { ar: "ريال سعودي",          symbol: "ر.س" },
  AED: { ar: "درهم إماراتي",        symbol: "د.إ" },
  KWD: { ar: "دينار كويتي",         symbol: "د.ك" },
  QAR: { ar: "ريال قطري",           symbol: "ر.ق" },
  BHD: { ar: "دينار بحريني",        symbol: "د.ب" },
  OMR: { ar: "ريال عماني",          symbol: "ر.ع" },
  JOD: { ar: "دينار أردني",         symbol: "د.أ" },
  LBP: { ar: "ليرة لبنانية",        symbol: "ل.ل" },
  IQD: { ar: "دينار عراقي",         symbol: "د.ع" },
  LYD: { ar: "دينار ليبي",          symbol: "د.ل" },
  TND: { ar: "دينار تونسي",         symbol: "د.ت" },
  MAD: { ar: "درهم مغربي",          symbol: "د.م" },
  DZD: { ar: "دينار جزائري",        symbol: "د.ج" },
  SDG: { ar: "جنيه سوداني",         symbol: "ج.س" },

  // Africa & Others
  ZAR: { ar: "راند جنوب أفريقي",    symbol: "R"  },
  TRY: { ar: "ليرة تركية",          symbol: "₺"  },
  RUB: { ar: "روبل روسي",           symbol: "₽"  },
  PKR: { ar: "روبية باكستانية",     symbol: "₨"  },
  MYR: { ar: "رينغيت ماليزي",       symbol: "RM" },
  THB: { ar: "بات تايلاندي",        symbol: "฿"  },
  IDR: { ar: "روبية إندونيسية",     symbol: "Rp" },
  PLN: { ar: "زلوتي بولندي",        symbol: "zł" },
  CZK: { ar: "كورونا تشيكية",       symbol: "Kč" },
  HUF: { ar: "فورنت مجري",          symbol: "Ft" },
};

// Get Arabic name for a currency code
export function getCurrencyNameAr(code: string): string {
  return CURRENCY_NAMES_AR[code]?.ar ?? code;
}

// Get currency symbol
export function getCurrencySymbol(code: string): string {
  return CURRENCY_NAMES_AR[code]?.symbol ?? code;
}

// Format a rate with Arabic currency name
// e.g. formatRateAr("USD", "EGP", 50.25) → "1 دولار أمريكي = 50.25 جنيه مصري"
export function formatRateAr(from: string, to: string, rate: number): string {
  const fromName = getCurrencyNameAr(from);
  const toName   = getCurrencyNameAr(to);
  return `1 ${fromName} = ${rate.toLocaleString("ar-EG")} ${toName}`;
}