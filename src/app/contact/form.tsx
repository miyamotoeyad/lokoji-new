"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  RiSendPlaneFill,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";

interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
}

const inputBase =
  "w-full bg-muted border-2 border-transparent focus:border-primary-brand focus:bg-card rounded-2xl px-4 py-3 text-sm font-bold text-foreground placeholder:text-muted-foreground outline-none transition-all duration-300";

const inputError = "border-primary-brand bg-primary-brand/5";

export default function Form() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Form Data:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitSuccessful) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-green-500/5 border border-green-500/20 rounded-3xl animate-in fade-in zoom-in duration-500 text-center gap-4">
        <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center">
          <RiCheckboxCircleFill size={32} className="text-green-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-foreground mb-2">تم الإرسال بنجاح!</h3>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed">
            شكراً لتواصلك معانا. فريق لوكوجي هيرد عليك في أقرب وقت ممكن.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="cursor-pointer mt-2 text-xs font-black text-primary-brand hover:underline underline-offset-4 transition-all"
        >
          إرسال رسالة أخرى
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir="rtl">

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="full-name" className="text-xs font-black text-muted-foreground uppercase tracking-widest">
          الإسم بالكامل <span className="text-primary-brand">*</span>
        </label>
        <input
          id="full-name"
          type="text"
          placeholder="مثال: أحمد محمد"
          className={cn(inputBase, errors.fullName && inputError)}
          {...register("fullName", { required: "الإسم مطلوب" })}
        />
        {errors.fullName && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-primary-brand">
            <RiErrorWarningLine size={13} />
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-black text-muted-foreground uppercase tracking-widest">
            البريد الإلكتروني <span className="text-primary-brand">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="email@example.com"
            className={cn(inputBase, errors.email && inputError)}
            {...register("email", {
              required: "البريد الإلكتروني مطلوب",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,4}$/,
                message: "صيغة البريد غير صحيحة",
              },
            })}
          />
          {errors.email && (
            <p className="flex items-center gap-1.5 text-xs font-bold text-primary-brand">
              <RiErrorWarningLine size={13} />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-xs font-black text-muted-foreground uppercase tracking-widest">
            رقم الهاتف
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="01xxxxxxxxx"
            className={cn(inputBase, errors.phone && inputError)}
            {...register("phone", {
              pattern: { value: /^01[0125][0-9]{8}$/, message: "رقم غير صحيح" },
            })}
          />
          {errors.phone && (
            <p className="flex items-center gap-1.5 text-xs font-bold text-primary-brand">
              <RiErrorWarningLine size={13} />
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-xs font-black text-muted-foreground uppercase tracking-widest">
          رسالتك <span className="text-primary-brand">*</span>
        </label>
        <textarea
          id="message"
          placeholder="اكتب استفسارك هنا..."
          rows={5}
          className={cn(inputBase, "resize-none py-3", errors.message && inputError)}
          {...register("message", { required: "من فضلك اكتب رسالتك" })}
        />
        {errors.message && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-primary-brand">
            <RiErrorWarningLine size={13} />
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "cursor-pointer w-full py-3.5 rounded-2xl font-black text-white text-sm transition-all duration-200 flex items-center justify-center gap-3",
          isSubmitting
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-primary-brand hover:bg-primary-brand/90 shadow-lg shadow-primary-brand/20 active:scale-95"
        )}
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
        ) : (
          <>
            <span>ارسال الرسالة</span>
            <RiSendPlaneFill size={16} className="rotate-180" />
          </>
        )}
      </button>
    </form>
  );
}