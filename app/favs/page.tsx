"use client";

import { useState } from "react";
import { Star, TrendingUp, TrendingDown, Flame, Clock, X, Search, Check } from "lucide-react";
import Favs from "@/components/dashboard/Favs";
import { formatCurrency, cn } from "@/lib/utils";

/**
 * Favs Page - Favorite Cryptocurrencies Dashboard
 * 
 * Features:
 * - Display favorite cryptocurrencies in 2-column layout
 * - Left: Favorite cards grid
 * - Right: Contextual widgets (total value, movers, tips)
 * - Add/remove favorites
 * - Matches dashboard styling
 * 
 * Modal Props Documentation:
 * @interface CompareFavoritesModalProps
 * @property {CryptoData[]} coins - Array of cryptocurrency objects to display
 * @property {string[]} selectedCoins - Array of selected coin IDs
 * @property {(coinId: string) => void} onToggleSelection - Callback when coin is selected/deselected
 * @property {boolean} isOpen - Controls modal visibility
 * @property {() => void} onClose - Callback to close modal
 * 
 * @interface CryptoData
 * @property {string} id - Unique identifier for the coin
 * @property {string} name - Full name (e.g., "Bitcoin")
 * @property {string} symbol - Trading symbol (e.g., "BTC")
 * @property {number} price - Current price in USD
 * @property {number} change24h - 24-hour percentage change
 * @property {number} marketCap - Market capitalization in USD
 * @property {number} volume - 24-hour trading volume in USD
 * @property {string} gradient - Tailwind gradient classes for avatar background
 * @property {string} logoColor - Hex color for the coin logo
 */
export default function FavsPage() {
  // Modal visibility states
  const [showAllPricesModal, setShowAllPricesModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  
  /**
   * Prop: Selected coins for comparison
   * Tracks which coins are currently selected in the Compare Favorites modal
   * In production, this would be managed by parent component or state management
   * @type {string[]} Array of coin IDs
   */
  const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
  
  // Alert form states
  const [alertCoin, setAlertCoin] = useState("");
  const [alertPrice, setAlertPrice] = useState("");
  const [alertType, setAlertType] = useState("above");

  // Sample data for right sidebar widgets
  const totalFavoritesValue = 87234.83;
  const topMovers = [
    { name: "Solana", symbol: "SOL", change: 5.42, isPositive: true },
    { name: "Ripple", symbol: "XRP", change: 3.74, isPositive: true },
    { name: "Bitcoin", symbol: "BTC", change: 2.81, isPositive: true },
  ];

  /**
   * Prop: All available cryptocurrencies for modals
   * In production, this would be passed as a prop from parent component or fetched from API
   * @type {CryptoData[]}
   */
  const allCryptos = [
    { 
      id: "bitcoin", 
      name: "Bitcoin", 
      symbol: "BTC", 
      price: 43250.50, 
      change24h: 2.81, 
      marketCap: 789500000000, 
      volume: 21171999345,
      gradient: "from-orange-400 to-yellow-500",
      logoColor: "#F7931A"
    },
    { 
      id: "ethereum", 
      name: "Ethereum", 
      symbol: "ETH", 
      price: 2234.75, 
      change24h: -1.48, 
      marketCap: 265800000000, 
      volume: 13171999345,
      gradient: "from-blue-400 to-purple-500",
      logoColor: "#627EEA"
    },
    { 
      id: "ripple", 
      name: "Ripple", 
      symbol: "XRP", 
      price: 0.52, 
      change24h: 3.74, 
      marketCap: 35000000000, 
      volume: 2500000000,
      gradient: "from-gray-600 to-gray-800",
      logoColor: "#23292F"
    },
    { 
      id: "cardano", 
      name: "Cardano", 
      symbol: "ADA", 
      price: 0.48, 
      change24h: 2.22, 
      marketCap: 18000000000, 
      volume: 800000000,
      gradient: "from-blue-500 to-blue-700",
      logoColor: "#0033AD"
    },
    { 
      id: "solana", 
      name: "Solana", 
      symbol: "SOL", 
      price: 98.45, 
      change24h: 5.42, 
      marketCap: 42000000000, 
      volume: 3500000000,
      gradient: "from-purple-400 to-pink-500",
      logoColor: "#14F195"
    },
    { 
      id: "dogecoin", 
      name: "Dogecoin", 
      symbol: "DOGE", 
      price: 0.08, 
      change24h: -2.15, 
      marketCap: 12000000000, 
      volume: 500000000,
      gradient: "from-yellow-400 to-yellow-600",
      logoColor: "#C2A633"
    },
  ];

  /**
   * Action: Toggle coin selection for comparison
   * Adds or removes a coin from the selectedCoins array
   * In production, this would be passed as an onToggleSelection prop callback
   * @param {string} coinId - The ID of the coin to toggle
   */
  const toggleCoinSelection = (coinId: string) => {
    setSelectedCoins(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };

  /**
   * Render cryptocurrency logo SVG based on coin ID
   * Uses official brand colors and authentic designs
   * Matches logos used across dashboard (Assets, CoinSlider, Explore)
   */
  const renderCryptoLogo = (coinId: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeMap = {
      sm: { width: 32, height: 32 },
      md: { width: 40, height: 40 },
      lg: { width: 48, height: 48 },
    };
    const { width, height } = sizeMap[size];

    switch (coinId) {
      case "bitcoin":
        return (
          <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
              fill="#F7931A"
            />
          </svg>
        );
      case "ethereum":
        return (
          <svg width={width} height={height} viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="#8A92B2" fillOpacity="0.6" />
            <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="#62688F" />
            <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" fill="#8A92B2" fillOpacity="0.6" />
            <path d="M127.962 416.905v-104.72L0 236.585z" fill="#62688F" />
            <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" fill="#454A75" />
            <path d="M0 212.32l127.96 75.638v-133.8z" fill="#8A92B2" fillOpacity="0.45" />
          </svg>
        );
      case "ripple":
        return (
          <svg width={width} height={height} viewBox="0 0 512 424" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M437.8 208.1c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5L0 281.3l8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 73.2-73.2-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5z"
              fill="#23292F"
            />
          </svg>
        );
      case "cardano":
        return (
          <svg width={width} height={height} viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="1000" cy="1000" r="180" fill="#0033AD" />
            <circle cx="1000" cy="450" r="80" fill="#0033AD" />
            <circle cx="1000" cy="1550" r="80" fill="#0033AD" />
            <circle cx="450" cy="1000" r="80" fill="#0033AD" />
            <circle cx="1550" cy="1000" r="80" fill="#0033AD" />
          </svg>
        );
      case "solana":
        return (
          <svg width={width} height={height} viewBox="0 0 646 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="solGradientFavs" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9945FF" />
                <stop offset="100%" stopColor="#14F195" />
              </linearGradient>
            </defs>
            <path d="M112.6 364.04l-73.53 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 0l-35.2-35.2L112.6 364.04z" fill="url(#solGradientFavs)" />
            <path d="M112.6 0L39.07 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 512l-35.2 35.2L112.6 0z" fill="url(#solGradientFavs)" />
          </svg>
        );
      case "polkadot":
        return (
          <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="4" fill="#E6007A" />
            <circle cx="16" cy="6" r="2.5" fill="#E6007A" />
            <circle cx="16" cy="26" r="2.5" fill="#E6007A" />
            <circle cx="6" cy="16" r="2.5" fill="#E6007A" />
            <circle cx="26" cy="16" r="2.5" fill="#E6007A" />
          </svg>
        );
      case "chainlink":
        return (
          <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4l-4 2.31v4.62L16 13.23l4-2.31V6.31L16 4z" fill="#2A5ADA" />
            <path d="M16 18.77l-4-2.31v4.62L16 23.39l4-2.31v-4.62l-4 2.31z" fill="#2A5ADA" />
            <path d="M8 10.15L4 12.46v4.62l4 2.31 4-2.31v-4.62L8 10.15z" fill="#2A5ADA" />
            <path d="M24 10.15l-4 2.31v4.62l4 2.31 4-2.31v-4.62l-4-2.31z" fill="#2A5ADA" />
          </svg>
        );
      case "litecoin":
        return (
          <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#345D9D" />
            <path
              d="M10.427 19.214l1.138-4.273-2.106.632.59-2.224 2.106-.632 2.328-8.756h4.366l-1.984 7.461 2.741-.824-.59 2.224-2.741.824-1.137 4.273h7.111l-.845 3.176H9.427z"
              fill="#FFFFFF"
            />
          </svg>
        );
      case "dogecoin":
        return (
          <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#C3A634" />
            <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm-2 6h4c3.314 0 6 2.686 6 6s-2.686 6-6 6h-4V10zm2 2v8h2c2.21 0 4-1.79 4-4s-1.79-4-4-4h-2z" fill="#FFFFFF"/>
          </svg>
        );
      default:
        // Fallback for unknown coins
        return (
          <div className="flex h-10 w-10 items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">
              {coinId.charAt(0).toUpperCase()}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="p-0 sm:p-0 lg:p-0">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        {/* Main Layout - 2 Column Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-screen">
          {/* Left Column - Favorites Dashboard */}
          <div className="lg:col-span-2 space-y-6 p-3 bg-[#eaebfd] dark:bg-gray-900 sm:p-8">
            
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Favorite Cryptocurrencies</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Manage and track your favorite digital assets
              </p>
            </div>

            {/* Favs Component */}
            <Favs period="weekly" />
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="space-y-6 bg-linear-to-r from-gray-100 via-blue-100 to-gray-100 dark:bg-linear-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-8 lg:col-span-1">
            
            {/* Total Favorites Value Widget */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-6 shadow-md dark:shadow-dark-md">
              <div className="mb-4 flex items-center gap-3">
                <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Total Value</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio Value</p>
                  <h2 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalFavoritesValue)}
                  </h2>
                </div>
                
                <div className="rounded-lg bg-green-50 dark:bg-green-900/30 p-3">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">24h Change</p>
                  <div className="mt-1 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">+2.34%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Movers Widget */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-6 shadow-md dark:shadow-dark-md">
              <div className="mb-4 flex items-center gap-3">
                <Flame className="h-6 w-6 text-[#ff9500]" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Movers</h3>
              </div>
              
              <div className="space-y-3">
                {topMovers.map((mover, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{mover.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{mover.symbol}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {mover.isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                      )}
                      <span className={cn(
                        "text-sm font-bold",
                        mover.isPositive ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                      )}>
                        {mover.isPositive ? "+" : ""}{mover.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips Widget */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-6 shadow-md dark:shadow-dark-md">
              <div className="mb-4 flex items-center gap-3">
                <Clock className="h-6 w-6 text-[#ff9500]" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Tips</h3>
              </div>
              
              <div className="space-y-3">
                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Diversify Your Favorites
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Add coins from different sectors to balance your portfolio.
                  </p>
                </div>
                
                <div className="rounded-lg bg-purple-50 dark:bg-purple-900/30 p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Monitor Price Alerts
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Set up notifications for your favorite coins to never miss a move.
                  </p>
                </div>
                
                <div className="rounded-lg bg-orange-50 dark:bg-orange-900/30 p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Track Performance
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Review 24h changes regularly to stay informed about trends.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Widget */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-6 shadow-lg dark:shadow-dark-lg">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setShowAllPricesModal(true)}
                  className="w-full rounded-xl bg-[#22243A] dark:bg-gray-700 px-4 py-3 text-center text-base font-bold text-[#ffe369] dark:text-yellow-400 shadow-md dark:shadow-dark-sm transition-all hover:bg-[#2a2d3f] dark:hover:bg-gray-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ffe369] dark:focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  View All Market Prices
                </button>
                <button 
                  onClick={() => setShowCompareModal(true)}
                  className="w-full rounded-xl bg-[#ffe369] dark:bg-yellow-500 px-4 py-3 text-center text-base font-bold text-[#22243A] dark:text-gray-900 shadow-md dark:shadow-dark-sm transition-all hover:bg-[#ffd940] dark:hover:bg-yellow-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22243A] dark:focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Compare Favorites
                </button>
                <button 
                  onClick={() => setShowAlertModal(true)}
                  className="w-full rounded-xl bg-[#ffe369] dark:bg-yellow-500 px-4 py-3 text-center text-base font-bold text-[#22243A] dark:text-gray-900 shadow-md dark:shadow-dark-sm transition-all hover:bg-[#ffd940] dark:hover:bg-yellow-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22243A] dark:focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  Set Price Alert
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 
          All Market Prices Modal - Avatar-Style Card Display
          Matches Compare Favorites modal design language
        */}
        {showAllPricesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl dark:shadow-dark-xl">
              {/* Modal Header - Matching Compare Favorites style */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">All Market Prices</h2>
                  <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">Live cryptocurrency prices and market data</p>
                </div>
                <button
                  onClick={() => setShowAllPricesModal(false)}
                  className="group rounded-full bg-white dark:bg-gray-700 p-2 text-gray-400 dark:text-gray-500 shadow-md dark:shadow-dark-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 p-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search cryptocurrencies by name or symbol..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-3 pl-12 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                    aria-label="Search cryptocurrencies"
                  />
                </div>
              </div>

              {/* Modal Content - Avatar-style cards in 4-column grid */}
              <div className="max-h-[60vh] overflow-y-auto p-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4 sm:grid-cols-2">
                  {allCryptos
                    .filter(crypto => 
                      searchQuery === "" || 
                      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((crypto) => (
                      <button
                        key={crypto.id}
                        className="group relative flex flex-col items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-5 transition-all duration-200 hover:scale-105 hover:border-[#ff9500]/40 hover:shadow-xl dark:hover:shadow-dark-lg focus:outline-none focus:ring-4 focus:ring-[#ff9500]/30"
                        aria-label={`View details for ${crypto.name}`}
                      >
                        {/* Coin Logo - Official SVG with Brand Colors */}
                        <div className="relative flex h-16 w-16 items-center justify-center">
                          {renderCryptoLogo(crypto.id, 'lg')}
                        </div>

                        {/* Coin Name & Symbol */}
                        <div className="w-full text-center">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">{crypto.name}</h4>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{crypto.symbol}</p>
                        </div>

                        {/* Price Display */}
                        <div className="w-full rounded-lg bg-white dark:bg-gray-700 p-2.5 shadow-sm dark:shadow-dark-sm">
                          <p className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">Price</p>
                          <p className="text-center text-base font-bold text-gray-900 dark:text-white">
                            {formatCurrency(crypto.price)}
                          </p>
                        </div>

                        {/* 24h Change Badge */}
                        <div className={cn(
                          "flex items-center gap-1 rounded-full px-3 py-1.5 shadow-sm",
                          crypto.change24h >= 0 ? "bg-green-50 dark:bg-green-900/30" : "bg-red-50 dark:bg-red-900/30"
                        )}>
                          {crypto.change24h >= 0 ? (
                            <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                          )}
                          <span className={cn(
                            "text-xs font-bold",
                            crypto.change24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          )}>
                            {crypto.change24h >= 0 ? "+" : ""}{crypto.change24h.toFixed(2)}%
                          </span>
                        </div>

                        {/* Market Stats - Compact */}
                        <div className="w-full space-y-1 border-t border-gray-100 dark:border-gray-700 pt-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Mkt Cap:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {crypto.marketCap >= 1e9 
                                ? `$${(crypto.marketCap / 1e9).toFixed(1)}B`
                                : `$${(crypto.marketCap / 1e6).toFixed(0)}M`
                              }
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Volume:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {crypto.volume >= 1e9 
                                ? `$${(crypto.volume / 1e9).toFixed(1)}B`
                                : `$${(crypto.volume / 1e6).toFixed(0)}M`
                              }
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>

                {/* Empty State */}
                {allCryptos.filter(crypto => 
                  searchQuery === "" || 
                  crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 && (
                  <div className="rounded-xl bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-12 text-center">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      No cryptocurrencies found matching "{searchQuery}"
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-4 rounded-lg bg-[#ffe369] dark:bg-yellow-500 px-4 py-2 text-sm font-bold text-[#22243A] dark:text-gray-900 transition-all hover:bg-[#ffd940] dark:hover:bg-yellow-400"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 
          Compare Favorites Modal - Avatar-Style Coin Selection
          
          Props Used:
          - coins: allCryptos (array of CryptoData)
          - selectedCoins: selectedCoins state (array of coin IDs)
          - onToggleSelection: toggleCoinSelection function
          - isOpen: showCompareModal state
          - onClose: () => { setShowCompareModal(false); setSelectedCoins([]); }
          
          Layout:
          - 4 columns on desktop (md:grid-cols-4)
          - 2 columns on mobile (grid-cols-2)
          - Responsive gap spacing (gap-6)
          
          Visual Consistency:
          - rounded-2xl modal corners
          - shadow-2xl for prominence
          - Gradient header (from-blue-50 to-purple-50)
          - White background (bg-white)
          - Dashboard color palette (#ff9500, #ffe369, #22243A)
        */}
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl dark:shadow-dark-xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Compare Favorites</h2>
                  <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">Select coins to compare side-by-side</p>
                </div>
                <button
                  onClick={() => {
                    setShowCompareModal(false);
                    setSelectedCoins([]);
                  }}
                  className="group rounded-full bg-white dark:bg-gray-700 p-2 text-gray-400 dark:text-gray-500 shadow-md dark:shadow-dark-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="max-h-[70vh] overflow-y-auto p-8">
                {/* Coin Avatar Selection Grid - 2 columns mobile, 4 columns desktop */}
                <div className="mb-8">
                  <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Select Coins to Compare
                  </h3>
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4 2">
                    {allCryptos.map((crypto) => {
                      const isSelected = selectedCoins.includes(crypto.id);
                      return (
                        <button
                          key={crypto.id}
                          onClick={() => toggleCoinSelection(crypto.id)}
                          className={cn(
                            "group relative flex flex-col items-center gap-3 rounded-xl p-4 transition-all duration-200 focus:outline-none  focus:ring-[#ff9500]/30",
                            isSelected
                              ? "scale-105 transform"
                              : "hover:scale-105 hover:transform"
                          )}
                          aria-label={`${isSelected ? 'Deselect' : 'Select'} ${crypto.name} (${crypto.symbol})`}
                          aria-pressed={isSelected}
                        >
                          {/* Coin Logo - Official SVG with Brand Colors */}
                          <div className="relative flex h-20 w-20 items-center justify-center">
                            {renderCryptoLogo(crypto.id, 'lg')}
                            
                            {/* Selection Indicator */}
                            {isSelected && (
                              <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#ffe369] dark:bg-yellow-500 shadow-md ring-2 ring-white dark:ring-gray-800">
                                <Check className="h-4 w-4 text-[#22243A] dark:text-gray-900" />
                              </div>
                            )}
                          </div>

                          {/* Coin Name & Symbol */}
                          <div className="text-center">
                            <h4 className={cn(
                              "text-sm font-bold transition-colors",
                              isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                            )}>
                              {crypto.name}
                            </h4>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{crypto.symbol}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comparison Grid - Only shows when 2+ coins selected */}
                {selectedCoins.length >= 2 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Side-by-Side Comparison
                      </h3>
                      <span className="rounded-full bg-[#ffe369] dark:bg-yellow-500 px-3 py-1 text-xs font-bold text-[#22243A] dark:text-gray-900">
                        {selectedCoins.length} Selected
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {selectedCoins.map((coinId) => {
                        const crypto = allCryptos.find(c => c.id === coinId);
                        if (!crypto) return null;
                        
                        return (
                          <div
                            key={crypto.id}
                            className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-linear-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 shadow-lg dark:shadow-dark-lg transition-all hover:border-[#ff9500] hover:shadow-xl dark:hover:shadow-dark-xl"
                          >
                            {/* Coin Header with Logo */}
                            <div className="mb-4 flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center">
                                {renderCryptoLogo(crypto.id, 'md')}
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{crypto.name}</h4>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{crypto.symbol}</p>
                              </div>
                            </div>
                            
                            {/* Price & Change */}
                            <div className="mb-4 rounded-lg bg-white dark:bg-gray-700 p-3 shadow-sm dark:shadow-dark-sm">
                              <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Current Price</div>
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(crypto.price)}</div>
                              <div className="mt-1 flex items-center gap-1">
                                {crypto.change24h >= 0 ? (
                                  <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />
                                )}
                                <span className={cn(
                                  "text-sm font-bold",
                                  crypto.change24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                )}>
                                  {crypto.change24h >= 0 ? "+" : ""}{crypto.change24h.toFixed(2)}%
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">24h</span>
                              </div>
                            </div>

                            {/* Additional Metrics */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between rounded-lg bg-blue-50 dark:bg-blue-900/30 px-3 py-2">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Market Cap</span>
                                <span className="text-xs font-bold text-gray-900 dark:text-white">{formatCurrency(crypto.marketCap, 0)}</span>
                              </div>
                              <div className="flex items-center justify-between rounded-lg bg-purple-50 dark:bg-purple-900/30 px-3 py-2">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Volume (24h)</span>
                                <span className="text-xs font-bold text-gray-900 dark:text-white">{formatCurrency(crypto.volume, 0)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Status/Instruction Footer */}
                <div className="mt-8 rounded-xl bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-6 text-center">
                  {selectedCoins.length === 0 && (
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      👆 Select coins above to compare their performance side-by-side
                    </p>
                  )}
                  {selectedCoins.length === 1 && (
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Select at least one more coin to start comparing
                    </p>
                  )}
                  {selectedCoins.length >= 2 && (
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        ✓ Great! Compare {selectedCoins.length} cryptocurrencies above
                      </p>
                      <button
                        className="rounded-xl bg-[#ffe369] dark:bg-yellow-500 px-6 py-2.5 text-sm font-bold text-[#22243A] dark:text-gray-900 shadow-md dark:shadow-dark-sm transition-all hover:bg-[#ffd940] dark:hover:bg-yellow-400 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#22243A] dark:focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        onClick={() => {
                          // Could trigger export, print, or detailed comparison view
                          alert(`Comparing ${selectedCoins.length} coins: ${selectedCoins.map(id => allCryptos.find(c => c.id === id)?.symbol).join(', ')}`);
                        }}
                      >
                        Export Comparison
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 
          Set Price Alert Modal - Matching Compare Favorites Design
          Perfect visual parity with Compare Favorites modal
        */}
        {showAlertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl dark:shadow-dark-xl">
              {/* Modal Header - Matching Compare Favorites style */}
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Set Price Alert</h2>
                  <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">Get notified when price reaches your target</p>
                </div>
                <button
                  onClick={() => {
                    setShowAlertModal(false);
                    setAlertCoin("");
                    setAlertPrice("");
                    setAlertType("above");
                  }}
                  className="group rounded-full bg-white dark:bg-gray-700 p-2 text-gray-400 dark:text-gray-500 shadow-md dark:shadow-dark-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="space-y-6">
                  {/* Coin Selection */}
                  <div>
                    <label 
                      htmlFor="alert-coin-select"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      Cryptocurrency
                    </label>
                    <div className="relative">
                      <select
                        id="alert-coin-select"
                        value={alertCoin}
                        onChange={(e) => setAlertCoin(e.target.value)}
                        className="w-full appearance-none rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-sm font-medium text-gray-900 dark:text-white shadow-sm dark:shadow-dark-sm transition-all focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                        aria-label="Select cryptocurrency"
                      >
                        <option value="">Select a coin...</option>
                        {allCryptos.map((crypto) => (
                          <option key={crypto.id} value={crypto.id}>
                            {crypto.name} ({crypto.symbol})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Alert Type */}
                  <div>
                    <label 
                      htmlFor="alert-type-select"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      Alert Condition
                    </label>
                    <div className="relative">
                      <select
                        id="alert-type-select"
                        value={alertType}
                        onChange={(e) => setAlertType(e.target.value)}
                        className="w-full appearance-none rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-sm font-medium text-gray-900 dark:text-white shadow-sm dark:shadow-dark-sm transition-all focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                        aria-label="Select alert condition"
                      >
                        <option value="above">Price Goes Above</option>
                        <option value="below">Price Goes Below</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Target Price */}
                  <div>
                    <label 
                      htmlFor="alert-price-input"
                      className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                    >
                      Target Price (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500 dark:text-gray-400">$</span>
                      <input
                        id="alert-price-input"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={alertPrice}
                        onChange={(e) => setAlertPrice(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 py-3 pl-8 pr-4 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm dark:shadow-dark-sm transition-all focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                        aria-label="Enter target price"
                      />
                    </div>
                  </div>

                  {/* Current Price Display */}
                  {alertCoin && (
                    <div className="rounded-xl bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-5 shadow-sm dark:shadow-dark-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Current Price</p>
                          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(allCryptos.find(c => c.id === alertCoin)?.price || 0)}
                          </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center">
                          {renderCryptoLogo(alertCoin || 'bitcoin', 'md')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <button 
                    onClick={() => {
                      // Validate and save alert
                      if (alertCoin && alertPrice && parseFloat(alertPrice) > 0) {
                        // In production, this would call onSaveAlert callback
                        console.log('Alert saved:', { coin: alertCoin, type: alertType, price: alertPrice });
                        
                        // Close modal immediately after save
                        setShowAlertModal(false);
                        setAlertCoin("");
                        setAlertPrice("");
                        setAlertType("above");
                      }
                    }}
                    disabled={!alertCoin || !alertPrice || parseFloat(alertPrice) <= 0}
                    className={cn(
                      "w-full rounded-xl px-6 py-3.5 text-center text-base font-bold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#22243A] dark:focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
                      alertCoin && alertPrice && parseFloat(alertPrice) > 0
                        ? "bg-[#ffe369] dark:bg-yellow-500 text-[#22243A] dark:text-gray-900 hover:bg-[#ffd940] dark:hover:bg-yellow-400 hover:shadow-lg cursor-pointer"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    )}
                    aria-label="Save price alert"
                  >
                    {alertCoin && alertPrice && parseFloat(alertPrice) > 0 ? 'Save Alert' : 'Fill All Fields to Continue'}
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
