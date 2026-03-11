"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  RiMenu3Line,
  RiMoonLine,
  RiSearch2Line,
  RiSunLine,
} from "@remixicon/react";
import SearchBox from "./SearchBox";
import NavList from "./NavList";
import MarketTickerBar from "./MarketTickerBar";
import type { TickerItem } from "@/lib/Data/tickerData";
import NavLogo from "./NavLogo";

export default function NavbarClient({
  tickerItems,
}: {
  tickerItems: TickerItem[];
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── MAIN NAVBAR ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "py-3 bg-card/90 backdrop-blur-md shadow-sm border-b border-border"
            : "py-5 bg-card border-b border-transparent"
        }`}
        dir="rtl"
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* LEFT: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="group cursor-pointer flex items-center gap-2 text-foreground hover:text-primary-brand transition-colors duration-200"
              aria-label="فتح القائمة"
            >
              <div className="w-9 h-9 flex items-center justify-center rounded-2xl border border-border bg-muted group-hover:bg-primary-brand/10 group-hover:border-primary-brand/30 transition-all duration-200">
                <RiMenu3Line size={18} />
              </div>
              <span className="hidden md:block text-sm font-black uppercase tracking-tight">
                القائمة
              </span>
            </button>

            <div className="h-6 w-px bg-border hidden md:block" />

            <NavLogo />
          </div>

          {/* RIGHT: Search + Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="cursor-pointer hidden lg:flex items-center gap-3 px-4 py-2.5 bg-muted border border-border rounded-2xl text-muted-foreground hover:border-primary-brand/40 hover:text-primary-brand transition-all duration-200"
            >
              <RiSearch2Line size={16} />
              <span className="text-xs font-bold">ابحث عن أخبار...</span>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="cursor-pointer lg:hidden w-9 h-9 flex items-center justify-center rounded-2xl border border-border bg-muted hover:bg-primary-brand/10 hover:border-primary-brand/30 hover:text-primary-brand transition-all duration-200"
              aria-label="بحث"
            >
              <RiSearch2Line size={18} />
            </button>

            <button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              className="cursor-pointer w-9 h-9 flex items-center justify-center rounded-2xl border border-border bg-muted hover:bg-primary-brand/10 hover:border-primary-brand/30 hover:text-primary-brand transition-all duration-200"
              aria-label="تغيير المظهر"
              suppressHydrationWarning
            >
              {resolvedTheme === "dark" ? (
                <RiSunLine size={18} />
              ) : (
                <RiMoonLine size={18} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── LIVE TICKER BAR ── */}
      <MarketTickerBar scrolled={scrolled} items={tickerItems} />

      <NavList openMenu={openMenu} setOpenMenu={setOpenMenu} />
      <SearchBox btn={searchOpen} setBtn={setSearchOpen} />
    </>
  );
}
