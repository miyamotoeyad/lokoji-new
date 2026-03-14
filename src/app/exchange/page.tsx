import { Metadata } from "next";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import ExchangeClient from "./ExchangeClient";
import { computeChanges, getExchangeRates, getPreviousExchangeRates } from "@/lib/Data/exchangeData";


const title = "أسعار العملات"
const description = "تابع جميع العملات الأجنبية وأسعارها مقابل الجنيه المصري لحظة بلحظة."

export const metadata: Metadata = generateStaticMetadata({
  title,
  description,
  url: "/exchange",
});

export default async function ExchangePage() {
  const [exchangeData, previousRates] = await Promise.all([
    getExchangeRates("USD"),
    getPreviousExchangeRates("USD"),
  ]);

  const changes = computeChanges(exchangeData.rates, previousRates);

  return <ExchangeClient initialData={{ exchangeData, changes }} />;
}
