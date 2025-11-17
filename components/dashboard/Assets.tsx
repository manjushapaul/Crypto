"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

/**
 * Asset holding data interface
 */
interface AssetHolding {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  valueUSD: number;
  change24h: number;
  allocation: number; // Percentage of portfolio
}

/**
 * Portfolio Coin Interface (from Explore page additions)
 */
interface PortfolioCoin {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  gradient: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  amount: number;
  addedAt: Date;
}

/**
 * Watchlist Coin Interface (coins being tracked, not held)
 */
interface WatchlistCoin {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  gradient: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  addedAt: Date;
}

/**
 * Assets Component Props
 * 
 * @property {AssetHolding[]} assets - Array of asset holdings
 * @property {(asset: AssetHolding) => void} onAssetClick - Callback when asset is clicked
 * @property {"daily" | "weekly" | "monthly" | "yearly"} period - Time period for asset analytics
 * @property {PortfolioCoin[]} portfolioCoins - Coins added from Explore page (appear at top)
 * @property {WatchlistCoin[]} watchlistCoins - Coins in watchlist (not held, appear in separate section)
 * @property {(coinId: string) => void} onRemoveFromWatchlist - Callback to remove coin from watchlist
 */
interface AssetsProps {
  assets?: AssetHolding[];
  onAssetClick?: (asset: AssetHolding) => void;
  period?: "daily" | "weekly" | "monthly" | "yearly";
  portfolioCoins?: PortfolioCoin[];
  watchlistCoins?: WatchlistCoin[];
  onRemoveFromWatchlist?: (coinId: string) => void;
}

/**
 * Generate period-based asset holdings
 */
function generateAssetsByPeriod(period: "daily" | "weekly" | "monthly" | "yearly"): AssetHolding[] {
  // Base multipliers for different periods
  const multipliers: Record<string, { amount: number; value: number; change: number }> = {
    daily: { amount: 0.05, value: 0.08, change: 0.5 },    // Small daily changes
    weekly: { amount: 0.3, value: 0.5, change: 1.2 },     // Weekly accumulation
    monthly: { amount: 1, value: 1, change: 2.5 },        // Monthly (baseline)
    yearly: { amount: 12, value: 11, change: 15 },        // Yearly totals
  };

  const m = multipliers[period];

  return [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      amount: 2.5 * m.amount,
      valueUSD: 100533.95 * m.value,
      change24h: 2.34 * m.change,
      allocation: 45.2,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      amount: 15.8 * m.amount,
      valueUSD: 34968.25 * m.value,
      change24h: -1.23 * m.change,
      allocation: 28.5,
    },
    {
      id: "ripple",
      name: "Ripple",
      symbol: "XRP",
      amount: 25000 * m.amount,
      valueUSD: 16000 * m.value,
      change24h: 3.12 * m.change,
      allocation: 12.8,
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      amount: 18500 * m.amount,
      valueUSD: 9620 * m.value,
      change24h: 1.85 * m.change,
      allocation: 8.2,
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      amount: 125 * m.amount,
      valueUSD: 13347.5 * m.value,
      change24h: 5.42 * m.change,
      allocation: 5.3,
    },
  ];
}

/**
 * Get period label for display
 */
function getPeriodLabel(period: "daily" | "weekly" | "monthly" | "yearly"): string {
  const labels: Record<string, string> = {
    daily: "Today",
    weekly: "This Week",
    monthly: "This Month",
    yearly: "This Year",
  };
  return labels[period];
}

/**
 * Assets - Portfolio asset holdings component
 * 
 * Features:
 * - List of cryptocurrency holdings
 * - Shows amount, USD value, change percentage, allocation
 * - Click to view details
 * - Responsive card layout
 * - Matches dashboard design patterns
 * - Updates dynamically based on selected period
 * 
 * Portfolio Integration & Aggregation:
 * - Accepts portfolioCoins prop (coins added from Explore page)
 * - Portfolio coins appear at TOP of assets list (sorted by most recent)
 * - New coins display with "New" badge and special styling
 * - AGGREGATION: Duplicate coins are NOT created
 *   - If coin already exists, holdings are summed (amount aggregated)
 *   - Updated card moves to top of list automatically
 *   - All metrics recalculated (value, allocation %)
 *   - "New" badge persists to indicate portfolio coins
 * - Asset count reflects UNIQUE coins only (no duplicate counting)
 * - Total value and allocations dynamically calculated across all assets
 * - All styling matches dashboard patterns
 * 
 * State Management:
 * - Props driven: portfolioCoins from PortfolioContext
 * - Auto-sorts: Most recently added/updated coins appear first
 * - Auto-calculates: Allocation % based on total portfolio value
 * - No local state mutations: All updates via context
 */
export default function Assets({
  assets: customAssets,
  onAssetClick,
  period = "monthly",
  portfolioCoins = [],
  watchlistCoins = [],
  onRemoveFromWatchlist,
}: AssetsProps = {}) {
  
  // Generate assets based on period if custom assets not provided
  const generatedAssets = customAssets ?? generateAssetsByPeriod(period);
  const periodLabel = getPeriodLabel(period);

  /**
   * Convert portfolio coins to AssetHolding format (without allocation yet)
   * 
   * Aggregation Support:
   * - Uses actual amount from portfolio coin (aggregated if added multiple times)
   * - Calculates value based on current price and holdings
   * - Most recently updated coins appear first (already sorted by addedAt in context)
   */
  const portfolioAssetsRaw = portfolioCoins.map((coin) => {
    // Use actual amount from portfolio (aggregated across multiple additions)
    // Fallback to 1 if amount is undefined (for backward compatibility with old localStorage data)
    const amount = coin.amount ?? 1;
    const valueUSD = coin.price * amount;

    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      amount,
      valueUSD,
      change24h: coin.change24h,
      allocation: 0, // Will be calculated below
    };
  });

  /**
   * Merge portfolio coins (at top) with existing assets
   * Newest additions/updates appear first for max visibility
   * 
   * IMPORTANT: Filter out duplicates from generated assets
   * - Portfolio coins take priority (appear at top with "New" badge)
   * - Generated assets that match portfolio coin IDs are excluded
   * - This prevents React key conflicts and ensures unique coin display
   */
  const portfolioCoinIds = new Set(portfolioAssetsRaw.map(coin => coin.id));
  const uniqueGeneratedAssets = generatedAssets.filter(
    asset => !portfolioCoinIds.has(asset.id)
  );
  
  const assetsBeforeAllocation = [...portfolioAssetsRaw, ...uniqueGeneratedAssets];
  
  /**
   * Calculate total portfolio value and allocation percentages
   * Each asset's allocation = (asset value / total value) * 100
   */
  const totalPortfolioValue = assetsBeforeAllocation.reduce(
    (sum, asset) => sum + asset.valueUSD,
    0
  );
  
  const assets: AssetHolding[] = assetsBeforeAllocation.map(asset => ({
    ...asset,
    allocation: totalPortfolioValue > 0 
      ? (asset.valueUSD / totalPortfolioValue) * 100 
      : 0,
  }));
  
  /**
   * Check if an asset is newly added from portfolio
   */
  const isNewAsset = (assetId: string): boolean => {
    return portfolioCoins.some(coin => coin.id === assetId);
  };
  
  /**
   * Handle asset click
   */
  const handleAssetClick = (asset: AssetHolding) => {
    if (onAssetClick) {
      onAssetClick(asset);
    }
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent, asset: AssetHolding) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAssetClick(asset);
    }
  };

  /**
   * Render cryptocurrency logo
   */
  const renderCryptoLogo = (id: string) => {
    switch (id) {
      case "bitcoin":
        return (
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
              fill="#F7931A"
            />
          </svg>
        );
      case "ethereum":
        return (
          <svg width="32" height="32" viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="#7681c5" fillOpacity="0.8" />
            <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="#7681c5" />
            <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" fill="#7681c5" fillOpacity="0.8" />
            <path d="M127.962 416.905v-104.72L0 236.585z" fill="#7681c5" />
            <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" fill="#7681c5" fillOpacity="0.5" />
            <path d="M0 212.32l127.96 75.638v-133.8z" fill="#7681c5" fillOpacity="0.7" />
          </svg>
        );
      case "ripple":
        return (
          <svg width="40" height="40" viewBox="0 0 512 424" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M437.8 208.1c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5L0 281.3l8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 73.2-73.2-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5z"
              fill="#23292F"
            />
          </svg>
        );
      case "cardano":
        return (
          <svg width="40" height="40" viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="1000" cy="1000" r="180" fill="#0033AD" />
            <circle cx="1000" cy="450" r="80" fill="#0033AD" />
            <circle cx="1000" cy="1550" r="80" fill="#0033AD" />
            <circle cx="450" cy="1000" r="80" fill="#0033AD" />
            <circle cx="1550" cy="1000" r="80" fill="#0033AD" />
          </svg>
        );
      case "solana":
        return (
          <svg width="40" height="40" viewBox="0 0 646 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M112.6 364.04l-73.53 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 0l-35.2-35.2L112.6 364.04z" fill="url(#solGrad1)" />
            <path d="M112.6 0L39.07 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 512l-35.2 35.2L112.6 0z" fill="url(#solGrad2)" />
            <defs>
              <linearGradient id="solGrad1"><stop offset="0%" stopColor="#9945FF" /><stop offset="100%" stopColor="#14F195" /></linearGradient>
              <linearGradient id="solGrad2"><stop offset="0%" stopColor="#9945FF" /><stop offset="100%" stopColor="#14F195" /></linearGradient>
            </defs>
          </svg>
        );
      case "polkadot":
        return (
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="4" fill="#E6007A" />
            <circle cx="16" cy="6" r="2.5" fill="#E6007A" />
            <circle cx="16" cy="26" r="2.5" fill="#E6007A" />
            <circle cx="6" cy="16" r="2.5" fill="#E6007A" />
            <circle cx="26" cy="16" r="2.5" fill="#E6007A" />
          </svg>
        );
      case "chainlink":
        return (
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4l-4 2.31v4.62L16 13.23l4-2.31V6.31L16 4z" fill="#2A5ADA" />
            <path d="M16 18.77l-4-2.31v4.62L16 23.39l4-2.31v-4.62l-4 2.31z" fill="#2A5ADA" />
            <path d="M8 10.15L4 12.46v4.62l4 2.31 4-2.31v-4.62L8 10.15z" fill="#2A5ADA" />
            <path d="M24 10.15l-4 2.31v4.62l4 2.31 4-2.31v-4.62l-4-2.31z" fill="#2A5ADA" />
          </svg>
        );
      default:
        // Fallback for any unknown coins - show first letter
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400">
            <span className="text-xl font-bold text-white">
              {id.charAt(0).toUpperCase()}
            </span>
          </div>
        );
    }
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.valueUSD, 0);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Total Portfolio Value Card */}
        <div className="text-gray-600 dark:text-gray-300">
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Portfolio Value - {periodLabel}
          </p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalValue)}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {assets.length} {assets.length === 1 ? 'asset' : 'assets'}
          </p>
        </div>

        {/* Asset Holdings List - Portfolio coins (with "New" badge) appear first */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {assets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => handleAssetClick(asset)}
              onKeyDown={(e) => handleKeyDown(e, asset)}
              tabIndex={0}
              role="button"
              aria-label={`View details for ${asset.name}`}
              className={cn(
                "group cursor-pointer rounded-xl border p-5 shadow-md dark:shadow-dark-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 hover:shadow-lg dark:hover:shadow-dark-lg",
                isNewAsset(asset.id)
                  ? "border-green-200 dark:border-green-700 bg-white dark:bg-gray-800 ring-2 ring-green-100 dark:ring-green-900"
                  : "border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800"
              )}
            >
              <div className="block min-[500px]:flex min-[500px]:items-center min-[500px]:justify-between min-[500px]:gap-4">
                {/* Left: Icon + Name */}
                <div className="flex items-center gap-4">
                  {/* Crypto Logo */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                    {renderCryptoLogo(asset.id)}
                  </div>

                  {/* Name and Amount */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">{asset.name}</h4>
                      {isNewAsset(asset.id) && (
                        <span className="rounded-full bg-green-500 dark:bg-green-600 px-2 py-0.5 text-xs font-bold text-white">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {asset.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })} {asset.symbol}
                    </p>
                  </div>
                </div>

                {/* Right: Value and Change */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(asset.valueUSD)}
                  </p>
                  <div className="mt-1 flex items-center justify-end gap-1">
                    {asset.change24h >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      asset.change24h >= 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                    )}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {asset.allocation.toFixed(1)}% of portfolio
                  </p>
                </div>
              </div>

              {/* Allocation Progress Bar */}
              <div className="mt-4">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-orange-800 via-orange-400 to-yellow-200 transition-all duration-500"
                    style={{ width: `${asset.allocation}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Watchlist Section - Coins being tracked (not held) */}
        {watchlistCoins.length > 0 && (
          <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Watchlist</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {watchlistCoins.length} {watchlistCoins.length === 1 ? 'coin' : 'coins'} tracked
                </p>
              </div>
            </div>

            {/* Watchlist Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {watchlistCoins.map((coin) => (
                <div
                  key={coin.id}
                  className="group relative cursor-pointer rounded-xl border border-blue-100 dark:border-blue-900 bg-white dark:bg-gray-800 p-5 shadow-md dark:shadow-dark-md transition-all duration-300 hover:shadow-lg dark:hover:shadow-dark-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <div className="block min-[500px]:flex min-[500px]:items-center min-[500px]:justify-between min-[500px]:gap-4">
                    {/* Left: Icon + Name */}
                    <div className="flex items-center gap-4">
                      {/* Crypto Logo */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                        {renderCryptoLogo(coin.id)}
                      </div>

                      {/* Name and Symbol */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-gray-900 dark:text-white">{coin.name}</h4>
                          <span className="rounded-full bg-blue-100 dark:bg-blue-900 px-2 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                            Watching
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol}</p>
                      </div>
                    </div>

                    {/* Right: Price and Change */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatCurrency(coin.price)}
                      </p>
                      <div className="mt-1 flex items-center justify-end gap-1">
                        {coin.change24h >= 0 ? (
                          <TrendingUp className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                        )}
                        <span className={cn(
                          "text-sm font-medium",
                          coin.change24h >= 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                        )}>
                          {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove from Watchlist Button - appears on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRemoveFromWatchlist) {
                        onRemoveFromWatchlist(coin.id);
                      }
                    }}
                    className="absolute right-3 top-3 opacity-0 rounded-lg bg-red-50 dark:bg-red-900/30 px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 transition-all hover:bg-red-100 dark:hover:bg-red-900/50 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                    aria-label={`Remove ${coin.name} from watchlist`}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Export interfaces
export type { AssetHolding, AssetsProps, PortfolioCoin, WatchlistCoin };

