import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import { Metadata } from "next";
import Link from "next/link";
import {
  RiHeart2Fill,
  RiCodeLine,
  RiFlashlightLine,
  RiShieldStarLine,
  RiArrowLeftLine,
  RiSmartphoneLine,
  RiBankCardLine,
} from "@remixicon/react";

export const metadata: Metadata = generateStaticMetadata({
  title: "ادعم لوكوجي",
  description: "ساعدنا في استمرار تقديم تحليلات اقتصادية دقيقة ومبسطة للجميع.",
  url: "/support",
});

const tiers = [
  {
    title: "دعم بسيط",
    price: "50",
    desc: "تمنحنا دفعة للاستمرار في تغطية أخبار السوق اليومية.",
    icon: RiCodeLine,
    link: "#",
    featured: false,
  },
  {
    title: "دعم المحترفين",
    price: "200",
    desc: "تساعدنا على تطوير أدوات تحليلية ورسوم بيانية أكثر دقة.",
    icon: RiFlashlightLine,
    link: "#",
    featured: true,
  },
  {
    title: "شريك النجاح",
    price: "500",
    desc: "تساهم بشكل مباشر في رواتب فريق العمل والبحث الميداني.",
    icon: RiShieldStarLine,
    link: "#",
    featured: false,
  },
];

const paymentMethods = [
  { icon: RiSmartphoneLine, label: "فودافون كاش", value: "010XXXXXXXX" },
  { icon: RiBankCardLine, label: "Instapay", value: "lokoji@instapay" },
];

export default function Support() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-16" dir="rtl">
      {/* ── HERO ── */}
      <header className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-black">
          <RiHeart2Fill size={14} />
          <span>ادعم رسالتنا</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
          ساعدنا نخلي الاقتصاد <span className="text-primary-brand">أبسط</span>{" "}
          وأقرب للكل
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          لوكوجي منصة مستقلة، هدفنا تقديم الحقيقة الاقتصادية بعيداً عن التعقيد.
          دعمك المادي بيساعدنا نطور المحتوى، نحدث التقنيات، ونحافظ على
          استقلاليتنا.
        </p>
      </header>

      {/* ── TIERS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return tier.featured ? (
            /* Featured tier — dark card */
            <div
              key={tier.title}
              className="relative bg-dprimary dark:bg-card rounded-3xl p-8 text-white flex flex-col overflow-hidden"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-brand/20 rounded-full blur-3xl pointer-events-none" />

              <span className="absolute top-5 left-5 bg-primary-brand text-white text-[10px] font-black px-3 py-1 rounded-full">
                الأكثر اختياراً
              </span>

              <div className="relative z-10 flex flex-col flex-1 pt-6">
                <div className="w-12 h-12 rounded-2xl bg-primary-brand/20 flex items-center justify-center text-primary-brand mb-5">
                  <Icon size={24} />
                </div>

                <h3 className="text-lg font-black text-white mb-1">{tier.title}</h3>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black tabular-nums">
                    {tier.price}
                  </span>
                  <span className="text-white/50 text-sm font-bold">ج.م</span>
                </div>

                <p className="text-sm text-white/60 leading-relaxed flex-1 mb-6">
                  {tier.desc}
                </p>
                <Link
                  href={tier.link}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-black text-sm bg-primary-brand hover:bg-primary-brand/90 transition-all duration-200 shadow-lg shadow-primary-brand/30 active:scale-95"
                >
                  <span>ادعم الآن</span>
                  <RiArrowLeftLine size={16} />
                </Link>
              </div>
            </div>
          ) : (
            /* Regular tier */
            <div
              key={tier.title}
              className="bg-card border border-border rounded-3xl p-8 flex flex-col hover:border-primary-brand/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand mb-5">
                <Icon size={24} />
              </div>

              <h3 className="text-lg font-black text-foreground mb-1">
                {tier.title}
              </h3>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-foreground tabular-nums">
                  {tier.price}
                </span>
                <span className="text-muted-foreground text-sm font-bold">
                  ج.م
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                {tier.desc}
              </p>

              <Link
                href={tier.link}
                className="btn flex items-center justify-center gap-2 w-full py-3.5 text-sm font-black"
              >
                <span>ادعم الآن</span>
                <RiArrowLeftLine size={16} />
              </Link>
            </div>
          );
        })}
      </div>

      {/* ── ALTERNATIVE PAYMENT ── */}
      <div className="bg-card border border-border rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
            <h2 className="text-xl font-black text-foreground">
              طرق تانية للدعم؟
            </h2>
          </div>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed max-w-sm">
            ممكن تدعمنا عن طريق فودافون كاش أو إنستاباي بشكل مباشر.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.label}
              className="flex items-center gap-3 bg-muted border border-border px-5 py-4 rounded-2xl hover:border-primary-brand/30 transition-colors duration-200"
            >
              <div className="w-9 h-9 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
                <method.icon size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
                  {method.label}
                </p>
                <p className="font-black text-foreground text-sm">
                  {method.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
