"use client";

import { useState } from "react";
import { ETFItem } from "@/lib/Data/etfData";
import type { CandlePoint, ChartRange } from "@/lib/Data/chartData";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface Props {
  item:        ETFItem;
  initialData: CandlePoint[];
}

const RANGES: { key: ChartRange; label: string }[] = [
  { key: "1d",  label: "يوم"   },
  { key: "5d",  label: "5أيام" },
  { key: "1mo", label: "شهر"   },
  { key: "3mo", label: "3شهور" },
  { key: "1y",  label: "سنة"   },
];

function CustomTooltip({
  active, payload, label, currency,
}: {
  active?:   boolean;
  payload?:  { value: number }[];
  label?:    string;
  currency:  string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-xs font-black space-y-0.5" dir="ltr">
      {label && <p className="text-muted-foreground">{label}</p>}
      <p className="text-foreground">
        {payload[0].value.toLocaleString("en-US", { maximumFractionDigits: 2 })} {currency}
      </p>
    </div>
  );
}

export default function ETFChart({ item, initialData }: Props) {
  const [range,   setRange]   = useState<ChartRange>("1d");
  const [data,    setData]    = useState<CandlePoint[]>(initialData);
  const [loading, setLoading] = useState(false);

  const color  = item.positive ? "#22c55e" : "#ff4c60";
  const isLive = data.length > 0;

  async function handleRangeChange(newRange: ChartRange) {
    if (newRange === range) return;
    setRange(newRange);
    setLoading(true);
    try {
      const res  = await fetch(
        `/api/candles?ticker=${encodeURIComponent(item.yahooTicker ?? item.ticker)}&range=${newRange}`,
      );
      const json = await res.json();
      setData(json.data ?? []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">

      {/* ── Range tabs + live badge ── */}
      <div className="flex items-center justify-between gap-2">

        {/* Scrollable tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => handleRangeChange(r.key)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                range === r.key
                  ? "bg-primary-brand text-white shadow"
                  : "bg-muted text-muted-foreground hover:bg-primary-brand/10 hover:text-primary-brand border border-border"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Live badge */}
        <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full border ${
          isLive
            ? "bg-green-500/10 text-green-500 border-green-500/20"
            : "bg-muted text-muted-foreground border-border"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLive ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
          <span className="hidden sm:inline">
            {isLive ? "بيانات مباشرة" : "بيانات غير متاحة"}
          </span>
        </span>
      </div>

      {/* ── Chart ── */}
      <div className={`w-full h-48 sm:h-56 md:h-64 transition-opacity duration-300 ${
        loading ? "opacity-40 pointer-events-none" : "opacity-100"
      }`}>
        {!isLive ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-muted-foreground font-bold">
              البيانات غير متاحة · السوق مغلق
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0}   />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{ fontSize: 9, fill: "var(--color-muted-foreground)", fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                tickCount={4}
              />

              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 9, fill: "var(--color-muted-foreground)", fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000
                    ? `${(v / 1000).toFixed(1)}k`
                    : v.toLocaleString("en-US", { maximumFractionDigits: 0 })
                }
                width={36}
              />

              <Tooltip
                content={(props) => (
                  <CustomTooltip
                    active={props.active}
                    payload={props.payload as { value: number }[] | undefined}
                    label={props.label as string | undefined}
                    currency={item.currency}
                  />
                )}
                cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 4" }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${item.id})`}
                dot={false}
                activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}