"use client";

import { Grid, TrendingUp } from "lucide-react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { portfolioBalance } from "@/lib/dummy-data";

/**
 * GradientCard Component
 * MY CARDS gradient card matching the sidebar design
 * Shows balance with gradient background
 */
export default function GradientCard() {
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
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-white/80">
              MY CARDS
            </p>

            {/* Large Balance */}
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              {formatCurrency(portfolioBalance.total)}
            </h2>
          </div>

          <div className="mt-auto">
            {/* Monthly Profit Label */}
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/80">
              MONTHLY PROFIT
            </p>

            {/* Monthly Profit Value */}
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                {formatCurrency(123455.13)}
              </h3>
              <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1">
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-xs font-medium text-white">+10.4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
