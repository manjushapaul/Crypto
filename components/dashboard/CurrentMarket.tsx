"use client";

import { useState } from "react";
import { CoinData } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import MicroChart from "@/components/ui/MicroChart";
import AssetDetailModal from "@/components/ui/AssetDetailModal";
import { coinAssets } from "@/lib/dummy-data";

/**
 * CurrentMarket Component Props
 * 
 * @property {CoinData[]} assets - Array of cryptocurrency assets to display (optional, defaults to coinAssets from dummy-data)
 * @property {string} className - Additional CSS classes for the container (optional)
 */
interface CurrentMarketProps {
  assets?: CoinData[];
  className?: string;
}

/**
 * CurrentMarket - Modern cryptocurrency market overview component
 * 
 * Displays a 2-column grid of cryptocurrency asset cards with comprehensive market data.
 * Clean, readable layout with proper spacing and organization.
 * 
 * Features:
 * - 2-column responsive grid layout (1 column on mobile, 2 on large screens)
 * - Header section: coin icon, name/symbol, and trend chart
 * - Data grid: market cap, 24h volume, and circulating supply with progress bar
 * - Improved spacing and readability with vertical card organization
 * - Hover effects for better interactivity
 * - Click to open detailed modal
 * - Keyboard accessible (tab navigation, enter to open, focus states)
 * - Fully responsive design for all screen sizes
 * - Proper number formatting with commas and decimal places
 * - Modular and reusable with props-based data
 * 
 * Accessibility:
 * - Semantic HTML with proper ARIA labels
 * - Keyboard navigation support
 * - Focus visible states
 * - Screen reader friendly
 * 
 * @example
 * ```tsx
 * // Use with default data
 * <CurrentMarket />
 * 
 * // Use with custom data
 * <CurrentMarket assets={customCoinData} />
 * ```
 */
export default function CurrentMarket({ 
  assets = coinAssets,
  className 
}: CurrentMarketProps) {
  const [selectedAsset, setSelectedAsset] = useState<CoinData | null>(null);

  /**
   * Handles card click to open detail modal
   */
  const handleCardClick = (asset: CoinData) => {
    setSelectedAsset(asset);
  };

  /**
   * Handles keyboard interaction for accessibility
   */
  const handleCardKeyDown = (e: React.KeyboardEvent, asset: CoinData) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick(asset);
    }
  };

  /**
   * Gets the coin icon color class based on coin ID
   */
  const getCoinIconClass = (id: string): string => {
    const colorMap: Record<string, string> = {
      bitcoin: "bg-linear-to-br from-blue-900 to-blue-700",
      ethereum: "bg-linear-to-br from-gray-700 to-purple-900",
    };
    return colorMap[id] || "bg-linear-to-br from-gray-600 to-gray-800";
  };

  return (
    <ErrorBoundary>
      <div 
        className={cn(
          "rounded-2xl mt-6 sm:bg-linear-to-br sm:from-blue-50/50 sm:to-purple-50/30 dark:sm:from-gray-800/50 dark:sm:to-gray-900/30 sm:p-6",
          className
        )}
      >
        {/* Section Header */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-300">
            CURRENT MARKET
          </h3>
        </div>

        {/* Asset Cards List */}
        <div className="grid grid-cols-1 gap-6 min-[500px]:grid-cols-2">
          {assets.map((asset) => {
            const supplyPercentage = (asset.circulatingSupply / asset.totalSupply) * 100;
            const iconColorClass = getCoinIconClass(asset.id);

            return (
              <div
                key={asset.id}
                onClick={() => handleCardClick(asset)}
                onKeyDown={(e) => handleCardKeyDown(e, asset)}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${asset.name}`}
                className="group cursor-pointer rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {/* Header: Icon, Name, Symbol */}
                <div className="mb-2 flex items-center gap-2">
                  <div className="shrink-0">
                    {/* Crypto Icon */}
                    <div
                      className="flex h-12 w-12 items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      aria-hidden="true"
                    >
                      {/* Bitcoin Logo */}
                      {asset.id === "bitcoin" && (
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 32 32"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
                            fill="#F7931A"
                          />
                        </svg>
                      )}

                      {/* Ethereum Logo */}
                      {asset.id === "ethereum" && (
                        <svg
                          width="36"
                          height="36"
                          viewBox="0 0 256 417"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
                            fill="#7681c5"
                            fillOpacity="0.8"
                          />
                          <path
                            d="M127.962 0L0 212.32l127.962 75.639V154.158z"
                            fill="#7681c5"
                          />
                          <path
                            d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"
                            fill="#7681c5"
                            fillOpacity="0.8"
                          />
                          <path
                            d="M127.962 416.905v-104.72L0 236.585z"
                            fill="#7681c5"
                          />
                          <path
                            d="M127.961 287.958l127.96-75.637-127.96-58.162z"
                            fill="#7681c5"
                            fillOpacity="0.5"
                          />
                          <path
                            d="M0 212.32l127.96 75.638v-133.8z"
                            fill="#7681c5"
                            fillOpacity="0.7"
                          />
                        </svg>
                      )}

                      {/* Ripple (XRP) Logo */}
                      {asset.id === "ripple" && (
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 512 424"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M437.8 208.1c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5L0 281.3l8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 73.2-73.2-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5z"
                            fill="#23292F"
                          />
                        </svg>
                      )}

                      {/* Cardano (ADA) Logo */}
                      {asset.id === "cardano" && (
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 2000 2000"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="1000" cy="1000" r="180" fill="#0033AD" />
                          <circle cx="1000" cy="450" r="80" fill="#0033AD" />
                          <circle cx="1000" cy="1550" r="80" fill="#0033AD" />
                          <circle cx="450" cy="1000" r="80" fill="#0033AD" />
                          <circle cx="1550" cy="1000" r="80" fill="#0033AD" />
                          <circle cx="650" cy="650" r="60" fill="#0033AD" />
                          <circle cx="1350" cy="650" r="60" fill="#0033AD" />
                          <circle cx="650" cy="1350" r="60" fill="#0033AD" />
                          <circle cx="1350" cy="1350" r="60" fill="#0033AD" />
                        </svg>
                      )}

                      {/* Solana (SOL) Logo */}
                      {asset.id === "solana" && (
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 646 512"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M112.6 364.04l-73.53 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 0l-35.2-35.2L112.6 364.04z"
                            fill="url(#solGradient1)"
                          />
                          <path
                            d="M112.6 0L39.07 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 512l-35.2 35.2L112.6 0z"
                            fill="url(#solGradient2)"
                          />
                          <path
                            d="M646 256L112.6 256 39.07 182.47a24.89 24.89 0 00-35.2 0c-9.7 9.7-9.7 25.5 0 35.2l73.53 73.53L610.8 291.2 646 256z"
                            fill="url(#solGradient3)"
                          />
                          <defs>
                            <linearGradient id="solGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#9945FF" />
                              <stop offset="100%" stopColor="#14F195" />
                            </linearGradient>
                            <linearGradient id="solGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#9945FF" />
                              <stop offset="100%" stopColor="#14F195" />
                            </linearGradient>
                            <linearGradient id="solGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#9945FF" />
                              <stop offset="100%" stopColor="#14F195" />
                            </linearGradient>
                          </defs>
                        </svg>
                      )}

                      {/* Default fallback for other coins */}
                      {asset.id !== "bitcoin" && 
                       asset.id !== "ethereum" && 
                       asset.id !== "ripple" && 
                       asset.id !== "cardano" && 
                       asset.id !== "solana" && (
                <div
                  className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-full shadow-sm",
                            iconColorClass
                  )}
                >
                          <span className="text-lg font-bold text-white">
                            {asset.symbol.substring(0, 1)}
                  </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name and Symbol */}
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {asset.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{asset.symbol}</p>
                  </div>
                </div>

                {/* Data Section */}
                <div className="space-y-3">
                  {/* Row 1: Market Cap */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Market cap:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(asset.marketCap, 2)}
                    </p>
                  </div>

                  {/* Row 2: Volume (24h) */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
                      Volume (24h):
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(asset.volume, 2)}
                    </p>
                  </div>

                  {/* Row 3: Circulating Supply and Micro Chart */}
                  <div className="flex items-start gap-4">
                    {/* Circulating Supply with Progress Bar */}
                    <div className="flex-1">
                      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-300">
                        Circulating supply
                      </p>
                      <p className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
                        {supplyPercentage.toFixed(1)}%
                      </p>
                      {/* Progress Bar */}
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-orange-800 via-orange-400 to-yellow-200 transition-all duration-500"
                          style={{ width: `${Math.min(supplyPercentage, 100)}%` }}
                          role="progressbar"
                          aria-valuenow={supplyPercentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Circulating supply: ${supplyPercentage.toFixed(1)}%`}
                        />
                      </div>
                    </div>

                    {/* Micro Chart */}
                    <div className="shrink-0">
                      <MicroChart
                        data={asset.chartData}
                        width={100}
                        height={60}
                        lineColor={asset.change >= 0 ? "#10B981" : "#EF4444"}
                        fillColor={asset.change >= 0 ? "#FEF3C7" : "#FEE2E2"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Asset Detail Modal */}
      <AssetDetailModal
        asset={selectedAsset}
        isOpen={!!selectedAsset}
        onClose={() => setSelectedAsset(null)}
      />
    </ErrorBoundary>
  );
}
