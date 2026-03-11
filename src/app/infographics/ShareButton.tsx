"use client";

import { RiShareLine } from "@remixicon/react";

export default function ShareButton({ title }: { title: string }) {
  return (
    <button
      onClick={() => navigator.share?.({ title, url: window.location.href })}
      className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-border bg-muted hover:border-primary-brand/40 hover:text-primary-brand text-sm font-black transition-all"
    >
      <RiShareLine size={16} />
      <span className="hidden sm:inline">مشاركة</span>
    </button>
  );
}