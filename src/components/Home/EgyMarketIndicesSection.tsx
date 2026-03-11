import { EGStock } from '@/lib/Data/egMarketData';
import { RiArrowLeftSLine, RiGlobalLine } from '@remixicon/react'
import Link from 'next/link'

interface EgyMarketIndicesSectionProps {
  egMarketData: EGStock[];
}

export default function EgyMarketIndicesSection({egMarketData = []}: EgyMarketIndicesSectionProps) {
  return (
    <section className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
                  <div className="w-8 h-8 rounded-xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
                    <RiGlobalLine size={16} />
                  </div>
                  <h2 className="text-xl font-black">اليورصة المصرية</h2>
                </div>
                <Link
                  href="/eg-market"
                  className="btn text-xs py-2 px-4 flex items-center gap-1"
                >
                  كل المؤشرات <RiArrowLeftSLine size={14} />
                </Link>
              </div>
    
              <div className="relative bg-muted/30 dark:bg-dprimary rounded-3xl overflow-hidden border border-border dark:border-white/5 shadow-xl">
                {/* Scrollable indices */}
                <div className="overflow-x-auto no-scrollbar">
                  <div className="flex divide-x divide-border dark:divide-white/10 min-w-max">
                    {egMarketData.slice(0, 10).map((item) => (
                      <Link
                        key={item.id}
                        href={`/eg-market/${item.slug}`}
                        className="group flex flex-col gap-2 px-5 py-4 hover:bg-primary-brand/5 dark:hover:bg-white/5 transition-colors min-w-35"
                      >
                        {/* Ticker + flag */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-bold text-muted-foreground font-mono uppercase tracking-widest">
                            {item.code}
                          </span>
                          <span className="text-[10px]">
                            🇪🇬
                          </span>
                        </div>
    
                        {/* Name */}
                        <p className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors truncate">
                          {item.titleAr}
                        </p>
    
                        {/* Price */}
                        <p
                          className="text-lg font-black text-foreground tabular-nums group-hover:text-primary-brand text-right transition-colors"
                          dir="ltr"
                        >
                          {item.price.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                          })}
                        </p>
    
                        {/* Change */}
                        <div className="flex text-right gap-1.5" dir="rtl">
                          <span
                            className={`text-[10px] font-black ${
                              item.changePercent >= 0
                                ? "text-green-500 dark:text-green-400"
                                : "text-destructive dark:text-red-400"
                            }`}
                          >
                            {item.changePercent >= 0 ? "▲" : "▼"}{" "}
                            {Math.abs(item.changePercent).toFixed(2)}%
                          </span>
                        </div>
    
                        {/* Mini heat bar */}
                        <div className="h-0.5 rounded-full bg-border dark:bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.changePercent >= 0
                                ? "bg-green-500 dark:bg-green-400"
                                : "bg-destructive dark:bg-red-400"
                            }`}
                            style={{
                              width: `${Math.min(Math.abs(item.changePercent) * 20, 100)}%`,
                            }}
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
    
                {/* Left fade */}
                <div className="absolute top-0 left-0 bottom-0 w-12 bg-linear-to-r from-muted/30 dark:from-dprimary to-transparent pointer-events-none" />
                {/* Right fade */}
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-linear-to-l from-muted/30 dark:from-dprimary to-transparent pointer-events-none" />
              </div>
            </section>
  )
}
