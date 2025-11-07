"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ChartSkeleton from "@/components/ui/ChartSkeleton";
import { performanceData } from "@/lib/dummy-data";

/**
 * PerformanceChart Component
 * Blue chart card matching the design
 * Shows performance percentage with blue area chart
 */
export default function PerformanceChart() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <div className="rounded-card bg-[#2A2A4A] p-6 shadow-card">
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {performanceData.percentage}%
            </h2>
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-xs font-medium text-success">+5.32</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-[#B8B8D4]">
            Compared to the $1,232.21 last week
          </p>
        </div>

        {/* Chart */}
        <div className="h-[200px] w-full sm:h-[220px]">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={performanceData.chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                {/* Gradient definition for blue area fill */}
                <defs>
                  <linearGradient id="colorBlueDark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
                    <stop offset="50%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#1E40AF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                {/* Grid lines - subtle */}
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="#3A3A5A"
                  vertical={false}
                />
                {/* Hidden axes */}
                <XAxis hide={true} />
                <YAxis hide={true} />
                {/* Tooltip */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2C2C4A",
                    border: "1px solid #3A3A5A",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                  animationDuration={200}
                />
                {/* Area chart with blue gradient */}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorBlueDark)"
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
