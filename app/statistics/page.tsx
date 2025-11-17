"use client";

import { useState } from "react";
import Statistics, { 
  type PortfolioDataPoint, 
  type OverallStats, 
  type CoinStat 
} from "@/components/dashboard/Statistics";

/**
 * Statistics Page
 * 
 * Displays comprehensive cryptocurrency statistics and analytics
 * 
 * Features:
 * - Two-column responsive layout matching Home page
 * - Portfolio growth visualization with blue dashboard charts
 * - Overall performance metrics with gradient cards
 * - Individual coin statistics with search
 * - Time range filters (1D, 7D, 1M, 1Y)
 * - Fully prop-driven component
 * 
 * Design:
 * - Matches dashboard styling exactly
 * - bg-[#eaebfd] left column, gradient right column
 * - Dark Portfolio chart (#181920) with orange/yellow line (#FF9500)
 * - Matches Weekly Profit Overview from Home page
 * - Soft pastel gradient summary cards
 * - Dashboard color palette throughout
 * - Fully responsive and accessible
 * 
 * Props:
 * - All data can be passed via props (portfolio, stats, coins)
 * - Chart colors are configurable (defaults to orange/yellow)
 * - Card background is configurable (defaults to dark #181920)
 * - Callbacks for interactions (time range, coin click)
 */
export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("7D");

  /**
   * Handle time range change
   * In production, fetch new data from API based on range
   */
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    console.log("Time range changed to:", range);
    // TODO: Fetch data for new time range
    // fetchStatistics(range);
  };

  /**
   * Handle coin click
   * Navigate to coin detail page or show modal
   */
  const handleCoinClick = (coinId: string) => {
    console.log("Coin clicked:", coinId);
    // TODO: Navigate to coin details or show modal
    // router.push(`/coins/${coinId}`);
  };

  /**
   * Example: Custom chart colors (optional)
   * Default colors match Weekly Profit Overview (orange/yellow on dark)
   */
  // const customChartColors = {
  //   chartColor: "#FF9500",           // Orange (default)
  //   chartGradientStart: "#FF9500",   // Orange (default)
  //   chartGradientMid: "#FFB340",     // Light orange (default)
  //   chartGradientEnd: "#181920",     // Dark background (default)
  //   cardBackground: "#181920",       // Dark card background (default)
  // };
  
  // Alternative: Blue theme
  // const blueChartColors = {
  //   chartColor: "#3B82F6",
  //   chartGradientStart: "#3B82F6",
  //   chartGradientMid: "#2563EB",
  //   chartGradientEnd: "#1E40AF",
  //   cardBackground: "#1F2937",
  // };

  /**
   * Example: Pass custom data via props
   * Uncomment to use API data instead of defaults
   */
  // const portfolioData: PortfolioDataPoint[] = [
  //   { time: "Mon", value: 120000 },
  //   { time: "Tue", value: 125000 },
  //   // ... more data points
  // ];

  // const overallStats: OverallStats = {
  //   invested: 120000,
  //   current: 133500,
  //   roi: 11.25,
  //   trades: 45,
  // };

  // const coinStats: CoinStat[] = [
  //   {
  //     id: "bitcoin",
  //     name: "Bitcoin",
  //     symbol: "BTC",
  //     gradient: "from-orange-400 to-yellow-500",
  //     price: 43250.50,
  //     change24h: 5.42,
  //     marketCap: 845000000000,
  //     volume24h: 28500000000,
  //     logo: "₿",
  //   },
  //   // ... more coins
  // ];

  return (
    <Statistics 
      timeRange={timeRange}
      onTimeRangeChange={handleTimeRangeChange}
      onCoinClick={handleCoinClick}
      // Optional: Pass custom data from API
      // portfolioData={portfolioData}
      // overallStats={overallStats}
      // coinStats={coinStats}
      // Optional: Customize chart colors (defaults to orange/yellow dark theme)
      // chartColor={customChartColors.chartColor}
      // chartGradientStart={customChartColors.chartGradientStart}
      // chartGradientMid={customChartColors.chartGradientMid}
      // chartGradientEnd={customChartColors.chartGradientEnd}
      // cardBackground={customChartColors.cardBackground}
    />
  );
}
