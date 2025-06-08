"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--chart-color-1)" },
  { browser: "safari", visitors: 200, fill: "var(--chart-color-2)" },
  { browser: "firefox", visitors: 287, fill: "var(--chart-color-3)" },
  { browser: "edge", visitors: 173, fill: "var(--chart-color-4)" },
  { browser: "other", visitors: 190, fill: "var(--chart-color-5)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(215, 90%, 50%)",
  },
  safari: {
    label: "Safari",
    color: "hsl(160, 90%, 50%)",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(280, 90%, 50%)",
  },
  edge: {
    label: "Edge",
    color: "hsl(30, 90%, 50%)",
  },
  other: {
    label: "Other",
    color: "hsl(200, 90%, 50%)",
  },
} satisfies ChartConfig;

export function RequestCount() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Browser Distribution
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          January - June 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <ChartTooltipContent hideLabel />
                </div>
              }
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={2}
              stroke="var(--background)"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-gray-900 dark:fill-gray-100 text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-gray-500 dark:fill-gray-400 text-sm"
                        >
                          Total Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 pt-6">
        <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
          <TrendingUp className="h-4 w-4" />
          Trending up by 5.2% this month
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
