"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import {
  RiFacebookCircleFill,
  RiTwitterXFill,
  RiTelegramFill,
  RiMailSendLine,
  RiCheckLine,
} from "react-icons/ri";
import { footerLinks } from "@/lib/Menus/footerMenu";
import { NavLinks } from "@/lib/Menus/navMenu";

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

interface NewsletterForm {
  email: string;
}

export default function Footer() {
  const { resolvedTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { isSubmitSuccessful, isSubmitting, errors },
  } = useForm<NewsletterForm>();

  const onSubmit = async (data: NewsletterForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
  };

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
              <Link
                href="/"
                className="hover:opacity-80 transition-opacity w-fit"
              >
                <Image
                  src={
                    resolvedTheme === "dark" ? "/Logo.svg" : "/Black Logo.svg"
                  }
                  alt="لوجو لوكوجي"
                  width={160}
                  height={52}
                  priority
                  suppressHydrationWarning
                />
              </Link>

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
          <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden h-fit lg:sticky lg:top-34">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-brand/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-brand/10 rounded-2xl flex items-center justify-center">
                  <RiMailSendLine size={20} className="text-primary-brand" />
                </div>
                <div>
                  <h2 className="text-lg m-0 font-black text-foreground">
                    النشرة البريدية
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-bold">
                    أسبوعياً · مجاناً
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                سجل بريدك الإلكتروني علشان توصلك أهم تحليلات البورصة والذهب
                أسبوعياً.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <input
                  type="email"
                  placeholder="أكتب بريدك الإلكتروني"
                  {...register("email", {
                    required: true,
                    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  })}
                  className={`w-full bg-muted border-2 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-300 ${
                    errors.email
                      ? "border-primary-brand"
                      : "border-transparent focus:border-primary-brand"
                  }`}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full bg-primary-brand hover:bg-primary-brand/90 disabled:opacity-50 text-white font-black py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-primary-brand/20 active:scale-95"
                >
                  {isSubmitting ? "جاري التسجيل..." : "اشترك الآن"}
                </button>
              </form>

              {isSubmitSuccessful && (
                <div className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold py-3 rounded-2xl">
                  <RiCheckLine size={16} />
                  <span>شكراً لاشتراكك! انتظرنا في بريدك قريباً ❤️</span>
                </div>
              )}
            </div>
          </div>
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
