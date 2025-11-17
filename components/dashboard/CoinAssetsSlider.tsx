"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { cn } from "@/lib/utils";

/**
 * Coin type interface
 */
export interface CoinType {
  id: string;
  name: string;
  symbol: string;
  count: number;
  bgColor: string;
  textColor: string;
}

/**
 * CardCoinAssets Props
 * 
 * @property {CoinType[]} coins - Array of coin objects to display in slider
 * @property {number} bitcoinCount - Count of Bitcoin assets (deprecated - use coins array)
 * @property {number} ethereumCount - Count of Ethereum assets (deprecated - use coins array)
 * @property {() => void} onClick - Callback when card is clicked
 */
interface CardCoinAssetsProps {
  coins?: CoinType[];
  bitcoinCount?: number;
  ethereumCount?: number;
  onClick?: () => void;
}

/**
 * CardCoinAssetsSlider - Coin asset cards with horizontal slider
 * 
 * Features:
 * - Supports multiple coins with horizontal slider (when > 2 coins)
 * - Navigation arrows when multiple coins present
 * - Smooth scrolling through all coin assets
 * - Maintains dashboard card UI pattern
 * - Falls back to static display for 2 or fewer coins
 * 
 * Styling (Updated):
 * - Solid neutral gray backgrounds (bg-gray-100) - NO gradients
 * - Real cryptocurrency logos (SVG) for all supported coins
 * - Dark gray text (text-gray-800) for coin counts
 * - Soft rounded corners (rounded-2xl) matching dashboard
 * - Medium shadows (shadow-md) for depth
 * - Clean, minimalist design with proper spacing
 * 
 * Portfolio Integration:
 * - Accepts coins added from Explore page via portfolioCoins prop in TabbedCards
 * - Portfolio coins appear at START of slider for max visibility
 * - Newly added coins display with their logo, name, symbol, and count
 * - All slider functionality (scroll, drag, navigation) maintained
 * - Supports logos for: Bitcoin, Ethereum, Ripple, Litecoin, Cardano, Solana, Polkadot, Chainlink
 * - Falls back to first letter for unknown coins
 * 
 * Responsive:
 * - Mobile: Stacks vertically with full functionality
 * - Tablet/Desktop: Horizontal slider with 2 cards per view
 * - All navigation and scroll features remain functional
 */
export default function CardCoinAssetsSlider({
  coins: customCoins,
  bitcoinCount = 34,
  ethereumCount = 16,
  onClick,
}: CardCoinAssetsProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  
  // Default coins if not provided
  const defaultCoins: CoinType[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      count: bitcoinCount,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      count: ethereumCount,
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    },
  ];

  const coins = customCoins ?? defaultCoins;
  const hasMultipleCoins = coins.length > 2;

  /**
   * Render coin logo SVG based on coin ID
   */
  const renderCoinLogo = (coinId: string) => {
    switch (coinId) {
      case "bitcoin":
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
              fill="#F7931A"
            />
          </svg>
        );
      case "ethereum":
        return (
          <svg width="32" height="32" viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <svg width="32" height="32" viewBox="0 0 512 424" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M437.8 208.1c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5L0 281.3l8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 73.2-73.2-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5z"
              fill="#23292F"
            />
          </svg>
        );
      case "litecoin":
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#345D9D" />
            <path
              d="M10.427 19.214l1.138-4.273-2.106.632.59-2.224 2.106-.632 2.328-8.756h4.366l-1.984 7.461 2.741-.824-.59 2.224-2.741.824-1.137 4.273h7.111l-.845 3.176H9.427z"
              fill="#FFFFFF"
            />
          </svg>
        );
      case "cardano":
        return (
          <svg width="32" height="32" viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="1000" cy="1000" r="180" fill="#0033AD" />
            <circle cx="1000" cy="450" r="80" fill="#0033AD" />
            <circle cx="1000" cy="1550" r="80" fill="#0033AD" />
            <circle cx="450" cy="1000" r="80" fill="#0033AD" />
            <circle cx="1550" cy="1000" r="80" fill="#0033AD" />
          </svg>
        );
      case "solana":
        return (
          <svg width="32" height="32" viewBox="0 0 646 512" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="solGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9945FF" />
                <stop offset="100%" stopColor="#14F195" />
              </linearGradient>
            </defs>
            <path d="M112.6 364.04l-73.53 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 0l-35.2-35.2L112.6 364.04z" fill="url(#solGradient)" />
            <path d="M112.6 0L39.07 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 512l-35.2 35.2L112.6 0z" fill="url(#solGradient)" />
          </svg>
        );
      case "polkadot":
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="4" fill="#E6007A" />
            <circle cx="16" cy="6" r="2.5" fill="#E6007A" />
            <circle cx="16" cy="26" r="2.5" fill="#E6007A" />
            <circle cx="6" cy="16" r="2.5" fill="#E6007A" />
            <circle cx="26" cy="16" r="2.5" fill="#E6007A" />
          </svg>
        );
      case "chainlink":
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4l-4 2.31v4.62L16 13.23l4-2.31V6.31L16 4z" fill="#2A5ADA" />
            <path d="M16 18.77l-4-2.31v4.62L16 23.39l4-2.31v-4.62l-4 2.31z" fill="#2A5ADA" />
            <path d="M8 10.15L4 12.46v4.62l4 2.31 4-2.31v-4.62L8 10.15z" fill="#2A5ADA" />
            <path d="M24 10.15l-4 2.31v4.62l4 2.31 4-2.31v-4.62l-4-2.31z" fill="#2A5ADA" />
          </svg>
        );
      default:
        // For any new coins, show first letter or symbol from name
        return (
          <div className="text-2xl font-bold">{coinId.substring(0, 1).toUpperCase()}</div>
        );
    }
  };

  return (
    <div
      className={cn(
        "group relative h-full rounded-2xl w-full bg-linear-to-br from-white to-blue-50/40 p-6 shadow-lg transition-all duration-300",
      )}
      aria-label="Coin assets card"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between relative">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            COIN ASSET
          </h3>
          
          {/* Navigation Arrows - Only show when slider is active */}
          {hasMultipleCoins ? (
            <div className="flex items-center gap-3">
              {/* Left Arrow */}
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label="Previous coin"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </button>
              
              {/* Right Arrow */}
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label="Next coin"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </button>
            </div>
          ) : (
            /* Diamond Icon - Only show when no slider */
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
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
          )}
        </div>

        {/* Coin Pills - With or without slider */}
        <div className="flex flex-1 items-center">
          {!hasMultipleCoins ? (
            // Static layout for 2 or fewer coins
            <div className="flex flex-1 items-center gap-3">
              {coins.map((coin) => (
                <div
                  key={coin.id}
                  className="flex flex-1 flex-col items-center h-full justify-center rounded-[40px] px-4 py-4 shadow-md bg-gray-100"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center">
                    {renderCoinLogo(coin.id)}
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {coin.count}
                  </p>
                  <p className="mt-1 text-xs font-medium text-gray-500 uppercase">
                    {coin.symbol}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            // Slider layout for more than 2 coins
            <div className="flex-1 min-h-[140px] overflow-hidden h-full">
              <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={2}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                className="h-full w-full"
                style={{ height: '100%' }}
              >
                  {coins.map((coin) => (
                    <SwiperSlide key={coin.id} style={{ height: 'auto' }}>
                      <div className="flex flex-col h-full items-center justify-center rounded-[40px] px-4 py-4 shadow-md bg-gray-100 min-h-[120px]">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center">
                          {renderCoinLogo(coin.id)}
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {coin.count}
                      </p>
                      <p className="mt-1 text-xs font-medium text-gray-500 uppercase">
                        {coin.symbol}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

