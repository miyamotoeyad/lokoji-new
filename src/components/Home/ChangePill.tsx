import { RiArrowDownSFill, RiArrowUpSFill } from "@remixicon/react";

export function ChangePill({
  value,
  suffix = "%",
}: {
  value: number;
  suffix?: string;
}) {
  const isUp = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${
        isUp
          ? "bg-green-500/10 text-green-500"
          : "bg-destructive/10 text-destructive"
      }`}
      dir="ltr"
    >
      {isUp ? <RiArrowUpSFill size={10} /> : <RiArrowDownSFill size={10} />}
      {Math.abs(value).toFixed(2)}
      {suffix}
    </span>
  );
}
