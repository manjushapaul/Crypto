/**
 * CurrentMarket Component - Usage Examples
 * 
 * This file contains practical examples of how to use the CurrentMarket component
 * in various scenarios. Copy and adapt these examples for your needs.
 */

import CurrentMarket from "./CurrentMarket";
import { CoinData } from "@/types";

/* ============================================================================
 * EXAMPLE 1: Basic Usage (Default Data)
 * ============================================================================
 * The simplest way to use the component with built-in dummy data.
 */

export function Example1_BasicUsage() {
  return (
    <div className="p-8">
      <CurrentMarket />
    </div>
  );
}

/* ============================================================================
 * EXAMPLE 2: Custom Asset Data
 * ============================================================================
 * Provide your own cryptocurrency data, useful for fetching from APIs.
 */

export function Example2_CustomData() {
  const customAssets: CoinData[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      icon: "https://example.com/btc.png",
      marketCap: 850000000000,
      volume: 28500000000,
      circulatingSupply: 19600000,
      totalSupply: 21000000,
      supply: "19.6M BTC",
      price: 43500.25,
      change: 5.67,
      chartData: [
        { date: "2024-01-01", value: 41000 },
        { date: "2024-01-02", value: 42000 },
        { date: "2024-01-03", value: 42500 },
        { date: "2024-01-04", value: 43000 },
        { date: "2024-01-05", value: 43500.25 },
      ],
      description: "Bitcoin is the world's first cryptocurrency.",
      website: "https://bitcoin.org",
      rank: 1,
      high24h: 44000,
      low24h: 42800,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      icon: "https://example.com/eth.png",
      marketCap: 280000000000,
      volume: 15000000000,
      circulatingSupply: 120500000,
      totalSupply: 120500000,
      supply: "120.5M ETH",
      price: 2325.80,
      change: -2.15,
      chartData: [
        { date: "2024-01-01", value: 2400 },
        { date: "2024-01-02", value: 2380 },
        { date: "2024-01-03", value: 2350 },
        { date: "2024-01-04", value: 2340 },
        { date: "2024-01-05", value: 2325.80 },
      ],
      description: "Ethereum is a decentralized platform for smart contracts.",
      website: "https://ethereum.org",
      rank: 2,
      high24h: 2420,
      low24h: 2310,
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      icon: "https://example.com/ada.png",
      marketCap: 15000000000,
      volume: 500000000,
      circulatingSupply: 35000000000,
      totalSupply: 45000000000,
      supply: "35B ADA",
      price: 0.428,
      change: 1.23,
      chartData: [
        { date: "2024-01-01", value: 0.41 },
        { date: "2024-01-02", value: 0.42 },
        { date: "2024-01-03", value: 0.425 },
        { date: "2024-01-04", value: 0.427 },
        { date: "2024-01-05", value: 0.428 },
      ],
      description: "Cardano is a proof-of-stake blockchain platform.",
      website: "https://cardano.org",
      rank: 8,
      high24h: 0.435,
      low24h: 0.415,
    },
  ];

  return (
    <div className="p-8">
      <CurrentMarket assets={customAssets} />
    </div>
  );
}

/* ============================================================================
 * EXAMPLE 3: Fetching Data from API
 * ============================================================================
 * Example showing how to fetch and display live cryptocurrency data.
 */

export function Example3_APIData() {
  // Note: In a real app, use React hooks for data fetching
  // This is a simplified example showing the structure
  
  const [assets, setAssets] = React.useState<CoinData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchCryptoData() {
      try {
        // Example API call (replace with your actual API)
        const response = await fetch('/api/crypto/market');
        const data = await response.json();
        
        // Transform API data to match CoinData interface
        const transformedData: CoinData[] = data.map((coin: any) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          icon: coin.image,
          marketCap: coin.market_cap,
          volume: coin.total_volume,
          circulatingSupply: coin.circulating_supply,
          totalSupply: coin.total_supply || coin.circulating_supply,
          supply: `${(coin.circulating_supply / 1000000).toFixed(1)}M ${coin.symbol}`,
          price: coin.current_price,
          change: coin.price_change_percentage_24h,
          chartData: coin.sparkline_7d.map((value: number, index: number) => ({
            date: new Date(Date.now() - (7 - index) * 24 * 60 * 60 * 1000).toISOString(),
            value,
          })),
          description: coin.description,
          website: coin.website,
          rank: coin.market_cap_rank,
          high24h: coin.high_24h,
          low24h: coin.low_24h,
        }));

        setAssets(transformedData);
      } catch (error) {
        console.error('Failed to fetch crypto data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCryptoData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading cryptocurrency data...</div>;
  }

  return (
    <div className="p-8">
      <CurrentMarket assets={assets} />
    </div>
  );
}

/* ============================================================================
 * EXAMPLE 4: Dashboard Layout Integration
 * ============================================================================
 * Show how to integrate CurrentMarket in a typical dashboard layout.
 */

export function Example4_DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Crypto Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content - Current Market */}
          <div className="lg:col-span-2">
            <CurrentMarket />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Portfolio</h3>
              <p className="text-gray-600">Sidebar content here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * EXAMPLE 5: With Custom Styling
 * ============================================================================
 * Customize the appearance using className prop.
 */

export function Example5_CustomStyling() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 p-8">
      <CurrentMarket 
        className="mx-auto max-w-4xl shadow-2xl"
      />
    </div>
  );
}

/* ============================================================================
 * EXAMPLE 6: Filtered Assets (Top 5)
 * ============================================================================
 * Show only the top performing assets.
 */

export function Example6_FilteredAssets() {
  const [allAssets, setAllAssets] = React.useState<CoinData[]>([]);
  
  // Filter to show only top 5 by market cap
  const topAssets = React.useMemo(() => {
    return [...allAssets]
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 5);
  }, [allAssets]);

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between 1">
        <h2 className="text-2xl font-bold">Top 5 Cryptocurrencies</h2>
      </div>
      <CurrentMarket assets={topAssets} />
    </div>
  );
}

/* ============================================================================
 * EXAMPLE 7: Multiple Market Views
 * ============================================================================
 * Display different market segments (gainers, losers, new).
 */

export function Example7_MultipleViews() {
  const [activeTab, setActiveTab] = React.useState<'all' | 'gainers' | 'losers'>('all');
  const [assets, setAssets] = React.useState<CoinData[]>([]);

  const filteredAssets = React.useMemo(() => {
    switch (activeTab) {
      case 'gainers':
        return assets.filter(asset => asset.change > 0);
      case 'losers':
        return assets.filter(asset => asset.change < 0);
      default:
        return assets;
    }
  }, [assets, activeTab]);

  return (
    <div className="p-8">
      {/* Tab Navigation */}
      <div className="mb-6 flex sm:gap-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Markets
        </button>
        <button
          onClick={() => setActiveTab('gainers')}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${
            activeTab === 'gainers'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Top Gainers
        </button>
        <button
          onClick={() => setActiveTab('losers')}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${
            activeTab === 'losers'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Top Losers
        </button>
      </div>

      <CurrentMarket assets={filteredAssets} />
    </div>
  );
}

/* ============================================================================
 * EXAMPLE 8: Real-time Updates with WebSocket
 * ============================================================================
 * Example of updating prices in real-time (conceptual).
 */

export function Example8_RealtimeUpdates() {
  const [assets, setAssets] = React.useState<CoinData[]>([]);

  React.useEffect(() => {
    // Simulated WebSocket connection
    const ws = new WebSocket('wss://example.com/crypto-prices');

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      setAssets(prevAssets =>
        prevAssets.map(asset =>
          asset.id === update.id
            ? { ...asset, price: update.price, change: update.change }
            : asset
        )
      );
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Market Data</h2>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>
      <CurrentMarket assets={assets} />
    </div>
  );
}

/* ============================================================================
 * UTILITY: React Import (add this if using the examples)
 * ============================================================================ */

import React from "react";

// Export all examples for easy access
export const CurrentMarketExamples = {
  Example1_BasicUsage,
  Example2_CustomData,
  Example3_APIData,
  Example4_DashboardLayout,
  Example5_CustomStyling,
  Example6_FilteredAssets,
  Example7_MultipleViews,
  Example8_RealtimeUpdates,
};









