"use client";

import Image from "next/image";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";

export default function GoogleNews() {
  return (
    <div
      className="flex flex-col md:flex-row gap-6 items-center p-6 md:px-6 bg-card border border-border rounded-3xl shadow-sm hover:border-primary-brand/30 hover:shadow-md transition-all duration-300"
      dir="rtl"
    >
      {/* ── ICON ── */}
      <div className="shrink-0 w-16 h-16 bg-muted border border-border rounded-2xl flex items-center justify-center">
        <Image
          alt="Google News"
          src="/google-news.svg"
          width={40}
          height={40}
          className="object-contain"
        />
      </div>

      {/* ── TEXT ── */}
      <div className="grow text-center md:text-right space-y-1.5">
        <h2 className="text-lg font-black text-foreground leading-tight">
          كن أول من يعلم بالتحركات الاقتصادية
        </h2>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
          تابع{" "}
          <span className="text-primary-brand font-black">لوكوجي</span>{" "}
          على أخبار جوجل لتصلك تحليلاتنا الحصرية أولاً بأول.
        </p>
      </div>

      {/* ── CTA ── */}
      <Link
        href="https://news.google.com/publications/CAAqBwgKMKPF-Aswp8GkAw"
        target="_blank"
        rel="noopener noreferrer"
        className="group btn whitespace-nowrap text-sm shrink-0"
      >
        <span>تابعنا الآن</span>
        <RiArrowLeftLine
          className="transition-transform group-hover:-translate-x-1"
          size={16}
        />
      </Link>
    </div>
  );
}