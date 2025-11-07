import {
  PerformanceData,
  CoinData,
  AccountMetric,
  Transaction,
  ChartDataPoint,
} from "@/types";

// 1. Performance Data
export const performanceData: PerformanceData = {
  percentage: 84.02,
  comparison: "vs last month",
  chartData: [
    { date: "2024-01-01", value: 72.5 },
    { date: "2024-01-02", value: 74.2 },
    { date: "2024-01-03", value: 75.8 },
    { date: "2024-01-04", value: 76.3 },
    { date: "2024-01-05", value: 77.1 },
    { date: "2024-01-06", value: 78.5 },
    { date: "2024-01-07", value: 79.2 },
    { date: "2024-01-08", value: 80.1 },
    { date: "2024-01-09", value: 81.3 },
    { date: "2024-01-10", value: 82.0 },
    { date: "2024-01-11", value: 82.7 },
    { date: "2024-01-12", value: 83.2 },
    { date: "2024-01-13", value: 83.8 },
    { date: "2024-01-14", value: 84.02 },
  ],
};

// 2. Coin Assets
export const coinAssets: CoinData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    marketCap: "$789.5B",
    volume: "$28.2B",
    supply: "19.6M BTC",
    price: 40213.45,
    change: 2.34,
    chartData: [
      { date: "2024-01-10", value: 39500 },
      { date: "2024-01-11", value: 39800 },
      { date: "2024-01-12", value: 40000 },
      { date: "2024-01-13", value: 40150 },
      { date: "2024-01-14", value: 40213.45 },
    ],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    marketCap: "$265.8B",
    volume: "$12.5B",
    supply: "120.2M ETH",
    price: 2213.67,
    change: -1.23,
    chartData: [
      { date: "2024-01-10", value: 2240 },
      { date: "2024-01-11", value: 2230 },
      { date: "2024-01-12", value: 2220 },
      { date: "2024-01-13", value: 2218 },
      { date: "2024-01-14", value: 2213.67 },
    ],
  },
];

// 3. Account Metrics
export const accountMetrics: AccountMetric[] = [
  {
    type: "Spending",
    value: 9496,
    change: 12.5,
    chartData: [8200, 8400, 8600, 8800, 9000, 9200, 9496],
  },
  {
    type: "Savings",
    value: 11496,
    change: -3.2,
    chartData: [11800, 11700, 11650, 11600, 11550, 11520, 11496],
  },
  {
    type: "Trend",
    value: 4.32,
    change: 8.7,
    chartData: [3.2, 3.4, 3.6, 3.8, 4.0, 4.15, 4.32],
  },
];

// 4. Recent Transactions
export const recentTransactions: Transaction[] = [
  {
    id: "txn-001",
    date: "2024-01-08",
    coin: "BTC",
    accountNumber: "****1234",
    type: "receive",
    amount: 0.025,
    status: "completed",
    iconColor: "bg-yellow-500",
  },
  {
    id: "txn-002",
    date: "2024-01-07",
    coin: "ETH",
    accountNumber: "****5678",
    type: "send",
    amount: 2.5,
    status: "completed",
    iconColor: "bg-green-500",
  },
  {
    id: "txn-003",
    date: "2024-01-05",
    coin: "BTC",
    accountNumber: "****9012",
    type: "swap",
    amount: 0.1,
    status: "completed",
    iconColor: "bg-blue-500",
  },
];

// 5. Portfolio Balance
export interface PortfolioBalance {
  total: number;
  change: number;
  previousBalance: number;
}

export const portfolioBalance: PortfolioBalance = {
  total: 543323.13,
  change: 2.5,
  previousBalance: 123324.35,
};




