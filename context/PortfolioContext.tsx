"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

/**
 * Portfolio Asset Interface
 * Represents a cryptocurrency asset in the portfolio
 */
export interface PortfolioAsset {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  gradient: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  amount?: number; // Number of coins owned (optional, defaults to 1)
  addedAt?: Date; // Date when added to portfolio/watchlist (auto-added by context)
}

/**
 * Notification Interface
 * Represents a notification message
 */
export interface Notification {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  timestamp: number;
  read: boolean;
}

/**
 * Alert Interface
 * Represents a price alert notification
 */
export interface Alert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  gradient: string;
  message: string;
  targetPrice: number;
  currentPrice: number;
  type: 'above' | 'below';
  timestamp: Date;
  isRead: boolean;
}

/**
 * Portfolio Context Type
 * Defines the shape of the portfolio context
 */
interface PortfolioContextType {
  portfolio: PortfolioAsset[];
  watchlist: PortfolioAsset[];
  notifications: Notification[];
  alerts: Alert[];
  addToPortfolio: (asset: PortfolioAsset) => boolean;
  addToWatchlist: (asset: PortfolioAsset) => boolean;
  removeFromPortfolio: (assetId: string) => void;
  removeFromWatchlist: (assetId: string) => void;
  clearNotifications: () => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllAlerts: () => void;
  markAlertAsRead: (alertId: string) => void;
  unreadNotificationCount: number;
  unreadAlertCount: number;
}

/**
 * LocalStorage keys
 */
const PORTFOLIO_STORAGE_KEY = "crypto-dashboard-portfolio";
const WATCHLIST_STORAGE_KEY = "crypto-dashboard-watchlist";
const NOTIFICATIONS_STORAGE_KEY = "crypto-dashboard-notifications";
const ALERTS_STORAGE_KEY = "crypto-dashboard-alerts";

/**
 * Portfolio Context
 * Provides global portfolio and watchlist state management
 */
const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

/**
 * Portfolio Provider Props
 */
interface PortfolioProviderProps {
  children: ReactNode;
}

/**
 * Load data from localStorage
 * Handles Date deserialization for portfolio/watchlist items
 */
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Convert addedAt timestamps back to Date objects for portfolio/watchlist
      if (key === PORTFOLIO_STORAGE_KEY || key === WATCHLIST_STORAGE_KEY) {
        const items = parsed as PortfolioAsset[];
        const withDates = items.map(item => ({
          ...item,
          addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
        }));
        console.log(`✅ ${key} loaded from localStorage (with Date conversion):`, withDates);
        return withDates as T;
      }
      
      console.log(`✅ ${key} loaded from localStorage:`, parsed);
      return parsed;
    }
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error);
  }
  
  return defaultValue;
};

/**
 * Save data to localStorage
 */
const saveToStorage = <T,>(key: string, data: T): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`✅ ${key} saved to localStorage:`, data);
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

/**
 * PortfolioProvider Component
 * 
 * Provides global portfolio, watchlist, and notification state to all child components.
 * Persists data to localStorage for persistence across sessions.
 * 
 * Features:
 * - Portfolio management (add/remove assets)
 * - Watchlist management (add/remove assets)
 * - Notification system with read/unread tracking
 * - localStorage persistence
 * - Duplicate prevention
 * - Type-safe API
 * 
 * @example
 * ```tsx
 * // In app layout
 * <PortfolioProvider>
 *   <App />
 * </PortfolioProvider>
 * 
 * // In any component
 * const { portfolio, addToPortfolio, addToWatchlist } = usePortfolio();
 * 
 * // Add asset to portfolio
 * addToPortfolio({
 *   id: "bitcoin",
 *   name: "Bitcoin",
 *   symbol: "BTC",
 *   // ... other properties
 * });
 * ```
 */
export function PortfolioProvider({ children }: PortfolioProviderProps) {
  // Initialize state from localStorage
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>(() => 
    loadFromStorage(PORTFOLIO_STORAGE_KEY, [])
  );
  
  const [watchlist, setWatchlist] = useState<PortfolioAsset[]>(() => 
    loadFromStorage(WATCHLIST_STORAGE_KEY, [])
  );
  
  const [notifications, setNotifications] = useState<Notification[]>(() => 
    loadFromStorage(NOTIFICATIONS_STORAGE_KEY, [])
  );
  
  const [alerts, setAlerts] = useState<Alert[]>(() => 
    loadFromStorage(ALERTS_STORAGE_KEY, [])
  );

  /**
   * Create a notification
   */
  const createNotification = (message: string, type: Notification["type"] = "success") => {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now(),
      read: false,
    };
    
    setNotifications((prev) => {
      const updated = [notification, ...prev];
      saveToStorage(NOTIFICATIONS_STORAGE_KEY, updated);
      return updated;
    });
    
    console.log("🔔 Notification created:", notification);
  };

  /**
   * Add asset to portfolio
   * Returns true if added, false if already exists
   */
  const addToPortfolio = (asset: PortfolioAsset): boolean => {
    // Check if already in portfolio
    const exists = portfolio.some((item) => item.id === asset.id);
    
    if (exists) {
      createNotification(
        `${asset.name} is already in your portfolio`,
        "info"
      );
      return false;
    }
    
    // Add to portfolio with default amount if not provided
    const newAsset: PortfolioAsset = {
      ...asset,
      amount: asset.amount || 1, // Default to 1 coin if not specified
      addedAt: new Date(), // Date object when added
    };
    
    setPortfolio((prev) => {
      const updated = [...prev, newAsset];
      saveToStorage(PORTFOLIO_STORAGE_KEY, updated);
      return updated;
    });
    
    createNotification(
      `${asset.name} successfully added to your Portfolio`,
      "success"
    );
    
    console.log("✅ Added to portfolio:", asset.name);
    return true;
  };

  /**
   * Add asset to watchlist
   * Returns true if added, false if already exists or in portfolio
   */
  const addToWatchlist = (asset: PortfolioAsset): boolean => {
    // Check if already in portfolio
    const inPortfolio = portfolio.some((item) => item.id === asset.id);
    
    if (inPortfolio) {
      createNotification(
        `${asset.name} is already in your portfolio`,
        "info"
      );
      return false;
    }
    
    // Check if already in watchlist
    const exists = watchlist.some((item) => item.id === asset.id);
    
    if (exists) {
      createNotification(
        `${asset.name} is already in your watchlist`,
        "info"
      );
      return false;
    }
    
    // Add to watchlist with default amount if not provided
    const newAsset: PortfolioAsset = {
      ...asset,
      amount: asset.amount || 1, // Default to 1 coin if not specified
      addedAt: new Date(), // Date object when added
    };
    
    setWatchlist((prev) => {
      const updated = [...prev, newAsset];
      saveToStorage(WATCHLIST_STORAGE_KEY, updated);
      return updated;
    });
    
    createNotification(
      `${asset.name} added to your Watchlist`,
      "success"
    );
    
    console.log("✅ Added to watchlist:", asset.name);
    return true;
  };

  /**
   * Remove asset from portfolio
   */
  const removeFromPortfolio = (assetId: string) => {
    const asset = portfolio.find((item) => item.id === assetId);
    
    setPortfolio((prev) => {
      const updated = prev.filter((item) => item.id !== assetId);
      saveToStorage(PORTFOLIO_STORAGE_KEY, updated);
      return updated;
    });
    
    if (asset) {
      createNotification(
        `${asset.name} removed from your Portfolio`,
        "info"
      );
      console.log("🗑️ Removed from portfolio:", asset.name);
    }
  };

  /**
   * Remove asset from watchlist
   */
  const removeFromWatchlist = (assetId: string) => {
    const asset = watchlist.find((item) => item.id === assetId);
    
    setWatchlist((prev) => {
      const updated = prev.filter((item) => item.id !== assetId);
      saveToStorage(WATCHLIST_STORAGE_KEY, updated);
      return updated;
    });
    
    if (asset) {
      createNotification(
        `${asset.name} removed from your Watchlist`,
        "info"
      );
      console.log("🗑️ Removed from watchlist:", asset.name);
    }
  };

  /**
   * Clear all notifications
   */
  const clearNotifications = () => {
    setNotifications([]);
    saveToStorage(NOTIFICATIONS_STORAGE_KEY, []);
    console.log("🧹 All notifications cleared");
  };

  /**
   * Mark a notification as read
   */
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      saveToStorage(NOTIFICATIONS_STORAGE_KEY, updated);
      return updated;
    });
  };

  /**
   * Clear all alerts
   */
  const clearAllAlerts = () => {
    setAlerts([]);
    saveToStorage(ALERTS_STORAGE_KEY, []);
    console.log("🧹 All alerts cleared");
  };

  /**
   * Mark an alert as read
   */
  const markAlertAsRead = (alertId: string) => {
    setAlerts((prev) => {
      const updated = prev.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      );
      saveToStorage(ALERTS_STORAGE_KEY, updated);
      return updated;
    });
  };

  /**
   * Count unread notifications
   */
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  
  /**
   * Count unread alerts
   */
  const unreadAlertCount = alerts.filter((a) => !a.isRead).length;

  // Persist to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(PORTFOLIO_STORAGE_KEY, portfolio);
  }, [portfolio]);

  useEffect(() => {
    saveToStorage(WATCHLIST_STORAGE_KEY, watchlist);
  }, [watchlist]);

  useEffect(() => {
    saveToStorage(NOTIFICATIONS_STORAGE_KEY, notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage(ALERTS_STORAGE_KEY, alerts);
  }, [alerts]);

  const value: PortfolioContextType = {
    portfolio,
    watchlist,
    notifications,
    alerts,
    addToPortfolio,
    addToWatchlist,
    removeFromPortfolio,
    removeFromWatchlist,
    clearNotifications,
    markNotificationAsRead,
    clearAllAlerts,
    markAlertAsRead,
    unreadNotificationCount,
    unreadAlertCount,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

/**
 * usePortfolio Hook
 * 
 * Custom hook to access portfolio context.
 * Must be used within a PortfolioProvider.
 * 
 * @throws {Error} If used outside of PortfolioProvider
 * 
 * @example
 * ```tsx
 * const { portfolio, addToPortfolio, notifications } = usePortfolio();
 * 
 * // Add asset to portfolio
 * addToPortfolio({
 *   id: "ethereum",
 *   name: "Ethereum",
 *   symbol: "ETH",
 *   // ... other properties
 * });
 * 
 * // Display portfolio items
 * {portfolio.map(asset => <AssetCard key={asset.id} asset={asset} />)}
 * 
 * // Display notification count
 * <Badge>{unreadNotificationCount}</Badge>
 * ```
 */
export function usePortfolio(): PortfolioContextType {
  const context = useContext(PortfolioContext);
  
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  
  return context;
}

/**
 * Export types for external use
 */
export type { PortfolioContextType };

