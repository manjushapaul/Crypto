"use client";

import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, ArrowDownCircle, ArrowUpCircle, DollarSign, Wallet } from "lucide-react";
import { cn, formatCurrency, formatCompactNumber } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

/**
 * Funding transaction interface
 */
interface FundingTransaction {
  id: string;
  type: "deposit" | "withdrawal" | "topup";
  date: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed";
  method: string;
}

/**
 * Funding Props
 */
interface FundingProps {
  period?: "daily" | "weekly" | "monthly" | "yearly";
}

/**
 * Generate period-based funding data
 */
function generateFundingData(period: "daily" | "weekly" | "monthly" | "yearly") {
  const dataPoints: Record<string, number> = {
    daily: 24,
    weekly: 7,
    monthly: 30,
    yearly: 12,
  };

  const baseAmounts: Record<string, { deposit: number; withdrawal: number; topup: number }> = {
    daily: { deposit: 5000, withdrawal: 3000, topup: 2000 },
    weekly: { deposit: 35000, withdrawal: 18000, topup: 12000 },
    monthly: { deposit: 150000, withdrawal: 85000, topup: 45000 },
    yearly: { deposit: 1800000, withdrawal: 950000, topup: 520000 },
  };

  const labels: Record<string, string[]> = {
    daily: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    monthly: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    yearly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  };

  const count = dataPoints[period];
  const base = baseAmounts[period];
  const periodLabels = labels[period];

  // Generate chart data
  const chartData = Array.from({ length: count }, (_, i) => ({
    label: periodLabels[i],
    deposits: base.deposit * (0.7 + Math.random() * 0.6),
    withdrawals: base.withdrawal * (0.6 + Math.random() * 0.8),
    topups: base.topup * (0.5 + Math.random() * 1.0),
  }));

  // Calculate totals
  const totalDeposits = chartData.reduce((sum, d) => sum + d.deposits, 0);
  const totalWithdrawals = chartData.reduce((sum, d) => sum + d.withdrawals, 0);
  const totalTopups = chartData.reduce((sum, d) => sum + d.topups, 0);
  const netFunding = totalDeposits + totalTopups - totalWithdrawals;

  // Generate recent transactions
  const transactionCount: Record<string, number> = {
    daily: 5,
    weekly: 12,
    monthly: 25,
    yearly: 150,
  };

  const transactions: FundingTransaction[] = Array.from(
    { length: Math.min(transactionCount[period], 8) },
    (_, i) => {
      const types: ("deposit" | "withdrawal" | "topup")[] = ["deposit", "withdrawal", "topup"];
      const type = types[Math.floor(Math.random() * types.length)];
      const currencies = ["USD", "BTC", "ETH", "USDT"];
      const methods = ["Bank Transfer", "Credit Card", "Crypto Transfer", "Wire Transfer"];
      
      return {
        id: `tx-${i}`,
        type,
        date: `${Math.floor(Math.random() * 28) + 1} ${["Jan", "Feb", "Mar"][Math.floor(Math.random() * 3)]} 2024`,
        amount: Math.random() * base[type],
        currency: currencies[Math.floor(Math.random() * currencies.length)],
        status: i === 0 && Math.random() > 0.7 ? "pending" : "completed",
        method: methods[Math.floor(Math.random() * methods.length)],
      };
    }
  );

  const periodNames: Record<string, string> = {
    daily: "Today",
    weekly: "This Week",
    monthly: "This Month",
    yearly: "This Year",
  };

  const comparisonNames: Record<string, string> = {
    daily: "yesterday",
    weekly: "last week",
    monthly: "last month",
    yearly: "last year",
  };

  return {
    totalDeposits,
    totalWithdrawals,
    totalTopups,
    netFunding,
    chartData,
    transactions,
    periodName: periodNames[period],
    comparisonName: comparisonNames[period],
    depositTrend: 12.5 + Math.random() * 10,
    withdrawalTrend: -5.2 + Math.random() * 8,
    netTrend: 8.3 + Math.random() * 12,
  };
}

/**
 * Funding - Funding activity dashboard
 * 
 * Features:
 * - Deposits, Withdrawals, Top-ups summary
 * - Period-based funding charts
 * - Recent funding transactions
 * - Dynamic updates based on timeframe
 */
export default function Funding({ period = "weekly" }: FundingProps) {
  const [activeView, setActiveView] = useState<"overview" | "transactions" | "chart">("overview");
  
  /**
   * Generate funding data based on period
   * Memoized to prevent regenerating random values on every render
   * Only regenerates when period actually changes
   * 
   * BUG FIX: Previously, clicking notifications caused re-renders which
   * regenerated random data, making funding values change unexpectedly.
   * useMemo ensures data only changes when period prop changes.
   */
  const fundingData = useMemo(
    () => generateFundingData(period),
    [period]
  );

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Period Comparison Summary - Funding Performance Card */}
        <div className="">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Funding Performance - {fundingData.periodName}
              </p>
              <h3 className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(fundingData.netFunding)}
              </h3>
             
              <div className="flex items-center gap-2 py-2">
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 pr-5">
                Net funding compared to {fundingData.comparisonName}
              </p>
              {fundingData.netTrend >= 0 ? (
                <>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-normal font-normal text-green-500">
                    +{fundingData.netTrend.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <span className="text-normal font-normal text-red-500">
                    {fundingData.netTrend.toFixed(1)}%
                  </span>
                </>
              )}
            </div>
            </div>
            
          </div>
        </div>

        {/* Summary Cards - Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Total Deposits Card */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
            {/* Header: Icon + Title */}
            <div className="mb-4 flex items-center gap-2">
              <div className="shrink-0">
                <ArrowDownCircle className="h-6 w-6 text-[#ff9500]" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Total Deposits</h4>
              </div>
            </div>

            {/* Data Section */}
            <div className="space-y-1">
              {/* Amount */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Amount:
                </p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(fundingData.totalDeposits)}
                </p>
              </div>

              {/* Period */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Period:
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {fundingData.periodName}
                </p>
              </div>

              {/* Trend */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Change:
                </p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                  <p className="text-sm font-bold text-green-500 dark:text-green-400">
                    +{fundingData.depositTrend.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Withdrawals Card */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
            {/* Header: Icon + Title */}
            <div className="mb-4 flex items-center gap-2">
              <div className="shrink-0">
                <ArrowUpCircle className="h-6 w-6 text-[#ff9500]" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Total Withdrawals</h4>
              </div>
            </div>

            {/* Data Section */}
            <div className="space-y-1">
              {/* Amount */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Amount:
                </p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(fundingData.totalWithdrawals)}
                </p>
              </div>

              {/* Period */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Period:
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {fundingData.periodName}
                </p>
              </div>

              {/* Trend */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Change:
                </p>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                  <p className="text-sm font-bold text-red-500 dark:text-red-400">
                    {fundingData.withdrawalTrend.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Net Funding Card */}
          <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
            {/* Header: Icon + Title */}
            <div className="mb-4 flex items-center gap-2">
              <div className="shrink-0">
                <Wallet className="h-6 w-6 text-[#ff9500]" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Net Funding</h4>
              </div>
            </div>

            {/* Data Section */}
            <div className="space-y-1">
              {/* Amount */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Amount:
                </p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {formatCurrency(fundingData.netFunding)}
                </p>
              </div>

              {/* Period */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Period:
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {fundingData.periodName}
                </p>
              </div>

              {/* Trend */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Change:
                </p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
                  <p className="text-sm font-bold text-purple-500 dark:text-purple-400">
                    +{fundingData.netTrend.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView("overview")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeView === "overview"
                ? "bg-[#22243A] dark:bg-gray-700 text-[#ffe369] dark:text-yellow-400 shadow-md dark:shadow-dark-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView("transactions")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeView === "transactions"
                ? "bg-[#22243A] dark:bg-gray-700 text-[#ffe369] dark:text-yellow-400 shadow-md dark:shadow-dark-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            Recent Transactions
          </button>
          <button
            onClick={() => setActiveView("chart")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all",
              activeView === "chart"
                ? "bg-[#22243A] dark:bg-gray-700 text-[#ffe369] dark:text-yellow-400 shadow-md dark:shadow-dark-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            Funding Chart
          </button>
        </div>

        {/* Overview View */}
        {activeView === "overview" && (
          <div className="space-y-6">
            {/* Funding Breakdown */}
            <div className="rounded-xl border border-gray-800 bg-[#2A2D3A] p-3 sm:p-6 shadow-md overflow-visible">
              <h3 className="mb-4 text-lg font-bold text-white">Funding Breakdown</h3>
              <div className="w-full h-[200px] sm:h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fundingData.chartData}>
                  <defs>
                    <linearGradient id="fundingDepositGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF9500" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#FFE369" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fundingWithdrawalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="label" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} tickFormatter={(val) => formatCompactNumber(val)} />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: '1px solid #374151', 
                      backgroundColor: '#1F2937',
                      color: '#F3F4F6',
                      fontSize: '12px'
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                    labelStyle={{ color: '#F3F4F6', fontSize: '11px' }}
                    itemStyle={{ color: '#FFE369', fontSize: '11px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="deposits" 
                    stroke="#FF9500" 
                    strokeWidth={1} 
                    fill="url(#fundingDepositGradient)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="withdrawals" 
                    stroke="#EF4444" 
                    strokeWidth={1} 
                    fill="url(#fundingWithdrawalGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
              </div>
            </div>

            {/* Funding Stats */}
            <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-6 shadow-md dark:shadow-dark-md">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Statistics - {fundingData.periodName}</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Avg. Deposit */}
                <div className="flex items-center rounded-lg p-4">
                <ArrowDownCircle className="h-6 w-6 text-[#ff9500] mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Deposit</p>
                    <p className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(fundingData.totalDeposits / fundingData.chartData.length)}
                    </p>
                  </div>
                 
                </div>

                {/* Avg. Withdrawal */}
                <div className="flex items-center rounded-lg p-4">
                <ArrowUpCircle className="h-6 w-6 text-[#ff9500] mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Withdrawal</p>
                    <p className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(fundingData.totalWithdrawals / fundingData.chartData.length)}
                    </p>
                  </div>
                  
                </div>

                {/* Net Flow */}
                <div className="flex items-center rounded-lg p-4">
                <Wallet className="h-6 w-6 text-[#ff9500] mr-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Flow</p>
                    <p className={cn(
                      "mt-1 text-xl font-bold",
                      fundingData.netFunding >= 0 ? "text-purple-600 dark:text-purple-400" : "text-red-600 dark:text-red-400"
                    )}>
                      {formatCurrency(fundingData.netFunding)}
                    </p>
                  </div>
                 
                </div>
              </div>
              
              {/* Transaction Count */}
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Transaction Count</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {fundingData.transactions.length * 3}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Transactions View */}
        {activeView === "transactions" && (
          <div>
            <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">
              Recent Funding Transactions - {fundingData.periodName}
            </h3>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {fundingData.transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="cursor-pointer rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-6 shadow-md dark:shadow-dark-md transition-all duration-300 hover:shadow-xl dark:hover:shadow-dark-lg"
                >
                  {/* Header: Icon + Type + Status */}
                  <div className="mb-2 flex items-center gap-2">
                    {/* Type Icon */}
                    <div className="shrink-0">
                      {tx.type === "deposit" && <ArrowDownCircle className="h-6 w-6 text-[#ff9500]" />}
                      {tx.type === "withdrawal" && <ArrowUpCircle className="h-6 w-6 text-[#ff9500]" />}
                      {tx.type === "topup" && <DollarSign className="h-6 w-6 text-[#ff9500]" />}
                    </div>

                    {/* Type and Status */}
                    <div className="flex flex-1 items-center gap-2">
                      <h4 className="text-lg font-bold capitalize text-gray-900 dark:text-white">{tx.type}</h4>
                      <span className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                        tx.status === "completed" && "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
                        tx.status === "pending" && "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
                        tx.status === "failed" && "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                      )}>
                        {tx.status}
                      </span>
                    </div>
                  </div>

                  {/* Data Section */}
                  <div className="space-y-1">
                    {/* Amount */}
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Amount:
                      </p>
                      <p className={cn(
                        "text-sm font-bold",
                        tx.type === "deposit" || tx.type === "topup" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {tx.type === "deposit" || tx.type === "topup" ? "+" : "-"}
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Date:
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {tx.date}
                      </p>
                    </div>

                    {/* Method */}
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Method:
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {tx.method}
                      </p>
                    </div>

                    {/* Currency */}
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Currency:
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {tx.currency}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart View */}
        {activeView === "chart" && (
          <div className="rounded-xl border border-gray-800 bg-[#2A2D3A] p-3 sm:p-6 shadow-md overflow-visible">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Funding Activity - {fundingData.periodName}</h3>
              <div className="block sm:flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#FF9500]"></div>
                  <span className="text-gray-400">Deposits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-400">Withdrawals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-400">Top-ups</span>
                </div>
              </div>
            </div>
            <div className="w-full h-[220px] sm:h-[280px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fundingData.chartData}>
                <defs>
                  <linearGradient id="depositGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF9500" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#FFE369" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="withdrawalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="topupGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="label" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} tickFormatter={(val) => formatCompactNumber(val)} />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #374151', 
                    backgroundColor: '#1F2937',
                    color: '#F3F4F6',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: '#F3F4F6', fontSize: '11px' }}
                  itemStyle={{ color: '#FFE369', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="deposits" stroke="#FF9500" strokeWidth={1} fill="url(#depositGrad)" />
                <Area type="monotone" dataKey="withdrawals" stroke="#EF4444" strokeWidth={1} fill="url(#withdrawalGrad)" />
                <Area type="monotone" dataKey="topups" stroke="#3B82F6" strokeWidth={1} fill="url(#topupGrad)" />
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

// Export interface
export type { FundingProps, FundingTransaction };

