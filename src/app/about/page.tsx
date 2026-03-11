import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";
import { Metadata } from "next";
import {
  RiTeamLine,
  RiCheckLine,
  RiQuestionLine,
  RiLightbulbLine,
} from "@remixicon/react";

const description =
  "أهلاً بكم في لوكوجي، أول منصة اقتصادية قومية متخصصة في تحليل الأسواق المصرية والعالمية برؤية مصرية خالصة.";
const title = "أحنا مين؟";

export const metadata: Metadata = generateStaticMetadata({
  title,
  description,
  url: "/about",
});

const features = [
  "تغطية حصرية لبورصات العالم والجمهورية المصرية.",
  "أول موقع مصري يوفر بيانات شاملة لعملات الكريبتو.",
  "متابعة لحظية وشاملة لكل الأخبار الاقتصادية.",
  "انفوجرافيك تفصيلي يسهل قراءة الأرقام المعقدة.",
  "شرح مبسط لكل المفاهيم الاقتصادية (اتعلم اقتصاد).",
];

export default function About() {
  return (
    <main
      className="container mx-auto px-4 py-10 max-w-4xl space-y-12"
      dir="rtl"
    >
      {/* ── HERO ── */}
      <header className="text-center space-y-6 pb-10 border-b border-border">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-black">
          <RiTeamLine size={16} />
          <span>تعرف علينا</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
          إحنا مين؟
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </header>

      {/* ── CONTENT SECTIONS ── */}
      <div className="space-y-10">
        {/* What's the content */}
        <section className="bg-card border border-border rounded-3xl p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
              <RiQuestionLine size={18} />
            </div>
            <h2 className="text-xl font-black text-foreground">
              إيه محتوى الموقع؟
            </h2>
          </div>
          <p className="text-muted-foreground leading-loose text-base">
            محتوى الموقع مخصص عن{" "}
            <strong className="text-foreground font-black">
              البورصة المصرية والعالمية
            </strong>{" "}
            وأسهم الشركات، مع باقة من مقالات الرأي والتحليلات الاقتصادية الشاملة
            التي تُقدم بتفاصيل دقيقة ولكن بلغة مبسطة تناسب الجميع.
          </p>
        </section>

        {/* Name meaning */}
        <section className="bg-dprimary rounded-3xl p-8 text-white relative overflow-hidden space-y-4">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-brand/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-primary-brand/20 flex items-center justify-center text-primary-brand shrink-0">
                <RiLightbulbLine size={18} />
              </div>
              <h2 className="text-xl text-white font-black">
                إيه معنى كلمة &quot;لوكوجي&quot;؟
              </h2>
            </div>
            <p className="text-white/70 leading-loose text-base">
              لوكوجي{" "}
              <span
                className="font-black text-white px-2 py-0.5 bg-white/10 rounded-lg mx-1"
                dir="ltr"
              >
                ⲗⲟⲕⲟϫⲓ
              </span>{" "}
              هي كلمة من اللغة المصرية القديمة (المرحلة القبطية) ومعناها{" "}
              <strong className="text-primary-brand font-black">
                &quot;عملة&quot;
              </strong>
              . اخترنا الاسم ده عشان نربط حاضرنا الاقتصادي بجذورنا التاريخية
              العظيمة.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
            <h2 className="text-xl font-black text-foreground">
              إيه اللي بيفرق لوكوجي؟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 bg-card border border-border rounded-2xl hover:border-primary-brand/30 transition-colors duration-200 group"
              >
                <div className="w-7 h-7 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0 mt-0.5 group-hover:bg-primary-brand group-hover:text-white transition-all duration-200">
                  <RiCheckLine size={14} />
                </div>
                <p className="text-sm font-bold text-foreground leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
