"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { RiCloseLine, RiSearchLine, RiFireLine } from "@remixicon/react";

type SearchProps = {
  btn: boolean;
  setBtn: (val: boolean) => void;
};

const trendingTags = ["بورصة", "كريبتو", "الذهب", "اتعلم اقتصاد", "شركات"];

export default function SearchBox({ btn, setBtn }: SearchProps) {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search-results?search=${encodeURIComponent(search)}`);
      setBtn(false);
    }
  };

  return (
    <>
      {/* ── SEARCH PANEL ── */}
      <div
        className={`fixed top-0 z-70 h-screen w-full md:w-105 bg-card border-r border-border shadow-2xl transition-all duration-500 ease-in-out flex flex-col ${
          btn ? "left-0" : "-left-full"
        }`}
        dir="rtl"
      >
        {/* ── HEADER ── */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-black text-foreground">ابحث في لوكوجي</h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-bold">
              أخبار · تحليلات · أسواق
            </p>
          </div>
          <button
            className="group w-10 h-10 flex items-center justify-center rounded-2xl border border-border hover:bg-primary-brand hover:border-primary-brand transition-all duration-300"
            onClick={() => setBtn(false)}
            aria-label="إغلاق البحث"
          >
            <RiCloseLine
              size={20}
              className="text-foreground group-hover:text-white transition-colors"
            />
          </button>
        </div>

        {/* ── SEARCH FORM ── */}
        <div className="p-6 border-b border-border">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative group">
              <input
                className="w-full bg-muted border-2 border-transparent focus:border-primary-brand focus:bg-card p-4 pr-12 rounded-2xl outline-none text-foreground placeholder:text-muted-foreground transition-all duration-300 text-base font-bold"
                type="text"
                placeholder="عن ماذا تبحث اليوم؟"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus={btn}
              />
              <RiSearchLine
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary-brand transition-colors duration-300"
                size={20}
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-primary-brand text-white font-black py-3.5 rounded-2xl hover:bg-primary-brand/90 active:scale-95 transition-all duration-200 shadow-lg shadow-primary-brand/20 flex items-center justify-center gap-2"
            >
              <RiSearchLine size={16} />
              بدء البحث
            </button>
          </form>
        </div>

        {/* ── TRENDING TAGS ── */}
        <div className="p-6 flex-1">
          <div className="flex items-center gap-2 mb-5">
            <RiFireLine className="text-primary-brand" size={16} />
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              الأكثر بحثاً
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {trendingTags.map((tag) => (
              <Link
                key={tag}
                href={`/search-results?search=${tag}`}
                onClick={() => setBtn(false)}
                className="btn text-sm py-2 px-4"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── BACKDROP ── */}
      <div
        className={`fixed inset-0 z-65 bg-dprimary/50 backdrop-blur-sm transition-all duration-500 ${
          btn ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setBtn(false)}
      />
    </>
  );
}