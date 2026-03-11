"use client";

import { RiCloseLine, RiArrowLeftSLine, RiArrowDownSLine } from "@remixicon/react";
import { NavLinks } from "@/lib/Menus/navMenu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MenuProps {
  openMenu: boolean;
  setOpenMenu: (open: boolean) => void;
}

export default function NavList({ openMenu, setOpenMenu }: MenuProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const pathname = usePathname();

  const [openMarkets, setOpenMarkets] = useState(() =>
    NavLinks.some((link) =>
      link.subLinks?.some((sub) => pathname.startsWith(sub.link))
    )
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatAMPM = (date: Date) =>
    date.toLocaleTimeString("ar-EG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const fullDate = new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "full",
  }).format(currentTime);

  return (
    <>
      {/* ── SIDEBAR PANEL ── */}
      <div
        className={`fixed top-0 z-60 h-screen w-full max-w-85 bg-card border-l border-border shadow-2xl transition-all duration-500 ease-in-out flex flex-col ${
          openMenu ? "right-0" : "-right-full"
        }`}
        dir="rtl"
      >
        {/* ── TOP: Close + Clock ── */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <button
            className="group cursor-pointer w-10 h-10 flex items-center justify-center rounded-2xl border border-border hover:bg-primary-brand hover:border-primary-brand transition-all duration-300"
            onClick={() => setOpenMenu(false)}
            aria-label="إغلاق القائمة"
          >
            <RiCloseLine
              size={20}
              className="text-foreground group-hover:text-white transition-colors"
            />
          </button>

          <div className="text-left">
            <p className="font-black text-2xl text-foreground tabular-nums">
              {formatAMPM(currentTime)}
            </p>
            <p className="text-[10px] text-primary-brand font-black mt-0.5">
              {fullDate}
            </p>
          </div>
        </div>

        {/* ── MIDDLE: Nav Links ── */}
        <nav className="flex flex-col flex-1 overflow-y-auto p-4 gap-1">
          {NavLinks.map((link) => {
            const hasSubLinks = !!(link.subLinks && link.subLinks.length > 0);
            const isActive = pathname === link.link;
            const isSublinkActive = link.subLinks?.some((sub) =>
              pathname.startsWith(sub.link)
            );

            if (hasSubLinks) {
              return (
                <div key={link.id} className="flex flex-col">

                  {/* Accordion trigger */}
                  <button
                    onClick={() => setOpenMarkets((prev) => !prev)}
                    className={`cursor-pointer flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-lg transition-all duration-200 ${
                      isSublinkActive || openMarkets
                        ? "bg-primary-brand/10 text-primary-brand"
                        : "text-foreground hover:bg-primary-brand/5 hover:text-primary-brand"
                    }`}
                  >
                    <span>{link.title}</span>
                    <RiArrowDownSLine
                      size={20}
                      className={`transition-transform duration-300 ${
                        openMarkets ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* ✅ max-h collapse — reliable across all Tailwind versions */}
                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      openMarkets ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="flex flex-col gap-1 pr-4 mr-2 border-r-2 border-primary-brand/20 py-1 mt-1 mb-1">
                      {link.subLinks?.map((sub) => {
                        const isChildActive = pathname === sub.link;
                        return (
                          <Link
                            key={sub.id}
                            href={sub.link}
                            onClick={() => setOpenMenu(false)}
                            className={`px-4 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${
                              isChildActive
                                ? "text-primary-brand bg-primary-brand/10"
                                : "text-foreground hover:text-primary-brand hover:bg-primary-brand/5"
                            }`}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            // Regular link
            return (
              <Link
                key={link.id}
                href={link.link || "#"}
                onClick={() => setOpenMenu(false)}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary-brand text-white shadow-lg shadow-primary-brand/20"
                    : "text-foreground hover:bg-primary-brand/10 hover:text-primary-brand"
                }`}
              >
                <span>{link.title}</span>
                <RiArrowLeftSLine
                  size={18}
                  className={`transition-all duration-200 ${
                    isActive
                      ? "opacity-0"
                      : "text-muted-foreground group-hover:text-primary-brand group-hover:-translate-x-1"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* ── BOTTOM: Footer ── */}
        <div className="p-6 border-t border-border">
          <div className="w-8 h-1 bg-primary-brand rounded-full mb-4" />
          <p className="text-xs font-black text-foreground mb-1">لوكوجي</p>
          <p className="text-[10px] text-muted-foreground font-bold leading-relaxed">
            القومية المصرية الاقتصادية
          </p>
          <div className="flex justify-between items-center mt-3">
            <p className="text-[10px] text-muted-foreground font-medium">
              &copy; {currentTime.getFullYear()} ⲗⲟⲕⲟϫⲓ
            </p>
            <span className="text-[8px] bg-primary-brand/10 text-primary-brand px-2 py-0.5 rounded-full font-black">
              v2.0
            </span>
          </div>
        </div>
      </div>

      {/* ── BACKDROP ── */}
      <div
        className={`fixed inset-0 z-55 bg-black/40 backdrop-blur-sm transition-all duration-500 ${
          openMenu ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpenMenu(false)}
      />
    </>
  );
}