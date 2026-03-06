import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  RiBarChartBoxLine,
  RiPieChartLine,
  RiArrowLeftUpLine,
  RiNewspaperLine,
} from "react-icons/ri";

export const metadata: Metadata = {
  title: "إنفوجرافيك لوكوجي",
  description: "تبسيط البيانات الاقتصادية المعقدة من خلال رسوم بيانية وتوضيحية سهلة الفهم.",
};

const INFOGRAPHICS = [
  {
    id: 1,
    title: "تطور سعر صرف الدولار مقابل الجنيه (2024-2025)",
    category: "عملات",
    date: "4 مارس 2026",
    image: "/infographics/usd-egp-trend.jpg",
    slug: "usd-egp-trend",
  },
  {
    id: 2,
    title: "خريطة توزيع الاستثمارات في البورصة المصرية",
    category: "بورصة",
    date: "1 مارس 2026",
    image: "/infographics/egx-distribution.jpg",
    slug: "egx-distribution",
  },
  {
    id: 3,
    title: "كيف تشتري الذهب؟ دليل المبتدئين للادخار",
    category: "تعليمي",
    date: "28 فبراير 2026",
    image: "/infographics/gold-guide.jpg",
    slug: "gold-buying-guide",
  },
];

const categories = ["الكل", "عملات", "بورصة", "ذهب", "تقارير سنوية"];

export default function InfographicsPage() {
  return (
    <main className="container mx-auto px-4 py-10 space-y-16" dir="rtl">

      {/* ── PAGE HEADER ── */}
      <header className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-black">
          <RiBarChartBoxLine size={16} />
          <span>مركز البيانات المرئية</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
          الاقتصاد..{" "}
          <span className="text-primary-brand">بالأرقام والصور</span>
        </h1>

        <p className="text-muted-foreground text-lg font-medium leading-relaxed">
          نحول الأرقام الصعبة إلى تقارير بصرية بسيطة تساعدك على اتخاذ قرار
          استثماري أفضل في ثوانٍ.
        </p>
      </header>

      {/* ── CATEGORY FILTER ── */}
      <div className="flex justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`cursor-pointer shrink-0 px-6 py-2.5 rounded-full font-black text-sm transition-all border-2 ${
              i === 0
                ? "border-primary-brand bg-primary-brand text-white"
                : "btn"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── INFOGRAPHICS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {INFOGRAPHICS.map((info) => (
          <article key={info.id} className="group">
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted border border-border shadow-md hover:shadow-xl hover:border-primary-brand/30 transition-all duration-500">
              <Image
                src={info.image}
                alt={info.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />

              {/* Content pinned to bottom */}
              <div className="absolute bottom-0 right-0 left-0 p-6 z-10">
                <span className="inline-block text-[10px] font-black tracking-widest bg-primary-brand text-white px-3 py-1 rounded-full mb-3">
                  {info.category}
                </span>

                <h3 className="text-lg font-black text-white leading-snug mb-4 group-hover:text-primary-brand transition-colors duration-300 line-clamp-2">
                  {info.title}
                </h3>

                <div className="flex justify-between items-center">
                  <span className="text-white/50 text-xs font-bold">
                    {info.date}
                  </span>
                  <Link
                    href={`/infographics/${info.slug}`}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary-brand backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                  >
                    <RiArrowLeftUpLine size={16} className="text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* ── NEWSLETTER CTA ── */}
      <section className="bg-dprimary dark:bg-card rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary-brand/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-primary-brand/10 rounded-full blur-3xl pointer-events-none" />
        <RiPieChartLine
          className="absolute -top-8 -left-8 text-white/5 pointer-events-none"
          size={200}
        />

        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <div className="w-12 h-12 bg-primary-brand/20 rounded-2xl flex items-center justify-center mx-auto">
            <RiNewspaperLine className="text-primary-brand" size={24} />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl text-white font-black mb-3">
              اشترك في النشرة المصورة
            </h2>
            <p className="text-white/50 font-medium text-sm leading-relaxed">
              احصل على أهم إنفوجرافيك أسبوعي مباشرة على بريدك الإلكتروني.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 bg-white/10 border-2 border-white/10 focus:border-primary-brand rounded-2xl px-5 py-3.5 text-white text-sm font-bold outline-none placeholder:text-white/30 transition-all duration-300"
            />
            <button className="cursor-pointer bg-primary-brand hover:bg-primary-brand/90 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-200 shadow-lg shadow-primary-brand/30 active:scale-95 shrink-0">
              اشترك الآن
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}