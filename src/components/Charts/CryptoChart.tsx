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

interface CryptoChartProps {
  history: number[];
  isNegative: boolean;
}

const labels = ["90ي", "60ي", "30ي", "7ي", "24س", "1س"];
const labelsFullAr = [
  "90 يوم",
  "60 يوم",
  "30 يوم",
  "7 أيام",
  "24 ساعة",
  "1 ساعة",
];

export default function CryptoChart({ history, isNegative }: CryptoChartProps) {
  const chartData = labels.map((label, i) => ({
    label,
    labelFull: labelsFullAr[i],
    change: parseFloat(history[i]?.toFixed(2) ?? "0"),
  }));

  const chartConfig = {
    change: {
      label: "تغيير السعر %",
      color: isNegative ? "hsl(0 84% 60%)" : "hsl(142 71% 45%)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 4, left: -12, bottom: 0 }}
        >
          <defs>
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
            stroke="hsl(var(--border))"
            vertical={false}
          />

          <XAxis
            dataKey="label"
            tick={{
              fontSize: 10,
              fontFamily: "inherit",
              fill: "hsl(var(--muted-foreground))",
            }}
            axisLine={false}
            tickLine={false}
            dy={8}
            interval={0} // ✅ show all ticks — labels are short now
          />

          <YAxis
            tick={{
              fontSize: 10,
              fontFamily: "inherit",
              fill: "hsl(var(--muted-foreground))",
            }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
            width={36} // ✅ narrower — reclaims chart space on mobile
          />

          <ChartTooltip
            cursor={{
              stroke: "hsl(var(--border))",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
            content={
              <ChartTooltipContent
                // ✅ show full Arabic label in tooltip even though axis shows short
                labelKey="labelFull"
                formatter={(value) => [`${value}%`, "تغيير السعر"]}
                labelClassName="font-bold text-foreground"
              />
            }
          />

          <Area
            type="monotone"
            dataKey="change"
            stroke="var(--color-change)"
            strokeWidth={2}
            fill="url(#gradient-change)"
            dot={{ r: 3, fill: "var(--color-change)", strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: "var(--color-change)",
              strokeWidth: 2,
              stroke: "hsl(var(--background))",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
