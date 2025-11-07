"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { CryptoCurrency } from "@/types/crypto";
import { cn } from "@/lib/utils";

interface CryptoCardProps {
  crypto: CryptoCurrency;
  onClick?: () => void;
}

export default function CryptoCard({ crypto, onClick }: CryptoCardProps) {
  const isPositive = crypto.price_change_percentage_24h >= 0;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-card border border-gray-200 bg-white p-6 shadow-card transition-all hover:shadow-card-hover dark:border-gray-800 dark:bg-gray-900",
        onClick && "hover:scale-[1.02]"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex-shrink-0">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="h-full w-full rounded-full object-cover"
              loading="lazy"
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/40/64748B/FFFFFF?text=${crypto.symbol.substring(0, 2).toUpperCase()}`;
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-[#1E293B] dark:text-gray-100">
              {crypto.name}
            </h3>
            <p className="text-sm text-[#64748B] dark:text-gray-400">
              {crypto.symbol.toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-[#1E293B] dark:text-gray-100">
            {formatCurrency(crypto.current_price)}
          </p>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium",
              isPositive
                ? "bg-green-100 text-[#10B981] dark:bg-green-950/30 dark:text-green-400"
                : "bg-red-100 text-[#EF4444] dark:bg-red-950/30 dark:text-red-400"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-[#64748B] dark:text-gray-400">
            <span>Market Cap</span>
            <span className="font-medium text-[#1E293B] dark:text-gray-100">
              {formatMarketCap(crypto.market_cap)}
            </span>
          </div>
          <div className="flex justify-between text-[#64748B] dark:text-gray-400">
            <span>Volume (24h)</span>
            <span className="font-medium text-[#1E293B] dark:text-gray-100">
              {formatMarketCap(crypto.total_volume)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

