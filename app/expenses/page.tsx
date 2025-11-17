"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

/**
 * Expenses Page - Crypto Expenses Dashboard
 * 
 * Features:
 * - Two-column responsive layout
 * - Total Expenses Overview card (dark themed)
 * - This Month summary card (gradient themed)
 * - Filter dropdown integrated in header
 * - Transaction list with multiple cryptocurrencies
 * - Matches Home page styling and structure
 */

// Chart data for expenses overview
const expenseChartData = [
  { date: "Jan 1", value: 15000 },
  { date: "Jan 3", value: 18000 },
  { date: "Jan 5", value: 16500 },
  { date: "Jan 7", value: 19000 },
  { date: "Jan 9", value: 21000 },
  { date: "Jan 11", value: 19500 },
  { date: "Jan 13", value: 22000 },
  { date: "Jan 15", value: 20500 },
  { date: "Jan 17", value: 23000 },
  { date: "Jan 19", value: 24500 },
];

// Default transactions with multiple cryptocurrencies
const defaultTransactions = [
  { id: 1, currency: "BTC", date: "Jan 7, 2024", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", amount: -0.0234, iconBg: "#F7931A" },
  { id: 2, currency: "ETH", date: "Jan 7, 2024", address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", amount: -1.5432, iconBg: "#627EEA" },
  { id: 3, currency: "XRP", date: "Jan 6, 2024", address: "rN7n7otQDd6FczFgLdlqtyMVrn3e5Z4cxs", amount: -500.00, iconBg: "#23292F" },
  { id: 4, currency: "LTC", date: "Jan 6, 2024", address: "LZxr1w3KmKm1WDdT7bHPkj38G4PDQZQX9q", amount: -5.25, iconBg: "#345D9D" },
  { id: 5, currency: "ADA", date: "Jan 5, 2024", address: "addr1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", amount: -1200.50, iconBg: "#0033AD" },
  { id: 6, currency: "SOL", date: "Jan 5, 2024", address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", amount: -15.75, iconBg: "#14F195" },
  { id: 7, currency: "DOGE", date: "Jan 4, 2024", address: "DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L", amount: -8500.00, iconBg: "#C2A633" },
  { id: 8, currency: "BNB", date: "Jan 4, 2024", address: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2", amount: -3.45, iconBg: "#F3BA2F" },
  { id: 9, currency: "BTC", date: "Jan 3, 2024", address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq", amount: -0.0156, iconBg: "#F7931A" },
  { id: 10, currency: "ETH", date: "Jan 3, 2024", address: "0x8da5cb5b3f3ed63f6e0bb5f35f5e1e7c24d5f6a9", amount: -2.3421, iconBg: "#627EEA" },
];

// Currency options for filter
const currencies = ["All Currencies", "BTC", "ETH", "XRP", "LTC", "ADA", "SOL", "DOGE", "BNB"];

/**
 * Render cryptocurrency logo SVG
 */
const renderCryptoLogo = (currency: string) => {
  switch (currency) {
    case "BTC":
      return (
        <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
            fill="#F7931A"
          />
        </svg>
      );
    case "ETH":
      return (
        <svg width="36" height="36" viewBox="0 0 256 417" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" fill="#7681c5" fillOpacity="0.8" />
          <path d="M127.962 0L0 212.32l127.962 75.639V154.158z" fill="#7681c5" />
          <path d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" fill="#7681c5" fillOpacity="0.8" />
          <path d="M127.962 416.905v-104.72L0 236.585z" fill="#7681c5" />
          <path d="M127.961 287.958l127.96-75.637-127.96-58.162z" fill="#7681c5" fillOpacity="0.5" />
          <path d="M0 212.32l127.96 75.638v-133.8z" fill="#7681c5" fillOpacity="0.7" />
        </svg>
      );
    default:
      return null;
  }
};

export default function ExpensesPage() {
  const [filterCurrency, setFilterCurrency] = useState("All Currencies");
  const [transactions] = useState(defaultTransactions);

  // Filter transactions based on selected currency
  const filteredTransactions = filterCurrency === "All Currencies"
    ? transactions
    : transactions.filter((tx) => tx.currency === filterCurrency);

  // Calculate totals
  const totalExpenses = transactions.reduce((sum, tx) => sum + Math.abs(tx.amount * getPrice(tx.currency)), 0);
  const monthlyChange = 10.4; // Example percentage

  return (
    <div className="p-0 sm:p-0 lg:p-0">
      <div className="mx-auto max-w-screen-2xl space-y-6">
        {/* Main Layout - 2 Column Design */}
        <div className="grid grid-cols-1 lg:grid-cols-3 min-h-screen" >
          {/* Left Column - Expenses Dashboard */}
          <div className="lg:col-span-2 space-y-6 p-3 bg-[#eaebfd] dark:bg-gray-900 sm:p-8">
            
            {/* Page Title Header with Filter */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Crypto Expenses</h1>
              
              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  value={filterCurrency}
                  onChange={(e) => setFilterCurrency(e.target.value)}
                  className="appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 pr-10 text-sm text-gray-700 dark:text-gray-200 shadow-sm transition-colors hover:border-gray-400 dark:hover:border-gray-500 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                >
                  {currencies.map((currency) => (
                    <option key={currency} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="h-4 w-4 text-gray-500" fill="none" 
                  stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" 
                    strokeWidth={1} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Expenses Overview Card - Dark Theme */}
            <div className="overflow-hidden rounded-2xl bg-[#1C1C1E] shadow-lg">
              {/* Header */}
              <div className="mb-4 flex items-center gap-3 px-6 pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                  <svg className="h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Total Expenses Overview</h3>
                <span className="ml-auto rounded-full bg-[#28A745] px-3 py-1 text-xs font-semibold text-white">
                  16%
                </span>
              </div>

              {/* Main Value */}
              <div className="mb-2 px-6">
                <h2 className="text-4xl font-normal text-white">{formatCurrency(totalExpenses)}</h2>
              </div>

              {/* Comparison Text */}
              <p className="mb-6 px-6 text-sm text-gray-400">
                Compared to the {formatCurrency(totalExpenses * 0.85)} last week
              </p>

              {/* Chart - Properly aligned with no black space */}
              <div className="w-full">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart 
                    data={expenseChartData}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF9500" stopOpacity={0.3} />
                        <stop offset="50%" stopColor="#FF9500" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#1C1C1E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#FF9500"
                      strokeWidth={2}
                      fill="url(#expenseGradient)"
                      fillOpacity={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transaction List */}
            <div>
              <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Recent Expense Transactions</h3>
              
              {filteredTransactions.length === 0 ? (
                <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center shadow-md">
                  <p className="text-gray-500 dark:text-gray-400">No transactions found for {filterCurrency}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="cursor-pointer rounded-xl border border-gray-100 dark:border-gray-700 bg-[#F5F7FA] dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-xl"
                    >
                      {/* Header: Icon + Currency */}
                      <div className="mb-4 flex items-center gap-4">
                        <div className="shrink-0">
                          {/* Crypto Icon */}
                          <div className="flex h-12 w-12 items-center justify-center">
                            {transaction.currency === "BTC" || transaction.currency === "ETH" ? (
                              renderCryptoLogo(transaction.currency)
                            ) : (
                              <div
                                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                                style={{ backgroundColor: transaction.iconBg }}
                              >
                                {transaction.currency.substring(0, 1)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{transaction.currency}</h4>
                        </div>
                      </div>

                      {/* Data Section */}
                      <div className="space-y-1">
                        {/* Amount in Crypto */}
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Amount:
                          </p>
                          <p className="text-sm font-bold text-red-600 dark:text-red-400">
                            {transaction.amount} {transaction.currency}
                          </p>
                        </div>

                        {/* USD Value */}
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            USD Value:
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(Math.abs(transaction.amount * getPrice(transaction.currency)))}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Date:
                          </p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {transaction.date}
                          </p>
                        </div>

                        {/* Address */}
                        <div className="flex items-start gap-2">
                          <p className="shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Address:
                          </p>
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-300 break-all">
                            {transaction.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 bg-linear-to-r from-gray-100 via-blue-100 to-gray-100 dark:bg-linear-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-3 sm:p-8 lg:col-span-1">
            
            {/* This Month Card - Gradient Style matching GradientCard */}
            <div className="relative min-h-[200px] rounded-card bg-gradient-card bg-[linear-gradient(135deg,#1d1d36_0%,#ecbbaa_40%,#dac28f_60%,#757ad0_100%)] p-6 shadow-card sm:min-h-[220px]">
              {/* Grid Icon - Top Right */}
              <div className="absolute right-6 top-6">
                <svg
                  className="h-6 w-6 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Label */}
                <p className="text-xs font-medium uppercase tracking-wider text-white/80 sm:text-sm">
                  THIS MONTH
                </p>

                {/* Main Balance */}
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  {formatCurrency(totalExpenses)}
                </h2>

                {/* Monthly Profit Section */}
                <div className="pt-2">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-white/70">
                    MONTHLY EXPENSES
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white sm:text-2xl">
                      {formatCurrency(totalExpenses * 0.35)}
                    </span>
                    <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs font-semibold text-white">
                        +{monthlyChange}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="space-y-4 rounded-2xl bg-[#F5F7FA] dark:bg-gray-800 p-6 shadow-md dark:shadow-gray-900/50">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Expense Summary</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{filteredTransactions.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average per Transaction</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(totalExpenses / filteredTransactions.length)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Highest Expense</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      Math.max(...filteredTransactions.map((tx) => Math.abs(tx.amount * getPrice(tx.currency))))
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper function to get cryptocurrency price in USD
 * (In a real app, this would fetch from an API)
 */
function getPrice(currency: string): number {
  const prices: Record<string, number> = {
    BTC: 43250,
    ETH: 2234,
    XRP: 0.52,
    LTC: 72,
    ADA: 0.48,
    SOL: 98,
    DOGE: 0.08,
    BNB: 310,
  };
  return prices[currency] || 1;
}

