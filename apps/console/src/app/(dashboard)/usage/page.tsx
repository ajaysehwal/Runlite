"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getApiUsage } from "@/store/thunks/usage";
import { Record } from "@/types";
import { useAuth } from "@/hooks/useAuth";

interface HourlyData {
  hour: string;
  total: number;
  cached: number;
  uncached: number;
}

interface MonthlyData {
  month: string;
  total: number;
  cached: number;
  uncached: number;
}

type TimeRange = "1m" | "3m" | "6m" | "1y";
type ActiveTab = "cost" | "activity";

// Utility functions
const getHourlyData = (usageRecords: Record[]): HourlyData[] => {
  // Handle case when usageRecords is undefined or empty
  if (!usageRecords || usageRecords.length === 0) {
    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i.toString().padStart(2, "0")}:00`,
      total: 0,
      cached: 0,
      uncached: 0,
    }));
  }

  const hourlyMap = new Map<string, HourlyData>();

  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    const hour = `${i.toString().padStart(2, "0")}:00`;
    hourlyMap.set(hour, {
      hour,
      total: 0,
      cached: 0,
      uncached: 0,
    });
  }

  usageRecords.forEach((record) => {
    if (!record.timestamp) return; // Skip invalid records

    const date = new Date(record.timestamp);
    const hour = date.getHours().toString().padStart(2, "0");
    const hourKey = `${hour}:00`;

    const hourData = hourlyMap.get(hourKey);
    console.log("hourData", hourData);
    if (hourData) {
      hourData.total += 1;
      if (record.isCached) {
        hourData.cached += 1;
      } else {
        hourData.uncached += 1;
      }
    }
  });

  return Array.from(hourlyMap.values()).sort(
    (a, b) => parseInt(a.hour) - parseInt(b.hour)
  );
};

const getMonthlyData = (usageRecords: Record[]): MonthlyData[] => {
  // Handle case when usageRecords is undefined or empty
  if (!usageRecords || usageRecords.length === 0) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month) => ({
      month,
      total: 0,
      cached: 0,
      uncached: 0,
    }));
  }

  const monthlyMap = new Map<string, MonthlyData>();

  // Initialize all months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  months.forEach((month) => {
    monthlyMap.set(month, {
      month,
      total: 0,
      cached: 0,
      uncached: 0,
    });
  });

  usageRecords.forEach((record) => {
    if (!record.timestamp) return; // Skip invalid records

    const date = new Date(record.timestamp);
    const monthKey = date.toLocaleString("default", { month: "short" });

    const monthData = monthlyMap.get(monthKey);
    if (monthData) {
      monthData.total += 1;
      if (record.isCached) {
        monthData.cached += 1;
      } else {
        monthData.uncached += 1;
      }
    }
  });

  return Array.from(monthlyMap.values());
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    name?: string;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload) return null;

  return (
    <div className="p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }} className="text-sm">
          {entry.name || entry.dataKey}: {entry.value}
        </p>
      ))}
    </div>
  );
};

interface HourlyChartProps {
  data: HourlyData[];
}

const HourlyChart: React.FC<HourlyChartProps> = ({ data }) => (
  <Card className="border-none shadow-none">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Hourly Usage Distribution
      </CardTitle>
      <CardDescription className="text-gray-500 dark:text-gray-400">
        Breakdown of cached vs uncached requests by hour
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="uncachedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="cachedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
            <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} className="dark:stroke-gray-400" />
            <YAxis stroke="#94a3b8" fontSize={12} className="dark:stroke-gray-400" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="uncached"
              name="Uncached Requests"
              stackId="1"
              stroke="#818cf8"
              fill="url(#uncachedGradient)"
            />
            <Area
              type="monotone"
              dataKey="cached"
              name="Cached Requests"
              stackId="1"
              stroke="#34d399"
              fill="url(#cachedGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

interface MonthlyChartProps {
  data: MonthlyData[];
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => (
  <Card className="border-none shadow-none">
    <CardHeader>
      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Monthly Usage Trend
      </CardTitle>
      <CardDescription className="text-gray-500 dark:text-gray-400">
        Total requests per month with cache breakdown
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-700" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} className="dark:stroke-gray-400" />
            <YAxis stroke="#94a3b8" fontSize={12} className="dark:stroke-gray-400" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Requests"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: "#8B5CF6", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="cached"
              name="Cached Requests"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ fill: "#34d399", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="uncached"
              name="Uncached Requests"
              stroke="#818cf8"
              strokeWidth={2}
              dot={{ fill: "#818cf8", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

interface CacheStatsCardProps {
  cacheCount: number;
  uncacheCount: number;
}

const CacheStatsCard: React.FC<CacheStatsCardProps> = ({
  cacheCount,
  uncacheCount,
}) => {
  const total = cacheCount + uncacheCount;
  const cacheRate = total > 0 ? ((cacheCount / total) * 100).toFixed(1) : "0";

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Cache Statistics
        </CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Overview of cache performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Cache Hit Rate</p>
            <p className="text-3xl font-bold text-green-500 dark:text-green-400">{cacheRate}%</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">Cached Requests</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {cacheCount.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300">Uncached Requests</p>
              <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                {uncacheCount.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Requests</p>
            <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
              {total.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Usage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("activity");
  const [timeRange, setTimeRange] = React.useState<TimeRange>("6m");
  const dispatch = useDispatch<AppDispatch>();
  const { usage } = useSelector((state: RootState) => state.usage);
  const { user } = useAuth();
  const hourlyData = React.useMemo(
    () => getHourlyData(usage?.usageRecord || []),
    [usage]
  );

  const monthlyData = React.useMemo(
    () => getMonthlyData(usage?.usageRecord || []),
    [usage]
  );
  React.useEffect(() => {
    if (user) {
      dispatch(getApiUsage());
    }
  }, [dispatch, user]);

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as ActiveTab)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-[200px] grid-cols-2 bg-gray-100 dark:bg-gray-800">
              <TabsTrigger 
                value="activity"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger 
                value="cost"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                Cost
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Select
            value={timeRange}
            onValueChange={(value: TimeRange) => setTimeRange(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] border-gray-200 dark:border-gray-700 bg-transparent">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <Tabs value={activeTab}>
              <TabsContent value="activity" className="m-0">
                <div className="grid gap-6 md:grid-cols-3">
                  <HourlyChart data={hourlyData} />
                  <CacheStatsCard
                    cacheCount={usage?.cacheCount || 0}
                    uncacheCount={usage?.uncacheCount || 0}
                  />
                  <MonthlyChart data={monthlyData} />
                </div>
              </TabsContent>
              <TabsContent value="cost" className="m-0">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="col-span-2 border-none shadow-none">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Cost Analysis
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        Coming soon
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-gray-400 dark:text-gray-500">
                      Cost analysis features will be added here
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Usage;
