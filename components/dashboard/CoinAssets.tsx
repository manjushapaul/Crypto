"use client";

import { useState, useEffect } from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { coinAssets } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

/**
 * Render cryptocurrency logo SVG
 * Uses official brand colors
 */
function renderCryptoLogo(coinId: string) {
  switch (coinId) {
    case "bitcoin":
      return (
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case "ethereum":
      return (
        <svg width="24" height="24" viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="#FFFFFF" fillOpacity="0.8" />
          <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="#FFFFFF" />
          <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" fill="#FFFFFF" fillOpacity="0.8" />
          <path d="M127.962 416.905v-104.72L0 236.585z" fill="#FFFFFF" />
          <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" fill="#FFFFFF" fillOpacity="0.5" />
          <path d="M0 212.32l127.96 75.638v-133.8z" fill="#FFFFFF" fillOpacity="0.7" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * CoinAssets Component
 * COIN ASSET section matching the light design
 * Shows two pill-shaped cryptocurrency assets (Bitcoin and Ethereum)
 */
export default function CoinAssets() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Coin data with styling
  const coins = [
    {
      id: "bitcoin",
      symbol: "BTC",
      value: "34",
      pillBg: "bg-white",
      textColor: "text-[#4A4A4A]",
      logoBg: "bg-[#F7931A]",
    },
    {
      id: "ethereum",
      symbol: "ETH",
      value: "16",
      pillBg: "bg-[#8B80F8]",
      textColor: "text-white",
      logoBg: "bg-transparent",
    },
  ];

  return (
    <ErrorBoundary>
      <div className="relative rounded-card bg-[#f1f5fe] dark:bg-gray-800 p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] dark:shadow-gray-900/50">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          {/* Title - Top Left */}
          <h3 className="text-sm font-medium uppercase tracking-wider text-[#4A4A4A] dark:text-gray-400">
            COIN ASSET
          </h3>

          {/* Diamond Icon - Top Right */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E0E7FF] dark:bg-gray-700">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2L10 6L14 8L10 10L8 14L6 10L2 8L6 6L8 2Z"
                fill="#3B82F6"
              />
            </svg>
          </div>
        </div>

        {/* Pill-Shaped Asset Sections */}
        <div className="flex items-stretch justify-center gap-4 h-3/4">
          {coins.map((coin) => (
            <div
              key={coin.id}
              className={cn(
                "flex  flex-col items-center justify-center rounded-[100px] px-4 py-6",
                "shadow-[outset_0_1px_12px_rgba(0,0,0,0.05)]",
                coin.pillBg
              )}
            >
              {/* Logo Icon */}
              <div
                className={cn(
                  "mb-4 flex h-10 w-10 items-center justify-center rounded-full",
                  coin.logoBg
                )}
              >
                {renderCryptoLogo(coin.id)}
              </div>

              {/* Numeric Value */}
              <p className={cn("text-2xl font-normal sm:text-2xl", coin.textColor)}>
                {coin.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
