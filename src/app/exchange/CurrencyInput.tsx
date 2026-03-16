import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrencyNameAr } from "@/lib/translateToArabic";

export function CurrencyInput({
  amount,
  currency,
  currencies,
  onAmountChange,
  onCurrencyChange,
  label,
}: {
  amount: number | string;
  currency: string;
  currencies: string[];
  onAmountChange: (v: string) => void;
  onCurrencyChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-5 w-full">
      <label className="text-sm mb-4 font-black text-muted-foreground uppercase tracking-widest">
        {label}
      </label>
      <div className="flex items-center gap-3">
        {/* ── Currency Selector ── */}
        <Select value={currency} onValueChange={onCurrencyChange}>
          <SelectTrigger
            dir="rtl"
            className="bg-primary-brand hover:bg-primary-brand/90 text-white font-black text-sm rounded-2xl h-24 w-36 shrink-0 border-none outline-none cursor-pointer py-7 px-3 transition-all duration-200"
          >
            <SelectValue>
              <div className="flex flex-col items-start leading-tight">
                <span className="font-black text-sm">
                  {getCurrencyNameAr(currency)}
                </span>
                <span className="text-[10px] text-white/70 font-bold truncate max-w-28">
                  {currency}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            dir="rtl"
            className="bg-card dark:bg-card border border-border rounded-2xl shadow-xl max-h-72 overflow-y-auto"
          >
            <SelectGroup>
              {currencies.map((c) => {
                const nameAr = getCurrencyNameAr(c);
                return (
                  <SelectItem
                    key={c}
                    value={c}
                    className="cursor-pointer rounded-xl px-3 py-2.5 hover:bg-primary-brand/10 focus:bg-primary-brand/10 transition-colors"
                    dir="rtl"
                  >
                    <div className="flex items-center justify-between gap-4 w-full">
                      {/* Arabic name — right side */}
                      <span className="text-xs text-muted-foreground font-bold truncate max-w-30">
                        {nameAr !== c ? nameAr : "—"}
                      </span>
                      {/* Code — left side */}
                      <span
                        className="font-black text-sm text-foreground font-mono shrink-0"
                        dir="ltr"
                      >
                        {c}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* ── Amount Input ── */}
        <div className="flex-1 bg-muted dark:bg-muted border-2 border-transparent focus-within:border-primary-brand focus-within:bg-card dark:focus-within:bg-card rounded-2xl overflow-hidden transition-all duration-300">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            dir="ltr"
            className="w-full bg-transparent border-0 px-4 py-3 text-foreground font-black text-lg outline-none tabular-nums min-w-0 placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </div>
  );
}
