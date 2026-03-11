import Link from "next/link";
import { RiHome4Line, RiSearchLine, RiArrowLeftLine } from "@remixicon/react";

export default function NotFound() {
  return (
    <div
      className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-16 space-y-8"
      dir="rtl"
    >

      {/* ── WATERMARK NUMBER ── */}
      <div className="relative select-none pointer-events-none">
        <p className="text-[10rem] md:text-[16rem] font-black text-muted-foreground/10 leading-none tabular-nums">
          404
        </p>
        {/* Glow blob behind the number */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 bg-primary-brand/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* ── EYEBROW ── */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-brand/10 border border-primary-brand/20 text-primary-brand text-xs font-black -mt-8">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-brand animate-pulse" />
        الصفحة غير موجودة
      </div>

      {/* ── HEADING ── */}
      <div className="space-y-3 max-w-lg">
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
          عذراً، هذا الخبر غير متاح حالياً
        </h1>
        <p className="text-muted-foreground font-medium leading-relaxed">
          يبدو أن الرابط الذي تحاول الوصول إليه قد تم نقله أو حذفه،
          أو ربما هناك خطأ في العنوان. لا تقلق، يمكنك العودة لمتابعة السوق.
        </p>
      </div>

      {/* ── ACTIONS ── */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center">
        <Link
          href="/"
          className="group btn whitespace-nowrap flex items-center justify-center gap-2 px-8 py-3 font-black"
        >
          <RiHome4Line size={18} />
          العودة للرئيسية
          <RiArrowLeftLine
            size={14}
            className="opacity-0 -mr-2 group-hover:opacity-100 group-hover:mr-0 transition-all duration-200"
          />
        </Link>

        <Link
          href="/articles"
          className="flex items-center justify-center gap-2 bg-muted border border-border text-foreground whitespace-nowrap px-8 py-3 rounded-2xl font-black hover:border-primary-brand/30 hover:bg-primary-brand/5 transition-all duration-200"
        >
          <RiSearchLine size={18} />
          تصفح الأرشيف
        </Link>
      </div>
    </div>
  );
}