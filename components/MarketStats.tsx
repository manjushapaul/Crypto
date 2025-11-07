"use client";

import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketStatsProps {
  stats: {
    total_market_cap: number;
    total_volume: number;
    btc_dominance: number;
    active_cryptocurrencies: number;
  };
}

export default function MarketStats({ stats }: MarketStatsProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const statCards = [
    {
      label: "Total Market Cap",
      value: formatCurrency(stats.total_market_cap),
      icon: DollarSign,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "24h Volume",
      value: formatCurrency(stats.total_volume),
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      label: "BTC Dominance",
      value: `${stats.btc_dominance.toFixed(2)}%`,
      icon: BarChart3,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      label: "Active Cryptocurrencies",
      value: stats.active_cryptocurrencies.toLocaleString(),
      icon: TrendingDown,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="rounded-card border border-gray-200 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#64748B] dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-[#1E293B] dark:text-gray-100">
                  {stat.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg",
                  stat.bgColor
                )}
              >
                <Icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

