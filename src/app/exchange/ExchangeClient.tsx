"use client";

import { useState, useMemo } from "react";
import {
  RiArrowUpDownLine,
  RiRefreshLine,
  RiExchangeDollarLine,
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiSearchLine,
} from "react-icons/ri";
import { CurrencyInput } from "./CurrencyInput";
import { useExchangeRates } from "@/hooks/useExchangeRates";
import { toEGP, toUSD } from "@/lib/Data/exchangeData";

export default function ExchangeClient() {
  // ✅ stableChanges now comes from the hook — no useEffect needed here
  const { rates, stableChanges, loading, error, lastUpdate, convert, refresh } =
    useExchangeRates();

  const [amount1, setAmount1] = useState<number | string>(1);
  const [currency1, setCurrency1] = useState("USD");
  const [currency2, setCurrency2] = useState("EGP");
  const [tableSearch, setTableSearch] = useState("");

  // ✅ Derived — no state, no effect, no cascading renders
  const amount2 = useMemo(() => {
    if (!rates[currency1] || !rates[currency2]) return "...";
    return convert(parseFloat(String(amount1)) || 0, currency1, currency2);
  }, [amount1, currency1, currency2, rates, convert]);

  const rate = useMemo(
    () =>
      rates[currency1] && rates[currency2]
        ? convert(1, currency1, currency2)
        : null,
    [rates, currency1, currency2, convert],
  );

  const currencies = Object.keys(rates);

  const tableData = useMemo(
    () =>
      currencies
        .map((c) => ({
          code: c,
          rate: toEGP(c, rates),
          rateUSD: toUSD(c, rates),
          change: stableChanges[c] ?? 0,
        }))
        .filter((row) =>
          row.code.toLowerCase().includes(tableSearch.toLowerCase()),
        ),
    [rates, tableSearch, stableChanges, currencies],
  );

  function handleAmount1Change(v: string) {
    setAmount1(v); // ✅ amount2 auto-derives
  }

  function handleAmount2Change(v: string) {
    // ✅ reverse convert into amount1
    setAmount1(convert(parseFloat(v) || 0, currency2, currency1));
  }

  function handleCurrency1Change(c: string) {
    setCurrency1(c); // ✅ amount2 auto-derives
  }

  function handleCurrency2Change(c: string) {
    setCurrency2(c); // ✅ amount2 auto-derives
  }

  function swap() {
    setCurrency1(currency2);
    setCurrency2(currency1);
    // ✅ amount2 auto-derives from new currencies
  }

  return (
    <main className="container mx-auto px-4 py-10 space-y-12" dir="rtl">
      {/* ── HEADER ── */}
      <div className="pb-8 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-primary-brand/10 flex items-center justify-center text-primary-brand">
              <RiExchangeDollarLine size={20} />
            </div>
            <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
              محول العملات
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-2">
            أسعار العملات
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            تابع جميع العملات الأجنبية وأسعارها مقابل الجنيه المصري.
          </p>
        </div>

        {rate && !loading && (
          <div className="bg-card border h-fit border-border rounded-2xl px-6 py-4 shrink-0 space-y-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              سعر الصرف الحالي
            </p>
            <p
              className="text-2xl font-black text-foreground tabular-nums"
              dir="ltr"
            >
              1 {currency1} <span className="text-primary-brand">=</span> {rate}{" "}
              {currency2}
            </p>
          </div>
        )}
      </div>

      {/* ── CONVERTER CARD ── */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
            <RiRefreshLine size={20} className="animate-spin" />
            <span className="text-sm font-bold">جارٍ تحميل الأسعار...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-sm font-bold text-primary-brand">{error}</p>
            <button onClick={refresh} className="btn text-xs px-5 py-2.5">
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex lg:flex-row items-center justify-between gap-4 w-full flex-col ">
              <CurrencyInput
                label="من"
                amount={amount1}
                currency={currency1}
                currencies={currencies}
                onAmountChange={handleAmount1Change}
                onCurrencyChange={handleCurrency1Change}
              />

              <div className="flex justify-center py-1">
                <button
                  onClick={swap}
                  className="cursor-pointer lg:rotate-90 w-10 h-10 rounded-2xl border border-border bg-muted hover:bg-primary-brand hover:border-primary-brand hover:text-white text-muted-foreground transition-all duration-200 flex items-center justify-center"
                  aria-label="تبديل العملتين"
                >
                  <RiArrowUpDownLine size={18} />
                </button>
              </div>

              <CurrencyInput
                label="إلى"
                amount={amount2}
                currency={currency2}
                currencies={currencies}
                onAmountChange={handleAmount2Change}
                onCurrencyChange={handleCurrency2Change}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={refresh}
                className="cursor-pointer flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold hover:text-primary-brand transition-colors"
              >
                <RiRefreshLine size={11} />
                {lastUpdate && `آخر تحديث: ${lastUpdate}`}
              </button>
              {rate && (
                <span
                  className="text-xs font-black text-muted-foreground bg-muted px-3 py-1.5 rounded-full"
                  dir="ltr"
                >
                  1 {currency1} = {rate} {currency2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── CURRENCIES TABLE ── */}
      {!loading && !error && (
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-1 h-7 bg-primary-brand rounded-full block shrink-0" />
              <h2 className="text-xl font-black text-foreground">
                جميع العملات مقابل الجنيه
              </h2>
              <span className="text-xs font-black text-muted-foreground bg-muted px-3 py-1.5 rounded-full border border-border">
                {tableData.length} عملة
              </span>
            </div>
            <div className="flex items-center overflow-hidden gap-3 bg-muted border-2 border-transparent focus-within:border-primary-brand focus-within:bg-card rounded-2xl px-4 py-2.5 w-full md:w-64 transition-all duration-300">
              <RiSearchLine
                size={16}
                className="text-muted-foreground shrink-0"
              />
              <input
                type="text"
                placeholder="ابحث عن عملة..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="flex-1 bg-transparent border-none ring-0 outline-none text-sm font-bold text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <div className="flex items-center px-6 py-4 border-b border-border bg-muted/50 gap-4">
              <span className="w-8 text-[11px] font-black text-muted-foreground uppercase tracking-widest shrink-0">
                #
              </span>
              <span className="flex-1 text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                العملة
              </span>
              <span className="w-32 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-center shrink-0 hidden md:block">
                بالدولار
              </span>
              <span className="w-36 text-[11px] font-black text-muted-foreground uppercase tracking-widest text-left shrink-0">
                بالجنيه
              </span>
            </div>
            <div className="divide-y divide-border">
              {tableData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm font-bold">
                  لا توجد نتائج لـ &quot;{tableSearch}&quot;
                </div>
              ) : (
                tableData.map((row, i) => {
                  const isUp = row.change >= 0;
                  return (
                    <div
                      key={row.code}
                      onClick={() => {
                        setCurrency2(row.code);
                        setAmount1(
                          convert(
                            parseFloat(String(amount1)) || 1,
                            currency1,
                            row.code,
                          ),
                        );
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="flex items-center px-6 py-4 hover:bg-primary-brand/5 transition-colors duration-200 gap-4 cursor-pointer group"
                    >
                      <span className="w-8 text-xs font-black text-muted-foreground tabular-nums shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-primary-brand/10 flex items-center justify-center font-black text-primary-brand text-xs shrink-0">
                          {row.code[0]}
                        </div>
                        <span className="font-black text-sm text-foreground group-hover:text-primary-brand transition-colors">
                          {row.code}
                        </span>
                      </div>
                      <div
                        className="w-32 text-center hidden md:block shrink-0"
                        dir="ltr"
                      >
                        <span className="text-xs font-bold text-muted-foreground tabular-nums">
                          ${row.rateUSD}
                        </span>
                      </div>
                      <div className="w-36 flex items-center justify-end gap-2 shrink-0">
                        <span
                          className="text-sm font-black text-foreground tabular-nums"
                          dir="ltr"
                        >
                          {row.rate} ج.م
                        </span>
                        <div
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                            isUp
                              ? "bg-green-500/10 text-green-500"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {isUp ? (
                            <RiArrowUpSFill size={12} />
                          ) : (
                            <RiArrowDownSFill size={12} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground font-bold text-center">
            الأسعار تقريبية · open.er-api.com · {lastUpdate}
          </p>
        </section>
      )}
    </main>
  );
}
