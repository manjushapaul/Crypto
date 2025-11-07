"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { MiniChartSkeleton } from "@/components/ui/ChartSkeleton";
import { accountMetrics } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

/**
 * AccountMetrics Component
 * ACCOUNTS section matching the design
 * Shows Spending, Savings, and Trend with horizontal bar charts
 */
export default function AccountMetrics() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Formats numeric value based on metric type
   */
  const formatValue = (value: number, type: string): string => {
    if (type === "Trend") {
      return `+${value.toFixed(2)}`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ErrorBoundary>
      <div className="rounded-card bg-[#2C2C4A] p-6 shadow-card">
        {/* Section Header */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B8B8D4]">
            ACCOUNTS
          </h3>
        </div>

        {/* Account Items */}
        <div className="space-y-6">
          {accountMetrics.map((metric) => {
            // Convert number array to chart data format
            const chartData = metric.chartData.map((value, index) => ({
              index,
              value,
            }));

            // Calculate max value for bar chart scaling
            const maxValue = Math.max(...metric.chartData);

            return (
              <div key={metric.type} className="space-y-2">
                {/* Label and Value Row */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#B8B8D4]">
                    {metric.type}
                  </span>
                  <div className="flex items-center gap-2">
                    {metric.type === "Trend" && (
                      <TrendingUp className="h-3 w-3 text-success" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        metric.type === "Trend"
                          ? "text-success"
                          : "text-white"
                      )}
                    >
                      {formatValue(metric.value, metric.type)}
                    </span>
                  </div>
                </div>

                {/* Horizontal Bar Chart */}
                <div className="h-8 w-full">
                  {isLoading ? (
                    <MiniChartSkeleton />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                      >
                        <XAxis type="number" hide={true} domain={[0, maxValue]} />
                        <YAxis type="category" dataKey="index" hide={true} />
                        <Bar
                          dataKey="value"
                          fill="#2563EB"
                          radius={[0, 4, 4, 0]}
                          animationDuration={300}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                {/* Time Label */}
                <p className="text-xs text-[#8B8BA7]">Last 12 days</p>
              </div>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
}
