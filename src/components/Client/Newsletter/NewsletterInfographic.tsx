"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  RiNewspaperLine,
  RiPieChartLine,
  RiCheckLine,
  RiErrorWarningLine,
} from "@remixicon/react";

type FormValues = {
  email: string;
};

export default function NewsletterInfographic() {
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  async function onSubmit({ email }: FormValues) {
    setServerError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حدث خطأ");

      setSuccess(true);
      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "حدث خطأ، حاول مجدداً");
    }
  }

  return (
    <section className="bg-dprimary dark:bg-card rounded-3xl p-10 md:p-14 text-white text-center relative overflow-hidden">
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

        {success ? (
          <div className="flex items-center justify-center gap-2 py-4 text-green-400 font-black text-sm">
            <RiCheckLine size={18} />
            <span>تم الاشتراك بنجاح! 🎉</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                disabled={isSubmitting}
                dir="ltr"
                {...register("email", {
                  required: "البريد الإلكتروني مطلوب",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "يرجى إدخال بريد إلكتروني صحيح",
                  },
                })}
                className="flex-1 bg-white/10 border-2 border-white/10 focus:border-primary-brand rounded-2xl px-5 py-3.5 text-white text-sm font-bold outline-none placeholder:text-white/30 transition-all duration-300 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer bg-primary-brand hover:bg-primary-brand/90 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-200 shadow-lg shadow-primary-brand/30 active:scale-95 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    جاري...
                  </span>
                ) : (
                  "اشترك الآن"
                )}
              </button>
            </div>

            {/* Errors — shown below the row */}
            {(errors.email || serverError) && (
              <p className="flex items-center justify-center gap-1.5 text-red-400 text-xs font-bold">
                <RiErrorWarningLine size={13} />
                {errors.email?.message ?? serverError}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}