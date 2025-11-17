"use client";

import { useState } from "react";
import { 
  Send, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  Star,
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  Plus
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

/**
 * P2P Transaction Interface
 */
interface P2PTransaction {
  id: string;
  type: "send" | "receive";
  contact: string;
  contactAvatar?: string;
  amount: number;
  currency: string;
  date: string;
  status: "completed" | "pending" | "cancelled";
  fee?: number;
}

/**
 * P2P Contact Interface
 */
interface P2PContact {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isFavorite: boolean;
  lastTransaction?: string;
}

/**
 * P2P Component Props
 */
interface P2PProps {
  period?: "daily" | "weekly" | "monthly" | "yearly";
}

/**
 * Generate P2P data based on period
 */
function generateP2PData(period: "daily" | "weekly" | "monthly" | "yearly") {
  const periodMultipliers = {
    daily: { transactions: 2, amount: 0.1 },
    weekly: { transactions: 8, amount: 0.5 },
    monthly: { transactions: 30, amount: 1 },
    yearly: { transactions: 365, amount: 12 },
  };

  const m = periodMultipliers[period];

  const periodLabels = {
    daily: "Today",
    weekly: "This Week",
    monthly: "This Month",
    yearly: "This Year",
  };

  // Sample contacts
  const contacts: P2PContact[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      username: "@sarahj",
      isFavorite: true,
      lastTransaction: "2 days ago",
    },
    {
      id: "2",
      name: "Michael Chen",
      username: "@mchen",
      isFavorite: true,
      lastTransaction: "5 days ago",
    },
    {
      id: "3",
      name: "Emma Davis",
      username: "@emmad",
      isFavorite: false,
      lastTransaction: "1 week ago",
    },
    {
      id: "4",
      name: "James Wilson",
      username: "@jwilson",
      isFavorite: false,
      lastTransaction: "2 weeks ago",
    },
  ];

  // Sample pending requests
  const pendingRequests: P2PTransaction[] = [
    {
      id: "pr1",
      type: "receive",
      contact: "Sarah Johnson",
      amount: 2500 * m.amount,
      currency: "USD",
      date: "2 hours ago",
      status: "pending",
    },
    {
      id: "pr2",
      type: "send",
      contact: "Michael Chen",
      amount: 1200 * m.amount,
      currency: "USD",
      date: "5 hours ago",
      status: "pending",
    },
  ];

  // Sample transaction history
  const transactions: P2PTransaction[] = [
    {
      id: "tx1",
      type: "send",
      contact: "Sarah Johnson",
      amount: 5000 * m.amount,
      currency: "BTC",
      date: "Jan 15, 2024",
      status: "completed",
      fee: 2.5,
    },
    {
      id: "tx2",
      type: "receive",
      contact: "Michael Chen",
      amount: 3500 * m.amount,
      currency: "ETH",
      date: "Jan 14, 2024",
      status: "completed",
      fee: 1.5,
    },
    {
      id: "tx3",
      type: "send",
      contact: "Emma Davis",
      amount: 1500 * m.amount,
      currency: "USD",
      date: "Jan 13, 2024",
      status: "completed",
      fee: 0.5,
    },
    {
      id: "tx4",
      type: "receive",
      contact: "James Wilson",
      amount: 2200 * m.amount,
      currency: "BTC",
      date: "Jan 12, 2024",
      status: "completed",
      fee: 1.0,
    },
    {
      id: "tx5",
      type: "send",
      contact: "Sarah Johnson",
      amount: 800 * m.amount,
      currency: "ETH",
      date: "Jan 11, 2024",
      status: "cancelled",
      fee: 0,
    },
    {
      id: "tx6",
      type: "receive",
      contact: "Michael Chen",
      amount: 4500 * m.amount,
      currency: "USD",
      date: "Jan 10, 2024",
      status: "completed",
      fee: 2.0,
    },
  ];

  const totalSent = transactions
    .filter((t) => t.type === "send" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceived = transactions
    .filter((t) => t.type === "receive" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    periodName: periodLabels[period],
    contacts,
    pendingRequests,
    transactions,
    totalSent,
    totalReceived,
    netFlow: totalReceived - totalSent,
  };
}

/**
 * P2P - Peer-to-peer transfer component
 * 
 * Features:
 * - Send and receive assets
 * - Pending requests management
 * - Transaction history
 * - Contacts and favorites
 * - Responsive design matching dashboard style
 */
export default function P2P({ period = "weekly" }: P2PProps) {
  const [activeView, setActiveView] = useState<"send" | "requests" | "history" | "contacts">("send");
  const [searchQuery, setSearchQuery] = useState("");
  
  const p2pData = generateP2PData(period);

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* P2P Overview Summary */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Total Sent */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
            <div className="mb-4 flex items-center gap-2">
              <div className="shrink-0">
                <ArrowUpCircle className="h-6 w-6 text-[#ff9500]" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Total Sent</h4>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Amount:
                </p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(p2pData.totalSent)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Period:
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {p2pData.periodName}
                </p>
              </div>
            </div>
          </div>

          {/* Total Received */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
            <div className="mb-4 flex items-center gap-2">
              <div className="shrink-0">
                <ArrowDownCircle className="h-6 w-6 text-[#ff9500]" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Total Received</h4>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Amount:
                </p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(p2pData.totalReceived)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Period:
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {p2pData.periodName}
                </p>
              </div>
            </div>
          </div>

          {/* Net Flow */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
            <div className="mb-4 flex items-center gap-2">
              <div className="shrink-0">
                <Send className="h-6 w-6 text-[#ff9500]" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Net Flow</h4>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Amount:
                </p>
                <p className={cn(
                  "text-sm font-bold",
                  p2pData.netFlow >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {formatCurrency(p2pData.netFlow)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Period:
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {p2pData.periodName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 overflow-scroll">
          <button
            onClick={() => setActiveView("send")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeView === "send"
                ? "bg-[#22243A] dark:bg-gray-700 text-[#ffe369] dark:text-yellow-400 shadow-md dark:shadow-dark-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            Send/Receive
          </button>
          <button
            onClick={() => setActiveView("requests")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeView === "requests"
                ? "bg-[#22243A] dark:bg-gray-700 text-[#ffe369] dark:text-yellow-400 shadow-md dark:shadow-dark-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            Pending Requests
          </button>
          <button
            onClick={() => setActiveView("history")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeView === "history"
                ? "bg-[#22243A] dark:bg-gray-700 text-[#ffe369] dark:text-yellow-400 shadow-md dark:shadow-dark-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            Transaction History
          </button>
          <button
            onClick={() => setActiveView("contacts")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeView === "contacts"
                ? "bg-[#22243A] dark:bg-gray-700 text-[#ffe369] dark:text-yellow-400 shadow-md dark:shadow-dark-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            Contacts
          </button>
        </div>

        {/* Send/Receive View */}
        {activeView === "send" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Send Form */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-dark-md">
              <div className="mb-4 flex items-center gap-3">
                <Send className="h-6 w-6 text-[#ff9500]" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Send Assets</h3>
              </div>
              
              <div className="space-y-4">
                {/* Recipient */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Recipient:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username or email"
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Amount:
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Currency:
                  </label>
                  <select className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20">
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>USD</option>
                    <option>XRP</option>
                    <option>ADA</option>
                  </select>
                </div>

                {/* Note */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Note (Optional):
                  </label>
                  <textarea
                    placeholder="Add a message..."
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                  />
                </div>

                {/* Send Button */}
                <button className="w-full rounded-lg bg-[#ff9500] dark:bg-[#ff9500] px-4 py-3 text-sm font-semibold text-white shadow-md dark:shadow-dark-sm transition-all hover:bg-[#e68500] dark:hover:bg-[#e68500] focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2 dark:focus:ring-offset-gray-800">
                  Send Now
                </button>
              </div>
            </div>

            {/* Quick Transfer */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-dark-md">
              <div className="mb-4 flex items-center gap-3">
                <Download className="h-6 w-6 text-[#ff9500]" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Request Payment</h3>
              </div>
              
              <div className="space-y-4">
                {/* From */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    From:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username or email"
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Amount:
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Currency:
                  </label>
                  <select className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20">
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>USD</option>
                    <option>XRP</option>
                    <option>ADA</option>
                  </select>
                </div>

                {/* Reason */}
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Reason (Optional):
                  </label>
                  <textarea
                    placeholder="What is this for?"
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                  />
                </div>

                {/* Request Button */}
                <button className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2">
                  Request Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Requests View */}
        {activeView === "requests" && (
          <div>
            <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
              Pending Requests - {p2pData.periodName}
            </h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {p2pData.pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-md dark:shadow-dark-md"
                >
                  {/* Header: Icon + Contact */}
                  <div className="mb-2 flex items-center gap-2">
                    <div className="shrink-0">
                      {request.type === "send" ? (
                        <Send className="h-6 w-6 text-[#ff9500]" />
                      ) : (
                        <Download className="h-6 w-6 text-[#ff9500]" />
                      )}
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <h4 className="text-lg font-bold capitalize text-gray-900 dark:text-white">
                        {request.type === "send" ? "Send to" : "Request from"} {request.contact}
                      </h4>
                      <span className="inline-block rounded-full bg-yellow-100 dark:bg-yellow-900 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:text-yellow-300">
                        pending
                      </span>
                    </div>
                  </div>

                  {/* Data Section */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Amount:
                      </p>
                      <p className={cn(
                        "text-sm font-bold",
                        request.type === "receive" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {request.type === "receive" ? "+" : "-"}
                        {formatCurrency(request.amount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Currency:
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {request.currency}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Time:
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {request.date}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 rounded-lg bg-green-600 dark:bg-green-700 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-700 dark:hover:bg-green-600 shadow-md dark:shadow-dark-sm">
                      Approve
                    </button>
                    <button className="flex-1 rounded-lg bg-red-600 dark:bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 dark:hover:bg-red-600 shadow-md dark:shadow-dark-sm">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {p2pData.pendingRequests.length === 0 && (
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center shadow-md dark:shadow-dark-md">
                <Clock className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No pending requests</p>
              </div>
            )}
          </div>
        )}

        {/* Transaction History View */}
        {activeView === "history" && (
          <div>
            <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
              P2P Transaction History - {p2pData.periodName}
            </h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {p2pData.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="cursor-pointer rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-6 shadow-md dark:shadow-dark-md transition-all duration-300 hover:shadow-xl dark:hover:shadow-dark-lg"
                >
                  {/* Header: Icon + Type + Status */}
                  <div className="mb-2 flex items-center gap-2">
                    <div className="shrink-0">
                      {tx.type === "send" ? (
                        <Send className="h-6 w-6 text-[#ff9500]" />
                      ) : (
                        <Download className="h-6 w-6 text-[#ff9500]" />
                      )}
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                      <h4 className="text-lg font-bold capitalize text-gray-900 dark:text-white">
                        {tx.type} - {tx.contact}
                      </h4>
                      <span className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                        tx.status === "completed" && "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
                        tx.status === "pending" && "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
                        tx.status === "cancelled" && "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                      )}>
                        {tx.status}
                      </span>
                    </div>
                  </div>

                  {/* Data Section */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Amount:
                      </p>
                      <p className={cn(
                        "text-sm font-bold",
                        tx.type === "receive" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {tx.type === "receive" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Currency:
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {tx.currency}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Date:
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {tx.date}
                      </p>
                    </div>

                    {tx.fee !== undefined && tx.fee > 0 && (
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Fee:
                        </p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          ${tx.fee.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts View */}
        {activeView === "contacts" && (
          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contacts</h3>
              
              {/* Search Bar */}
              <div className="relative flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                />
              </div>

              {/* Add Contact Button */}
              <button className="flex items-center gap-2 rounded-lg bg-[#ff9500] px-4 py-2 text-sm font-semibold text-white shadow-md dark:shadow-dark-sm transition-all hover:bg-[#e68500]">
                <Plus className="h-4 w-4" />
                Add Contact
              </button>
            </div>

            {/* Favorites Section */}
            <div className="mb-6">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Favorites
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {p2pData.contacts
                  .filter((contact) => contact.isFavorite)
                  .map((contact) => (
                    <div
                      key={contact.id}
                      className="cursor-pointer rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md transition-all hover:shadow-xl dark:hover:shadow-dark-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff9500] text-white">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900 dark:text-white">{contact.name}</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{contact.username}</p>
                        </div>
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      </div>
                      {contact.lastTransaction && (
                        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                          Last: {contact.lastTransaction}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* All Contacts Section */}
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                All Contacts
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {p2pData.contacts
                  .filter((contact) => !contact.isFavorite)
                  .filter((contact) => 
                    searchQuery === "" || 
                    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((contact) => (
                    <div
                      key={contact.id}
                      className="cursor-pointer rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md transition-all hover:shadow-xl dark:hover:shadow-dark-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-900 dark:text-white">{contact.name}</h5>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{contact.username}</p>
                        </div>
                        <Star className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                      </div>
                      {contact.lastTransaction && (
                        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                          Last: {contact.lastTransaction}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Export interface
export type { P2PProps, P2PTransaction, P2PContact };




