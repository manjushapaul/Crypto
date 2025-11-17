"use client";

import { useState } from "react";
import { Search, TrendingUp, TrendingDown, X, Eye, Star, Filter, ChevronDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { cn, formatCurrency } from "@/lib/utils";

/**
 * Asset Interface
 * Represents a cryptocurrency asset for exploration
 */
export interface Asset {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  gradient: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  description: string;
  tags: string[];
  chartData: { value: number }[];
  isFeatured?: boolean;
}

/**
 * Explore Component Props
 * 
 * @property {Asset[]} assets - Array of cryptocurrency assets to display
 * @property {Asset[]} featuredAssets - Featured/highlighted assets
 * @property {(assetId: string) => void} onAssetClick - Callback when asset is clicked
 * @property {(asset: Asset) => void} onAddToPortfolio - Callback when asset is added to portfolio
 * @property {(asset: Asset) => boolean} onAddToWatchlist - Callback when asset is added to watchlist (returns true if added)
 * @property {(query: string) => void} onSearch - Callback when search query changes
 * @property {(filter: string) => void} onFilterChange - Callback when filter changes
 * @property {string} searchQuery - Current search query
 * @property {string} selectedFilter - Current filter selection
 */
interface ExploreProps {
  assets?: Asset[];
  featuredAssets?: Asset[];
  onAssetClick?: (assetId: string) => void;
  onAddToPortfolio?: (asset: Asset) => void;
  onAddToWatchlist?: (asset: Asset) => boolean;
  onSearch?: (query: string) => void;
  onFilterChange?: (filter: string) => void;
  searchQuery?: string;
  selectedFilter?: string;
}

/**
 * Explore Component
 * Displays trending and new cryptocurrencies for discovery
 * 
 * Features:
 * - Grid of asset cards with logos, prices, and mini charts
 * - Search and filter functionality
 * - Featured assets with highlight
 * - Asset detail modal
 * - Tag/chip display for categorization
 * - Matches dashboard design patterns
 * 
 * Design Consistency:
 * - Uses dashboard color palette (#ff9500, #22243A, #F5F7FA)
 * - Card styling: rounded-xl, shadow-md, bg-[#F5F7FA]
 * - Responsive grid layout
 * - Matching typography and spacing
 * - Accessible with ARIA labels
 */
export default function Explore({
  assets: propAssets,
  featuredAssets: propFeaturedAssets,
  onAssetClick,
  onAddToPortfolio,
  onAddToWatchlist,
  onSearch,
  onFilterChange,
  searchQuery: propSearchQuery = "",
  selectedFilter: propSelectedFilter = "all",
}: ExploreProps) {
  const [searchQuery, setSearchQuery] = useState(propSearchQuery);
  const [selectedFilter, setSelectedFilter] = useState(propSelectedFilter);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [watchlistStatus, setWatchlistStatus] = useState<'idle' | 'added' | 'already'>('idle');

  /**
   * Render cryptocurrency logo SVG based on coin ID
   * Uses official brand colors and authentic designs
   */
  const renderCryptoLogo = (coinId: string) => {
    switch (coinId) {
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
          <svg width="40" height="40" viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="#8A92B2" fillOpacity="0.6" />
            <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="#62688F" />
            <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" fill="#8A92B2" fillOpacity="0.6" />
            <path d="M127.962 416.905v-104.72L0 236.585z" fill="#62688F" />
            <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" fill="#454A75" />
            <path d="M0 212.32l127.96 75.638v-133.8z" fill="#8A92B2" fillOpacity="0.45" />
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
            <defs>
              <linearGradient id="solGradientExplore" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9945FF" />
                <stop offset="100%" stopColor="#14F195" />
              </linearGradient>
            </defs>
            <path d="M112.6 364.04l-73.53 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 0l-35.2-35.2L112.6 364.04z" fill="url(#solGradientExplore)" />
            <path d="M112.6 0L39.07 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 512l-35.2 35.2L112.6 0z" fill="url(#solGradientExplore)" />
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
      case "ripple":
        return (
          <svg width="40" height="40" viewBox="0 0 512 424" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M437.8 208.1c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5L0 281.3l8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 73.2-73.2-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5z"
              fill="#23292F"
            />
          </svg>
        );
      case "litecoin":
        return (
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#345D9D" />
            <path
              d="M10.427 19.214l1.138-4.273-2.106.632.59-2.224 2.106-.632 2.328-8.756h4.366l-1.984 7.461 2.741-.824-.59 2.224-2.741.824-1.137 4.273h7.111l-.845 3.176H9.427z"
              fill="#FFFFFF"
            />
          </svg>
        );
      default:
        // Fallback for unknown coins - show first letter in gradient circle
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-gray-300 to-gray-400">
            <span className="text-xl font-bold text-white">
              {coinId.charAt(0).toUpperCase()}
            </span>
          </div>
        );
    }
  };

  /**
   * Default assets data
   * In production, this would come from API or props
   */
  const defaultAssets: Asset[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      logo: "₿",
      gradient: "from-orange-400 to-yellow-500",
      price: 43250.50,
      change24h: 5.42,
      marketCap: 845000000000,
      volume24h: 28500000000,
      description: "The first and most valuable cryptocurrency, Bitcoin is a decentralized digital currency without a central bank.",
      tags: ["Store of Value", "Proof of Work", "Layer 1"],
      chartData: [
        { value: 38000 }, { value: 39500 }, { value: 38800 }, 
        { value: 40200 }, { value: 41500 }, { value: 42800 }, { value: 43250 }
      ],
      isFeatured: true,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      logo: "Ξ",
      gradient: "from-blue-400 to-purple-500",
      price: 2284.75,
      change24h: 3.18,
      marketCap: 274000000000,
      volume24h: 15200000000,
      description: "Ethereum is a decentralized platform for smart contracts and decentralized applications (dApps).",
      tags: ["Smart Contracts", "DeFi", "Layer 1"],
      chartData: [
        { value: 2100 }, { value: 2150 }, { value: 2180 }, 
        { value: 2200 }, { value: 2250 }, { value: 2270 }, { value: 2284 }
      ],
      isFeatured: true,
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      logo: "₳",
      gradient: "from-blue-500 to-blue-700",
      price: 0.52,
      change24h: 1.87,
      marketCap: 18500000000,
      volume24h: 850000000,
      description: "Cardano is a proof-of-stake blockchain platform focused on sustainability and scalability.",
      tags: ["Proof of Stake", "Layer 1", "Academic"],
      chartData: [
        { value: 0.48 }, { value: 0.49 }, { value: 0.50 }, 
        { value: 0.51 }, { value: 0.51 }, { value: 0.52 }, { value: 0.52 }
      ],
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      logo: "◎",
      gradient: "from-purple-400 to-pink-500",
      price: 102.45,
      change24h: 8.23,
      marketCap: 44000000000,
      volume24h: 3800000000,
      description: "Solana is a high-performance blockchain supporting fast transactions and low fees.",
      tags: ["High Speed", "DeFi", "Layer 1"],
      chartData: [
        { value: 88 }, { value: 92 }, { value: 95 }, 
        { value: 97 }, { value: 99 }, { value: 101 }, { value: 102 }
      ],
      isFeatured: true,
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      logo: "●",
      gradient: "from-pink-500 to-rose-600",
      price: 7.82,
      change24h: 2.15,
      marketCap: 9500000000,
      volume24h: 420000000,
      description: "Polkadot enables cross-blockchain transfers and interoperability between different networks.",
      tags: ["Interoperability", "Parachains", "Layer 0"],
      chartData: [
        { value: 7.2 }, { value: 7.4 }, { value: 7.5 }, 
        { value: 7.6 }, { value: 7.7 }, { value: 7.8 }, { value: 7.82 }
      ],
    },
    {
      id: "chainlink",
      name: "Chainlink",
      symbol: "LINK",
      logo: "⬡",
      gradient: "from-blue-600 to-blue-800",
      price: 14.58,
      change24h: -1.23,
      marketCap: 8200000000,
      volume24h: 680000000,
      description: "Chainlink is a decentralized oracle network providing real-world data to smart contracts.",
      tags: ["Oracle", "Data", "Infrastructure"],
      chartData: [
        { value: 15.2 }, { value: 15.0 }, { value: 14.9 }, 
        { value: 14.8 }, { value: 14.7 }, { value: 14.6 }, { value: 14.58 }
      ],
    },
  ];

  const assets = propAssets || defaultAssets;
  const featuredAssets = propFeaturedAssets || assets.filter(a => a.isFeatured);

  /**
   * Handle search input change
   */
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  /**
   * Handle asset click - open detail modal
   */
  const handleAssetClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowDetailModal(true);
    if (onAssetClick) {
      onAssetClick(asset.id);
    }
  };

  /**
   * Close detail modal
   */
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedAsset(null);
    setWatchlistStatus('idle'); // Reset watchlist status
  };

  /**
   * Handle add to watchlist button click
   * Provides immediate UI feedback based on result
   */
  const handleAddToWatchlist = () => {
    if (onAddToWatchlist && selectedAsset) {
      const added = onAddToWatchlist(selectedAsset);
      if (added) {
        setWatchlistStatus('added');
        // Reset status after 2 seconds
        setTimeout(() => setWatchlistStatus('idle'), 2000);
      } else {
        setWatchlistStatus('already');
        // Reset status after 2 seconds
        setTimeout(() => setWatchlistStatus('idle'), 2000);
      }
    }
  };

  /**
   * Filter and search assets
   */
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      searchQuery === "" ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "trending" && asset.isFeatured) ||
      asset.tags.some(tag => tag.toLowerCase().includes(selectedFilter.toLowerCase()));
    
    return matchesSearch && matchesFilter;
  });

  /**
   * Get tag color based on tag name
   */
  const getTagColor = (tag: string): string => {
    const tagColors: Record<string, string> = {
      "Store of Value": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      "Smart Contracts": "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      "DeFi": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      "Layer 1": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      "Layer 0": "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
      "Proof of Work": "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
      "Proof of Stake": "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
      "High Speed": "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
      "Oracle": "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300",
      "Interoperability": "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
      "Academic": "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
      "Parachains": "bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300",
      "Data": "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300",
      "Infrastructure": "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300",
    };
    return tagColors[tag] || "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
  };

  return (
    <div className="p-0 sm:p-0 lg:p-0">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        {/* Main Layout - 2 Column Design (Matching Home Page) */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left Column - Explore Content */}
          <div className="lg:col-span-2 space-y-6 p-3 bg-[#eaebfd] dark:bg-gray-900 sm:p-8">
            {/* Page Header */}
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Discover trending cryptocurrencies and new investment opportunities
              </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-3 pl-11 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 transition-all focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                  aria-label="Search cryptocurrencies"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  className="w-full appearance-none rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-sm font-medium text-gray-900 dark:text-white transition-all focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20 sm:w-auto"
                  aria-label="Filter assets"
                >
                  <option value="all">All Assets</option>
                  <option value="trending">Trending</option>
                  <option value="defi">DeFi</option>
                  <option value="layer 1">Layer 1</option>
                  <option value="proof of stake">Proof of Stake</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            {/* Content Card */}
            <div className="rounded-xl space-y-6 lg:rounded-3xl lg:p-6 lg:shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] dark:lg:shadow-[inset_0_2px_8px_rgba(255,255,255,0.06)] lg:dark:bg-gray-800">
              {/* Featured Assets Section */}
              {featuredAssets.length > 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                    Featured Assets
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {featuredAssets.slice(0, 4).map((asset) => (
                      <div
                        key={asset.id}
                        className="rounded-xl border-2 border-[#ff9500]/30 dark:border-[#ff9500]/40 bg-white dark:bg-gray-800 p-5 shadow-lg dark:shadow-dark-lg ring-2 ring-[#ff9500]/10 dark:ring-[#ff9500]/20 transition-all hover:shadow-xl dark:hover:shadow-dark-xl"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center">
                              {renderCryptoLogo(asset.id)}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{asset.name}</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{asset.symbol}</p>
                            </div>
                          </div>
                          <Star className="h-5 w-5 fill-[#ff9500] text-[#ff9500]" />
                        </div>

                        <div className="mb-3 flex items-baseline justify-between">
                          <div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {formatCurrency(asset.price)}
                            </p>
                            <div className="mt-1 flex items-center gap-1">
                              {asset.change24h >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />
                              )}
                              <span
                                className={cn(
                                  "text-sm font-bold",
                                  asset.change24h >= 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                                )}
                              >
                                {asset.change24h >= 0 ? "+" : ""}
                                {asset.change24h.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                          <div className="h-12 w-20">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={asset.chartData}>
                                <defs>
                                  <linearGradient id={`mini-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                      offset="0%"
                                      stopColor={asset.change24h >= 0 ? "#10b981" : "#ef4444"}
                                      stopOpacity={0.3}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor={asset.change24h >= 0 ? "#10b981" : "#ef4444"}
                                      stopOpacity={0}
                                    />
                                  </linearGradient>
                                </defs>
                                <Area
                                  type="monotone"
                                  dataKey="value"
                                  stroke={asset.change24h >= 0 ? "#10b981" : "#ef4444"}
                                  strokeWidth={1.5}
                                  fill={`url(#mini-${asset.id})`}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="mb-3 flex flex-wrap gap-1">
                          {asset.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs font-medium",
                                getTagColor(tag)
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => handleAssetClick(asset)}
                          className="w-full rounded-lg bg-[#22243A] dark:bg-gray-700 px-4 py-2 text-sm font-bold text-[#ffe369] dark:text-yellow-400 transition-all hover:bg-[#2a2d3f] dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Assets Grid */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    All Cryptocurrencies
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredAssets.length} assets
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md transition-all hover:shadow-lg dark:hover:shadow-dark-lg"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center">
                          {renderCryptoLogo(asset.id)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">{asset.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{asset.symbol}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(asset.price)}
                        </p>
                        <div className="mt-1 flex items-center gap-1">
                          {asset.change24h >= 0 ? (
                            <TrendingUp className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                          )}
                          <span
                            className={cn(
                              "text-sm font-bold",
                              asset.change24h >= 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                            )}
                          >
                            {asset.change24h >= 0 ? "+" : ""}
                            {asset.change24h.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      <div className="mb-3 flex flex-wrap gap-1">
                        {asset.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium",
                              getTagColor(tag)
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => handleAssetClick(asset)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-700 px-4 py-2 text-sm font-bold text-gray-900 dark:text-white shadow-sm dark:shadow-dark-sm transition-all hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow dark:hover:shadow-dark-md focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredAssets.length === 0 && (
                  <div className="rounded-xl bg-white dark:bg-gray-800 p-12 text-center shadow-md dark:shadow-dark-md">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      No assets found matching your criteria
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedFilter("all");
                      }}
                      className="mt-4 rounded-lg bg-[#ffe369] dark:bg-yellow-500 px-4 py-2 text-sm font-bold text-[#22243A] dark:text-gray-900 transition-all hover:bg-[#ffd940] dark:hover:bg-yellow-400"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Insights Sidebar */}
          <div className="space-y-6 bg-linear-to-r from-gray-100 via-blue-100 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-8 lg:col-span-1">
            {/* Market Trends Card */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-dark-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Market Trends</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-green-50 dark:bg-green-900/30 p-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bullish Assets</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {assets.filter(a => a.change24h > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-red-50 dark:bg-red-900/30 p-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bearish Assets</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {assets.filter(a => a.change24h < 0).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Categories Card */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-dark-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {["DeFi", "Layer 1", "Proof of Stake", "Smart Contracts", "Oracle"].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange(category.toLowerCase())}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                      selectedFilter === category.toLowerCase()
                        ? "bg-[#22243A] dark:bg-gray-700 text-[#ffe369] dark:text-yellow-400 shadow-md dark:shadow-dark-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-dark-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Market Cap:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(assets.reduce((sum, a) => sum + a.marketCap, 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">24h Volume:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(assets.reduce((sum, a) => sum + a.volume24h, 0), 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Average Change:</span>
                  <span className={cn(
                    "font-bold",
                    assets.reduce((sum, a) => sum + a.change24h, 0) / assets.length >= 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}>
                    {(assets.reduce((sum, a) => sum + a.change24h, 0) / assets.length).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Detail Modal */}
        {showDetailModal && selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4">
            <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl dark:shadow-dark-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center">
                    {renderCryptoLogo(selectedAsset.id)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {selectedAsset.name}
                    </h2>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{selectedAsset.symbol}</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="group rounded-full bg-white dark:bg-gray-700 p-2 text-gray-400 dark:text-gray-300 shadow-md dark:shadow-dark-md transition-all hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white hover:shadow-lg dark:hover:shadow-dark-lg focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="max-h-[70vh] overflow-y-auto p-6">
                {/* Price Section */}
                <div className="mb-6 rounded-xl bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-5">
                  <div className="flex flex-col min-[500px]:flex-row min-[500px]:items-baseline min-[500px]:justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Current Price</p>
                      <p className="mt-1 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(selectedAsset.price)}
                      </p>
                    </div>
                    <div className="text-left min-[500px]:text-right">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">24h Change</p>
                      <div className="mt-1 flex items-center gap-1">
                        {selectedAsset.change24h >= 0 ? (
                          <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        <span
                          className={cn(
                            "text-xl sm:text-2xl font-bold",
                            selectedAsset.change24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          )}
                        >
                          {selectedAsset.change24h >= 0 ? "+" : ""}
                          {selectedAsset.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    About
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {selectedAsset.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAsset.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium",
                          getTagColor(tag)
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Market Cap</p>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(selectedAsset.marketCap, 0)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-50 dark:bg-purple-900/30 p-4">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Volume (24h)</p>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(selectedAsset.volume24h, 0)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      if (onAddToPortfolio && selectedAsset) {
                        onAddToPortfolio(selectedAsset);
                        handleCloseModal();
                      }
                    }}
                    className="flex-1 rounded-xl bg-[#ffe369] dark:bg-yellow-500 px-4 py-3 text-center font-bold text-[#22243A] dark:text-gray-900 transition-all hover:bg-[#ffd940] dark:hover:bg-yellow-400 hover:shadow-lg dark:hover:shadow-dark-lg focus:outline-none focus:ring-2 focus:ring-[#22243A] dark:focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    Add to Portfolio
                  </button>
                  <button
                    onClick={handleAddToWatchlist}
                    disabled={watchlistStatus !== 'idle'}
                    className={cn(
                      "flex-1 rounded-xl border-2 px-4 py-3 text-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
                      watchlistStatus === 'idle' && "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-gray-500",
                      watchlistStatus === 'added' && "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-not-allowed",
                      watchlistStatus === 'already' && "border-yellow-500 dark:border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 cursor-not-allowed"
                    )}
                  >
                    {watchlistStatus === 'idle' && 'Add to Watchlist'}
                    {watchlistStatus === 'added' && '✓ Added to Watchlist'}
                    {watchlistStatus === 'already' && 'Already Added'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export props type for use in other components
export type { ExploreProps };

