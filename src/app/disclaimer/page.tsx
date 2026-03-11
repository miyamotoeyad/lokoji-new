import {
  RiInformationLine,
  RiBankLine,
  RiShieldCheckLine,
  RiAlertLine,
  RiScalesLine,
} from "@remixicon/react";
import { Metadata } from "next";
import Link from "next/link";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";

const title = "إخلاء المسؤولية";
const description =
  "تعرف على حدود المسؤولية القانونية وشروط استخدام البيانات المعروضة في منصة لوكوجي.";

export const metadata: Metadata = generateStaticMetadata({
  title,
  description,
  url: "/disclaimer",
});

const sections = [
  {
    icon: RiInformationLine,
    title: "دقة البيانات والمعلومات",
    content:
      "يتم جمع كافة أسعار العملات والمعادن من مصادر رسمية ومواقع البنوك مباشرة. ومع ذلك، قد يحدث تأخير طفيف في تحديث البيانات. نحن لا نضمن دقة المعلومات بنسبة 100% في اللحظة الفعلية.",
  },
  {
    icon: RiAlertLine,
    title: "ليست نصيحة استثمارية",
    content:
      "المحتوى المقدم في لوكوجي هو لأغراض معلوماتية فقط ولا يجب اعتباره نصيحة مالية أو دعوة للاستثمار. اتخاذ القرارات المالية بناءً على هذه الأرقام يقع على عاتق المستخدم وحده.",
    highlight: true,
  },
  {
    icon: RiBankLine,
    title: "العلاقة مع البنوك",
    content:
      "نحن لسنا تابعين لأي بنك أو مؤسسة مالية رسمية. العلامات التجارية والشعارات الخاصة بالبنوك هي ملك لأصحابها، ونحن نستخدمها فقط لتوضيح جهة صدور السعر.",
  },
  {
    icon: RiShieldCheckLine,
    title: "حدود المسؤولية",
    content:
      "لا يتحمل لوكوجي أو مطوروه أي مسؤولية عن خسائر مادية أو قرارات خاطئة تنتج عن استخدام البيانات المعروضة هنا. يرجى دائماً التأكد من السعر النهائي من فرع البنك قبل التنفيذ.",
  },
];

export default function DisclaimerPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10" dir="rtl">
      {/* ── HEADER ── */}
      <header className="pb-8 border-b border-border space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-black">
          <RiScalesLine size={14} />
          <span>الإطار القانوني</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground">
          إخلاء المسؤولية
        </h1>
        <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl">
          يرجى قراءة هذه الصفحة بعناية لفهم حدود مسؤوليتنا القانونية تجاه
          البيانات المعروضة في منصة لوكوجي.
        </p>
      </header>

      {/* ── INVESTMENT WARNING — dark card ── */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <RiAlertLine size={18} />
          </div>
          <h2 className="text-base font-black text-amber-600 dark:text-amber-400">
            تحذير استثماري
          </h2>
        </div>
        <p className="text-sm text-amber-900/70 dark:text-amber-200/60 leading-loose font-medium">
          جميع البيانات والأرقام المعروضة على{" "}
          <strong className="font-black">لوكوجي</strong> هي لأغراض إعلامية
          وتثقيفية فحسب. لا تُعدّ نصيحة مالية أو استثمارية أو قانونية تحت أي
          ظرف.
        </p>
      </div>

      {/* ── SECTIONS ── */}
      <div className="space-y-4">
        {sections.map((s) => (
          <div
            key={s.title}
            className="bg-card border border-border rounded-3xl p-6 space-y-4 hover:border-primary-brand/30 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
                <s.icon size={18} />
              </div>
              <h2 className="text-base font-black text-foreground">
                {s.title}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground leading-loose">
              {s.content}
            </p>
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div className="text-center pt-4 space-y-4 border-t border-border">
        <p className="text-muted-foreground font-bold text-sm">
          هل لديك أي استفسار قانوني؟
        </p>
        <Link
          href="/contact"
          className="btn inline-flex items-center gap-2 px-8 py-3 text-sm font-black"
        >
          تواصل معنا
        </Link>
        <p className="text-xs text-muted-foreground font-bold">
          آخر تحديث:{" "}
          {new Date().toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </main>
  );
}
