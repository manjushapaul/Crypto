// ChartDataPoint interface for chart data points
export interface ChartDataPoint {
  date: string;
  value: number;
}

// CoinData interface for cryptocurrency data
export interface CoinData {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  marketCap: string;
  volume: string;
  supply: string;
  price: number;
  change: number; // Can be positive or negative
  chartData: ChartDataPoint[];
}

// Transaction interface for transaction records
export interface Transaction {
  id: string;
  date: string;
  coin: string;
  accountNumber: string;
  type: "send" | "receive" | "swap";
  amount: number;
  status: "completed" | "pending";
  iconColor: string; // Tailwind class name
}

// AccountMetric interface for account metrics
export interface AccountMetric {
  type: "Spending" | "Savings" | "Trend";
  value: number;
  change: number;
  chartData: number[];
}

// PerformanceData interface for performance metrics
export interface PerformanceData {
  percentage: number;
  comparison: string;
  chartData: ChartDataPoint[];
}




