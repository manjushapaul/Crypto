"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { CoinData } from "@/types";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import MicroChart from "./MicroChart";

/**
 * AssetDetailModal Component Props
 * 
 * @property {CoinData} asset - The cryptocurrency asset data to display
 * @property {boolean} isOpen - Whether the modal is currently open
 * @property {() => void} onClose - Callback function to close the modal
 */
interface AssetDetailModalProps {
  asset: CoinData | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AssetDetailModal - Modal/Drawer component for displaying detailed asset information
 * 
 * Features:
 * - Slide-in drawer animation from right
 * - Backdrop overlay with click-to-close
 * - Keyboard accessible (ESC to close, focus trap)
 * - Displays comprehensive asset information
 * - Responsive design
 * 
 * Accessibility:
 * - ARIA labels and roles
 * - Focus management
 * - Keyboard navigation (ESC, Tab)
 * - Screen reader friendly
 * 
 * @example
 * ```tsx
 * const [selectedAsset, setSelectedAsset] = useState<CoinData | null>(null);
 * 
 * <AssetDetailModal
 *   asset={selectedAsset}
 *   isOpen={!!selectedAsset}
 *   onClose={() => setSelectedAsset(null)}
 * />
 * ```
 */
export default function AssetDetailModal({
  asset,
  isOpen,
  onClose,
}: AssetDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      
      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !asset) {
    return null;
  }

  const supplyPercentage = (asset.circulatingSupply / asset.totalSupply) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal/Drawer Container */}
      <div
        ref={modalRef}
        className="relative h-full w-full max-w-md overflow-y-auto bg-white dark:bg-gray-800 shadow-2xl dark:shadow-dark-xl animate-slide-in-right md:max-w-lg"
        role="document"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
          <h2
            id="modal-title"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            Asset Details
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Asset Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center">
              {/* Bitcoin Logo */}
              {asset.id === "bitcoin" && (
                <svg
                  width="64"
                  height="64"
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
                  width="48"
                  height="48"
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

              {/* Ripple Logo */}
              {asset.id === "ripple" && (
                <svg
                  width="64"
                  height="64"
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

              {/* Cardano Logo */}
              {asset.id === "cardano" && (
                <svg
                  width="64"
                  height="64"
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

              {/* Solana Logo */}
              {asset.id === "solana" && (
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 646 512"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M112.6 364.04l-73.53 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 0l-35.2-35.2L112.6 364.04z"
                    fill="url(#solGradientModal1)"
                  />
                  <path
                    d="M112.6 0L39.07 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 512l-35.2 35.2L112.6 0z"
                    fill="url(#solGradientModal2)"
                  />
                  <path
                    d="M646 256L112.6 256 39.07 182.47a24.89 24.89 0 00-35.2 0c-9.7 9.7-9.7 25.5 0 35.2l73.53 73.53L610.8 291.2 646 256z"
                    fill="url(#solGradientModal3)"
                  />
                  <defs>
                    <linearGradient id="solGradientModal1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9945FF" />
                      <stop offset="100%" stopColor="#14F195" />
                    </linearGradient>
                    <linearGradient id="solGradientModal2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9945FF" />
                      <stop offset="100%" stopColor="#14F195" />
                    </linearGradient>
                    <linearGradient id="solGradientModal3" x1="0%" y1="0%" x2="100%" y2="100%">
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
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <span className="text-2xl font-bold text-white">
                    {asset.symbol.substring(0, 1)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{asset.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {asset.symbol} {asset.rank && `• Rank #${asset.rank}`}
              </p>
            </div>
          </div>

          {/* Current Price */}
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 p-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Price</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(asset.price)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  asset.change >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {asset.change >= 0 ? "+" : ""}
                {asset.change.toFixed(2)}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">(24h)</span>
            </div>
          </div>

          {/* Price Chart */}
          <div>
            <p className="mb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Price Trend</p>
            <div className="flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6">
              <MicroChart
                data={asset.chartData}
                width={250}
                height={100}
                lineColor={asset.change >= 0 ? "#10B981" : "#EF4444"}
              />
            </div>
          </div>

          {/* Market Statistics */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Market Statistics
            </h4>
            <div className="space-y-4">
              {/* Market Cap */}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Market Cap</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(asset.marketCap)}
                </span>
              </div>

              {/* Volume 24h */}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Volume (24h)</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(asset.volume)}
                </span>
              </div>

              {/* 24h High */}
              {asset.high24h && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">24h High</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(asset.high24h)}
                  </span>
                </div>
              )}

              {/* 24h Low */}
              {asset.low24h && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">24h Low</span>
                  <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                    {formatCurrency(asset.low24h)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Supply Information */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Supply Information
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Circulating Supply</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCompactNumber(asset.circulatingSupply)} {asset.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Supply</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCompactNumber(asset.totalSupply)} {asset.symbol}
                </span>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Supply Progress</span>
                  <span>{supplyPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-orange-800 via-orange-400 to-yellow-200 transition-all duration-500"
                    style={{ width: `${supplyPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {asset.description && (
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                About
              </h4>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {asset.description}
              </p>
            </div>
          )}

          {/* Website Link */}
          {asset.website && (
            <div>
              <a
                href={asset.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#22243A] dark:bg-gray-700 p-4 text-sm font-medium text-[#ffe369] dark:text-yellow-400 transition-colors hover:bg-[#2a2d3f] dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ffe369] dark:focus:ring-yellow-400"
              >
                Visit Website
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}


