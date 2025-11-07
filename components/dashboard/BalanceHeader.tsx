"use client";

import { useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { portfolioBalance } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

/**
 * BalanceHeader Component
 * MY BALANCE card matching the design
 * Shows balance, tabs, and search controls
 */
export default function BalanceHeader() {
  const [activeTab, setActiveTab] = useState("PORTFOLIO");

  /**
   * Formats currency value to USD format
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const tabs = [
    { id: "PORTFOLIO", label: "PORTFOLIO" },
    { id: "ASSETS", label: "ASSETS" },
    { id: "FUNDING", label: "FUNDING" },
    { id: "P2P", label: "P2P" },
  ];

  return (
    <ErrorBoundary>
      <div className="rounded-card p-6">
        {/* Header Section with Greeting and Controls */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Greeting */}
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Hi, Mafruh Faruqi
          </h1>

          {/* Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Dropdown */}
            <div className="relative w-full sm:w-auto sm:min-w-[200px]">
              <select className="w-full appearance-none rounded-lg border border-gray-400  px-4 py-2.5 pr-10 text-sm text-gray-400 transition-colors hover:border-[#4A4A6A] focus:outline-none focus:ring-2 focus:ring-[#ffe369]/20">
                <option>Weekly transaction analysis</option>
                <option>Monthly transaction analysis</option>
                <option>Yearly transaction analysis</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="h-4 w-4 text-[#B8B8D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-auto sm:min-w-[200px]">
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#B8B8D4]" />
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-lg border border-[#FFF] bg-[#FFF] py-2.5 pr-10 pl-4 text-sm text-gray-500 placeholder:text-[#8B8BA7] transition-colors hover:border-[#4A4A6A] focus:border-[#ffe369] focus:outline-none focus:ring-2 focus:ring-[#ffe369]/20"
              />
            </div>
          </div>
        </div>

        {/* MY BALANCE Section */}
        <div className="mb-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
            MY BALANCE
          </p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl font-semibold text-gray-600 sm:text-4xl">
              {formatCurrency(portfolioBalance.total)}
            </h2>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-gray-500">
                {formatCurrency(portfolioBalance.previousBalance)}
              </span>
            </div>
          </div>
        </div>

   
      </div>
    </ErrorBoundary>
  );
}
