import {
  PerformanceData,
  CoinData,
  AccountMetric,
  Transaction,
  ChartDataPoint,
  Message,
  Request,
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
    marketCap: 789500000000, // $789.5B
    volume: 21171999345, // $21.17B (matching screenshot volume)
    circulatingSupply: 19600000,
    totalSupply: 21000000,
    supply: "19.6M BTC",
    price: 40213.18,
    change: 2.34,
    chartData: [
      { date: "2024-01-10", value: 39500 },
      { date: "2024-01-11", value: 39800 },
      { date: "2024-01-12", value: 40000 },
      { date: "2024-01-13", value: 40150 },
      { date: "2024-01-14", value: 40213.18 },
    ],
    description: "Bitcoin is a decentralized digital currency that operates without a central bank or single administrator.",
    website: "https://bitcoin.org",
    rank: 1,
    high24h: 41250.32,
    low24h: 39890.45,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    marketCap: 265800000000, // $265.8B
    volume: 13171999345, // $13.17B (matching screenshot pattern)
    circulatingSupply: 120200000,
    totalSupply: 120200000, // Ethereum has no max supply, using circulating supply
    supply: "120.2M ETH",
    price: 2213.18,
    change: -1.23,
    chartData: [
      { date: "2024-01-10", value: 2240 },
      { date: "2024-01-11", value: 2230 },
      { date: "2024-01-12", value: 2220 },
      { date: "2024-01-13", value: 2218 },
      { date: "2024-01-14", value: 2213.18 },
    ],
    description: "Ethereum is a decentralized platform that runs smart contracts and decentralized applications.",
    website: "https://ethereum.org",
    rank: 2,
    high24h: 2298.76,
    low24h: 2198.33,
  },
  {
    id: "ripple",
    name: "Ripple",
    symbol: "XRP",
    icon: "https://assets.coingecko.com/coins/images/44/large/xrp.png",
    marketCap: 35000000000,
    volume: 2500000000,
    circulatingSupply: 54500000000,
    totalSupply: 100000000000,
    supply: "54.5B XRP",
    price: 0.64,
    change: 3.12,
    chartData: [
      { date: "2024-01-10", value: 0.62 },
      { date: "2024-01-11", value: 0.625 },
      { date: "2024-01-12", value: 0.63 },
      { date: "2024-01-13", value: 0.635 },
      { date: "2024-01-14", value: 0.64 },
    ],
    description: "XRP is a digital asset built for payments, enabling fast and low-cost international transfers.",
    website: "https://ripple.com",
    rank: 6,
    high24h: 0.67,
    low24h: 0.61,
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    icon: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    marketCap: 18000000000,
    volume: 800000000,
    circulatingSupply: 35000000000,
    totalSupply: 45000000000,
    supply: "35B ADA",
    price: 0.52,
    change: 1.85,
    chartData: [
      { date: "2024-01-10", value: 0.51 },
      { date: "2024-01-11", value: 0.515 },
      { date: "2024-01-12", value: 0.518 },
      { date: "2024-01-13", value: 0.52 },
      { date: "2024-01-14", value: 0.52 },
    ],
    description: "Cardano is a proof-of-stake blockchain platform focused on security and sustainability.",
    website: "https://cardano.org",
    rank: 10,
    high24h: 0.54,
    low24h: 0.50,
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    icon: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    marketCap: 48000000000,
    volume: 3200000000,
    circulatingSupply: 450000000,
    totalSupply: 580000000,
    supply: "450M SOL",
    price: 106.78,
    change: 5.42,
    chartData: [
      { date: "2024-01-10", value: 101 },
      { date: "2024-01-11", value: 103 },
      { date: "2024-01-12", value: 105 },
      { date: "2024-01-13", value: 106 },
      { date: "2024-01-14", value: 106.78 },
    ],
    description: "Solana is a high-performance blockchain supporting fast, secure, and scalable decentralized apps.",
    website: "https://solana.com",
    rank: 5,
    high24h: 108.50,
    low24h: 100.20,
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

// 6. Messages Data
export const inboxMessages: Message[] = [
  {
    id: "msg-001",
    sender: "Support Team",
    subject: "Account Security Alert",
    preview: "We detected a new login from an unrecognized device. If this wasn't you, please secure your account immediately.",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    isRead: false,
    folder: "inbox",
    threadId: "thread-001",
  },
  {
    id: "msg-002",
    sender: "Trading Platform",
    subject: "Your BTC withdrawal is complete",
    preview: "Your withdrawal of 0.5 BTC has been successfully processed and sent to your wallet.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    folder: "inbox",
    threadId: "thread-002",
  },
  {
    id: "msg-003",
    sender: "Market Updates",
    subject: "Bitcoin reaches new all-time high",
    preview: "Bitcoin has reached $65,000, marking a new milestone. Check your portfolio performance.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: true,
    folder: "inbox",
    threadId: "thread-003",
  },
  {
    id: "msg-004",
    sender: "John Smith",
    subject: "P2P Trade Request",
    preview: "Hi, I'm interested in buying 0.1 ETH. Are you available for a P2P trade?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    isRead: true,
    folder: "inbox",
    threadId: "thread-004",
  },
  {
    id: "msg-005",
    sender: "Rewards Program",
    subject: "You've earned 50 bonus points!",
    preview: "Congratulations! You've completed your weekly trading goal and earned 50 bonus points.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    folder: "inbox",
    threadId: "thread-005",
  },
  {
    id: "msg-006",
    sender: "Sarah Johnson",
    subject: "Re: Investment opportunity",
    preview: "Thanks for your interest. I've attached the proposal document for your review.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
    isRead: false,
    folder: "inbox",
    threadId: "thread-006",
  },
  {
    id: "msg-007",
    sender: "System Notification",
    subject: "Scheduled maintenance tonight",
    preview: "We'll be performing scheduled maintenance from 2 AM to 4 AM UTC. Services may be temporarily unavailable.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    isRead: true,
    folder: "inbox",
    threadId: "thread-007",
  },
  {
    id: "msg-008",
    sender: "Michael Chen",
    subject: "Partnership inquiry",
    preview: "I represent a crypto exchange platform and would like to discuss potential partnership opportunities.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    isRead: true,
    folder: "inbox",
    threadId: "thread-008",
  },
];

export const sentMessages: Message[] = [
  {
    id: "sent-001",
    sender: "You",
    subject: "Re: P2P Trade Request",
    preview: "Yes, I'm available. Let's discuss the details.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10), // 10 hours ago
    isRead: true,
    folder: "sent",
    threadId: "thread-004",
  },
  {
    id: "sent-002",
    sender: "You",
    subject: "Investment opportunity inquiry",
    preview: "I'm interested in learning more about your investment proposal.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 40), // 40 hours ago
    isRead: true,
    folder: "sent",
    threadId: "thread-006",
  },
];

// 7. Requests Data
export const requests: Request[] = [
  {
    id: "req-001",
    type: "incoming",
    sender: "John Smith",
    amount: 0.05,
    currency: "BTC",
    currencySymbol: "₿",
    description: "Request 0.05 BTC for P2P Trade",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: "pending",
    iconBg: "#F7931A",
  },
  {
    id: "req-002",
    type: "outgoing",
    sender: "You",
    amount: 2.5,
    currency: "ETH",
    currencySymbol: "◆",
    description: "Request 2.5 ETH payment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "pending",
    iconBg: "#4CAF50",
  },
  {
    id: "req-003",
    type: "incoming",
    sender: "Sarah Johnson",
    amount: 1500,
    currency: "XRP",
    currencySymbol: "X",
    description: "Request 1500 XRP for services",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    status: "pending",
    iconBg: "#23292F",
  },
  {
    id: "req-004",
    type: "incoming",
    sender: "Michael Chen",
    amount: 0.1,
    currency: "BTC",
    currencySymbol: "₿",
    description: "Request 0.1 BTC for investment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    status: "completed",
    iconBg: "#F7931A",
  },
  {
    id: "req-005",
    type: "outgoing",
    sender: "You",
    amount: 100,
    currency: "SOL",
    currencySymbol: "S",
    description: "Request 100 SOL payment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: "pending",
    iconBg: "#9945FF",
  },
];




