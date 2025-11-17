"use client";

import { useState, useMemo } from "react";
import { Check, X as XIcon, Eye, ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { requests } from "@/lib/dummy-data";
import { Request } from "@/types";

/**
 * Transaction data interface
 * 
 * @property {string} id - Unique transaction identifier
 * @property {string} icon - Crypto icon identifier (BTC, ETH, LTC)
 * @property {string} iconBg - Background color for the icon
 * @property {string} date - Transaction date (e.g., "Jan 5")
 * @property {string} address - Truncated wallet address
 * @property {string} amount - Transaction amount
 * @property {string} currency - Currency symbol (BTC, ETH, LTE)
 */
interface TransactionItem {
  id: string;
  icon: string;
  iconBg: string;
  date: string;
  address: string;
  amount: string;
  currency: string;
}

/**
 * RecentTransactions Component Props
 * 
 * @property {TransactionItem[]} transactions - Array of transaction data (optional, defaults to sample data)
 * @property {(tab: string) => void} onTabChange - Callback when tab is changed (optional)
 * @property {(transaction: TransactionItem) => void} onRowClick - Callback when transaction row is clicked (optional)
 * @property {(request: Request) => void} onRequestAccept - Callback when request is accepted (optional)
 * @property {(request: Request) => void} onRequestDecline - Callback when request is declined (optional)
 * @property {(request: Request) => void} onRequestView - Callback when request details are viewed (optional)
 */
interface RecentTransactionsProps {
  transactions?: TransactionItem[];
  onTabChange?: (tab: string) => void;
  onRowClick?: (transaction: TransactionItem) => void;
  onRequestAccept?: (request: Request) => void;
  onRequestDecline?: (request: Request) => void;
  onRequestView?: (request: Request) => void;
}

// Default sample transactions with multiple cryptocurrencies
const defaultTransactions: TransactionItem[] = [
  {
    id: "1",
    icon: "₿",
    iconBg: "#F7931A",
    date: "Jan 5",
    address: "cbshbcba...",
    amount: "000000000000.12",
    currency: "BTC"
  },
  {
    id: "2",
    icon: "◆",
    iconBg: "#4CAF50",
    date: "Jan 5",
    address: "cbshbcba...",
    amount: "000000000000.1",
    currency: "ETH"
  },
  {
    id: "3",
    icon: "X",
    iconBg: "#23292F",
    date: "Jan 6",
    address: "rXrpAddr...",
    amount: "1500.00",
    currency: "XRP"
  },
  {
    id: "4",
    icon: "Ł",
    iconBg: "#345D9D",
    date: "Jan 7",
    address: "cbshbcba...",
    amount: "000000000000.12",
    currency: "LTC"
  },
];

/**
 * Format relative time
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
}

/**
 * Get sender initials for avatar
 */
function getInitials(name: string): string {
  if (name === "You") return "YO";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * RecentTransactions - Modern transaction list component with Requests tab
 * 
 * Features:
 * - Card with rounded corners and subtle shadow (adapts to light/dark mode)
 * - Two tabs: "RECENT TRANSACTIONS" and "REQUESTS"
 * - Transaction list with crypto icons, dates, addresses, amounts
 * - Requests list matching inbox message style with avatar, title, description, timestamp
 * - Accept/Decline actions for requests
 * - Filter dropdown for requests (All, Incoming, Outgoing, Completed)
 * - Interactive rows with hover effects
 * - Full dark mode support
 * - Keyboard accessible
 * - Fully responsive design
 * - ARIA labels for screen readers
 */
export default function RecentTransactions({
  transactions = defaultTransactions,
  onTabChange,
  onRowClick,
  onRequestAccept,
  onRequestDecline,
  onRequestView,
}: RecentTransactionsProps = {}) {
  const [activeTab, setActiveTab] = useState("RECENT TRANSACTIONS");
  const [localRequests, setLocalRequests] = useState<Request[]>(requests);
  const [requestFilter, setRequestFilter] = useState<"all" | "incoming" | "outgoing" | "completed">("all");

  /**
   * Handles tab click with callback
   */
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  /**
   * Handles transaction row click with callback
   */
  const handleRowClick = (transaction: TransactionItem) => {
    if (onRowClick) {
      onRowClick(transaction);
    }
  };

  /**
   * Handles keyboard navigation for rows
   */
  const handleRowKeyDown = (e: React.KeyboardEvent, transaction: TransactionItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRowClick(transaction);
    }
  };

  /**
   * Handle request accept
   */
  const handleRequestAccept = (request: Request, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: "completed" as const } : r))
    );
    if (onRequestAccept) {
      onRequestAccept(request);
    }
  };

  /**
   * Handle request decline
   */
  const handleRequestDecline = (request: Request, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalRequests((prev) =>
      prev.map((r) => (r.id === request.id ? { ...r, status: "declined" as const } : r))
    );
    if (onRequestDecline) {
      onRequestDecline(request);
    }
  };

  /**
   * Handle request view details
   */
  const handleRequestView = (request: Request) => {
    if (onRequestView) {
      onRequestView(request);
    }
  };

  /**
   * Filter requests based on selected filter
   */
  const filteredRequests = useMemo(() => {
    let filtered = localRequests;
    
    if (requestFilter === "incoming") {
      filtered = filtered.filter((r) => r.type === "incoming");
    } else if (requestFilter === "outgoing") {
      filtered = filtered.filter((r) => r.type === "outgoing");
    } else if (requestFilter === "completed") {
      filtered = filtered.filter((r) => r.status === "completed" || r.status === "declined");
    }
    
    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [localRequests, requestFilter]);

  /**
   * Get pending requests count - memoized to ensure reactivity
   */
  const pendingCount = useMemo(() => {
    return localRequests.filter((r) => r.status === "pending").length;
  }, [localRequests]);

  const tabs = ["RECENT TRANSACTIONS", "REQUESTS"];

  return (
    <ErrorBoundary>
      <div 
        className="rounded-2xl bg-[#F5F7FA] dark:bg-gray-800 p-3 sm:p-6 shadow-lg dark:shadow-gray-900/50"
        role="region"
        aria-label="Recent transactions and requests"
      >
        {/* Tabs */}
        <div className="mb-6 flex sm:gap-4" role="tablist">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${tab.toLowerCase().replace(/\s+/g, '-')}-panel`}
                tabIndex={isActive ? 0 : -1}
                className={cn(
                  "rounded-full px-1 py-1 sm:px-5 sm:py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800",
                  isActive
                    ? "bg-white dark:bg-gray-700 text-[#3A4060] dark:text-white shadow-md dark:shadow-gray-900/50"
                    : "text-[#8E9BAF] dark:text-gray-400 hover:text-[#3A4060] dark:hover:text-gray-200"
                )}
              >
                {tab}
                {tab === "REQUESTS" && pendingCount > 0 && (
                  <span className="ml-2 rounded-full bg-[#ff9500] px-2 py-0.5 text-[10px] font-bold text-white">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Transaction List */}
        {activeTab === "RECENT TRANSACTIONS" && (
        <div 
          className="space-y-4 overflow-y-auto"
          role="list"
          aria-label="Transaction list"
          style={{ maxHeight: '500px' }}
        >
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              onClick={() => handleRowClick(transaction)}
              onKeyDown={(e) => handleRowKeyDown(e, transaction)}
              role="listitem"
              tabIndex={0}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-xl p-1 sm:p-4 transition-all duration-200",
                "hover:bg-white/80 dark:hover:bg-gray-700/50 hover:shadow-sm dark:hover:shadow-gray-900/30",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50"
              )}
              aria-label={`Transaction ${transaction.currency} ${transaction.amount} on ${transaction.date}`}
            >
              {/* Left Side: Icon + Date/Address Stack */}
              <div className="flex items-center gap-4">
                {/* Crypto Icon */}
                <div
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  {transaction.currency === "BTC" && (
                    <svg
                      width="48"
                      height="48"
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

                  {transaction.currency === "ETH" && (
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 256 417"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
                        fill="#4CAF50"
                        fillOpacity="0.8"
                      />
                      <path
                        d="M127.962 0L0 212.32l127.962 75.639V154.158z"
                        fill="#4CAF50"
                      />
                      <path
                        d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"
                        fill="#4CAF50"
                        fillOpacity="0.8"
                      />
                      <path
                        d="M127.962 416.905v-104.72L0 236.585z"
                        fill="#4CAF50"
                      />
                      <path
                        d="M127.961 287.958l127.96-75.637-127.96-58.162z"
                        fill="#4CAF50"
                        fillOpacity="0.5"
                      />
                      <path
                        d="M0 212.32l127.96 75.638v-133.8z"
                        fill="#4CAF50"
                        fillOpacity="0.7"
                      />
                    </svg>
                  )}

                  {transaction.currency !== "BTC" && transaction.currency !== "ETH" && (
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl shadow-sm"
                      style={{ backgroundColor: transaction.iconBg }}
                    >
                      <span className="text-lg font-bold text-white">
                        {transaction.icon}
                      </span>
                    </div>
                  )}
                </div>

                {/* Date and Address Stack */}
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-[#3A4060] dark:text-white">
                    {transaction.date}
                  </p>
                  <p className="text-xs text-[#8E9BAF] dark:text-gray-400">
                    {transaction.address}
                  </p>
                </div>
              </div>

              {/* Right Side: Amount + Currency */}
              <div className="flex items-baseline gap-1.5 text-right">
                <p className="text-sm font-bold text-[#3A4060] dark:text-white">
                  {transaction.amount}
                </p>
                <p className="text-xs text-[#8E9BAF] dark:text-gray-400">
                  {transaction.currency}
                </p>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Requests List */}
        {activeTab === "REQUESTS" && (
          <div role="region" aria-label="Requests list">
            {/* Filter Dropdown */}
            <div className="mb-4">
              <div className="relative">
                <select
                  value={requestFilter}
                  onChange={(e) => setRequestFilter(e.target.value as typeof requestFilter)}
                  className="appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2.5 pr-10 text-sm text-gray-700 dark:text-gray-200 shadow-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                >
                  <option value="all">All</option>
                  <option value="incoming">Incoming</option>
                  <option value="outgoing">Outgoing</option>
                  <option value="completed">Completed</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="h-4 w-4 text-[#ff9500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Requests List */}
            <div 
              className="space-y-2 overflow-y-auto"
              role="list"
              aria-label="Requests list"
              style={{ maxHeight: '500px' }}
            >
              {filteredRequests.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    <ArrowDown className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    No pending requests
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    {requestFilter === "all" 
                      ? "You don't have any requests at the moment"
                      : `No ${requestFilter} requests found`}
                  </p>
                </div>
              ) : (
                filteredRequests.map((request) => {
                  const isPending = request.status === "pending";
                  const isIncoming = request.type === "incoming";
                  
                  return (
                    <div
                      key={request.id}
                      onClick={() => handleRequestView(request)}
                      className={cn(
                        "cursor-pointer rounded-xl p-1 sm:p-4 transition-all duration-200",
                        "hover:bg-white/80 dark:hover:bg-gray-700/50 hover:shadow-sm dark:hover:shadow-gray-900/30",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50"
                      )}
                      role="listitem"
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar or Coin Icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#22243A] dark:bg-gray-700 text-sm font-semibold text-[#ffe369] dark:text-yellow-400">
                          {request.senderAvatar ? (
                            <img
                              src={request.senderAvatar}
                              alt={request.sender}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <span>{getInitials(request.sender)}</span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                  {request.sender}
                                </p>
                                {isPending && (
                                  <div className="h-2 w-2 shrink-0 rounded-full bg-[#ff9500]" />
                                )}
                                {isIncoming && (
                                  <ArrowDown className="h-3 w-3 text-green-500" />
                                )}
                                {!isIncoming && (
                                  <ArrowUp className="h-3 w-3 text-blue-500" />
                                )}
                              </div>
                              <p className="mt-1 truncate text-sm font-medium text-gray-900 dark:text-white">
                                {request.description}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatRelativeTime(request.timestamp)}
                                </p>
                                <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  {request.amount} {request.currency}
                                </p>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              {isPending ? (
                                <div className="flex items-center gap-2">
                                  {isIncoming && (
                                    <>
                                      <button
                                        onClick={(e) => handleRequestAccept(request, e)}
                                        className="rounded-lg bg-green-500 p-1.5 text-white transition-colors hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                        title="Accept"
                                        aria-label="Accept request"
                                      >
                                        <Check className="h-4 w-4" />
                                      </button>
                                      <button
                                        onClick={(e) => handleRequestDecline(request, e)}
                                        className="rounded-lg bg-red-500 p-1.5 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                        title="Decline"
                                        aria-label="Decline request"
                                      >
                                        <XIcon className="h-4 w-4" />
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRequestView(request);
                                    }}
                                    className="rounded-lg bg-gray-200 dark:bg-gray-600 p-1.5 text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                                    title="View Details"
                                    aria-label="View request details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  className={cn(
                                    "rounded-full px-2.5 py-1 text-xs font-medium",
                                    request.status === "completed"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                  )}
                                >
                                  {request.status === "completed" ? "Completed" : "Declined"}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Export the interface for external use
export type { TransactionItem, RecentTransactionsProps };
