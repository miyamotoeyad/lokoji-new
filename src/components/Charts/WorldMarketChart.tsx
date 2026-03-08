"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface WorldMarketChartProps {
  data: { time: string; value: number }[];
  isPositive: boolean;
  ticker: string;
}

export default function WorldMarketChart({
  data,
  isPositive,
  ticker,
}: WorldMarketChartProps) {
  const color = isPositive ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)";

  const chartConfig = {
    value: {
      label: "القيمة",
      color,
    },
  } satisfies ChartConfig;

  if (!data.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-xs text-muted-foreground font-bold">
          البيانات غير متاحة · السوق مغلق
        </p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`grad-${ticker}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-value)"
                stopOpacity={0.25}
              />
              <stop
                offset="95%"
                stopColor="var(--color-value)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            vertical={false}
          />

          <XAxis
            dataKey="time"
            tick={{
              fontSize: 9,
              fill: "hsl(var(--muted-foreground))",
              fontWeight: 700,
            }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            tickCount={5}
          />

          <YAxis
            domain={["auto", "auto"]}
            tick={{
              fontSize: 9,
              fill: "hsl(var(--muted-foreground))",
              fontWeight: 700,
            }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) =>
              v >= 1000
                ? `${(v / 1000).toFixed(1)}k`
                : v.toLocaleString("en-US", { maximumFractionDigits: 0 })
            }
            width={36}
          />

          <ChartTooltip
            cursor={{
              stroke: "hsl(var(--border))",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
            content={
              <ChartTooltipContent
                formatter={(value) => [
                  Number(value).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
                  "القيمة",
                ]}
                labelClassName="font-bold text-foreground"
              />
            }
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            fill={`url(#grad-${ticker})`}
            dot={false}
            activeDot={{
              r: 4,
              fill: "var(--color-value)",
              strokeWidth: 2,
              stroke: "hsl(var(--background))",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
