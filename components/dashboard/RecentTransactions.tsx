"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { recentTransactions } from "@/lib/dummy-data";
import { Transaction } from "@/types";

/**
 * RecentTransactions Component
 * Sidebar transaction list matching the design
 * Shows tabs for RECENT TRANSACTIONS and REQUESTS
 */
export default function RecentTransactions() {
  const [activeTab, setActiveTab] = useState("RECENT TRANSACTIONS");

  /**
   * Groups transactions by date
   */
  const groupByDate = (transactions: Transaction[]): { [key: string]: Transaction[] } => {
    const grouped: { [key: string]: Transaction[] } = {};
    
    transactions.forEach((transaction) => {
      if (!grouped[transaction.date]) {
        grouped[transaction.date] = [];
      }
      grouped[transaction.date].push(transaction);
    });
    
    return grouped;
  };

  /**
   * Formats date string for display (e.g., "Jan 5")
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  /**
   * Gets coin color class based on coin symbol
   */
  const getCoinColorClass = (coin: string): string => {
    if (coin === "BTC") return "bg-bitcoin";
    if (coin === "ETH") return "bg-ethereum";
    return "bg-blue-500";
  };

  const groupedTransactions = groupByDate(recentTransactions);
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const tabs = ["RECENT TRANSACTIONS", "REQUESTS"];

  return (
    <ErrorBoundary>
      <div className="rounded-card bg-[#2C2C4A] p-6 shadow-card">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-[#3A3A5A]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors duration-200",
                  isActive
                    ? "border-b-2 border-[#ffe369] bg-[#3A3A5A] text-white"
                    : "text-[#B8B8D4] hover:text-white hover:bg-[#3A3A5A]/50"
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Transaction List */}
        <div className="max-h-[600px] space-y-4 overflow-y-auto">
          {sortedDates.map((date) => (
            <div key={date}>
              {/* Date Header */}
              <h4 className="mb-3 text-xs uppercase text-[#B8B8D4]">
                {formatDate(date)}
              </h4>

              {/* Transaction Items */}
              <div className="space-y-3">
                {groupedTransactions[date].map((transaction) => {
                  const coinColorClass = getCoinColorClass(transaction.coin);
                  
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-[#3A3A5A]"
                    >
                      {/* Coin Icon Circle */}
                      <div
                        className={cn(
                          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
                          coinColorClass
                        )}
                      >
                        <span className="text-xs font-semibold text-white">
                          {transaction.coin.substring(0, 1)}
                        </span>
                      </div>

                      {/* Transaction Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#B8B8D4]">
                          {transaction.accountNumber || "cbshbcba"}
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">
                          {transaction.amount.toFixed(12)} {transaction.coin}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
