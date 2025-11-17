"use client";

import { useState, useRef, useEffect } from "react";
import { Star, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

/**
 * LocalStorage keys for favorites persistence
 */
const FAVORITES_STORAGE_KEY = "crypto-dashboard-favorites";
const SHOW_ALL_COINS_KEY = "crypto-dashboard-show-all-coins";

/**
 * Favorite Cryptocurrency Interface
 */
interface FavoriteCrypto {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  isFavorite: boolean;
}

/**
 * Favs Component Props
 */
interface FavsProps {
  period?: "daily" | "weekly" | "monthly" | "yearly";
}

/**
 * Generate favorite cryptocurrencies data
 */
function generateFavoritesData(): FavoriteCrypto[] {
  return [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 43250.50,
      change24h: 2.81,
      marketCap: 789500000000,
      volume: 21171999345,
      isFavorite: true,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 2234.75,
      change24h: -1.48,
      marketCap: 265800000000,
      volume: 13171999345,
      isFavorite: true,
    },
    {
      id: "ripple",
      name: "Ripple",
      symbol: "XRP",
      price: 0.52,
      change24h: 3.74,
      marketCap: 35000000000,
      volume: 2500000000,
      isFavorite: true,
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.48,
      change24h: 2.22,
      marketCap: 18000000000,
      volume: 800000000,
      isFavorite: true,
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 98.45,
      change24h: 5.42,
      marketCap: 42000000000,
      volume: 3500000000,
      isFavorite: true,
    },
    {
      id: "dogecoin",
      name: "Dogecoin",
      symbol: "DOGE",
      price: 0.08,
      change24h: -2.15,
      marketCap: 12000000000,
      volume: 500000000,
      isFavorite: false,
    },
    {
      id: "binancecoin",
      name: "Binance Coin",
      symbol: "BNB",
      price: 310.25,
      change24h: 1.88,
      marketCap: 48000000000,
      volume: 1800000000,
      isFavorite: false,
    },
    {
      id: "litecoin",
      name: "Litecoin",
      symbol: "LTC",
      price: 72.50,
      change24h: -0.95,
      marketCap: 5300000000,
      volume: 450000000,
      isFavorite: false,
    },
  ];
}

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
    case "dogecoin":
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C2A633] text-xl font-bold text-white">
          D
        </div>
      );
    case "binancecoin":
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3BA2F] text-xl font-bold text-white">
          B
        </div>
      );
    case "litecoin":
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#345D9D] text-xl font-bold text-white">
          L
        </div>
      );
    default:
      return (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-400 text-xl font-bold text-white">
          ?
        </div>
      );
  }
};

/**
 * Load favorites from localStorage
 * Returns saved favorites or default data if not found
 * 
 * IMPORTANT: Loads ENTIRE crypto list (favorites + available)
 * This ensures "Available Cryptocurrencies" persists across refresh
 */
function loadFavoritesFromStorage(): FavoriteCrypto[] {
  if (typeof window === "undefined") {
    console.log("🖥️  Server-side render: using default favorites");
    return generateFavoritesData();
  }
  
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) {
      console.log("📦 No favorites in localStorage, will use defaults and save on next change");
      return generateFavoritesData();
    }
    
    const parsed = JSON.parse(stored);
    
    // Validate data structure
    if (!Array.isArray(parsed) || parsed.length === 0) {
      console.warn("⚠️  Invalid data in localStorage, using defaults");
      return generateFavoritesData();
    }
    
    const favoriteCount = parsed.filter((c: FavoriteCrypto) => c.isFavorite).length;
    const totalCount = parsed.length;
    console.log(`✅ Loaded from localStorage: ${favoriteCount} favorites, ${totalCount - favoriteCount} available, ${totalCount} total coins`);
    
    return parsed;
  } catch (error) {
    console.error("❌ Error loading favorites from localStorage:", error);
    return generateFavoritesData();
  }
}

/**
 * Save favorites to localStorage
 */
function saveFavoritesToStorage(favorites: FavoriteCrypto[]): void {
  if (typeof window === "undefined") return;
  
  try {
    // Validate data before saving
    if (!Array.isArray(favorites) || favorites.length === 0) {
      console.warn("Invalid favorites data, skipping save");
      return;
    }
    
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    const favoriteCount = favorites.filter(c => c.isFavorite).length;
    const totalCount = favorites.length;
    console.log(`✅ Saved to localStorage: ${favoriteCount} favorites out of ${totalCount} total coins`);
  } catch (error) {
    console.error("❌ Error saving favorites to localStorage:", error);
  }
}

/**
 * Load showAllCoins state from localStorage
 */
function loadShowAllCoinsState(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const stored = localStorage.getItem(SHOW_ALL_COINS_KEY);
    if (stored === null) return false;
    return stored === "true";
  } catch (error) {
    console.error("Error loading showAllCoins state:", error);
    return false;
  }
}

/**
 * Save showAllCoins state to localStorage
 */
function saveShowAllCoinsState(show: boolean): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(SHOW_ALL_COINS_KEY, String(show));
    console.log(`💾 Available Cryptocurrencies visibility: ${show ? 'shown' : 'hidden'}`);
  } catch (error) {
    console.error("Error saving showAllCoins state:", error);
  }
}

/**
 * Favs - Favorite cryptocurrencies dashboard
 * 
 * Features:
 * - Display favorite cryptocurrencies
 * - Add/remove from favorites
 * - Real-time price updates
 * - Percentage change indicators
 * - Responsive grid layout
 * - Matches dashboard styling
 * - LocalStorage persistence (favorites survive page refresh)
 */
export default function Favs({ period = "weekly" }: FavsProps) {
  const [cryptos, setCryptos] = useState<FavoriteCrypto[]>(generateFavoritesData());
  const [showAllCoins, setShowAllCoins] = useState(() => {
    // Initialize from localStorage to prevent state reset on navigation
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SHOW_ALL_COINS_KEY);
      return stored === "true";
    }
    return false;
  });
  const availableCoinsRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  /**
   * Load favorites from localStorage on client mount
   * Prevents hydration mismatch and ensures data persistence
   * 
   * Note: showAllCoins is now initialized from localStorage during useState,
   * so we don't need to load it here. This prevents state reset on navigation.
   * 
   * Critical Flow:
   * 1. Component mounts with default data (cryptos) and stored showAllCoins
   * 2. This effect runs and loads saved favorites data from localStorage
   * 3. Updates state with saved favorites + available coins
   * 4. Sets flag to enable auto-save for future changes
   */
  useEffect(() => {
    console.log("🔄 Favs component mounting, loading from localStorage...");
    
    // Load stored favorites on mount
    const stored = loadFavoritesFromStorage();
    setCryptos(stored);
    
    // Log current visibility state (already loaded during useState initialization)
    console.log(`👁️  Available Cryptocurrencies section: ${showAllCoins ? 'SHOWN' : 'HIDDEN'} (from localStorage)`);
    
    // Mark initial mount as complete
    isInitialMount.current = false;
    
    console.log("✅ Favs component initialized with stored data");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  /**
   * Save favorites to localStorage whenever they change
   * Skips initial mount to prevent overwriting with default data
   * 
   * This ensures:
   * - User changes are saved immediately
   * - Page refresh preserves all data (favorites + available coins)
   */
  useEffect(() => {
    // Skip save on initial mount (we just loaded from storage)
    if (isInitialMount.current) {
      return;
    }
    
    // Save changes to localStorage
    saveFavoritesToStorage(cryptos);
  }, [cryptos]);

  /**
   * Save "Available Cryptocurrencies" visibility state whenever it changes
   * This ensures the section remains visible/hidden after page refresh
   */
  useEffect(() => {
    // Skip save on initial mount
    if (isInitialMount.current) {
      return;
    }
    
    // Save visibility state
    saveShowAllCoinsState(showAllCoins);
  }, [showAllCoins]);

  /**
   * Toggle favorite status
   * Updates state and automatically saves to localStorage via useEffect
   */
  const toggleFavorite = (id: string) => {
    setCryptos((prev) => {
      const coin = prev.find(c => c.id === id);
      const updated = prev.map((crypto) =>
        crypto.id === id ? { ...crypto, isFavorite: !crypto.isFavorite } : crypto
      );
      
      const action = coin?.isFavorite ? 'removed from' : 'added to';
      console.log(`⭐ ${coin?.name} ${action} favorites`);
      
      return updated;
    });
  };

  /**
   * Handle add favorites button click with scroll
   * Toggles "Available Cryptocurrencies" section visibility
   * State is automatically saved to localStorage via useEffect
   */
  const handleAddFavoritesClick = () => {
    const newState = !showAllCoins;
    setShowAllCoins(newState);
    
    console.log(`🔘 User ${newState ? 'opened' : 'closed'} Available Cryptocurrencies section`);
    
    // Scroll to available coins section when opening
    if (newState) {
      setTimeout(() => {
        availableCoinsRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  const favoriteCryptos = cryptos.filter((c) => c.isFavorite);
  const otherCryptos = cryptos.filter((c) => !c.isFavorite);
  
  // Debug: Log current state for troubleshooting
  useEffect(() => {
    console.log(`📊 Current State: ${favoriteCryptos.length} favorites, ${otherCryptos.length} available, ${cryptos.length} total`);
  }, [cryptos.length, favoriteCryptos.length, otherCryptos.length]);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Favorites Summary */}
        <div className="flex flex-col min-[500px]:flex-row min-[500px]:items-center min-[500px]:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Favorite Cryptocurrencies</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {favoriteCryptos.length} favorite{favoriteCryptos.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={handleAddFavoritesClick}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all bg-[#22243A] dark:bg-gray-700 text-[#ffe369] dark:text-yellow-400 shadow-md dark:shadow-dark-sm hover:bg-[#2a2d3f] dark:hover:bg-gray-600 self-end min-[500px]:self-auto"
          >
            <Plus className="h-4 w-4" />
            {showAllCoins ? "Hide Available Coins" : "Add Favorites"}
          </button>
        </div>

        {/* Favorite Coins Grid */}
        {favoriteCryptos.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {favoriteCryptos.map((crypto) => (
              <div
                key={crypto.id}
                className="cursor-pointer rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-6 shadow-md dark:shadow-dark-md transition-all duration-300 hover:shadow-xl dark:hover:shadow-dark-lg"
              >
                {/* Header: Icon + Name + Star */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="shrink-0">
                    {renderCryptoLogo(crypto.id)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{crypto.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(crypto.id);
                    }}
                    className="shrink-0 transition-transform hover:scale-110"
                    aria-label={`Remove ${crypto.name} from favorites`}
                  >
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  </button>
                </div>

                {/* Data Section */}
                <div className="space-y-1">
                  {/* Current Price */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Price:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(crypto.price)}
                    </p>
                  </div>

                  {/* 24h Change */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      24h Change:
                    </p>
                    <div className="flex items-center gap-1">
                      {crypto.change24h >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                      )}
                      <p className={cn(
                        "text-sm font-bold",
                        crypto.change24h >= 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                      )}>
                        {crypto.change24h >= 0 ? "+" : ""}{crypto.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Market Cap */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Market Cap:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(crypto.marketCap, 0)}
                    </p>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Volume (24h):
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(crypto.volume, 0)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center shadow-md dark:shadow-dark-md">
            <Star className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No favorite cryptocurrencies yet</p>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">Click "Add Favorites" to select your favorites</p>
          </div>
        )}

        {/* Add Favorites Section */}
        {showAllCoins && (
          <div ref={availableCoinsRef}>
            <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Available Cryptocurrencies</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {otherCryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className="cursor-pointer rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-6 shadow-md dark:shadow-dark-md transition-all duration-300 hover:shadow-xl dark:hover:shadow-dark-lg"
                >
                  {/* Header: Icon + Name + Star */}
                  <div className="mb-4 flex items-center gap-4">
                    <div className="shrink-0">
                      {renderCryptoLogo(crypto.id)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{crypto.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{crypto.symbol}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(crypto.id);
                      }}
                      className="shrink-0 transition-transform hover:scale-110"
                      aria-label={`Add ${crypto.name} to favorites`}
                    >
                      <Star className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                    </button>
                  </div>

                  {/* Data Section */}
                  <div className="space-y-1">
                    {/* Current Price */}
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Price:
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(crypto.price)}
                      </p>
                    </div>

                    {/* 24h Change */}
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        24h Change:
                      </p>
                      <div className="flex items-center gap-1">
                        {crypto.change24h >= 0 ? (
                          <TrendingUp className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                        )}
                        <p className={cn(
                          "text-sm font-bold",
                          crypto.change24h >= 0 ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
                        )}>
                          {crypto.change24h >= 0 ? "+" : ""}{crypto.change24h.toFixed(2)}%
                        </p>
                      </div>
                    </div>

                    {/* Market Cap */}
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Market Cap:
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(crypto.marketCap, 0)}
                      </p>
                    </div>

                    {/* Volume */}
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Volume (24h):
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatCurrency(crypto.volume, 0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ErrorBoundary>
  );
}

// Export interface
export type { FavsProps, FavoriteCrypto };

