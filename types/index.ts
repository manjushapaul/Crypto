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
  marketCap: number; // Numeric value for market cap in USD
  volume: number; // Numeric value for 24h volume in USD
  circulatingSupply: number; // Current circulating supply
  totalSupply: number; // Maximum total supply
  supply: string; // Formatted supply string (legacy)
  price: number;
  change: number; // Can be positive or negative
  chartData: ChartDataPoint[];
  // Optional detailed info for modal
  description?: string;
  website?: string;
  rank?: number;
  high24h?: number;
  low24h?: number;
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

// Message interface for inbox messages
export interface Message {
  id: string;
  sender: string;
  senderAvatar?: string;
  subject: string;
  preview: string;
  timestamp: Date;
  isRead: boolean;
  folder: "inbox" | "sent" | "archived";
  threadId?: string; // For grouping messages in threads
}

// Message thread interface for conversation view
export interface MessageThread {
  id: string;
  participants: string[];
  subject: string;
  messages: Message[];
  lastMessageAt: Date;
  isRead: boolean;
}

// Request interface for P2P payment/crypto requests
export interface Request {
  id: string;
  type: "incoming" | "outgoing";
  sender: string;
  senderAvatar?: string;
  amount: number;
  currency: string;
  currencySymbol: string;
  description: string;
  timestamp: Date;
  status: "pending" | "completed" | "declined";
  iconBg?: string;
}




