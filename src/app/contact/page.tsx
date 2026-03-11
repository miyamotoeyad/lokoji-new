import { Metadata } from "next";
import Form from "./form";
import {
  RiMailSendLine,
  RiMapPin2Line,
  RiTwitterXFill,
  RiWhatsappLine,
  RiTelegramFill,
  RiChatSmile2Line,
} from "@remixicon/react";
import { generateStaticMetadata } from "@/lib/MetaData/generateStaticMetadata";

const title = "تواصل معنا | فريق لوكوجي الاقتصادي";
const description = "لو عندك أي استفسار أو سؤال في بالك، فريق لوكوجي جاهز للرد عليك. تواصل معنا لمناقشة آخر تطورات السوق المصري والعالمي.";

export const metadata: Metadata = generateStaticMetadata({
  title,
  description,
  url: "/contact",
});

const contactInfo = [
  {
    icon: RiMailSendLine,
    label: "البريد الإلكتروني",
    value: "contact@lokoji.com",
  },
  {
    icon: RiMapPin2Line,
    label: "المقر الرئيسي",
    value: "القاهرة، الجمهورية المصرية",
  },
];

const socials = [
  { icon: RiTwitterXFill,  href: "#", label: "تويتر",    color: "hover:bg-foreground/10 hover:text-foreground hover:border-border" },
  { icon: RiWhatsappLine,  href: "#", label: "واتساب",   color: "hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30" },
  { icon: RiTelegramFill,  href: "#", label: "تيليجرام", color: "hover:bg-[#26A5E4]/10 hover:text-[#26A5E4] hover:border-[#26A5E4]/30" },
];

export default function Contact() {
  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 md:py-16" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* ── LEFT: INFO ── */}
        <div className="space-y-8">

          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-black">
              <RiChatSmile2Line size={16} />
              <span>نورنا بتواصلك</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
              خلينا على{" "}
              <span className="text-primary-brand">تواصل</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              فريق لوكوجي بيسعى دايماً لتبسيط الاقتصاد. لو عندك سؤال، اقتراح،
              أو حابب تعلن معانا، ابعت لنا رسالة وهنرد عليك في أقرب وقت.
            </p>
          </div>

          {/* Contact cards */}
          <div className="space-y-3">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 p-5 rounded-3xl bg-card border border-border hover:border-primary-brand/30 transition-colors duration-200"
              >
                <div className="w-11 h-11 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
                    {item.label}
                  </p>
                  <p className="font-black text-foreground text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="flex gap-3 pt-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className={`w-11 h-11 flex items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground transition-all duration-200 ${s.color}`}
              >
                <s.icon size={18} />
              </a>
            ))}
          </div>

          {/* Decorative watermark */}
          <p className="text-5xl font-black text-muted-foreground/10 select-none pointer-events-none leading-none pt-4">
            ⲗⲟⲕⲟϫⲓ
          </p>
        </div>

        {/* ── RIGHT: FORM ── */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
          <Form />
        </div>

      </div>
    </main>
  );
}