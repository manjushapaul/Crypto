"use client";

import { useState } from "react";
import Explore, { type Asset } from "@/components/dashboard/Explore";
import { usePortfolio } from "@/context/PortfolioContext";

/**
 * Explore Page
 * 
 * Cryptocurrency discovery and exploration page
 * 
 * Features:
 * - Two-column responsive layout matching Home page
 * - Left: Discover section with asset cards and search
 * - Right: Quick insights and market trends
 * - Featured assets highlighting
 * - Search and filter functionality
 * - Asset detail modal with "Add to Portfolio" action
 * - Tag-based categorization
 * - Portfolio addition flow with notifications
 * 
 * Design:
 * - Matches dashboard styling exactly
 * - bg-[#eaebfd] left column, gradient right column
 * - Dashboard color palette throughout (#ff9500, #22243A, #ffe369)
 * - Fully responsive and accessible
 * 
 * Portfolio Integration:
 * - Uses PortfolioContext for global state management
 * - Adding coin creates notification in bell icon
 * - Added coins appear in Home/Portfolio tab above Current Market
 * - Notification shows "[Coin Name] successfully added to your Portfolio"
 */
export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Get portfolio context for adding coins and watchlist
  const { addToPortfolio, addToWatchlist } = usePortfolio();

  /**
   * Handle search query change
   * In production, fetch filtered results from API
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log("Search query:", query);
    // TODO: Fetch filtered assets from API
    // fetchAssets({ search: query, filter: selectedFilter });
  };

  /**
   * Handle filter change
   * In production, fetch filtered results from API
   */
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    console.log("Filter changed:", filter);
    // TODO: Fetch filtered assets from API
    // fetchAssets({ search: searchQuery, filter });
  };

  /**
   * Handle asset click
   * Navigate to asset detail page or show detailed modal
   */
  const handleAssetClick = (assetId: string) => {
    console.log("Asset clicked:", assetId);
    // TODO: Navigate to asset details or fetch additional data
    // router.push(`/assets/${assetId}`);
    // or fetchAssetDetails(assetId);
  };

  /**
   * Handle add to portfolio
   * Adds coin to portfolio and creates notification
   */
  const handleAddToPortfolio = (asset: Asset) => {
    addToPortfolio({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      logo: asset.logo,
      gradient: asset.gradient,
      price: asset.price,
      change24h: asset.change24h,
      marketCap: asset.marketCap,
      volume24h: asset.volume24h,
      // amount and addedAt will be added automatically by context
    });
    console.log("Asset added to portfolio:", asset.name);
  };

  /**
   * Handle add to watchlist
   * Adds coin to watchlist and creates notification
   * Returns true if added, false if duplicate or already in portfolio
   */
  const handleAddToWatchlist = (asset: Asset): boolean => {
    const added = addToWatchlist({
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      logo: asset.logo,
      gradient: asset.gradient,
      price: asset.price,
      change24h: asset.change24h,
      marketCap: asset.marketCap,
      volume24h: asset.volume24h,
      // amount and addedAt will be added automatically by context
    });
    
    if (added) {
      console.log("Asset added to watchlist:", asset.name);
    } else {
      console.log("Asset already in watchlist or portfolio:", asset.name);
    }
    
    return added;
  };

  /**
   * Example: Custom assets data from API
   * Uncomment to use API data instead of defaults
   */
  // const assets: Asset[] = [
  //   {
  //     id: "bitcoin",
  //     name: "Bitcoin",
  //     symbol: "BTC",
  //     logo: "₿",
  //     gradient: "from-orange-400 to-yellow-500",
  //     price: 43250.50,
  //     change24h: 5.42,
  //     marketCap: 845000000000,
  //     volume24h: 28500000000,
  //     description: "The first and most valuable cryptocurrency...",
  //     tags: ["Store of Value", "Proof of Work", "Layer 1"],
  //     chartData: [{ value: 38000 }, { value: 43250 }],
  //     isFeatured: true,
  //   },
  //   // ... more assets
  // ];

  return (
    <Explore
      searchQuery={searchQuery}
      selectedFilter={selectedFilter}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onAssetClick={handleAssetClick}
      onAddToPortfolio={handleAddToPortfolio}
      onAddToWatchlist={handleAddToWatchlist}
      // Optional: Pass custom assets data from API
      // assets={customAssets}
      // featuredAssets={customFeaturedAssets}
    />
  );
}
