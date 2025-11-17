"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Search, ArrowUpCircle, ArrowDownCircle, DollarSign, Activity } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { cn, formatCurrency } from "@/lib/utils";

/**
 * Render cryptocurrency logo SVG based on coin ID
 * Uses official brand colors and authentic designs
 */
function renderCryptoLogo(coinId: string, size: 'sm' | 'md' = 'md') {
  const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
  };
  const { width, height } = sizeMap[size];

  switch (coinId) {
    case "bitcoin":
      return (
        <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
            fill="#F7931A"
          />
        </svg>
      );
    case "ethereum":
      return (
        <svg width={width} height={height} viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <svg width={width} height={height} viewBox="0 0 512 424" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M437.8 208.1c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5L0 281.3l8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 8.5 8.5c22.9 22.9 53.8 35.5 86.9 35.5s64-12.6 86.9-35.5l8.5-8.5 73.2-73.2-8.5-8.5c-22.9-22.9-53.8-35.5-86.9-35.5s-64 12.6-86.9 35.5l-8.5 8.5-8.5-8.5z"
            fill="#23292F"
          />
        </svg>
      );
    case "cardano":
      return (
        <svg width={width} height={height} viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="1000" cy="1000" r="180" fill="#0033AD" />
          <circle cx="1000" cy="450" r="80" fill="#0033AD" />
          <circle cx="1000" cy="1550" r="80" fill="#0033AD" />
          <circle cx="450" cy="1000" r="80" fill="#0033AD" />
          <circle cx="1550" cy="1000" r="80" fill="#0033AD" />
        </svg>
      );
    case "solana":
      return (
        <svg width={width} height={height} viewBox="0 0 646 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="solGradientStats" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#9945FF" />
              <stop offset="100%" stopColor="#14F195" />
            </linearGradient>
          </defs>
          <path d="M112.6 364.04l-73.53 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 0l-35.2-35.2L112.6 364.04z" fill="url(#solGradientStats)" />
          <path d="M112.6 0L39.07 73.53a24.89 24.89 0 000 35.2c9.7 9.7 25.5 9.7 35.2 0L646 512l-35.2 35.2L112.6 0z" fill="url(#solGradientStats)" />
        </svg>
      );
    case "dogecoin":
      return (
        <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#C3A634" />
          <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm-2 6h4c3.314 0 6 2.686 6 6s-2.686 6-6 6h-4V10zm2 2v8h2c2.21 0 4-1.79 4-4s-1.79-4-4-4h-2z" fill="#FFFFFF"/>
        </svg>
      );
    case "polkadot":
      return (
        <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="4" fill="#E6007A" />
          <circle cx="16" cy="6" r="2.5" fill="#E6007A" />
          <circle cx="16" cy="26" r="2.5" fill="#E6007A" />
          <circle cx="6" cy="16" r="2.5" fill="#E6007A" />
          <circle cx="26" cy="16" r="2.5" fill="#E6007A" />
        </svg>
      );
    case "chainlink":
      return (
        <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 4l-4 2.31v4.62L16 13.23l4-2.31V6.31L16 4z" fill="#2A5ADA" />
          <path d="M16 18.77l-4-2.31v4.62L16 23.39l4-2.31v-4.62l-4 2.31z" fill="#2A5ADA" />
          <path d="M8 10.15L4 12.46v4.62l4 2.31 4-2.31v-4.62L8 10.15z" fill="#2A5ADA" />
          <path d="M24 10.15l-4 2.31v4.62l4 2.31 4-2.31v-4.62l-4-2.31z" fill="#2A5ADA" />
        </svg>
      );
    case "litecoin":
      return (
        <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#345D9D" />
          <path
            d="M10.427 19.214l1.138-4.273-2.106.632.59-2.224 2.106-.632 2.328-8.756h4.366l-1.984 7.461 2.741-.824-.59 2.224-2.741.824-1.137 4.273h7.111l-.845 3.176H9.427z"
            fill="#FFFFFF"
          />
        </svg>
      );
    default:
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-gray-300 to-gray-400">
          <span className="text-xl font-bold text-white">
            {coinId.charAt(0).toUpperCase()}
          </span>
        </div>
      );
  }
}

/**
 * Portfolio Data Point Interface
 * Single data point for portfolio growth chart
 */
interface PortfolioDataPoint {
  time: string;
  value: number;
}

/**
 * Overall Statistics Interface
 * Summary statistics for the portfolio
 */
interface OverallStats {
  invested: number;
  current: number;
  roi: number;
  trades: number;
}

/**
 * Statistics Component Props
 * 
 * @property {string} timeRange - Selected time range filter (1D, 7D, 1M, 1Y)
 * @property {(range: string) => void} onTimeRangeChange - Callback when time range changes
 * @property {PortfolioDataPoint[]} portfolioData - Chart data for portfolio growth
 * @property {OverallStats} overallStats - Summary statistics (invested, current, ROI, trades)
 * @property {CoinStat[]} coinStats - Array of individual coin statistics
 * @property {(coinId: string) => void} onCoinClick - Callback when a coin is clicked
 * @property {string} chartColor - Primary color for chart line (default: #FF9500 - orange)
 * @property {string} chartGradientStart - Gradient start color (default: #FF9500)
 * @property {string} chartGradientMid - Gradient middle color (default: #FFB340)
 * @property {string} chartGradientEnd - Gradient end color (default: #181920)
 * @property {string} cardBackground - Card background color (default: #181920 - dark)
 */
interface StatisticsProps {
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  portfolioData?: PortfolioDataPoint[];
  overallStats?: OverallStats;
  coinStats?: CoinStat[];
  onCoinClick?: (coinId: string) => void;
  chartColor?: string;
  chartGradientStart?: string;
  chartGradientMid?: string;
  chartGradientEnd?: string;
  cardBackground?: string;
}

/**
 * Coin Statistics Interface
 * Individual cryptocurrency statistics
 */
interface CoinStat {
  id: string;
  name: string;
  symbol: string;
  gradient: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  logo: string;
}

/**
 * Statistics Component
 * Displays comprehensive cryptocurrency statistics and analytics
 * 
 * Features:
 * - Two-column responsive layout matching Home page exactly
 * - Left: Portfolio analytics with Profit Overview-style chart
 * - Right: Individual coin statistics with search
 * - Time range filters (1D, 7D, 1M, 1Y)
 * - Fully prop-driven for API integration
 * - Configurable chart colors
 * 
 * Portfolio Chart (Matching Weekly Profit Overview - Dark Theme):
 * - Dark background: bg-[#2A2A4A] (matching Home charts exactly)
 * - Rounded corners: rounded-card (16px - same as Home)
 * - Shadow: shadow-card (matching Home)
 * - Padding: p-6 (same as PerformanceChart)
 * - Orange gradient chart line (#FF9500)
 * - Hidden axes for clean minimal look
 * - Subtle dark grid lines (#3A3A5A)
 * - Dark tooltip (#2C2C4A with border #3A3A5A)
 * - Smooth gradient area fill (orange 60% → 40% → transparent)
 * - Value display: text-3xl sm:text-4xl (exact match)
 * - Subtitle: text-sm text-[#B8B8D4] (exact match)
 * - Badge: bg-white/10 with success color (exact match)
 * - Stroke width: 2px (same as Home charts)
 * - Chart height: 200px sm:220px (exact match)
 * 
 * Design Consistency:
 * - Exact Home page layout structure
 * - Dashboard orange/yellow color palette (#FF9500, #FFB340)
 * - Same spacing, typography, and hover states
 * - Dark theme matching Profit Overview
 * - Fully responsive and accessible
 */
export default function Statistics({
  timeRange = "7D",
  onTimeRangeChange,
  portfolioData: propPortfolioData,
  overallStats: propOverallStats,
  coinStats: propCoinStats,
  onCoinClick,
  chartColor = "#FF9500",
  chartGradientStart = "#FF9500",
  chartGradientMid = "#FFB340",
  chartGradientEnd = "#181920",
  cardBackground = "#181920",
}: StatisticsProps) {
  const [selectedRange, setSelectedRange] = useState(timeRange);
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Handle time range selection
   */
  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    }
  };

  /**
   * Handle coin click
   */
  const handleCoinClick = (coinId: string) => {
    if (onCoinClick) {
      onCoinClick(coinId);
    }
  };

  /**
   * Generate portfolio growth data based on time range
   */
  const getPortfolioData = (range: string) => {
    const dataPoints: Record<string, any[]> = {
      "1D": [
        { time: "00:00", value: 125000 },
        { time: "04:00", value: 127500 },
        { time: "08:00", value: 126800 },
        { time: "12:00", value: 128900 },
        { time: "16:00", value: 131200 },
        { time: "20:00", value: 132450 },
        { time: "24:00", value: 133500 },
      ],
      "7D": [
        { time: "Mon", value: 120000 },
        { time: "Tue", value: 122500 },
        { time: "Wed", value: 125800 },
        { time: "Thu", value: 127900 },
        { time: "Fri", value: 129200 },
        { time: "Sat", value: 131450 },
        { time: "Sun", value: 133500 },
      ],
      "1M": [
        { time: "Week 1", value: 110000 },
        { time: "Week 2", value: 115000 },
        { time: "Week 3", value: 122000 },
        { time: "Week 4", value: 133500 },
      ],
      "1Y": [
        { time: "Jan", value: 85000 },
        { time: "Feb", value: 88000 },
        { time: "Mar", value: 92000 },
        { time: "Apr", value: 95000 },
        { time: "May", value: 98000 },
        { time: "Jun", value: 103000 },
        { time: "Jul", value: 108000 },
        { time: "Aug", value: 115000 },
        { time: "Sep", value: 120000 },
        { time: "Oct", value: 125000 },
        { time: "Nov", value: 130000 },
        { time: "Dec", value: 133500 },
      ],
    };
    return dataPoints[range] || dataPoints["7D"];
  };

  /**
   * Overall statistics based on time range
   */
  const getOverallStats = (range: string) => {
    const stats: Record<string, any> = {
      "1D": { invested: 125000, current: 133500, roi: 6.8, trades: 12 },
      "7D": { invested: 120000, current: 133500, roi: 11.25, trades: 45 },
      "1M": { invested: 110000, current: 133500, roi: 21.36, trades: 187 },
      "1Y": { invested: 85000, current: 133500, roi: 57.06, trades: 892 },
    };
    return stats[range] || stats["7D"];
  };

  /**
   * Default coin statistics data
   * Used if no coin data is provided via props
   * In production, this would come from API or props
   */
  const defaultCoinStats: CoinStat[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      gradient: "from-orange-400 to-yellow-500",
      price: 43250.50,
      change24h: 5.42,
      marketCap: 845000000000,
      volume24h: 28500000000,
      logo: "₿",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      gradient: "from-blue-400 to-purple-500",
      price: 2284.75,
      change24h: 3.18,
      marketCap: 274000000000,
      volume24h: 15200000000,
      logo: "Ξ",
    },
    {
      id: "ripple",
      name: "Ripple",
      symbol: "XRP",
      gradient: "from-gray-600 to-gray-800",
      price: 0.58,
      change24h: -2.34,
      marketCap: 31000000000,
      volume24h: 2100000000,
      logo: "✕",
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      gradient: "from-blue-500 to-blue-700",
      price: 0.52,
      change24h: 1.87,
      marketCap: 18500000000,
      volume24h: 850000000,
      logo: "₳",
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      gradient: "from-purple-400 to-pink-500",
      price: 102.45,
      change24h: 8.23,
      marketCap: 44000000000,
      volume24h: 3800000000,
      logo: "◎",
    },
    {
      id: "dogecoin",
      name: "Dogecoin",
      symbol: "DOGE",
      gradient: "from-yellow-400 to-yellow-600",
      price: 0.085,
      change24h: -4.12,
      marketCap: 12100000000,
      volume24h: 580000000,
      logo: "Ð",
    },
  ];

  // Use provided data or generate default data
  const portfolioData = propPortfolioData || getPortfolioData(selectedRange);
  const overallStats = propOverallStats || getOverallStats(selectedRange);
  const coinStats = propCoinStats || defaultCoinStats;

  // Filter coins based on search
  const filteredCoins = coinStats.filter(
    (coin) =>
      searchQuery === "" ||
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by change24h to get top gainers/losers
  const topGainer = [...coinStats].sort((a, b) => b.change24h - a.change24h)[0];
  const topLoser = [...coinStats].sort((a, b) => a.change24h - b.change24h)[0];

  return (
    <div className="p-0 sm:p-0 lg:p-0">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        {/* Main Layout - 2 Column Design (Matching Home Page) */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left Column - Analytics Dashboard */}
          <div className="lg:col-span-2 space-y-6 p-3 bg-[#eaebfd] dark:bg-gray-900 sm:p-8">
            {/* Page Header */}
            <div className="mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Statistics</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Cryptocurrency statistics and analytics
              </p>
            </div>

            {/* Time Range Filter */}
            <div className="flex flex-wrap gap-2">
              {["1D", "7D", "1M", "1Y"].map((range) => (
                <button
                  key={range}
                  onClick={() => handleRangeChange(range)}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                    selectedRange === range
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md dark:shadow-dark-sm"
                      : "text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                  aria-label={`View ${range} statistics`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Analytics Content Card */}
            <div className="rounded-xl space-y-6 lg:rounded-3xl lg:p-6 lg:shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] dark:lg:shadow-[inset_0_2px_8px_rgba(255,255,255,0.06)] lg:dark:bg-gray-800">
            {/* Portfolio Growth Chart Card - Matching Weekly Profit Overview (Dark Theme) */}
            <div className="relative min-h-[200px] rounded-card bg-[#1C1C1E]  shadow-card sm:min-h-[220px] overflow-hidden" >
              {/* Header Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  {/* Main Value - Matching Home chart font sizes */}
                  <h2 className="text-3xl font-normal text-white sm:text-4xl p-7 pb-0">
                    {formatCurrency(overallStats.current)}
                  </h2>
                  {/* Change Badge */}
                  <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
                    {overallStats.roi >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                    <span className="text-xs font-medium text-success">
                      {overallStats.roi >= 0 ? "+" : ""}
                      {overallStats.roi.toFixed(2)}
                    </span>
                  </div>
                </div>
                {/* Subtitle - Comparison */}
                <p className="mt-2 text-sm text-[#B8B8D4] px-6">
                  Compared to the {formatCurrency(overallStats.invested)} last week
                </p>
              </div>

              {/* Chart */}
              <div className="h-[200px] w-full sm:h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={portfolioData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    {/* Gradient definition for area fill */}
                    <defs>
                      <linearGradient id="portfolioOrangeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF9500" stopOpacity={0.6} />
                        <stop offset="50%" stopColor="#FFB340" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#2A2A4A" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    {/* Grid lines - subtle */}
                    <CartesianGrid
                      strokeDasharray="0"
                      stroke="#3A3A5A"
                      vertical={false}
                    />
                    {/* Hidden axes */}
                    <XAxis hide={true} />
                    <YAxis hide={true} />
                    {/* Tooltip */}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2C2C4A",
                        border: "1px solid #3A3A5A",
                        borderRadius: "8px",
                        color: "#FFFFFF",
                        fontSize: "12px",
                      }}
                      formatter={(value: any) => [formatCurrency(value), "Portfolio Value"]}
                      animationDuration={200}
                    />
                    {/* Area chart with orange gradient */}
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#FF9500"
                      strokeWidth={1}
                      fill="url(#portfolioOrangeGradient)"
                      animationDuration={300}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Statistics Cards - Matching Funding Tab Style */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Total Invested Card */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
                {/* Header: Icon + Title */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="shrink-0">
                    <DollarSign className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Total Invested</h4>
                  </div>
                </div>

                {/* Data Section */}
                <div className="space-y-1">
                  {/* Amount */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Amount:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(overallStats.invested)}
                    </p>
                  </div>

                  {/* Period */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Period:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedRange}
                    </p>
                  </div>
                </div>
              </div>

              {/* Portfolio ROI Card */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
                {/* Header: Icon + Title */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="shrink-0">
                    <TrendingUp className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Portfolio ROI</h4>
                  </div>
                </div>

                {/* Data Section */}
                <div className="space-y-1">
                  {/* ROI Percentage */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Return:
                    </p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      +{overallStats.roi.toFixed(2)}%
                    </p>
                  </div>

                  {/* Period */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Period:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedRange}
                    </p>
                  </div>

                  {/* Change */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Change:
                    </p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                      <p className="text-sm font-bold text-green-500 dark:text-green-400">
                        +{overallStats.roi.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Value Card */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
                {/* Header: Icon + Title */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="shrink-0">
                    <ArrowUpCircle className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Current Value</h4>
                  </div>
                </div>

                {/* Data Section */}
                <div className="space-y-1">
                  {/* Amount */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Amount:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(overallStats.current)}
                    </p>
                  </div>

                  {/* Gain */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Gain:
                    </p>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      +{formatCurrency(overallStats.current - overallStats.invested)}
                    </p>
                  </div>

                  {/* Change */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Change:
                    </p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                      <p className="text-sm font-bold text-green-500 dark:text-green-400">
                        +{overallStats.roi.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Trades Card */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
                {/* Header: Icon + Title */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="shrink-0">
                    <Activity className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Total Trades</h4>
                  </div>
                </div>

                {/* Data Section */}
                <div className="space-y-1">
                  {/* Count */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Count:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {overallStats.trades.toLocaleString()}
                    </p>
                  </div>

                  {/* Period */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Period:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedRange}
                    </p>
                  </div>

                  {/* Activity Level */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Status:
                    </p>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Gainer/Loser - Matching Funding Tab Style */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Top Gainer Card */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
                {/* Header: Icon + Title */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="shrink-0">
                    <TrendingUp className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Top Gainer</h4>
                  </div>
                </div>

                {/* Data Section */}
                <div className="space-y-1">
                  {/* Coin */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Coin:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {topGainer.name} ({topGainer.symbol})
                    </p>
                  </div>

                  {/* Change */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Change:
                    </p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-green-500 dark:text-green-400" />
                      <p className="text-sm font-bold text-green-500 dark:text-green-400">
                        +{topGainer.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Period */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Period:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      24 Hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Loser Card */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-4 shadow-md dark:shadow-dark-md">
                {/* Header: Icon + Title */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="shrink-0">
                    <TrendingDown className="h-6 w-6 text-[#ff9500]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Top Loser</h4>
                  </div>
                </div>

                {/* Data Section */}
                <div className="space-y-1">
                  {/* Coin */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Coin:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {topLoser.name} ({topLoser.symbol})
                    </p>
                  </div>

                  {/* Change */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Change:
                    </p>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                      <p className="text-sm font-bold text-red-500 dark:text-red-400">
                        {topLoser.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* Period */}
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Period:
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      24 Hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Right Column - Coin Statistics Sidebar */}
          <div className="space-y-6 bg-linear-to-r from-gray-100 via-blue-100 to-gray-100 dark:bg-linear-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-8 lg:col-span-1">
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg dark:shadow-dark-lg">
              <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Coin Statistics
              </h2>

              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search coins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:border-[#ff9500] focus:outline-none focus:ring-2 focus:ring-[#ff9500]/20"
                  aria-label="Search cryptocurrencies"
                />
              </div>

              {/* Coin List */}
              <div className="space-y-3">
                {filteredCoins.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => handleCoinClick(coin.id)}
                    className="w-full rounded-xl bg-linear-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 p-4 shadow-sm dark:shadow-dark-sm text-left transition-all hover:shadow-lg dark:hover:shadow-dark-md hover:from-blue-50/30 dark:hover:from-blue-900/30 hover:to-white dark:hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                    aria-label={`View details for ${coin.name}`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center">
                          {renderCryptoLogo(coin.id, 'md')}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{coin.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{coin.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(coin.price)}
                        </p>
                        <div
                          className={cn(
                            "flex items-center justify-end gap-1 text-xs font-bold",
                            coin.change24h >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          )}
                        >
                          {coin.change24h >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {coin.change24h >= 0 ? "+" : ""}
                          {coin.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Market Cap:</span>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {coin.marketCap >= 1e9
                            ? `$${(coin.marketCap / 1e9).toFixed(1)}B`
                            : `$${(coin.marketCap / 1e6).toFixed(0)}M`}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Volume (24h):</span>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {coin.volume24h >= 1e9
                            ? `$${(coin.volume24h / 1e9).toFixed(1)}B`
                            : `$${(coin.volume24h / 1e6).toFixed(0)}M`}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Empty State */}
              {filteredCoins.length === 0 && (
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700 py-8 text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    No coins found matching "{searchQuery}"
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-xs font-semibold text-[#ff9500] hover:text-[#ff9500]/80"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export interfaces for use in other components
export type { StatisticsProps, CoinStat, PortfolioDataPoint, OverallStats };

