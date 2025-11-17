"use client";

import { useId, useState, useRef, useMemo } from "react";
import { TrendingUp, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { performanceData, coinAssets, accountMetrics } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";
import CardCoinAssetsSlider, { type CoinType } from "./CoinAssetsSlider";

/**
 * Generate dynamic data based on analysis period
 */
export function generatePeriodData(period: "daily" | "weekly" | "monthly" | "yearly") {
  const dataPoints: Record<string, number> = {
    daily: 24, // 24 hours
    weekly: 7, // 7 days
    monthly: 30, // 30 days
    yearly: 12, // 12 months
  };

  const baseValue: Record<string, number> = {
    daily: 35000,
    weekly: 250000,
    monthly: 1000000,
    yearly: 12000000,
  };

  const periodLabels: Record<string, string[]> = {
    daily: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    monthly: Array.from({ length: 30 }, (_, i) => `${i + 1}`),
    yearly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  };

  const count = dataPoints[period];
  const base = baseValue[period];
  const labels = periodLabels[period];

  // Generate chart data
  const chartData = Array.from({ length: count }, (_, i) => ({
    date: labels[i],
    value: base * (0.7 + Math.random() * 0.6),
  }));

  // Calculate totals and trends
  const totalValue = chartData.reduce((sum, d) => sum + d.value, 0);
  const avgValue = totalValue / count;
  const lastValue = chartData[chartData.length - 1].value;
  const firstValue = chartData[0].value;
  const trend = ((lastValue - firstValue) / firstValue) * 100;

  // Generate coin transaction data for multiple coins
  // All coins use solid neutral gray background (no gradients)
  const coinData: Record<string, CoinType[]> = {
    daily: [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", count: 5 + Math.floor(Math.random() * 10), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", count: 8 + Math.floor(Math.random() * 15), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "ripple", name: "Ripple", symbol: "XRP", count: 10 + Math.floor(Math.random() * 20), bgColor: "bg-gray-100", textColor: "text-gray-800" },
    ],
    weekly: [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", count: 20 + Math.floor(Math.random() * 15), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", count: 35 + Math.floor(Math.random() * 25), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "ripple", name: "Ripple", symbol: "XRP", count: 45 + Math.floor(Math.random() * 30), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "litecoin", name: "Litecoin", symbol: "LTC", count: 25 + Math.floor(Math.random() * 20), bgColor: "bg-gray-100", textColor: "text-gray-800" },
    ],
    monthly: [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", count: 80 + Math.floor(Math.random() * 40), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", count: 120 + Math.floor(Math.random() * 60), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "ripple", name: "Ripple", symbol: "XRP", count: 150 + Math.floor(Math.random() * 80), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "litecoin", name: "Litecoin", symbol: "LTC", count: 90 + Math.floor(Math.random() * 50), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "cardano", name: "Cardano", symbol: "ADA", count: 200 + Math.floor(Math.random() * 100), bgColor: "bg-gray-100", textColor: "text-gray-800" },
    ],
    yearly: [
      { id: "bitcoin", name: "Bitcoin", symbol: "BTC", count: 950 + Math.floor(Math.random() * 200), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "ethereum", name: "Ethereum", symbol: "ETH", count: 1500 + Math.floor(Math.random() * 300), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "ripple", name: "Ripple", symbol: "XRP", count: 1800 + Math.floor(Math.random() * 400), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "litecoin", name: "Litecoin", symbol: "LTC", count: 1200 + Math.floor(Math.random() * 300), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "cardano", name: "Cardano", symbol: "ADA", count: 2500 + Math.floor(Math.random() * 500), bgColor: "bg-gray-100", textColor: "text-gray-800" },
      { id: "solana", name: "Solana", symbol: "SOL", count: 800 + Math.floor(Math.random() * 200), bgColor: "bg-gray-100", textColor: "text-gray-800" },
    ],
  };

  // Generate account spending/savings data
  const spendingBase: Record<string, number> = {
    daily: 1200,
    weekly: 9500,
    monthly: 38000,
    yearly: 450000,
  };

  const savingsBase: Record<string, number> = {
    daily: 800,
    weekly: 6500,
    monthly: 28000,
    yearly: 320000,
  };

  const spendingChartData = Array.from({ length: 12 }, () => 
    spendingBase[period] * (0.6 + Math.random() * 0.8)
  );
  
  const savingsChartData = Array.from({ length: 12 }, () => 
    savingsBase[period] * (0.5 + Math.random() * 1.0)
  );

  // Calculate comparison text
  const comparisonMap: Record<string, string> = {
    daily: "yesterday",
    weekly: "last week",
    monthly: "last month",
    yearly: "last year",
  };

  const titleMap: Record<string, string> = {
    daily: "Daily Profit Overview",
    weekly: "Weekly Profit Overview",
    monthly: "Monthly Profit Overview",
    yearly: "Yearly Profit Overview",
  };

  const daysMap: Record<string, string> = {
    daily: "Last 24 hours",
    weekly: "Last 7 days",
    monthly: "Last 30 days",
    yearly: "Last 12 months",
  };

  return {
    title: titleMap[period],
    mainValue: avgValue,
    trendPercentage: Math.abs(trend),
    trendPositive: trend >= 0,
    comparisonText: `Compared to the $${(avgValue * 0.85).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${comparisonMap[period]}`,
    chartData,
    coins: coinData[period],
    spending: {
      value: spendingBase[period],
      chartData: spendingChartData,
    },
    savings: {
      value: savingsBase[period],
      chartData: savingsChartData,
    },
    daysLabel: daysMap[period],
  };
}

/**
 * Portfolio Coin Interface
 * Represents a coin added to portfolio from Explore page
 * 
 * Note: amount field represents aggregated holdings
 */
interface PortfolioCoin {
  id: string;
  name: string;
  symbol: string;
  logo: string;
  gradient: string;
  price: number;
  change24h: number;
  amount: number; // Aggregated holdings count
}

/**
 * TabbedCards Component Props
 * 
 * @property {object} performanceData - Performance statistics data
 * @property {object} coinData - Cryptocurrency asset data (Bitcoin, Ethereum counts)
 * @property {object} accountData - Account spending/savings data
 * @property {(cardType: string) => void} onCardClick - Callback when card is clicked
 * @property {"daily" | "weekly" | "monthly" | "yearly"} analysisPeriod - Time period for analytics
 * @property {PortfolioCoin[]} portfolioCoins - Coins added to portfolio (appear at start of slider)
 */
interface TabbedCardsProps {
  performanceData?: {
    percentage: number;
    weekGrowth: number;
    comparisonText: string;
    chartData: Array<{ date: string; value: number }>;
  };
  coinData?: {
    bitcoin: number;
    ethereum: number;
  };
  portfolioCoins?: PortfolioCoin[];
  accountData?: {
    spending: { value: number; chartData: number[] };
    savings: { value: number; chartData: number[] };
    trend: number;
  };
  onCardClick?: (cardType: "performance" | "coins" | "accounts") => void;
  analysisPeriod?: "daily" | "weekly" | "monthly" | "yearly";
}

/**
 * CardComparison - Monthly Profit Overview card with dark theme
 * 
 * Features:
 * - Dark background (#1C1C1E)
 * - Header with icon and title
 * - Large main value in white
 * - Green trend badge in top-right
 * - Orange line chart with gradient fill
 * - Date labels at bottom
 */
export function CardComparison({ 
  data, 
  onClick,
  title = "Monthly Profit Overview",
  mainValue = 456789,
  trendPercentage = 16,
  trendPositive = true,
  comparisonText = "Compared to the $1,232.21 last week",
  chartData: customChartData,
}: { 
  data?: TabbedCardsProps["performanceData"]; 
  onClick?: () => void;
  title?: string;
  mainValue?: number;
  trendPercentage?: number;
  trendPositive?: boolean;
  comparisonText?: string;
  chartData?: Array<{ date: string; value: number }>;
}) {
  const rid = useId().replace(/[:]/g, "-");
  const gradientId = `orangeGradient-${rid}`;

  const defaultData = performanceData;
  const chartData = customChartData ?? data?.chartData ?? defaultData.chartData;
  
  // Ensure chartData is valid and has data
  if (!chartData || chartData.length === 0) {
    console.warn("Chart data is empty or undefined");
  }

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "group relative h-full w-full rounded-2xl bg-[#1C1C1E]  text-white shadow-lg transition-all duration-300",
        onClick && "cursor-pointer hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      )}
      aria-label="Monthly profit overview card"
    >
      <div className="flex h-full flex-col">
        {/* Header Section */}
        <div className="mb-4 flex items-start justify-between px-6 pt-6">
          {/* Icon and Title */}
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
            <span className="text-sm font-normal text-gray-400">
              {title}
            </span>
          </div>

          {/* Trend Badge - Top Right */}
          <div className={cn(
            "flex items-center gap-1 rounded-md px-2.5 py-1.5",
            trendPositive ? "bg-[#28A745]" : "bg-red-500"
          )}>
            <TrendingUp className="h-3.5 w-3.5 text-white" />
            <span className="text-sm font-normal text-white">
              {trendPercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Main Value */}
        <div className="mb-2 px-6">
          <h2 className="text-4xl font-normal text-white xl:text-5xl">
            ${mainValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </h2>
        </div>

        {/* Comparison Text */}
        <div className="mb-6 px-6">
          <p className="text-sm text-gray-400">
            {comparisonText}
          </p>
      </div>

        {/* Line Chart with Orange Theme */}
        <div className="w-full h-[140px] sm:h-[160px] relative overflow-hidden rounded-b-2xl">
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData} 
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
              <defs>
                {/* Orange gradient fill */}
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF9500" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#FF9500" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#1C1C1E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke="transparent" />
              <XAxis hide={true} />
              <YAxis hide={true} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#2C2C2E",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(value: number) => `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
              />
              {/* Orange line with gradient fill */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="#FF9500"
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                animationDuration={300}
              />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400 text-sm">
              No chart data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * CardCoinAssets - Two-column pill card for Bitcoin and Ethereum
 * 
 * Features:
 * - Light background
 * - "COIN ASSET" header with diamond icon
 * - Two vertical pill sections (Bitcoin orange, Ethereum purple)
 * - Circular icons with counts below
 * - Centered and balanced layout
 */
function CardCoinAssets({ 
  data, 
  onClick,
  bitcoinCount: customBitcoinCount,
  ethereumCount: customEthereumCount,
}: { 
  data?: TabbedCardsProps["coinData"]; 
  onClick?: () => void;
  bitcoinCount?: number;
  ethereumCount?: number;
}) {
  const bitcoinCount = customBitcoinCount ?? data?.bitcoin ?? 34;
  const ethereumCount = customEthereumCount ?? data?.ethereum ?? 16;

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "group h-full rounded-2xl w-full bg-linear-to-br from-white to-blue-50/40 dark:bg-linear-to-br dark:from-gray-800 dark:to-gray-900 p-6 shadow-lg dark:shadow-gray-900/50 transition-all duration-300",
        onClick && "cursor-pointer hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      )}
      aria-label="Coin assets card"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            COIN ASSET
          </h3>
          {/* Diamond Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-gray-700">
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

        {/* Two-Column Pill Layout - Slim and elongated pills */}
        <div className="flex flex-1 items-center gap-3">
        {/* Bitcoin Pill - Slimmer and more elongated */}
        <div className="flex flex-1 flex-col items-center h-full justify-center rounded-[40px] bg-white dark:bg-gray-700 px-4 py-3 shadow-sm dark:shadow-gray-900/50">
          {/* Bitcoin Icon */}
          <div className="mb-2 flex h-10 w-10 items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bitcoin Logo - B with two lines */}
              <path
                d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
                fill="#F7931A"
              />
            </svg>
          </div>
          {/* Count */}
          <p className="text-xl font-semibold text-gray-800 dark:text-white">{bitcoinCount}</p>
        </div>

        {/* Ethereum Pill - Slimmer and more elongated */}
        <div className="flex flex-1 flex-col items-center h-full justify-center rounded-[40px] bg-linear-to-br from-[#99a2d4] to-[#7681c5] dark:bg-linear-to-br dark:from-gray-600 dark:to-gray-700 px-4 py-3 shadow-sm dark:shadow-gray-900/50">
          {/* Ethereum Icon */}
          <div className="mb-2 flex h-10 w-10 items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 256 417"
          fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ethereum Diamond Logo */}
              <path
                d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"
                fill="white"
                fillOpacity="0.8"
              />
              <path
                d="M127.962 0L0 212.32l127.962 75.639V154.158z"
                fill="white"
              />
              <path
                d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"
                fill="white"
                fillOpacity="0.8"
              />
              <path
                d="M127.962 416.905v-104.72L0 236.585z"
                fill="white"
              />
              <path
                d="M127.961 287.958l127.96-75.637-127.96-58.162z"
                fill="white"
                fillOpacity="0.5"
              />
              <path
                d="M0 212.32l127.96 75.638v-133.8z"
                fill="white"
                fillOpacity="0.7"
              />
        </svg>
          </div>
          {/* Count */}
          <p className="text-xl font-semibold text-white">{ethereumCount}</p>
        </div>
      </div>
      </div>
    </div>
  );
}

/**
 * CardAccounts - Spending and Savings with sparklines
 * 
 * Features:
 * - "ACCOUNTS" header with arrow icon
 * - Two sections: Spending (blue bars), Savings (red bars)
 * - 12-day sparkline charts
 * - USD amounts right-aligned
 * - Trend indicator at bottom with arrow
 */
function CardAccounts({ 
  data, 
  onClick,
  spendingValue: customSpendingValue,
  spendingChart: customSpendingChart,
  savingsValue: customSavingsValue,
  savingsChart: customSavingsChart,
  daysLabel = "Last 12 days",
}: { 
  data?: TabbedCardsProps["accountData"]; 
  onClick?: () => void;
  spendingValue?: number;
  spendingChart?: number[];
  savingsValue?: number;
  savingsChart?: number[];
  daysLabel?: string;
}) {
  const spendingValue = customSpendingValue ?? data?.spending?.value ?? 9496;
  const spendingChart = customSpendingChart ?? data?.spending?.chartData ?? Array.from({ length: 12 }, (_, i) => 20 + ((i * 7) % 30));
  const savingsValue = customSavingsValue ?? data?.savings?.value ?? 11496;
  const savingsChart = customSavingsChart ?? data?.savings?.chartData ?? Array.from({ length: 12 }, (_, i) => 25 + ((i * 5) % 28));
  const trendValue = data?.trend ?? 4.32;

  const accounts = [
    {
      label: "Spending",
      value: spendingValue,
      unit: "USD",
      color: "#6366F1", // Indigo
      chartData: spendingChart,
    },
    {
      label: "Savings",
      value: savingsValue,
      unit: "USD",
      color: "#EF4444", // Red
      chartData: savingsChart,
    },
  ];

  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "group h-full rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-gray-900/50 transition-all duration-300 w-full",
        onClick && "cursor-pointer hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      )}
      aria-label="Accounts card"
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            ACCOUNTS
          </h3>
          <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </div>

        {/* Account Sections */}
        <div className="flex flex-1 flex-col justify-between space-y-6">
        {accounts.map((account) => (
          <div key={account.label}>
            {/* Label and Value */}
            <div className="mb-2 flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {account.label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{daysLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {account.value.toLocaleString("en-US")}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{account.unit}</p>
              </div>
            </div>

            {/* Sparkline Chart - Thinner bars with increased spacing */}
            <div className="flex h-10 items-end gap-1.5">
              {account.chartData.map((value, index) => {
                // Normalize the height to fit within 8-40px range
                const maxValue = Math.max(...account.chartData);
                const minValue = Math.min(...account.chartData);
                const normalizedHeight = minValue === maxValue 
                  ? 24 // If all values are the same, use middle height
                  : 8 + ((value - minValue) / (maxValue - minValue)) * 32;
                
                return (
                  <div
                    key={index}
                    className="w-1.5 rounded-t transition-all duration-300 hover:opacity-70"
                    style={{
                      height: `${normalizedHeight}px`,
                      backgroundColor: account.color,
                      opacity: 0.8,
                    }}
                    aria-label={`Day ${index + 1}: ${value.toFixed(0)}`}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Trend Indicator */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trend</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-500 dark:text-green-400">
              +{trendValue.toFixed(2)}
            </span>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TabbedCards - Main component showing three dashboard cards
 * 
 * Layout:
 * - Desktop: Horizontal row with exact proportions
 *   - Left column (Performance): 45% width
 *   - Center column (Accounts): 25% width
 *   - Right column (Coin Assets): 30% width
 * - Mobile: Stacked vertically, each card 100% width
 * 
 * Features:
 * - Three cards in horizontal layout with exact proportions
 * - Performance card with gradient and chart
 * - Coin assets card with slider/carousel
 * - Accounts card with spending/savings
 * - Click callbacks for each card
 * - Keyboard accessible
 * - Fully responsive with mobile stacking
 * 
 * Portfolio Integration:
 * - Accepts portfolioCoins prop (coins added from Explore page)
 * - Portfolio coins appear at START of coin assets slider
 * - Newly added coins show first for max visibility
 * - Merges portfolio coins with period-based coin data
 * - All slider navigation and functionality maintained
 * - Each portfolio coin displays with correct logo, name, symbol, count
 * 
 * @example
 * ```tsx
 * <TabbedCards
 *   onCardClick={(cardType) => console.log('Clicked:', cardType)}
 *   analysisPeriod="weekly"
 *   portfolioCoins={addedCoinsFromExplore}
 * />
 * ```
 */
export default function TabbedCards({
  performanceData: perfData,
  coinData,
  accountData,
  onCardClick,
  analysisPeriod = "weekly",
  portfolioCoins = [],
}: TabbedCardsProps = {}) {
  
  /**
   * Generate dynamic data based on analysis period
   * Memoized to prevent regenerating random values on every render
   * Only regenerates when analysisPeriod actually changes
   * 
   * BUG FIX: Previously, clicking notifications caused re-renders which
   * regenerated random data, making card values change unexpectedly.
   * useMemo ensures data only changes when period prop changes.
   */
  const periodData = useMemo(
    () => generatePeriodData(analysisPeriod),
    [analysisPeriod]
  );

  /**
   * Convert portfolio coins to CoinType format for slider
   * Uses solid neutral gray background for all coins (no gradients)
   * Count reflects actual aggregated amount from portfolio
   */
  const portfolioCoinCards: CoinType[] = portfolioCoins.map((coin) => {
    return {
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      count: coin.amount, // Use actual amount (aggregated across multiple additions)
      bgColor: "bg-gray-100", // Solid neutral gray background
      textColor: "text-gray-800", // Dark gray text for clarity
    };
  });

  /**
   * Merge portfolio coins with period coin data
   * Portfolio coins appear at the START of the slider for max visibility
   * This ensures newly added coins from Explore page are shown first
   * 
   * IMPORTANT: Filter out duplicates to prevent React key conflicts
   * - Portfolio coins take priority (appear first in slider)
   * - Period coins that match portfolio coin IDs are excluded
   * - Ensures unique coin.id keys for React rendering
   */
  const portfolioCoinIds = new Set(portfolioCoinCards.map(coin => coin.id));
  const uniquePeriodCoins = periodData.coins.filter(
    coin => !portfolioCoinIds.has(coin.id)
  );
  
  const mergedCoinData = [...portfolioCoinCards, ...uniquePeriodCoins];
  
  const handleCardClick = (cardType: "performance" | "coins" | "accounts") => {
    if (onCardClick) {
      onCardClick(cardType);
    }
  };

  return (
    <section 
      className="mx-auto max-w-screen-2xl sm:px-3"
      role="region"
      aria-label="Dashboard cards"
    >
      {/* Three Cards with Exact Proportions: 45% - 25% - 30% - All same height, uniform spacing */}
      <div className="w-full">
        <div className="flex w-full flex-col gap-3 md:flex-row md:justify-center">
          {/* Left Column - Performance (45% width on desktop, 100% on mobile) */}
          <div className="hidden md:flex w-full md:w-[45%] md:shrink-0">
            <CardComparison
              data={perfData}
              onClick={() => handleCardClick("performance")}
              title={periodData.title}
              mainValue={periodData.mainValue}
              trendPercentage={periodData.trendPercentage}
              trendPositive={periodData.trendPositive}
              comparisonText={periodData.comparisonText}
              chartData={periodData.chartData}
            />
          </div>
 {/* Right Column - Coin Assets (30% width on desktop, 100% on mobile) */}
 <div className="w-full md:flex md:w-[25%] md:shrink-0">
            <CardCoinAssetsSlider
              coins={mergedCoinData}
              onClick={() => handleCardClick("coins")}
            />
          </div>
          {/* Center Column - Accounts (25% width on desktop, 100% on mobile) */}
          <div className="w-full md:flex md:w-[30%] md:shrink-0">
            <CardAccounts
              data={accountData}
              onClick={() => handleCardClick("accounts")}
              spendingValue={periodData.spending.value}
              spendingChart={periodData.spending.chartData}
              savingsValue={periodData.savings.value}
              savingsChart={periodData.savings.chartData}
              daysLabel={periodData.daysLabel}
            />
          </div>

         
        </div>
        </div>
    </section>
  );
}
