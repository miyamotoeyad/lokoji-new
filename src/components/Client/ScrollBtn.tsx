"use client";

import { useState, useEffect } from "react";
import { RiArrowUpLine } from "react-icons/ri";

export default function ScrollButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="العودة للأعلى"
      dir="rtl"
      className={`fixed left-4 z-50 cursor-pointer flex items-center gap-2 bg-primary-brand text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-lg shadow-primary-brand/30 hover:bg-primary-brand/90 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${
        visible
          ? "bottom-6 opacity-100"
          : "-bottom-20 opacity-0 pointer-events-none"
      }`}
    >
      <RiArrowUpLine size={15} />
      أطلع لفوق
    </button>
  );
}