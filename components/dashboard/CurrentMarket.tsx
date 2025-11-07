"use client";

import { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { MiniChartSkeleton } from "@/components/ui/ChartSkeleton";
import { coinAssets } from "@/lib/dummy-data";

/**
 * CurrentMarket Component
 * CURRENT MARKET section matching the design
 * Shows cryptocurrency market data in table format
 */
export default function CurrentMarket() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Maps coin ID to corresponding Tailwind background color class
   */
  const getCoinColorClass = (id: string): string => {
    if (id === "bitcoin") return "bg-bitcoin";
    if (id === "ethereum") return "bg-ethereum";
    return "bg-gray-500";
  };

  /**
   * Returns stroke color for chart (green for positive trends)
   */
  const getStrokeColor = (): string => {
    return "#10B981"; // Green for all charts in design
  };

  /**
   * Formats currency value
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
      <div className="rounded-card bg-[#f1f5fd] p-6 shadow-card">
        {/* Section Header */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#B8B8D4]">
            CURRENT MARKET
          </h3>
        </div>

        {/* List of Cryptocurrency Rows */}
        <div className="space-y-4">
          {coinAssets.map((coin) => {
            const colorClass = getCoinColorClass(coin.id);
            const strokeColor = getStrokeColor();

            return (
              <div
                key={coin.id}
                className="flex items-center gap-4 rounded-lg p-3 transition-colors bg-[#fffff] border-gray-200 border-solid border"
              >
                {/* Coin Icon Circle */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    colorClass
                  )}
                >
                  <span className="text-xs font-semibold text-[1d1d36]">
                    {coin.symbol.substring(0, 1)}
                  </span>
                </div>

                {/* Coin Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1d1d36]">
                    {coin.name} {coin.symbol}
                  </p>
                  <div className="mt-1 space-y-1 text-xs">
                    <div className="text-[#B8B8D4]">
                      <span className="font-medium">Market cap: </span>
                      <span className="text-[#1d1d36]">{formatCurrency(coin.price)}</span>
                    </div>
                    <div className="text-[#B8B8D4]">
                      <span className="font-medium">Volume (24h): </span>
                      <span className="text-[#1d1d36]">{coin.volume}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#B8B8D4]">
                      <span className="font-medium">Circulating supply: </span>
                      {/* Mini LineChart */}
                      <div className="h-4 w-16">
                        {isLoading ? (
                          <div className="h-full w-full animate-pulse rounded bg-[#3A3A5A]" />
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={coin.chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                              <XAxis hide={true} />
                              <YAxis hide={true} />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke={strokeColor}
                                strokeWidth={2}
                                dot={false}
                                animationDuration={300}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Three-dot Menu */}
                <button
                  className="flex-shrink-0 rounded p-2 text-[#B8B8D4] transition-colors hover:bg-[#3A3A5A] hover:text-white touch-manipulation"
                  aria-label="More options"
                >
                  <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
}
