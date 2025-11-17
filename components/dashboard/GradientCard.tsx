"use client";

import { Grid, TrendingUp, TrendingDown } from "lucide-react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { portfolioBalance } from "@/lib/dummy-data";

/**
 * GradientCard Props
 */
interface GradientCardProps {
  period?: "daily" | "weekly" | "monthly" | "yearly";
  profitValue?: number;
  profitTrend?: number;
  balance?: number;
}

/**
 * GradientCard Component
 * MY CARDS gradient card matching the sidebar design
 * Shows balance with gradient background and period-based profit
 */
export default function GradientCard({
  period = "monthly",
  profitValue = 123455.13,
  profitTrend = 10.4,
  balance = portfolioBalance.total,
}: GradientCardProps) {
  /**
   * Formats currency value to USD format
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  /**
   * Get period label
   */
  const getPeriodLabel = (): string => {
    const labels: Record<string, string> = {
      daily: "DAILY PROFIT",
      weekly: "WEEKLY PROFIT",
      monthly: "MONTHLY PROFIT",
      yearly: "YEARLY PROFIT",
    };
    return labels[period];
  };

  const isPositiveTrend = profitTrend >= 0;

  return (
    <ErrorBoundary>
      <div className="relative min-h-[200px] rounded-card bg-gradient-card bg-[linear-gradient(135deg,#1d1d36_0%,#ecbbaa_40%,#dac28f_60%,#757ad0_100%)] p-6 shadow-card sm:min-h-[220px]">
        {/* Grid Icon - Top Right */}
        <div className="absolute right-6 top-6">
          <Grid className="h-5 w-5 text-white/60" />
        </div>

        {/* Content */}
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Label */}
            <p className="mb-8 text-xs font-medium uppercase tracking-wider text-white/80">
              MY CARDS
            </p>

            {/* Large Balance */}
            <h2 className="text-4xl font-semibold text-white xl:text-5xl">
              {formatCurrency(balance)}
            </h2>
          </div>

          <div className="mt-auto">
            {/* Period Profit Label - Dynamic based on selected period */}
            <p className="mb-1  mt-6  text-xs font-medium uppercase tracking-wider text-white/80">
              {getPeriodLabel()}
            </p>

            {/* Period Profit Value - Dynamic based on selected period */}
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                {formatCurrency(profitValue)}
              </h3>
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1">
                {isPositiveTrend ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                )}
                <span className="text-xs font-medium text-white">
                  {isPositiveTrend ? '+' : ''}{profitTrend.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
