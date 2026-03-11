import Link from "next/link";
import {
  RiFacebookCircleFill,
  RiTwitterXFill,
  RiTelegramFill,
} from "@remixicon/react";
import { footerLinks } from "@/lib/Menus/footerMenu";
import { NavLinks } from "@/lib/Menus/navMenu";
import FooterLogo from "./FooterLogo";
import NewsletterFooter from "../Client/Newsletter/NewsletterFooter";

const socials = [
  {
    icon: RiFacebookCircleFill,
    href: "https://facebook.com/lokoji.eco",
    label: "فيسبوك",
    color:
      "hover:text-[#1877F2] hover:border-[#1877F2]/30 hover:bg-[#1877F2]/10",
  },
  {
    icon: RiTwitterXFill,
    href: "https://twitter.com/LokojiEco",
    label: "تويتر",
    color: "hover:text-foreground hover:border-border hover:bg-muted",
  },
  {
    icon: RiTelegramFill,
    href: "https://t.me/lokoji_eco",
    label: "تيليجرام",
    color:
      "hover:text-[#26A5E4] hover:border-[#26A5E4]/30 hover:bg-[#26A5E4]/10",
  },
];

export default function Footer() {

  const mainLinks = NavLinks.filter((l) => l.link && l.id !== 1);
  const marketItem = NavLinks.find((l) => l.id === 10);

  return (
    <footer
      className="bg-card border-t border-border pt-16 pb-8 transition-colors duration-300"
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        {/* ── MAIN GRID: 2 cols ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* ── LEFT: BRAND + NAV ── */}
          <div className="flex flex-col gap-8">
            {/* Brand */}
            <div className="flex flex-col gap-6">
              <FooterLogo />

              <p className="text-muted-foreground text-sm leading-loose max-w-sm">
                لوكوجي{" "}
                <span className="text-primary-brand font-black">ⲗⲟⲕⲟϫⲓ</span> هي
                وجهتك للتحليل الاقتصادي القومي. نترجم الأرقام المعقدة لأبسط
                البيانات تدعم قراراتك الاستثمارية.
              </p>

              <div className="flex gap-3">
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-10 h-10 flex items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground transition-all duration-200 ${s.color}`}
                  >
                    <s.icon size={18} />
                  </Link>
                ))}
              </div>
            </div>

            {/* ── NAV LINKS under logo ── */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
              {/* Column 1: Main pages */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-primary-brand uppercase tracking-widest">
                  روابط سريعة
                </h3>
                <ul className="space-y-3">
                  {mainLinks.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.link!}
                        className="text-sm font-bold text-muted-foreground hover:text-primary-brand transition-colors duration-200"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Markets sublinks */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-black text-primary-brand uppercase tracking-widest">
                  الأسواق
                </h3>
                <ul className="space-y-3">
                  {marketItem?.subLinks?.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={sub.link}
                        className="text-sm font-bold text-muted-foreground hover:text-primary-brand transition-colors duration-200"
                      >
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-4xl font-black text-muted-foreground/10 select-none pointer-events-none leading-none">
              ⲗⲟⲕⲟϫⲓ
            </p>
          </div>

          {/* ── RIGHT: NEWSLETTER ── */}
          <NewsletterFooter />
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="pt-8 border-t border-border flex lg:flex-row justify-between flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={`${link.href}`}
                className="text-xs font-bold text-muted-foreground hover:text-primary-brand transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-muted-foreground text-xs lg:mb-0 mb-16 text-center">
            كل الحقوق محفوظة لدى{" "}
            <span className="text-foreground font-black">لوكوجي</span> &copy;{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
