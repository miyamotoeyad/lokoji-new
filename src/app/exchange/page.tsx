import { Metadata } from "next";
import ExchangePage from "./ExchangeClient";

export const metadata: Metadata = {
  title: "أسعار العملات",
  description:
    "تابع جميع العملات الأجنبية وأسعارها مقابل الجنيه المصري لحظة بلحظة.",
  openGraph: {
    title: "محول العملات - لوكوجي",
    description: "أسعار الصرف الحية مقابل الجنيه المصري",
  },
};

export default function Page() {
  return <ExchangePage />;
}
