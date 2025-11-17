"use client";

import { useState, useRef, useMemo } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import BalanceHeader from "@/components/dashboard/BalanceHeader";
import GradientCard from "@/components/dashboard/GradientCard";
import CurrentMarket from "@/components/dashboard/CurrentMarket";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import TabbedCards, { CardComparison, generatePeriodData } from "@/components/dashboard/TabbedCards";
import Assets from "@/components/dashboard/Assets";
import Funding from "@/components/dashboard/Funding";
import P2P from "@/components/dashboard/P2P";
import Favs from "@/components/dashboard/Favs";
import { cn, formatCurrency } from "@/lib/utils";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Home() {
  const [activeTab, setActiveTab] = useState("PORTFOLIO");
  const [analysisPeriod, setAnalysisPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");
  
  // Refs for scrolling to sections
  const portfolioRef = useRef<HTMLDivElement>(null);
  const assetsRef = useRef<HTMLDivElement>(null);
  const transactionsRef = useRef<HTMLDivElement>(null);
  const tabbedCardsRef = useRef<HTMLDivElement>(null);
  
  // Get portfolio coins and watchlist from context
  const { portfolio = [], watchlist = [], removeFromWatchlist } = usePortfolio();

  /**
   * Transform portfolio assets to ensure all required fields are present
   * Adds default values for amount and addedAt if missing
   */
  const portfolioCoins = portfolio.map(asset => ({
    ...asset,
    amount: asset.amount ?? 1,
    addedAt: asset.addedAt ?? new Date(),
  }));

  /**
   * Transform watchlist assets to ensure all required fields are present
   */
  const watchlistCoins = watchlist.map(asset => ({
    ...asset,
    amount: asset.amount ?? 1,
    addedAt: asset.addedAt ?? new Date(),
  }));

  /**
   * Filter watchlist to exclude coins already in portfolio
   * Ensures clean separation: if coin is held, don't show in watchlist
   */
  const portfolioCoinIds = new Set(portfolioCoins.map(c => c.id));
  const filteredWatchlist = watchlistCoins.filter(c => !portfolioCoinIds.has(c.id));

  /**
   * Generate profit data based on selected period
   */
  const getProfitData = (period: "daily" | "weekly" | "monthly" | "yearly") => {
    const profitData: Record<string, { value: number; trend: number }> = {
      daily: {
        value: 34347.25,      // Daily profit
        trend: 8.3,           // +8.3% compared to yesterday
      },
      weekly: {
        value: 263154.89,     // Weekly profit
        trend: 12.7,          // +12.7% compared to last week
      },
      monthly: {
        value: 123455.13,     // Monthly profit
        trend: 10.4,          // +10.4% compared to last month
      },
      yearly: {
        value: 1456789.50,    // Yearly profit
        trend: 15.2,          // +15.2% compared to last year
      },
    };
    return profitData[period];
  };

  const currentProfitData = getProfitData(analysisPeriod);

  /**
   * Generate period data for the profit overview card
   */
  const periodData = useMemo(
    () => generatePeriodData(analysisPeriod),
    [analysisPeriod]
  );

  /**
   * Handle tab change from BalanceHeader
   */
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    console.log("Tab changed to:", tab);
  };

  /**
   * Handle analysis period change from dropdown
   */
  const handleAnalysisPeriodChange = (period: string) => {
    setAnalysisPeriod(period as "daily" | "weekly" | "monthly" | "yearly");
    console.log("Analysis period changed to:", period);
  };

  /**
   * Handle card click from TabbedCards
   */
  const handleCardClick = (cardType: string) => {
    console.log("Card clicked:", cardType);
    // You can add modal/drawer logic here
  };

  /**
   * Handle navigation from search results
   */
  const handleNavigate = (type: "portfolio" | "assets" | "transactions" | "metrics", data?: any) => {
    // Switch to appropriate tab and scroll to section
    switch (type) {
      case "portfolio":
        setActiveTab("PORTFOLIO");
        // Scroll to portfolio section after tab change
        setTimeout(() => {
          portfolioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        break;
      case "assets":
        setActiveTab("ASSETS");
        // Scroll to assets section after tab change
        setTimeout(() => {
          assetsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        break;
      case "transactions":
        // Scroll to transactions section (in sidebar)
        setTimeout(() => {
          transactionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        break;
      case "metrics":
        // Metrics are in the ACCOUNTS card within TabbedCards, scroll to portfolio tab
        setActiveTab("PORTFOLIO");
        setTimeout(() => {
          tabbedCardsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
        break;
    }
  };

  return (
    <div className="p-0 sm:p-0 lg:p-0 min-h-screen">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        {/* Main Layout - 2 Column Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 1">
          {/* Left Column - Dashboard */}
          <div className="lg:col-span-2 space-y-6 p-3 bg-[#eaebfd] dark:bg-gray-900 sm:p-8">
            {/* Balance Header (without tabs) */}
            <BalanceHeader 
              analysisPeriod={analysisPeriod}
              onAnalysisPeriodChange={handleAnalysisPeriodChange}
              onNavigate={handleNavigate}
            />

            {/* Weekly Profit Overview Card - Mobile Only (above tabs) */}
            <div className="md:hidden mb-6">
              <CardComparison
                onClick={() => handleCardClick("performance")}
                title={periodData.title}
                mainValue={periodData.mainValue}
                trendPercentage={periodData.trendPercentage}
                trendPositive={periodData.trendPositive}
                comparisonText={periodData.comparisonText}
                chartData={periodData.chartData}
              />
            </div>

            {/* Unified Container: Tabs + Content */}
            <div className="rounded-xl lg:rounded-3xl lg:p-6 lg:shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] dark:lg:shadow-[inset_0_2px_8px_rgba(255,255,255,0.06)] lg:dark:bg-gray-800">
              {/* Tab Navigation */}
              <div className="mb-6 flex flex-wrap gap-2 sm:gap-3 justify-end" role="tablist">
                {["PORTFOLIO", "ASSETS", "FUNDING", "P2P"].map((tab) => {
                  const isActive = tab === activeTab;
                  return (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleTabChange(tab);
                        }
                      }}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`${tab.toLowerCase()}-panel`}
                      tabIndex={isActive ? 0 : -1}
                      className={
                        isActive
                          ? "rounded-xl bg-white dark:bg-gray-700 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          : "rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-all duration-200 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      }
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              {activeTab === "PORTFOLIO" && (
                <div ref={portfolioRef}>
                  {/* Three Cards Section - Contains ACCOUNTS card with metrics */}
                  <div ref={tabbedCardsRef}>
                    <TabbedCards 
                      onCardClick={handleCardClick}
                      analysisPeriod={analysisPeriod}
                      portfolioCoins={portfolioCoins}
                    />
                  </div>

                  {/* Current Market Section */}
                  <CurrentMarket />
                </div>
              )}

              {/* Assets Tab Content */}
              {activeTab === "ASSETS" && (
                <div ref={assetsRef}>
                  <Assets 
                    period={analysisPeriod}
                    portfolioCoins={portfolioCoins}
                    watchlistCoins={filteredWatchlist}
                    onRemoveFromWatchlist={removeFromWatchlist}
                    onAssetClick={(asset) => console.log("Asset clicked:", asset)} 
                  />
                </div>
              )}

              {/* Funding Tab Content */}
              {activeTab === "FUNDING" && (
                <Funding period={analysisPeriod} />
              )}

              {/* P2P Tab Content */}
              {activeTab === "P2P" && (
                <P2P period={analysisPeriod} />
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 bg-linear-to-r from-gray-100 via-blue-100 to-gray-100 dark:bg-linear-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-8 lg:col-span-1">
            {/* Gradient Card - Updates based on analysis period */}
            <GradientCard 
              period={analysisPeriod}
              profitValue={currentProfitData.value}
              profitTrend={currentProfitData.trend}
            />

            {/* Recent Transactions */}
            <div ref={transactionsRef}>
              <RecentTransactions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
