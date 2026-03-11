"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { RiNewspaperLine, RiCheckLine, RiErrorWarningLine } from "@remixicon/react";

type FormValues = {
  email: string;
};

export default function NewsletterHome() {
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
    <div className="bg-dprimary rounded-3xl p-6 text-white text-center relative overflow-hidden space-y-4">
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-brand/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="w-10 h-10 bg-primary-brand/20 rounded-2xl flex items-center justify-center mx-auto">
          <RiNewspaperLine className="text-primary-brand" size={20} />
        </div>

        <div>
          <h4 className="font-black text-base">النشرة الإخبارية</h4>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            أهم ملخصات السوق المصري تصلك صباح كل يوم
          </p>
        </div>

        {success ? (
          <div className="flex items-center justify-center gap-2 py-4 text-green-400 font-black text-sm">
            <RiCheckLine size={18} />
            <span>تم الاشتراك بنجاح! 🎉</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
            <div className="space-y-1.5 text-right">
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
                className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-primary-brand placeholder:text-white/30 transition-colors disabled:opacity-50"
              />

              {/* Field error */}
              {errors.email && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
                  <RiErrorWarningLine size={13} />
                  {errors.email.message}
                </p>
              )}

              {/* Server error */}
              {serverError && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
                  <RiErrorWarningLine size={13} />
                  {serverError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-primary-brand hover:bg-primary-brand/90 py-3 rounded-2xl font-black text-sm transition-colors shadow-lg shadow-primary-brand/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  جاري الاشتراك...
                </span>
              ) : (
                "اشترك الآن"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}