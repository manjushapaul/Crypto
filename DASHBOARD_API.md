# Dashboard Components - API Reference

## Table of Contents
- [BalanceHeader Component](#balanceheader-component)
- [TabbedCards Component](#tabbedcards-component)
- [Usage Examples](#usage-examples)
- [Type Definitions](#type-definitions)
- [Styling Guide](#styling-guide)

---

## BalanceHeader Component

Header section displaying account balance with tab navigation.

### Import

```tsx
import BalanceHeader from "@/components/dashboard/BalanceHeader";
```

### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `balance` | `number` | `portfolioBalance.total` | No | Main account balance to display |
| `previousBalance` | `number` | `portfolioBalance.previousBalance` | No | Previous balance for growth indicator |
| `tabs` | `string[]` | `["PORTFOLIO", "ASSETS", "FUNDING", "P2P"]` | No | Array of tab labels |
| `activeTab` | `string` | `"PORTFOLIO"` | No | Currently active tab |
| `onTabChange` | `(tab: string) => void` | `undefined` | No | Callback fired when tab is clicked |

### Features

- ✅ Large, bold balance display (responsive: 4xl → 6xl)
- ✅ Growth indicator with arrow icon
- ✅ Horizontal tab menu with pill-style active state
- ✅ Keyboard accessible (Tab, Enter, Space)
- ✅ ARIA labels for screen readers
- ✅ Soft shadows and rounded corners
- ✅ Backdrop blur effect on tab container

### Example

```tsx
import { useState } from "react";
import BalanceHeader from "@/components/dashboard/BalanceHeader";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("PORTFOLIO");

  return (
    <BalanceHeader
      balance={543323.13}
      previousBalance={123324.32}
      tabs={["PORTFOLIO", "ASSETS", "FUNDING", "P2P"]}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        console.log("Tab changed to:", tab);
      }}
    />
  );
}
```

### Accessibility

- **Keyboard Navigation**: Tab between tabs, Enter/Space to activate
- **ARIA Attributes**:
  - `role="tablist"` on tab container
  - `role="tab"` on each tab button
  - `aria-selected` indicates active tab
  - `aria-controls` links tab to panel
  - `aria-label` on tab list
- **Focus Management**: Active tab has `tabIndex={0}`, others have `tabIndex={-1}`
- **Visual Focus**: Focus ring with `focus:ring-2 focus:ring-blue-500`

---

## TabbedCards Component

Three-card dashboard layout with performance, coin assets, and accounts.

### Import

```tsx
import TabbedCards from "@/components/dashboard/TabbedCards";
```

### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `performanceData` | `PerformanceData` | See below | No | Performance statistics data |
| `coinData` | `CoinData` | See below | No | Cryptocurrency counts |
| `accountData` | `AccountData` | See below | No | Spending/savings data |
| `onCardClick` | `(cardType) => void` | `undefined` | No | Callback when card is clicked |

### Type Definitions

```typescript
interface PerformanceData {
  percentage: number;              // e.g., 84.02
  weekGrowth: number;              // e.g., 5.32
  comparisonText: string;          // e.g., "Compared to the $1,232.21 last week"
  chartData: Array<{
    date: string;                  // ISO date string
    value: number;                 // Numeric value
  }>;
}

interface CoinData {
  bitcoin: number;                 // Bitcoin count (e.g., 34)
  ethereum: number;                // Ethereum count (e.g., 16)
}

interface AccountData {
  spending: {
    value: number;                 // Amount in USD (e.g., 9496)
    chartData: number[];           // 12-day sparkline heights
  };
  savings: {
    value: number;                 // Amount in USD (e.g., 11496)
    chartData: number[];           // 12-day sparkline heights
  };
  trend: number;                   // Trend value (e.g., 4.32)
}

type CardType = "performance" | "coins" | "accounts";
```

### Features

#### CardComparison (Performance Card)
- ✅ Deep blue-purple gradient background
- ✅ Large percentage display (84.02%)
- ✅ Week-on-week growth indicator (+5.32)
- ✅ Comparison text
- ✅ Layered area chart (two blue gradients)
- ✅ Responsive sizing
- ✅ Tooltip on hover

#### CardCoinAssets (Coin Asset Card)
- ✅ Two-column pill design
- ✅ Bitcoin pill (white, orange icon)
- ✅ Ethereum pill (purple gradient)
- ✅ Circular icons (48px)
- ✅ Count display below icons
- ✅ Diamond icon in header

#### CardAccounts (Accounts Card)
- ✅ Spending section with blue sparkline
- ✅ Savings section with red sparkline
- ✅ 12-day bar charts
- ✅ USD amounts right-aligned
- ✅ Trend indicator with arrow
- ✅ "Last 12 days" labels

### Example

```tsx
import TabbedCards from "@/components/dashboard/TabbedCards";

export default function Dashboard() {
  const performanceData = {
    percentage: 84.02,
    weekGrowth: 5.32,
    comparisonText: "Compared to the $1,232.21 last week",
    chartData: [
      { date: "2024-01-01", value: 72.5 },
      { date: "2024-01-02", value: 74.2 },
      // ... more data
    ],
  };

  const coinData = {
    bitcoin: 34,
    ethereum: 16,
  };

  const accountData = {
    spending: {
      value: 9496,
      chartData: [20, 25, 30, 22, 28, 35, 40, 32, 38, 42, 45, 48],
    },
    savings: {
      value: 11496,
      chartData: [25, 28, 30, 26, 32, 38, 42, 36, 40, 44, 48, 50],
    },
    trend: 4.32,
  };

  return (
    <TabbedCards
      performanceData={performanceData}
      coinData={coinData}
      accountData={accountData}
      onCardClick={(cardType) => {
        console.log("Card clicked:", cardType);
        
        // Example: Open modal based on card type
        if (cardType === "performance") {
          openPerformanceModal();
        } else if (cardType === "coins") {
          openCoinAssetsModal();
        } else if (cardType === "accounts") {
          openAccountsModal();
        }
      }}
    />
  );
}
```

### Accessibility

- **Keyboard Navigation**: Tab between cards, Enter/Space to click
- **ARIA Attributes**:
  - `role="button"` on clickable cards
  - `role="region"` on main container
  - `aria-label` on each card
  - `tabIndex={0}` on clickable cards
- **Focus Management**: Visible focus ring on all interactive elements
- **Visual Feedback**: Hover states with scale and shadow

---

## Usage Examples

### Example 1: Basic Dashboard

```tsx
"use client";

import { useState } from "react";
import BalanceHeader from "@/components/dashboard/BalanceHeader";
import TabbedCards from "@/components/dashboard/TabbedCards";

export default function BasicDashboard() {
  const [activeTab, setActiveTab] = useState("PORTFOLIO");

  return (
    <div className="space-y-6 p-8">
      <BalanceHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {activeTab === "PORTFOLIO" && (
        <TabbedCards />
      )}
    </div>
  );
}
```

### Example 2: With Custom Data

```tsx
"use client";

import { useState, useEffect } from "react";
import BalanceHeader from "@/components/dashboard/BalanceHeader";
import TabbedCards from "@/components/dashboard/TabbedCards";

export default function CustomDashboard() {
  const [activeTab, setActiveTab] = useState("PORTFOLIO");
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Fetch data from API
    async function fetchData() {
      const response = await fetch("/api/dashboard");
      const data = await response.json();
      setDashboardData(data);
    }
    fetchData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-8">
      <BalanceHeader
        balance={dashboardData.balance}
        previousBalance={dashboardData.previousBalance}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {activeTab === "PORTFOLIO" && (
        <TabbedCards
          performanceData={dashboardData.performance}
          coinData={dashboardData.coins}
          accountData={dashboardData.accounts}
          onCardClick={(cardType) => {
            console.log("Opening details for:", cardType);
          }}
        />
      )}
    </div>
  );
}
```

### Example 3: With Modal Integration

```tsx
"use client";

import { useState } from "react";
import BalanceHeader from "@/components/dashboard/BalanceHeader";
import TabbedCards from "@/components/dashboard/TabbedCards";
import Modal from "@/components/ui/Modal";

export default function DashboardWithModal() {
  const [activeTab, setActiveTab] = useState("PORTFOLIO");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleCardClick = (cardType) => {
    // Set modal content based on card type
    if (cardType === "performance") {
      setModalContent({
        title: "Performance Details",
        content: "Detailed performance metrics...",
      });
    } else if (cardType === "coins") {
      setModalContent({
        title: "Coin Assets",
        content: "Detailed coin information...",
      });
    } else if (cardType === "accounts") {
      setModalContent({
        title: "Account Details",
        content: "Detailed account information...",
      });
    }
    setModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6 p-8">
        <BalanceHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {activeTab === "PORTFOLIO" && (
          <TabbedCards onCardClick={handleCardClick} />
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent?.title}
      >
        {modalContent?.content}
      </Modal>
    </>
  );
}
```

### Example 4: With Real-Time Updates

```tsx
"use client";

import { useState, useEffect } from "react";
import BalanceHeader from "@/components/dashboard/BalanceHeader";
import TabbedCards from "@/components/dashboard/TabbedCards";

export default function RealtimeDashboard() {
  const [activeTab, setActiveTab] = useState("PORTFOLIO");
  const [data, setData] = useState(getInitialData());

  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket("wss://api.example.com/dashboard");

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setData((prevData) => ({
        ...prevData,
        ...update,
      }));
    };

    return () => ws.close();
  }, []);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      <BalanceHeader
        balance={data.balance}
        previousBalance={data.previousBalance}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {activeTab === "PORTFOLIO" && (
        <TabbedCards
          performanceData={data.performance}
          coinData={data.coins}
          accountData={data.accounts}
        />
      )}
    </div>
  );
}

function getInitialData() {
  // Return initial data structure
  return {
    balance: 543323.13,
    previousBalance: 123324.32,
    performance: { /* ... */ },
    coins: { /* ... */ },
    accounts: { /* ... */ },
  };
}
```

---

## Type Definitions

Complete TypeScript type definitions for all components:

```typescript
// BalanceHeader Types
interface BalanceHeaderProps {
  balance?: number;
  previousBalance?: number;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

// TabbedCards Types
interface TabbedCardsProps {
  performanceData?: PerformanceData;
  coinData?: CoinData;
  accountData?: AccountData;
  onCardClick?: (cardType: CardType) => void;
}

interface PerformanceData {
  percentage: number;
  weekGrowth: number;
  comparisonText: string;
  chartData: ChartDataPoint[];
}

interface ChartDataPoint {
  date: string;
  value: number;
}

interface CoinData {
  bitcoin: number;
  ethereum: number;
}

interface AccountData {
  spending: AccountSection;
  savings: AccountSection;
  trend: number;
}

interface AccountSection {
  value: number;
  chartData: number[];
}

type CardType = "performance" | "coins" | "accounts";
```

---

## Styling Guide

### Color Palette

```css
/* BalanceHeader */
--header-bg: gradient-to-br from-white/80 to-purple-50/30;
--tab-active-bg: #FFFFFF;
--tab-active-text: #111827;
--tab-inactive-text: #6B7280;

/* Performance Card */
--performance-gradient: gradient-to-br from-blue-700 via-indigo-700 to-purple-800;
--growth-indicator: #10B981;
--chart-blue-1: #60A5FA;
--chart-blue-2: #2563EB;

/* Coin Asset Card */
--coin-bg: gradient-to-br from-white to-blue-50/40;
--bitcoin-icon: #F97316;
--ethereum-gradient: gradient-to-br from-purple-500 to-indigo-600;

/* Accounts Card */
--accounts-bg: #FFFFFF;
--spending-bars: #6366F1;
--savings-bars: #EF4444;
--trend-color: #10B981;
```

### Spacing

```css
/* Card Padding */
--card-padding: 1.5rem; /* 24px */

/* Card Gap */
--card-gap: 1.5rem; /* 24px */

/* Header Padding */
--header-padding-x: 2rem; /* 32px */
--header-padding-y: 1.5rem; /* 24px */
```

### Shadows

```css
/* Card Shadow */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Card Shadow on Hover */
box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

### Border Radius

```css
--header-radius: 0.75rem; /* 12px */
--card-radius: 1rem; /* 16px */
--tab-radius: 0.75rem; /* 12px */
--pill-radius: 60px;
```

---

## Best Practices

### 1. State Management

```tsx
// Use useState for tab state
const [activeTab, setActiveTab] = useState("PORTFOLIO");

// Pass callbacks to components
<BalanceHeader
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### 2. Data Fetching

```tsx
// Use useEffect for API calls
useEffect(() => {
  async function fetchData() {
    const data = await fetch("/api/dashboard").then(r => r.json());
    setDashboardData(data);
  }
  fetchData();
}, []);
```

### 3. Error Handling

```tsx
// Wrap components in ErrorBoundary
<ErrorBoundary>
  <BalanceHeader {...props} />
</ErrorBoundary>
```

### 4. Loading States

```tsx
{loading ? (
  <div>Loading...</div>
) : (
  <TabbedCards {...props} />
)}
```

### 5. Responsive Design

```tsx
// Components are responsive by default
// Grid adjusts automatically:
// - Mobile: 1 column
// - Tablet: 2 columns
// - Desktop: 3 columns
```

---

## Troubleshooting

### Issue: Tabs not changing

**Solution**: Ensure `onTabChange` callback updates state:

```tsx
<BalanceHeader
  activeTab={activeTab}
  onTabChange={(tab) => setActiveTab(tab)}  // ✅ Update state
/>
```

### Issue: Cards not clickable

**Solution**: Ensure `onCardClick` is passed to TabbedCards:

```tsx
<TabbedCards
  onCardClick={(cardType) => console.log(cardType)}  // ✅ Add callback
/>
```

### Issue: Charts not rendering

**Solution**: Ensure chart data has valid structure:

```tsx
chartData: [
  { date: "2024-01-01", value: 100 },  // ✅ Correct format
  // NOT: { x: "2024-01-01", y: 100 }  // ❌ Wrong format
]
```

### Issue: Numbers not formatting

**Solution**: Use formatCurrency utility:

```tsx
import { formatCurrency } from "@/lib/utils";

{formatCurrency(543323.13)}  // ✅ "$543,323.13"
```

---

## Support

For questions or issues:
1. Check this API reference
2. Review usage examples
3. Check component source code
4. See DASHBOARD_UPDATE.md for implementation details

---

**Last Updated**: November 7, 2025  
**Version**: 1.0.0









