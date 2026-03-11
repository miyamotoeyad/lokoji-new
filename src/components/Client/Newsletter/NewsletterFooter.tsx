"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { RiMailSendLine, RiCheckLine, RiErrorWarningLine } from "@remixicon/react";

type FormValues = {
  email: string;
};

export default function NewsletterFooter() {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
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

      reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "حدث خطأ، حاول مجدداً");
    }
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden h-fit lg:sticky lg:top-34">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-brand/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-brand/10 rounded-2xl flex items-center justify-center">
            <RiMailSendLine size={20} className="text-primary-brand" />
          </div>
          <div>
            <h2 className="text-lg m-0 font-black text-foreground">النشرة البريدية</h2>
            <p className="text-[10px] text-muted-foreground font-bold">أسبوعياً · مجاناً</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          سجل بريدك الإلكتروني علشان توصلك أهم تحليلات البورصة والذهب أسبوعياً.
        </p>

        {isSubmitSuccessful && !serverError ? (
          <div className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-bold py-3 rounded-2xl">
            <RiCheckLine size={16} />
            <span>شكراً لاشتراكك! انتظرنا في بريدك قريباً ❤️</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
            <div className="space-y-1.5">
              <input
                type="email"
                placeholder="أكتب بريدك الإلكتروني"
                disabled={isSubmitting}
                dir="ltr"
                {...register("email", {
                  required: "البريد الإلكتروني مطلوب",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "يرجى إدخال بريد إلكتروني صحيح",
                  },
                })}
                className={`w-full bg-muted border-2 rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all duration-300 disabled:opacity-50 ${
                  errors.email
                    ? "border-red-400"
                    : "border-transparent focus:border-primary-brand"
                }`}
              />

              {(errors.email || serverError) && (
                <p className="flex items-center gap-1.5 text-red-400 text-xs font-bold">
                  <RiErrorWarningLine size={13} />
                  {errors.email?.message ?? serverError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-primary-brand hover:bg-primary-brand/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-primary-brand/20 active:scale-95"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  جاري التسجيل...
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