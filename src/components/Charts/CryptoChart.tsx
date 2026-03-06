"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CryptoChartProps {
  history: number[];
  isNegative: boolean;
}

const labels = ["90 يوم", "60 يوم", "30 يوم", "7 أيام", "24 ساعة", "1 ساعة"];

export default function CryptoChart({ history, isNegative }: CryptoChartProps) {
  const chartData = labels.map((label, i) => ({
    label,
    change: parseFloat(history[i]?.toFixed(2) ?? "0"),
  }));

  // ✅ Define color once here — ChartContainer injects it as --color-change
  // Both light and dark mode use the same semantic color (red/green)
  // but we adjust opacity via the gradient stops
  const chartConfig = {
    change: {
      label: "تغيير السعر %",
      // Uses CSS variable so shadcn's theming layer controls it
      color: isNegative
        ? "hsl(0 84% 60%)"       // red — same in light + dark (saturated enough)
        : "hsl(142 71% 45%)",    // green
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          {/* ✅ Use var(--color-change) — injected by ChartContainer */}
          <linearGradient id="gradient-change" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-change)"
              stopOpacity={0.25}
            />
            <stop
              offset="95%"
              stopColor="var(--color-change)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          // ✅ Already a CSS variable — adapts to dark mode automatically
          stroke="hsl(var(--border))"
          vertical={false}
        />

        <XAxis
          dataKey="label"
          tick={{
            fontSize: 11,
            fontFamily: "inherit",
            // ✅ CSS variable — adapts automatically
            fill: "hsl(var(--muted-foreground))",
          }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />

        <YAxis
          tick={{
            fontSize: 11,
            fontFamily: "inherit",
            fill: "hsl(var(--muted-foreground))",
          }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
          width={48}
        />

        <ChartTooltip
          // ✅ ChartTooltipContent uses bg-background + text-foreground internally
          cursor={{
            stroke: "hsl(var(--border))",
            strokeWidth: 1,
            strokeDasharray: "4 4",
          }}
          content={
            <ChartTooltipContent
              formatter={(value) => [`${value}%`, "تغيير السعر"]}
              labelClassName="font-bold text-foreground"
            />
          }
        />

        <Area
          type="monotone"
          dataKey="change"
          // ✅ All three use var(--color-change)
          stroke="var(--color-change)"
          strokeWidth={2.5}
          fill="url(#gradient-change)"
          dot={{
            r: 4,
            fill: "var(--color-change)",
            strokeWidth: 0,
          }}
          activeDot={{
            r: 6,
            fill: "var(--color-change)",
            strokeWidth: 2,
            // ✅ Ring uses bg-background so it matches dark card background
            stroke: "hsl(var(--background))",
          }}
        />
      </AreaChart>
    </ChartContainer>
  );
}