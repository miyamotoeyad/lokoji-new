import { Metadata } from "next";
import Link from "next/link";
import {
  RiShieldCheckLine,
  RiInformationLine,
  RiAlertLine,
  RiCopyrightLine,
  RiUserForbidLine,
  RiExternalLinkLine,
} from "react-icons/ri";

const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
const title = "شروط الاستخدام";

export const metadata: Metadata = {
  title,
  description:
    "شروط وأحكام استخدام منصة لوكوجي الاقتصادية. تعرف على حقوقك والتزاماتك عند تصفح محتوانا.",
  alternates: { canonical: `${siteUrl}/terms` },
};

export default function Terms() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10" dir="rtl">
      {/* ── HEADER ── */}
      <header className="pb-8 border-b border-border space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-black">
          <RiShieldCheckLine size={14} />
          <span>اتفاقية الاستخدام</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground">
          شروط وأحكام لوكوجي
        </h1>
        <p className="text-sm font-bold text-muted-foreground">
          آخر تحديث:{" "}
          {new Date().toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </header>

      {/* ── INTRO ── */}
      <div className="bg-card border border-border rounded-3xl p-6 text-muted-foreground text-sm leading-loose">
        أهلاً بك في{" "}
        <strong className="text-foreground font-black">لوكوجي</strong>.
        باستخدامك لهذا الموقع، فإنك تقر بأنك قرأت وفهمت ووافقت على الالتزام
        بشروط الاستخدام التالية. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى
        عدم استخدام الموقع.
      </div>

      {/* ── FINANCIAL DISCLAIMER ── */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <RiAlertLine size={18} />
          </div>
          <h2 className="text-base font-black text-amber-600 dark:text-amber-400">
            إخلاء مسؤولية مالية
          </h2>
        </div>
        <p className="text-sm text-amber-900/70 dark:text-amber-200/60 leading-loose font-medium">
          كل المحتوى المنشور على{" "}
          <strong className="text-amber-800 dark:text-amber-300 font-black">
            لوكوجي
          </strong>{" "}
          هو لأغراض إعلامية وتثقيفية فقط. لا يمثل هذا المحتوى نصيحة استثمارية،
          مالية، أو قانونية. أي قرارات تتخذها بناءً على المعلومات المتاحة في
          الموقع هي على مسؤوليتك الشخصية الكاملة.
        </p>
      </div>

      {/* ── SECTIONS ── */}
      <div className="space-y-4">
        {/* Intellectual Property */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-4 hover:border-primary-brand/30 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
              <RiCopyrightLine size={18} />
            </div>
            <h2 className="text-base font-black text-foreground">
              الملكية الفكرية
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-loose">
            جميع المحتويات الموجودة على هذا الموقع، بما في ذلك النصوص، الرسوم
            البيانية، الشعارات، والصور، هي ملك لـ{" "}
            <strong className="text-foreground font-black">لوكوجي</strong>{" "}
            ومحمية بموجب قوانين الملكية الفكرية الدولية وقوانين جمهورية مصر
            العربية.
          </p>
          <p className="text-sm text-muted-foreground leading-loose">
            يُمنع منعاً باتاً نسخ أو إعادة نشر المحتوى دون ذكر المصدر صراحةً مع
            رابط مباشر للمقال الأصلي.
          </p>
        </div>

        {/* User Conduct */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-4 hover:border-primary-brand/30 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
              <RiUserForbidLine size={18} />
            </div>
            <h2 className="text-base font-black text-foreground">
              سلوك المستخدم
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            عند استخدامك للموقع، فإنك تتعهد بـ:
          </p>
          <ul className="space-y-2">
            {[
              "عدم استخدام الموقع لأي غرض غير قانوني.",
              "عدم محاولة اختراق الموقع أو تعطيل أنظمته الأمنية.",
              "عدم استخدام أي أدوات آلية (مثل الـ Crawlers) لجمع بيانات الموقع دون إذن كتابي.",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary-brand mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* External Links */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-4 hover:border-primary-brand/30 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
              <RiExternalLinkLine size={18} />
            </div>
            <h2 className="text-base font-black text-foreground">
              الروابط الخارجية
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-loose">
            قد يحتوي موقعنا على روابط لمواقع خارجية. نحن لا نتحمل مسؤولية محتوى
            هذه المواقع أو سياسات الخصوصية الخاصة بها. استخدامك لهذه الروابط
            يكون على مسؤوليتك الخاصة.
          </p>
        </div>

        {/* Modifications */}
        <div className="bg-card border border-border rounded-3xl p-6 space-y-4 hover:border-primary-brand/30 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
              <RiInformationLine size={18} />
            </div>
            <h2 className="text-base font-black text-foreground">
              تعديل الشروط
            </h2>
          </div>
          <p className="text-sm text-muted-foreground leading-loose">
            نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التحديثات على
            هذه الصفحة فور اعتمادها، ويُعتبر استمرارك في استخدام الموقع بعد
            التعديلات موافقة صريحة منك عليها.
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="text-center pt-4 space-y-4 border-t border-border">
        <p className="text-muted-foreground font-bold text-sm">
          هل لديك أي استفسار حول هذه الشروط؟
        </p>
        <Link
          href="/contact"
          className="btn inline-flex items-center gap-2 px-8 py-3 text-sm font-black"
        >
          تواصل معنا الآن
        </Link>
      </div>
    </main>
  );
}
