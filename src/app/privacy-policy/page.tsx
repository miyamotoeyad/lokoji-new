import { CookieIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import {
  RiShieldKeyholeLine,
  RiUserLine,
  RiSettings4Line,
  RiFileLockLine,
  RiParentLine,
} from "react-icons/ri";

const desc = "اقرأ عن سياسة الخصوصية الخاصة بموقع لوكوجي لتطمئن على كيفية حماية بياناتك الشخصية.";
const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
const title = "سياسة الخصوصية";

export const metadata: Metadata = {
  title,
  description: desc,
  openGraph: { title, description: desc },
  alternates: { canonical: `${siteUrl}/privacy-policy` },
};

const sections = [
  {
    icon: RiUserLine,
    title: "المعلومات التي نجمعها",
    content: "المعلومات الشخصية التي نطلب منك تقديمها، والأسباب التي تدفعنا لذلك، سيتم توضيحها لك في اللحظة التي نطلب فيها بياناتك. في حالة التواصل المباشر، قد نتلقى تفاصيل إضافية مثل اسمك، بريدك الإلكتروني، رقم هاتفك، ومحتوى أي مرفقات ترسلها إلينا.",
  },
  {
    icon: RiSettings4Line,
    title: "كيف نستخدم معلوماتك",
    list: [
      "تشغيل وصيانة الموقع الإلكتروني وتطويره.",
      "تحسين وتخصيص تجربة المستخدم بناءً على سلوك التصفح.",
      "تحليل كيفية استخدام الزوار لموقعنا لتقديم محتوى اقتصادي أفضل.",
      "التواصل معك بخصوص التحديثات أو للأغراض التسويقية.",
      "منع عمليات الاحتيال والحفاظ على أمن الموقع.",
    ],
  },
  {
    icon: CookieIcon,
    title: "ملفات تعريف الارتباط (Cookies)",
    content: 'مثل أي موقع آخر، نستخدم "الكوكيز" لتخزين تفضيلات الزوار والصفحات التي تمت زيارتها، وذلك بهدف تحسين تجربة المستخدم وتخصيص المحتوى بناءً على نوع المتصفح.',
  },
  {
    icon: RiFileLockLine,
    title: "حقوق حماية البيانات",
    content: "نود التأكد من أنك على دراية كاملة بحقوقك:",
    list: [
      "حق الوصول: يمكنك طلب نسخ من بياناتك الشخصية.",
      "حق التصحيح: يمكنك طلب تصحيح أي معلومات تراها غير دقيقة.",
      "حق المسح: يمكنك طلب حذف بياناتك في حالات معينة.",
    ],
  },
  {
    icon: RiParentLine,
    title: "خصوصية الأطفال",
    content: "لوكوجي لا يجمع عن قصد أي معلومات من الأطفال دون سن 13 عاماً. إذا كنت تعتقد أن طفلك قدم مثل هذه المعلومات، يرجى الاتصال بنا فوراً لحذفها من سجلاتنا.",
  },
];

export default function Privacy() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-10" dir="rtl">

      {/* ── HEADER ── */}
      <header className="pb-8 border-b border-border space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-black">
          <RiShieldKeyholeLine size={14} />
          <span>حماية البيانات</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground">
          سياسة الخصوصية
        </h1>
        <p className="text-sm font-bold text-muted-foreground">
          آخر تحديث:{" "}
          {new Date().toLocaleDateString("ar-EG", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </header>

      {/* ── INTRO ── */}
      <div className="bg-card border border-border rounded-3xl p-6 text-muted-foreground leading-loose text-sm space-y-3">
        <p>
          في <strong className="text-foreground font-black">لوكوجي</strong>، التي يمكن الوصول إليها عبر{" "}
          <span className="text-primary-brand font-bold">{siteUrl}</span>، نضع خصوصية زوارنا على رأس أولوياتنا. توضح هذه الوثيقة أنواع المعلومات التي نجمعها وكيفية استخدامها.
        </p>
        <p>
          إذا كان لديك أي استفسار، فلا تتردد في{" "}
          <Link href="/contact" className="text-primary-brand font-black underline underline-offset-4">
            الاتصال بنا
          </Link>.
        </p>
      </div>

      {/* ── CONSENT CARD ── */}
      <div className="bg-dprimary rounded-3xl p-6 text-white relative overflow-hidden space-y-2">
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary-brand/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="w-8 h-1 bg-primary-brand rounded-full mb-4" />
          <h2 className="text-lg text-white font-black mb-2">الموافقة</h2>
          <p className="text-white/60 text-sm leading-loose">
            باستخدامك لموقعنا، فأنت توافق بموجب هذا على سياسة الخصوصية الخاصة بنا وتوافق على شروطها.
          </p>
        </div>
      </div>

      {/* ── SECTIONS ── */}
      <div className="space-y-4">
        {sections.map((s) => (
          <div key={s.title} className="bg-card border border-border rounded-3xl p-6 space-y-4 hover:border-primary-brand/30 transition-colors duration-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
                <s.icon size={18} />
              </div>
              <h2 className="text-base font-black text-foreground">{s.title}</h2>
            </div>
            {s.content && (
              <p className="text-sm text-muted-foreground leading-loose">{s.content}</p>
            )}
            {s.list && (
              <ul className="space-y-2">
                {s.list.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-brand mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* ── FOOTER ── */}
      <div className="text-center pt-4 space-y-4 border-t border-border">
        <p className="text-muted-foreground font-bold text-sm">
          هل لديك أي استفسار حول سياسة الخصوصية؟
        </p>
        <Link href="/contact" className="btn inline-flex items-center gap-2 px-8 py-3 text-sm font-black">
          تواصل معنا الآن
        </Link>
      </div>

    </main>
  );
}