import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Provider from "./Provider";
import ScrollButton from "@/components/Client/ScrollBtn";
import CookieBanner from "@/components/Client/CookieBanner";

import {
  generateBreadcrumbSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/Schemas/schemas";

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300" ,"400", "600", "700"], 
  variable: "--font-ibm-plex",
  display: "swap",
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
        url: "/main.webp",
        width: 1200,
        height: 630,
        alt: "لوكوجي الاقتصادي",
      },
    ],
  },
  icons: {
    icon: [
      { url: "/icon0.svg", type: "image/svg+xml" }, // "any" for .ico format
      { url: "/icon1.png", type: "image/png", sizes: "96x96" }, // "any" for .ico format
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
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
      <head>
        <link rel="preconnect" href="https://images.ctfassets.net" />
        <meta name="apple-mobile-web-app-title" content="Lokoji" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbSchema()),
          }}
        />
      </head>
      <body
        className={`
          ${ibmPlexArabic.variable}
           ${ibmPlexArabic.className}
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
        <GoogleAnalytics gaId="G-L2L744B91L" />
      </body>
    </html>
  );
}
