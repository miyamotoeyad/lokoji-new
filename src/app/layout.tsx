import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Provider from "./Provider";
import ScrollButton from "@/components/Client/ScrollBtn";
import CookieBanner from "@/components/Client/CookieBanner";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});

const title = "%s — لوكوجي";
const desc =
  "تابع الاقتصاد والسوق المصري والعالمي بضغطة واحدة - رؤية تحليلية قومية";
const siteUrl =
  process.env.NEXT_PUBLIC_DOMAIN_URL || "https://lokoji.vercel.app";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#16213e" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "لوكوجي — تابع سوقك",
    template: title,
  },
  description: desc,
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    title: "لوكوجي — تابع سوقك",
    description: desc,
    locale: "ar_EG",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "لوجو لوكوجي الاقتصادي",
      },
    ],
  },
  twitter: {
    site: "@LokojiEco",
    card: "summary_large_image",
  },
  verification: {
    google: "SAdpay-liv1rI5Wv_WMEhQWbAXRtsm96riCif7zyOzs",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`
          ${ibmPlexArabic.variable} ${ibmPlexArabic.className}
          antialiased
          bg-background text-foreground
          transition-colors duration-300
        `}
      >
        <Provider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="grow">{children}</main>
            <Footer />
          </div>
          <ScrollButton />
          <CookieBanner />
        </Provider>
      </body>
    </html>
  );
}
