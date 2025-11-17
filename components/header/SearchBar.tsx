"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  TrendingUp,
  Wallet,
  FileText,
  Settings,
  HelpCircle,
  Clock,
  Filter,
  ChevronDown,
  ArrowRight,
  Download,
  Send,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { coinAssets, recentTransactions } from "@/lib/dummy-data";
import { CoinData, Transaction } from "@/types";

/**
 * Search Result Types
 */
export type SearchResultType = "asset" | "transaction" | "account" | "feature" | "help" | "insight";

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
 * SearchBar Component
 * 
 * Advanced universal search for dashboard with:
 * - Asset search (coins, tokens)
 * - Transaction search
 * - Account search
 * - Feature/settings navigation
 * - Help/article search
 * - Natural language queries
 * - Autocomplete suggestions
 * - Category grouping
 * - Filters and sorting
 */
export default function SearchBar() {
  const router = useRouter();
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filterType, setFilterType] = useState<SearchResultType | "all">("all");
  const [sortBy, setSortBy] = useState<"relevance" | "date">("relevance");
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use actual transactions from dummy data
  const sampleTransactions = recentTransactions;

  // Feature/settings navigation items
  const features = [
    { id: "profile", title: "Profile", path: "/profile", icon: Settings },
    { id: "settings", title: "Settings", path: "/settings", icon: Settings },
    { id: "notifications", title: "Notifications", path: "/settings", icon: Settings },
    { id: "api-keys", title: "API Keys", path: "/settings", icon: Settings },
    { id: "password", title: "Change Password", path: "/settings", icon: Settings },
    { id: "2fa", title: "Two-Factor Authentication", path: "/settings", icon: Settings },
  ];

  // Help articles
  const helpArticles = [
    { id: "h1", title: "How to buy cryptocurrency", category: "Trading" },
    { id: "h2", title: "Setting up 2FA", category: "Security" },
    { id: "h3", title: "Understanding transaction fees", category: "Transactions" },
    { id: "h4", title: "Portfolio management guide", category: "Portfolio" },
  ];

  /**
   * Process natural language queries
   */
  const processNaturalLanguage = (q: string): { type?: SearchResultType; filters?: any } => {
    const lowerQuery = q.toLowerCase();
    
    // Portfolio queries
    if (lowerQuery.includes("portfolio") || lowerQuery.includes("performance")) {
      return { type: "asset" };
    }
    
    // Transaction queries
    if (lowerQuery.includes("transaction") || lowerQuery.includes("tx") || lowerQuery.match(/\b(eth|btc|xrp|ltc)\b/)) {
      return { type: "transaction" };
    }
    
    // Settings queries
    if (lowerQuery.includes("setting") || lowerQuery.includes("preference") || lowerQuery.includes("password")) {
      return { type: "feature" };
    }
    
    return {};
  };

  /**
   * Search assets
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
        metadata: { asset },
        action: () => {
          router.push(`/explore?asset=${asset.id}`);
          setIsOpen(false);
        },
      }));
  };

  /**
   * Search transactions
   */
  const searchTransactions = (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    
    const lowerQuery = q.toLowerCase();
    return sampleTransactions
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
        metadata: { transaction: tx },
        action: () => {
          console.log("View transaction:", tx.id);
          setIsOpen(false);
        },
      }));
  };

  /**
   * Search features/settings
   */
  const searchFeatures = (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    
    const lowerQuery = q.toLowerCase();
    return features
      .filter((feature) => feature.title.toLowerCase().includes(lowerQuery))
      .map((feature) => ({
        id: feature.id,
        type: "feature" as SearchResultType,
        title: feature.title,
        subtitle: "Settings",
        icon: <feature.icon className="h-4 w-4" />,
        metadata: { path: feature.path },
        action: () => {
          router.push(feature.path);
          setIsOpen(false);
        },
      }));
  };

  /**
   * Search help articles
   */
  const searchHelp = (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    
    const lowerQuery = q.toLowerCase();
    return helpArticles
      .filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.category.toLowerCase().includes(lowerQuery)
      )
      .map((article) => ({
        id: article.id,
        type: "help" as SearchResultType,
        title: article.title,
        subtitle: article.category,
        icon: <HelpCircle className="h-4 w-4" />,
        action: () => {
          console.log("Open help article:", article.id);
          setIsOpen(false);
        },
      }));
  };

  /**
   * Generate insights based on query
   */
  const generateInsights = (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    
    const lowerQuery = q.toLowerCase();
    const insights: SearchResult[] = [];
    
    // Price change insights
    const matchingAssets = coinAssets.filter(
      (asset) =>
        asset.name.toLowerCase().includes(lowerQuery) ||
        asset.symbol.toLowerCase().includes(lowerQuery)
    );
    
    matchingAssets.forEach((asset) => {
      if (Math.abs(asset.change) > 2) {
        insights.push({
          id: `insight-${asset.id}`,
          type: "insight" as SearchResultType,
          title: `${asset.symbol} ${asset.change > 0 ? "increased" : "decreased"} by ${Math.abs(asset.change).toFixed(2)}%`,
          subtitle: "Price Alert",
          description: `Current price: $${asset.price.toLocaleString()}`,
          metadata: { asset },
        });
      }
    });
    
    return insights;
  };

  /**
   * Perform search across all categories
   */
  const performSearch = (q: string): SearchResult[] => {
    if (!q.trim()) return [];
    
    const nlResult = processNaturalLanguage(q);
    const results: SearchResult[] = [];
    
    // Search based on natural language hints or all categories
    if (nlResult.type === "asset" || !nlResult.type) {
      results.push(...searchAssets(q));
    }
    if (nlResult.type === "transaction" || !nlResult.type) {
      results.push(...searchTransactions(q));
    }
    if (nlResult.type === "feature" || !nlResult.type) {
      results.push(...searchFeatures(q));
    }
    if (!nlResult.type) {
      results.push(...searchHelp(q));
      results.push(...generateInsights(q));
    }
    
    return results;
  };

  /**
   * Get autocomplete suggestions
   */
  const getSuggestions = (q: string): string[] => {
    if (!q.trim() || q.length < 2) return [];
    
    const lowerQuery = q.toLowerCase();
    const suggestions: string[] = [];
    
    // Asset suggestions
    coinAssets.forEach((asset) => {
      if (asset.name.toLowerCase().startsWith(lowerQuery)) {
        suggestions.push(asset.name);
      }
      if (asset.symbol.toLowerCase().startsWith(lowerQuery)) {
        suggestions.push(asset.symbol);
      }
    });
    
    // Feature suggestions
    features.forEach((feature) => {
      if (feature.title.toLowerCase().startsWith(lowerQuery)) {
        suggestions.push(feature.title);
      }
    });
    
    // Popular queries
    const popularQueries = [
      "Portfolio performance",
      "Show all ETH transactions",
      "Change password",
      "API keys",
      "Bitcoin price",
    ];
    
    popularQueries.forEach((popular) => {
      if (popular.toLowerCase().includes(lowerQuery)) {
        suggestions.push(popular);
      }
    });
    
    return suggestions.slice(0, 5);
  };

  /**
   * Filter and sort results
   */
  const filteredResults = useMemo(() => {
    let results = performSearch(query);
    
    // Apply type filter
    if (filterType !== "all") {
      results = results.filter((r) => r.type === filterType);
    }
    
    // Apply sorting
    if (sortBy === "date") {
      results = results.sort((a, b) => {
        const aDate = a.metadata?.transaction?.date 
          ? new Date(a.metadata.transaction.date) 
          : new Date(0);
        const bDate = b.metadata?.transaction?.date 
          ? new Date(b.metadata.transaction.date) 
          : new Date(0);
        return bDate.getTime() - aDate.getTime();
      });
    }
    
    return results;
  }, [query, filterType, sortBy]);

  /**
   * Group results by category
   */
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {
      Assets: [],
      Transactions: [],
      Features: [],
      Help: [],
      Insights: [],
    };
    
    filteredResults.forEach((result) => {
      switch (result.type) {
        case "asset":
          groups.Assets.push(result);
          break;
        case "transaction":
          groups.Transactions.push(result);
          break;
        case "feature":
          groups.Features.push(result);
          break;
        case "help":
          groups.Help.push(result);
          break;
        case "insight":
          groups.Insights.push(result);
          break;
      }
    });
    
    // Remove empty groups
    return Object.entries(groups).filter(([_, results]) => results.length > 0);
  }, [filteredResults]);

  const suggestions = useMemo(() => getSuggestions(query), [query]);

  /**
   * Handle click outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
      filteredResults[selectedIndex].action?.();
    }
  };

  /**
   * Get icon for result type
   */
  const getTypeIcon = (type: SearchResultType) => {
    switch (type) {
      case "asset":
        return <TrendingUp className="h-4 w-4 text-[#ff9500]" />;
      case "transaction":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "account":
        return <Wallet className="h-4 w-4 text-green-500" />;
      case "feature":
        return <Settings className="h-4 w-4 text-purple-500" />;
      case "help":
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
      case "insight":
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className={cn(
            "w-full rounded-lg border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-gray-800",
            "px-10 py-2.5 pr-10 text-sm text-gray-900 dark:text-white",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20",
            "transition-colors"
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 mt-2 z-50",
            "rounded-xl bg-white dark:bg-gray-800",
            "shadow-lg dark:shadow-gray-900/50",
            "border border-gray-200 dark:border-gray-700",
            "max-h-[600px] overflow-y-auto"
          )}
        >
          {/* Filters and Sort */}
          {query && (
            <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className={cn(
                  "flex-1 rounded-lg border border-gray-300 dark:border-gray-600",
                  "bg-white dark:bg-gray-700 px-3 py-1.5 text-xs",
                  "text-gray-900 dark:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                )}
              >
                <option value="all">All Categories</option>
                <option value="asset">Assets</option>
                <option value="transaction">Transactions</option>
                <option value="feature">Features</option>
                <option value="help">Help</option>
                <option value="insight">Insights</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={cn(
                  "flex-1 rounded-lg border border-gray-300 dark:border-gray-600",
                  "bg-white dark:bg-gray-700 px-3 py-1.5 text-xs",
                  "text-gray-900 dark:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                )}
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
              </select>
            </div>
          )}

          {/* Autocomplete Suggestions */}
          {!query && (
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                Recent Searches
              </div>
              <div className="space-y-1">
                {["Bitcoin", "Portfolio performance", "ETH transactions"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setQuery(suggestion);
                      setIsOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions while typing */}
          {query && suggestions.length > 0 && filteredResults.length === 0 && (
            <div className="p-4">
              <div className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                Suggestions
              </div>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion);
                      setIsOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Search className="h-4 w-4 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && filteredResults.length > 0 && (
            <div className="p-2">
              {groupedResults.map(([category, results]) => (
                <div key={category} className="mb-4">
                  <div className="mb-2 px-3 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {category}
                  </div>
                  <div className="space-y-1">
                    {results.map((result, index) => {
                      const globalIndex = filteredResults.indexOf(result);
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
                              ? "bg-[#ff9500]/10 dark:bg-[#ff9500]/20 border border-[#ff9500]/30"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          )}
                        >
                          <div className="mt-0.5 shrink-0">
                            {result.icon || getTypeIcon(result.type)}
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
          )}

          {/* Empty State */}
          {query && filteredResults.length === 0 && suggestions.length === 0 && (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                No results found
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

