"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { TrendingUp, Search, X, Wallet, FileText, TrendingDown, ArrowRight, Coins } from "lucide-react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { portfolioBalance, coinAssets, recentTransactions, accountMetrics } from "@/lib/dummy-data";
import { formatCurrency, cn } from "@/lib/utils";
import { usePortfolio } from "@/context/PortfolioContext";
import { CoinData, Transaction } from "@/types";

/**
 * Search Result Types
 */
export type SearchResultType = "asset" | "transaction" | "metric" | "portfolio";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: () => void;
  metadata?: Record<string, any>;
}

/**
 * BalanceHeader Component Props
 * 
 * @property {string} userName - User name for greeting (optional, defaults to "Mafrukh Faruqi")
 * @property {number} balance - Main account balance (optional, defaults to portfolioBalance.total)
 * @property {number} previousBalance - Previous balance for growth indicator (optional)
 * @property {string} walletImage - URL for wallet image (optional, uses default SVG icon if not provided)
 * @property {(searchQuery: string) => void} onSearch - Callback when search is performed (optional)
 * @property {string} analysisPeriod - Current analysis period (optional)
 * @property {(period: string) => void} onAnalysisPeriodChange - Callback when analysis period changes (optional)
 * @property {(type: string, data?: any) => void} onNavigate - Callback when search result is clicked to navigate to section (optional)
 */
interface BalanceHeaderProps {
  userName?: string;
  balance?: number;
  previousBalance?: number;
  walletImage?: string;
  onSearch?: (searchQuery: string) => void;
  analysisPeriod?: string;
  onAnalysisPeriodChange?: (period: string) => void;
  onNavigate?: (type: "portfolio" | "assets" | "transactions" | "metrics", data?: any) => void;
}

/**
 * BalanceHeader - Header section with greeting, balance display, and search
 * 
 * Features:
 * - Greeting with user name
 * - Dropdown for transaction analysis period
 * - Search bar
 * - Balance card with wallet icon
 * - Large, bold account balance display
 * - Secondary balance with growth arrow
 * - Soft shadows and rounded corners
 * - Responsive design
 * 
 * Design Details:
 * - Wallet icon: SVG or custom image placeholder
 * - Balance: "MY BALANCE" label + large amount
 * - Growth indicator: Arrow icon + previous balance
 * - Styling: White card, soft shadows, pastel colors
 * 
 * @example
 * ```tsx
 * <BalanceHeader
 *   userName="Mafrukh Faruqi"
 *   balance={543323.13}
 *   previousBalance={123324.32}
 *   walletImage="/images/wallet.png"
 *   onSearch={(query) => console.log('Search:', query)}
 * />
 * ```
 */
export default function BalanceHeader({
  userName = "Mafrukh Faruqi",
  balance = portfolioBalance.total,
  previousBalance = portfolioBalance.previousBalance,
  walletImage,
  onSearch,
  analysisPeriod = "weekly",
  onAnalysisPeriodChange,
  onNavigate,
}: BalanceHeaderProps = {}) {
  const { portfolio } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  /**
   * Handles analysis period change
   */
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (onAnalysisPeriodChange) {
      onAnalysisPeriodChange(value);
    }
  };
  
  /**
   * Search portfolio assets
   */
  const searchPortfolio = (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    
    const lowerQuery = q.toLowerCase();
    return portfolio
      .filter(
        (asset) =>
          asset.name.toLowerCase().includes(lowerQuery) ||
          asset.symbol.toLowerCase().includes(lowerQuery) ||
          asset.id.toLowerCase().includes(lowerQuery)
      )
      .map((asset) => ({
        id: `portfolio-${asset.id}`,
        type: "portfolio" as SearchResultType,
        title: asset.name,
        subtitle: asset.symbol,
        description: `In Portfolio • ${asset.amount || 0} ${asset.symbol} • $${asset.price.toLocaleString()}`,
        icon: <Wallet className="h-4 w-4 text-green-500" />,
        metadata: { asset },
        action: () => {
          setIsSearchOpen(false);
          if (onNavigate) {
            onNavigate("portfolio", asset);
          } else {
            console.log("View portfolio asset:", asset.id);
          }
        },
      }));
  };

  /**
   * Search market assets
   */
  const searchAssets = (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    
    const lowerQuery = q.toLowerCase();
    return coinAssets
      .filter(
        (asset) =>
          asset.name.toLowerCase().includes(lowerQuery) ||
          asset.symbol.toLowerCase().includes(lowerQuery) ||
          asset.id.toLowerCase().includes(lowerQuery)
      )
      .map((asset) => ({
        id: asset.id,
        type: "asset" as SearchResultType,
        title: asset.name,
        subtitle: asset.symbol,
        description: `$${asset.price.toLocaleString()} • ${asset.change > 0 ? "+" : ""}${asset.change.toFixed(2)}%`,
        icon: <Coins className="h-4 w-4 text-[#ff9500]" />,
        metadata: { asset },
        action: () => {
          setIsSearchOpen(false);
          if (onNavigate) {
            onNavigate("assets", asset);
          } else {
            console.log("View asset:", asset.id);
          }
        },
      }));
  };

  /**
   * Search transactions
   */
  const searchTransactions = (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    
    const lowerQuery = q.toLowerCase();
    return recentTransactions
      .filter(
        (tx) =>
          tx.id.toLowerCase().includes(lowerQuery) ||
          tx.coin.toLowerCase().includes(lowerQuery) ||
          tx.accountNumber.toLowerCase().includes(lowerQuery) ||
          tx.amount.toString().includes(lowerQuery)
      )
      .map((tx) => ({
        id: tx.id,
        type: "transaction" as SearchResultType,
        title: `${tx.type === "send" ? "Sent" : tx.type === "receive" ? "Received" : "Swapped"} ${tx.amount} ${tx.coin}`,
        subtitle: new Date(tx.date).toLocaleDateString(),
        description: `Account: ${tx.accountNumber} • Status: ${tx.status}`,
        icon: <FileText className="h-4 w-4 text-blue-500" />,
        metadata: { transaction: tx },
        action: () => {
          setIsSearchOpen(false);
          if (onNavigate) {
            onNavigate("transactions", tx);
          } else {
            console.log("View transaction:", tx.id);
          }
        },
      }));
  };

  /**
   * Search account metrics
   */
  const searchMetrics = (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    
    const lowerQuery = q.toLowerCase();
    return accountMetrics
      .filter(
        (metric) =>
          metric.type.toLowerCase().includes(lowerQuery)
      )
      .map((metric) => ({
        id: `metric-${metric.type}`,
        type: "metric" as SearchResultType,
        title: metric.type,
        subtitle: "Account Metric",
        description: `$${metric.value.toLocaleString()} • ${metric.change > 0 ? "+" : ""}${metric.change.toFixed(2)}% change`,
        icon: metric.change > 0 ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        ),
        metadata: { metric },
        action: () => {
          setIsSearchOpen(false);
          if (onNavigate) {
            onNavigate("metrics", metric);
          } else {
            console.log("View metric:", metric.type);
          }
        },
      }));
  };

  /**
   * Perform search across all categories
   */
  const performSearch = (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    
    const results: SearchResult[] = [];
    results.push(...searchPortfolio(q));
    results.push(...searchAssets(q));
    results.push(...searchTransactions(q));
    results.push(...searchMetrics(q));
    
    return results;
  };

  /**
   * Filtered and sorted search results
   */
  const searchResults = useMemo(() => {
    return performSearch(searchQuery);
  }, [searchQuery, portfolio]);

  /**
   * Group results by category
   */
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {
      Portfolio: [],
      Assets: [],
      Transactions: [],
      Metrics: [],
    };
    
    searchResults.forEach((result) => {
      switch (result.type) {
        case "portfolio":
          groups.Portfolio.push(result);
          break;
        case "asset":
          groups.Assets.push(result);
          break;
        case "transaction":
          groups.Transactions.push(result);
          break;
        case "metric":
          groups.Metrics.push(result);
          break;
      }
    });
    
    // Remove empty groups
    return Object.entries(groups).filter(([_, results]) => results.length > 0);
  }, [searchResults]);

  /**
   * Handle click outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSearchOpen]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsSearchOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && searchResults[selectedIndex]) {
      searchResults[selectedIndex].action?.();
    }
  };

  /**
   * Handle search input change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearchOpen(true);
    setSelectedIndex(0);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <ErrorBoundary>
      <div className="rounded-xl bg-linear-to-br  pb-0 sm:pb-0 sm:px-0 px-0">
        {/* Greeting Section with Dropdown and Search */}
        <div className="my-3 block gap-4 sm:flex-row items-baseline sm:items-baseline sm:justify-between">
          {/* Greeting */}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Hi, {userName}
          </h2>

          {/* Controls: Dropdown and Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-end mt-3">
            {/* Dropdown */}
            <div className="relative w-full sm:w-auto sm:min-w-[240px]">
              <select 
                value={analysisPeriod}
                onChange={handlePeriodChange}
                className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 pr-10 text-sm text-gray-700 dark:text-gray-200 shadow-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
              >
                <option value="weekly">Weekly transaction analysis</option>
                <option value="daily">Daily transaction analysis</option>
                <option value="monthly">Monthly transaction analysis</option>
                <option value="yearly">Yearly transaction analysis</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Bar */}
            <div ref={searchRef} className="relative w-full sm:w-auto sm:min-w-[240px]">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                placeholder="Search"
                onChange={handleSearchChange}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2.5 pr-10 pl-10 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Search Results Dropdown */}
              {isSearchOpen && searchQuery && (
                <div
                  className={cn(
                    "absolute top-full left-0 right-0 mt-2 z-50",
                    "rounded-xl bg-white dark:bg-gray-800",
                    "shadow-lg dark:shadow-gray-900/50",
                    "border border-gray-200 dark:border-gray-700",
                    "max-h-[500px] overflow-y-auto"
                  )}
                >
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      {groupedResults.map(([category, results]) => (
                        <div key={category} className="mb-4">
                          <div className="mb-2 px-3 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            {category}
                          </div>
                          <div className="space-y-1">
                            {results.map((result, index) => {
                              const globalIndex = searchResults.indexOf(result);
                              const isSelected = globalIndex === selectedIndex;
                              
                              return (
                                <button
                                  key={result.id}
                                  onClick={() => result.action?.()}
                                  onMouseEnter={() => setSelectedIndex(globalIndex)}
                                  className={cn(
                                    "w-full text-left px-3 py-2.5 rounded-lg transition-colors",
                                    "flex items-start gap-3",
                                    isSelected
                                      ? "bg-purple-100 dark:bg-purple-900/20 border border-purple-300 dark:border-purple-700"
                                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                  )}
                                >
                                  <div className="mt-0.5 shrink-0">
                                    {result.icon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                      {result.title}
                                    </div>
                                    {result.subtitle && (
                                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {result.subtitle}
                                      </div>
                                    )}
                                    {result.description && (
                                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                        {result.description}
                                      </div>
                                    )}
                                  </div>
                                  <ArrowRight className="h-4 w-4 text-gray-400 shrink-0 mt-1" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Search className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        No results found
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        Try searching for assets, transactions, or metrics
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Balance Section - Card with Wallet Icon */}
        <div className="mb-8">
          <div>
            <div className="flex items-center gap-6">
              {/* Wallet Icon - Image or SVG Placeholder */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-gray-800">
                {walletImage ? (
                  /* Custom wallet image if provided */
                  <img
                    src={walletImage}
                    alt="Wallet"
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : (
                  /* Default SVG wallet icon */
                  <svg
                    className="h-12 w-12"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-2"
                      stroke="#6366F1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 10h18v8H3z"
                      fill="#8B5CF6"
                      fillOpacity="0.3"
                    />
                    <circle
                      cx="19"
                      cy="14"
                      r="1.5"
                      fill="#F59E0B"
                    />
                    <path
                      d="M19 11v6"
                      stroke="#6366F1"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>

              {/* Balance Information */}
              <div className="flex-1">
                {/* MY BALANCE Label */}
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  MY BALANCE
                </p>

                {/* Main Balance - Large and Bold */}
                <h1 className="text-2xl font-semibold text-gray-700 dark:text-white sm:text-3xl">
                  {formatCurrency(balance)}
                </h1>

                {/* Secondary Balance with Growth Indicator */}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-normal font-medium text-gray-600 dark:text-gray-400">
                    {formatCurrency(previousBalance)}
                  </span>
                  <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ErrorBoundary>
  );
}
