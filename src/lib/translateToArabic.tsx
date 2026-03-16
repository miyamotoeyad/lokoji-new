import translate from "translate";
import { CURRENCY_NAMES_AR } from "./Array/CurrencyNameAr";

translate.engine = "google";

export async function translateToArabic(englishText: string): Promise<string> {
  if (!englishText || englishText === "Unknown") return "غير معروف";

  const commonStocks: Record<string, string> = {
    // Top Banking & Finance
    "Commercial International Bank": "البنك التجاري الدولي",
    "Commercial International Bank-Egypt (CIB)": "البنك التجاري الدولي",
    "Fawry For Banking Technology And Electronic Payment":
      "فوري لتكنولوجيا البنوك",
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
    console.warn(
      `Translation failed for: ${englishText}. Falling back to original.`,
    );
    return englishText;
  }
}

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
  const toName = getCurrencyNameAr(to);
  return `1 ${fromName} = ${rate.toLocaleString("ar-EG")} ${toName}`;
}
