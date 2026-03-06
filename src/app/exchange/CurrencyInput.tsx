import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="space-y-3">
      <label className="text-lg font-black text-muted-foreground uppercase tracking-widest">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <Select value={currency}>
          <SelectTrigger
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            dir="rtl"
            className="bg-primary-brand rounded-2xl h-36 text-white font-black text-sm w-28 outline-none cursor-pointer appearance-none"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white/90 backdrop-blur-sm border border-border rounded-2xl p-2">
            <SelectGroup>
              {currencies.map((c) => (
                <SelectItem className="ml-4" key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="bg-muted border-2 border-transparent focus-within:border-primary-brand focus-within:bg-card rounded-2xl overflow-hidden transition-all duration-300">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="flex-1 w-full border-transparent bg-transparent px-2 py-2 text-foreground font-black text-lg outline-none tabular-nums min-w-0"
          />
        </div>
      </div>
    </div>
  );
}
