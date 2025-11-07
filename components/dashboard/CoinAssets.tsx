"use client";

import { useState, useEffect } from "react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { coinAssets } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

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
      logoIcon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            x="12"
            y="18"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill="white"
            fontFamily="Arial, sans-serif"
          >
            ₿
          </text>
        </svg>
      ),
    },
    {
      id: "ethereum",
      symbol: "ETH",
      value: "16",
      pillBg: "bg-[#8B80F8]",
      textColor: "text-white",
      logoBg: "bg-transparent",
      logoIcon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L4.5 12.5L12 16L19.5 12.5L12 2Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 13.5L12 17L19.5 13.5L12 22L4.5 13.5Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <ErrorBoundary>
      <div className="relative rounded-card bg-[#f1f5fe] p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          {/* Title - Top Left */}
          <h3 className="text-sm font-medium uppercase tracking-wider text-[#4A4A4A]">
            COIN ASSET
          </h3>

          {/* Diamond Icon - Top Right */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E0E7FF]">
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
                {coin.logoIcon}
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
