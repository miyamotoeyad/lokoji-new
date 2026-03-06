"use client";

import { useState } from "react";
import type { CandlePoint, ChartRange } from "@/lib/Data/chartData";
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface Props {
  ticker:      string;
  isUp:        boolean;
  initialData: CandlePoint[];
}

const RANGES: { key: ChartRange; label: string }[] = [
  { key: "1d",  label: "يوم"    },
  { key: "5d",  label: "5 أيام" },
  { key: "1mo", label: "شهر"    },
  { key: "3mo", label: "3 شهور" },
  { key: "1y",  label: "سنة"    },
];

function CustomTooltip({
  active, payload,
}: {
  active?: boolean;
  payload?: { value: number }[];
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-xs font-black" dir="ltr">
      <p className="text-foreground">
        {payload[0].value.toLocaleString("en-US", { maximumFractionDigits: 2 })} EGP
      </p>
    </div>
  );
}

export default function MarketChart({ ticker, isUp, initialData }: Props) {
  const [range,   setRange]   = useState<ChartRange>("1d");
  const [data,    setData]    = useState<CandlePoint[]>(initialData);
  const [loading, setLoading] = useState(false);

  const color  = isUp ? "#22c55e" : "#ff4c60";
  const isLive = data.length > 0;

  async function handleRangeChange(newRange: ChartRange) {
    if (newRange === range) return;
    setRange(newRange);
    setLoading(true);
    try {
      const res  = await fetch(`/api/candles?ticker=${encodeURIComponent(ticker)}&range=${newRange}`);
      const json = await res.json();
      setData(json.data ?? []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">

      {/* ── Range tabs + live badge ── */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => handleRangeChange(r.key)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
              range === r.key
                ? "bg-primary-brand text-white shadow"
                : "bg-muted text-muted-foreground hover:bg-primary-brand/10 hover:text-primary-brand border border-border"
            }`}
          >
            {r.label}
          </button>
        ))}
        <span className={`mr-auto inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full border ${
          isLive
            ? "bg-green-500/10 text-green-500 border-green-500/20"
            : "bg-muted text-muted-foreground border-border"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
          {isLive ? "بيانات مباشرة" : "السوق مغلق"}
        </span>
      </div>

      {/* ── Chart ── */}
      <div className={`w-full h-64 transition-opacity duration-300 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
        {!isLive ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-xs text-muted-foreground font-bold">البيانات غير متاحة · السوق مغلق</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${ticker}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0}   />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />

              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)", fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />

              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)", fontWeight: 700 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => v.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                width={60}
              />

              <Tooltip
                content={(props) => (
                  <CustomTooltip
                    active={props.active}
                    payload={props.payload as { value: number }[] | undefined}
                  />
                )}
                cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "4 4" }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${ticker})`}
                dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}