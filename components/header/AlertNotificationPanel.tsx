"use client";

import { useEffect, useRef } from "react";
import { X, Clock } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

/**
 * Alert Interface
 * Represents a single price alert notification
 * 
 * @property {string} id - Unique identifier for the alert
 * @property {string} coinId - ID of the cryptocurrency
 * @property {string} coinName - Full name (e.g., "Bitcoin")
 * @property {string} coinSymbol - Trading symbol (e.g., "BTC")
 * @property {string} gradient - Tailwind gradient classes for coin avatar
 * @property {string} message - Alert message text
 * @property {number} targetPrice - Price that triggered the alert
 * @property {number} currentPrice - Current price when alert triggered
 * @property {'above' | 'below'} type - Alert condition type
 * @property {Date} timestamp - When the alert was triggered
 * @property {boolean} isRead - Whether the alert has been viewed
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
 * AlertNotificationPanel Props
 * 
 * @property {Alert[]} alerts - Array of alert notifications
 * @property {boolean} isOpen - Controls panel visibility
 * @property {() => void} onClose - Callback when panel should close
 * @property {(alertId: string) => void} onAlertClick - Callback when an alert is clicked
 * @property {() => void} onClearAll - Callback to clear all alerts
 * @property {(alertId: string) => void} onMarkAsRead - Callback to mark alert as read
 */
interface AlertNotificationPanelProps {
  alerts: Alert[];
  isOpen: boolean;
  onClose: () => void;
  onAlertClick?: (alertId: string) => void;
  onClearAll: () => void;
  onMarkAsRead?: (alertId: string) => void;
}

/**
 * AlertNotificationPanel Component
 * Dropdown panel displaying price alert notifications
 * 
 * Features:
 * - Matches dashboard modal styling (rounded-2xl, shadow-lg, white bg)
 * - Displays coin logo, alert message, and relative timestamp
 * - Keyboard accessible with Tab/Enter/Escape support
 * - Click outside to close
 * - Hover effects on alert rows
 * - Clear All functionality
 * - Responsive positioning
 * 
 * Design Consistency:
 * - Uses dashboard color palette (#22243A, #ffe369, #ff9500)
 * - Matches Compare Favorites modal styling
 * - Smooth animations and transitions
 * - Proper shadows and rounded corners
 */
export default function AlertNotificationPanel({
  alerts,
  isOpen,
  onClose,
  onAlertClick,
  onClearAll,
  onMarkAsRead,
}: AlertNotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * Format timestamp to relative time string
   * @param {Date | string | number} date - Timestamp to format
   * @returns {string} Relative time string (e.g., "Just now", "5 min ago")
   */
  const getRelativeTime = (date: Date | string | number): string => {
    // Convert to Date object if it's a string or number
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Recently";
    }
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  /**
   * Render cryptocurrency logo SVG
   * Uses official brand colors and authentic designs
   */
  const renderCryptoLogo = (coinId: string) => {
    const width = 32;
    const height = 32;

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
      case "solana":
        return (
          <svg width={width} height={height} viewBox="0 0 646 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="solGradientAlert" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9945FF" />
                <stop offset="100%" stopColor="#14F195" />
              </linearGradient>
            </defs>
            <path d="M112.6 364.04l-73.53 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 0l-35.2-35.2L112.6 364.04z" fill="url(#solGradientAlert)" />
            <path d="M112.6 0L39.07 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 512l-35.2 35.2L112.6 0z" fill="url(#solGradientAlert)" />
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
      default:
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-gray-300 to-gray-400">
            <span className="text-sm font-bold text-white">
              {coinId.charAt(0).toUpperCase()}
            </span>
          </div>
        );
    }
  };

  // OLD CryptoLogo Component - Kept for backward compatibility but not used
  const CryptoLogo = ({ symbol, color }: { symbol: string; color: string }) => {
    const logos: Record<string, React.ReactElement> = {
      BTC: (
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <g fill={color}>
            <path d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.921-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/>
          </g>
        </svg>
      ),
      ETH: (
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <g fill={color}>
            <path d="M15.927 23.959l-9.823-5.797 9.817 13.839 9.828-13.839-9.828 5.797zM16.073 0l-9.819 16.297 9.819 5.807 9.823-5.801z"/>
          </g>
        </svg>
      ),
      XRP: (
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <g fill={color}>
            <path d="M25.07 6.93l-2.07-2.07-6.5 6.5-6.5-6.5-2.07 2.07 6.5 6.5-6.5 6.5 2.07 2.07 6.5-6.5 6.5 6.5 2.07-2.07-6.5-6.5z"/>
          </g>
        </svg>
      ),
      ADA: (
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <g fill={color}>
            <circle cx="16" cy="16" r="3"/>
            <circle cx="16" cy="6" r="2"/>
            <circle cx="16" cy="26" r="2"/>
            <circle cx="6" cy="16" r="2"/>
            <circle cx="26" cy="16" r="2"/>
            <circle cx="10" cy="10" r="1.5"/>
            <circle cx="22" cy="10" r="1.5"/>
            <circle cx="10" cy="22" r="1.5"/>
            <circle cx="22" cy="22" r="1.5"/>
          </g>
        </svg>
      ),
      SOL: (
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <g fill={color}>
            <path d="M7.5 19.5l4-4h13l-4 4zm4-11h13l-4 4h-13zm0 5.5h13l4 4h-13z"/>
          </g>
        </svg>
      ),
      DOGE: (
        <svg viewBox="0 0 32 32" className="h-6 w-6">
          <g fill={color}>
            <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S6 21.523 6 16 10.477 6 16 6zm-2 4v12h4c3.314 0 6-2.686 6-6s-2.686-6-6-6h-4zm2 2h2c2.21 0 4 1.79 4 4s-1.79 4-4 4h-2v-8z"/>
          </g>
        </svg>
      ),
    };
    return logos[symbol] || <span className="text-sm font-bold">{symbol}</span>;
  };

  /**
   * Handle click outside panel to close
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  /**
   * Handle Escape key to close panel
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  /**
   * Handle alert click
   */
  const handleAlertClick = (alert: Alert) => {
    if (onMarkAsRead && !alert.isRead) {
      onMarkAsRead(alert.id);
    }
    if (onAlertClick) {
      onAlertClick(alert.id);
    }
  };

  /**
   * Handle keyboard navigation on alert items
   */
  const handleAlertKeyDown = (event: React.KeyboardEvent, alert: Alert) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleAlertClick(alert);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-full z-50 mt-2 w-[380px] overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl dark:shadow-dark-xl"
      role="dialog"
      aria-label="Alert notifications"
      aria-modal="false"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-4">
        <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          Price Alerts
        </h3>
        <div className="flex items-center gap-2">
          {alerts.length > 0 && (
            <button
              onClick={onClearAll}
              className="rounded-lg px-3 py-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 transition-all hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label="Clear all alerts"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 dark:text-gray-500 transition-all hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff9500]"
            aria-label="Close notifications"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Alert List */}
      <div className="max-h-[400px] overflow-y-auto">
        {alerts.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <Clock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">No alerts yet</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your price alerts will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {alerts.map((alert) => (
              <button
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                onKeyDown={(e) => handleAlertKeyDown(e, alert)}
                className={cn(
                  "w-full p-4 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#ff9500]",
                  !alert.isRead 
                    ? "bg-blue-50/30 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30" 
                    : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
                tabIndex={0}
                role="button"
                aria-label={`Alert: ${alert.message}`}
              >
                <div className="flex items-start gap-3">
                  {/* Coin Logo - Official SVG with Brand Colors */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                    {renderCryptoLogo(alert.coinId)}
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {alert.coinName} ({alert.coinSymbol})
                      </p>
                      {!alert.isRead && (
                        <span className="shrink-0 h-2 w-2 rounded-full bg-[#ff9500]" aria-label="Unread" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {alert.message}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getRelativeTime(alert.timestamp)}
                      </span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {formatCurrency(alert.currentPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

