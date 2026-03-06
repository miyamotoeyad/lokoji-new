import { Metadata } from "next";
import ExchangePage from "./ExchangeClient";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";


const title = "أسعار العملات"
const description = "تابع جميع العملات الأجنبية وأسعارها مقابل الجنيه المصري لحظة بلحظة."

export const metadata: Metadata = generateStaticMetadata({
  title,
  description,
  url: "/exchange",
});

export default function Page() {
  return <ExchangePage />;
}
