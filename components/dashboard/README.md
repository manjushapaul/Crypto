# CurrentMarket Component Documentation

## Overview

The `CurrentMarket` component is a modern, fully-featured cryptocurrency market overview component that displays asset cards with comprehensive market data, interactive charts, and detailed modal views.

![CurrentMarket Component](screenshot-reference.png)

## Features

### Core Features
- ✅ **Vertical Card Layout**: Clean, modern card-based design with shadows and rounded corners
- ✅ **Comprehensive Data Display**: Shows market cap, volume, circulating supply for each asset
- ✅ **Progress Bar Visualization**: Gradient progress bar showing circulating supply percentage
- ✅ **Micro Chart**: SVG-based price trend visualization with peak highlighting
- ✅ **Interactive Modal**: Click any card to view detailed asset information
- ✅ **Hover Effects**: Smooth scale and shadow transitions
- ✅ **Responsive Design**: Mobile, tablet, and desktop optimized layouts
- ✅ **Keyboard Accessible**: Full keyboard navigation support (Tab, Enter, Escape)
- ✅ **Options Menu**: Three-dot menu for additional actions (placeholder)

### Accessibility
- ✅ Semantic HTML with proper ARIA labels
- ✅ Keyboard navigation (Tab, Enter, Space, Escape)
- ✅ Focus visible states
- ✅ Screen reader friendly
- ✅ Proper role attributes for interactive elements

### Styling
- ✅ Tailwind CSS utility classes
- ✅ Gradient backgrounds matching screenshot
- ✅ Soft shadows and rounded corners
- ✅ Smooth transitions and animations
- ✅ Color-coded icons (Bitcoin, Ethereum)

## Usage

### Basic Usage

```tsx
import CurrentMarket from "@/components/dashboard/CurrentMarket";

export default function Dashboard() {
  return <CurrentMarket />;
}
```

### With Custom Data

```tsx
import CurrentMarket from "@/components/dashboard/CurrentMarket";
import { CoinData } from "@/types";

const customAssets: CoinData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "...",
    marketCap: 789500000000,
    volume: 21171999345,
    circulatingSupply: 19600000,
    totalSupply: 21000000,
    supply: "19.6M BTC",
    price: 40213.18,
    change: 2.34,
    chartData: [
      { date: "2024-01-10", value: 39500 },
      { date: "2024-01-11", value: 39800 },
      // ... more data points
    ],
    description: "Bitcoin is a decentralized digital currency...",
    website: "https://bitcoin.org",
    rank: 1,
    high24h: 41250.32,
    low24h: 39890.45,
  },
  // ... more assets
];

export default function Dashboard() {
  return <CurrentMarket assets={customAssets} />;
}
```

### With Custom Styling

```tsx
<CurrentMarket 
  assets={myAssets}
  className="my-custom-class"
/>
```

## Component Props

### CurrentMarket Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `assets` | `CoinData[]` | `coinAssets` | Array of cryptocurrency assets to display |
| `className` | `string` | `undefined` | Additional CSS classes for the container |

### CoinData Interface

```typescript
interface CoinData {
  id: string;                    // Unique identifier
  name: string;                  // Asset name (e.g., "Bitcoin")
  symbol: string;                // Asset symbol (e.g., "BTC")
  icon: string;                  // Icon URL (currently using initials)
  marketCap: number;             // Market cap in USD
  volume: number;                // 24h volume in USD
  circulatingSupply: number;     // Current circulating supply
  totalSupply: number;           // Maximum total supply
  supply: string;                // Formatted supply string (legacy)
  price: number;                 // Current price in USD
  change: number;                // 24h price change percentage
  chartData: ChartDataPoint[];   // Historical price data
  // Optional fields for detail modal
  description?: string;          // Asset description
  website?: string;              // Official website URL
  rank?: number;                 // Market rank
  high24h?: number;              // 24h high price
  low24h?: number;               // 24h low price
}
```

### ChartDataPoint Interface

```typescript
interface ChartDataPoint {
  date: string;   // ISO date string
  value: number;  // Price value
}
```

## Sub-Components

### MicroChart

A lightweight SVG-based chart component for inline trend visualization.

```tsx
import MicroChart from "@/components/ui/MicroChart";

<MicroChart
  data={chartData}
  width={80}
  height={40}
  lineColor="#10B981"
  fillColor="#FEF3C7"
  showPeak={true}
/>
```

**Props:**
- `data`: ChartDataPoint[] - Chart data points
- `width`: number (default: 80) - Chart width in pixels
- `height`: number (default: 40) - Chart height in pixels
- `lineColor`: string (default: "#10B981") - Line color
- `fillColor`: string (default: "#FEF3C7") - Fill color under peak
- `showPeak`: boolean (default: true) - Show peak point indicator

### AssetDetailModal

Modal/drawer component for displaying detailed asset information.

```tsx
import AssetDetailModal from "@/components/ui/AssetDetailModal";

const [selectedAsset, setSelectedAsset] = useState<CoinData | null>(null);

<AssetDetailModal
  asset={selectedAsset}
  isOpen={!!selectedAsset}
  onClose={() => setSelectedAsset(null)}
/>
```

**Props:**
- `asset`: CoinData | null - Asset data to display
- `isOpen`: boolean - Modal open state
- `onClose`: () => void - Close callback function

## Utility Functions

### formatCurrency

Formats numbers as currency with commas and decimal places.

```typescript
import { formatCurrency } from "@/lib/utils";

formatCurrency(40213.18);              // "$40,213.18"
formatCurrency(21171999345);           // "$21,171,999,345.00"
formatCurrency(40213.18, 2, false);    // "40,213.18" (no $ sign)
```

**Parameters:**
- `value`: number - The value to format
- `decimals`: number (default: 2) - Number of decimal places
- `includeDollarSign`: boolean (default: true) - Include $ symbol

### formatCompactNumber

Formats large numbers with K, M, B, T abbreviations.

```typescript
import { formatCompactNumber } from "@/lib/utils";

formatCompactNumber(1234);           // "1.2K"
formatCompactNumber(1234567);        // "1.2M"
formatCompactNumber(1234567890);     // "1.2B"
```

**Parameters:**
- `value`: number - The value to format
- `decimals`: number (default: 1) - Number of decimal places

## Keyboard Accessibility

| Key | Action |
|-----|--------|
| `Tab` | Navigate between cards and interactive elements |
| `Shift + Tab` | Navigate backwards |
| `Enter` or `Space` | Open detail modal for focused card |
| `Escape` | Close open modal |

## Styling Customization

### Colors

The component uses the following color scheme matching the screenshot:

- **Background**: Light gradient `from-blue-50/50 to-purple-50/30`
- **Cards**: White background with shadows
- **Progress Bar**: Gradient `from-purple-500 via-pink-500 to-blue-500`
- **Chart Line**: Green `#10B981` (positive) or Red `#EF4444` (negative)
- **Chart Fill**: Yellow `#FEF3C7` (positive) or Red `#FEE2E2` (negative)

### Icons

Icon colors are defined per asset:
- **Bitcoin**: Blue gradient `from-blue-900 to-blue-700`
- **Ethereum**: Purple gradient `from-gray-700 to-purple-900`
- **Default**: Gray gradient `from-gray-600 to-gray-800`

## Responsive Breakpoints

- **Mobile** (< 640px): Stacked layout with minimal data
- **Tablet** (640px - 1024px): Partial data display
- **Desktop** (> 1024px): Full data grid with charts

## Error Handling

The component is wrapped in an `ErrorBoundary` to gracefully handle runtime errors:

```tsx
import ErrorBoundary from "@/components/ui/ErrorBoundary";

<ErrorBoundary>
  <CurrentMarket />
</ErrorBoundary>
```

## Data Requirements

### Minimum Required Data

Each asset must have at minimum:
- `id`, `name`, `symbol`
- `marketCap`, `volume`, `price`
- `circulatingSupply`, `totalSupply`
- `chartData` (at least 2 points for chart)

### Recommended Data

For optimal display:
- 5+ chart data points for smooth trend line
- All optional fields filled for detailed modal
- Valid icon URL (currently using symbol initials)

## Performance Considerations

- Uses `useMemo` for chart calculations to prevent unnecessary re-renders
- SVG-based charts (no heavy chart library dependencies)
- Efficient CSS transitions
- Optimized for mobile with conditional rendering

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Testing

### Manual Testing Checklist

- [ ] Cards display correctly with all data
- [ ] Progress bars show correct percentages
- [ ] Micro charts render properly
- [ ] Click opens detail modal
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Hover effects are smooth
- [ ] Mobile responsive layout works
- [ ] Options menu button is clickable
- [ ] Numbers formatted with commas and decimals
- [ ] Modal scrolls properly with long content

## Future Enhancements

Potential features for future development:
- [ ] Real-time price updates via WebSocket
- [ ] Sortable columns (by market cap, volume, etc.)
- [ ] Filterable asset list
- [ ] Watchlist functionality
- [ ] Price alerts
- [ ] Options menu with actual functionality (bookmark, share, etc.)
- [ ] Animation on data changes
- [ ] Light/dark mode support
- [ ] Export data functionality

## Troubleshooting

### Cards not displaying
- Check that assets array is not empty
- Verify data structure matches CoinData interface
- Check console for errors

### Charts not rendering
- Ensure chartData has at least 2 data points
- Verify data values are numbers, not strings
- Check browser console for SVG errors

### Modal not opening
- Verify click handlers are not being prevented
- Check that state management is working
- Ensure modal component is rendered

### Styling issues
- Verify Tailwind CSS is properly configured
- Check that custom classes aren't conflicting
- Clear browser cache and rebuild

## Support

For issues or questions:
1. Check this documentation
2. Review the component source code
3. Check existing issues in the project
4. Create a new issue with reproduction steps

## License

This component is part of the Crypto project and follows the project's license.









