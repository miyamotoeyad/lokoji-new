"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { RiCloseLine, RiShieldCheckLine } from "@remixicon/react";
import { CookieIcon } from "lucide-react";

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set("cookieConsent", "true", { expires: 365 });
    setConsentGiven(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    Cookies.set("cookieConsent", "false", { expires: 30 });
    setIsVisible(false);
  };

  useEffect(() => {
    if (consentGiven && typeof window !== "undefined") {
      (
        window as {
          gtag?: (
            command: string,
            action: string,
            params: Record<string, string>,
          ) => void;
        }
      ).gtag?.("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
      });
    }
  }, [consentGiven]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-100"
      dir="rtl"
    >
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-6">
        {/* Background accent */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary-brand/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary-brand/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
                <CookieIcon size={16} />
              </div>
              <h3 className="text-sm font-black text-foreground">
                بنستخدم الكوكيز 🍪
              </h3>
            </div>
            <button
              onClick={handleDecline}
              className="w-7 h-7 rounded-xl bg-muted hover:bg-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <RiCloseLine size={14} />
            </button>
          </div>

          {/* Body */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            بنستخدم الكوكيز عشان نحسّن تجربتك على الموقع ونحلل الزيارات.
            باستخدامك للموقع، بتوافق على{" "}
            <Link
              href="/privacy-policy"
              className="text-primary-brand font-black hover:underline underline-offset-4 transition-all"
            >
              سياسة الخصوصية
            </Link>{" "}
            بتاعتنا.
          </p>

          {/* Trust note */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-bold">
            <RiShieldCheckLine size={12} className="text-green-500" />
            <span>بياناتك محمية ومش بتتشارك مع أي طرف تالت</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleAccept}
              className="cursor-pointer flex-1 bg-primary-brand hover:bg-primary-brand/90 text-white text-sm font-black py-2.5 rounded-2xl shadow-lg shadow-primary-brand/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            >
              موافق، تمام 👍
            </button>
            <button
              onClick={handleDecline}
              className="cursor-pointer flex-1 bg-muted hover:bg-border text-muted-foreground hover:text-foreground text-sm font-black py-2.5 rounded-2xl border border-border transition-all duration-200"
            >
              مش موافق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
