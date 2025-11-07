# Header Component Documentation

## Overview
The Header component matches the Tixx design from the provided screenshot, featuring a dark navigation header with logo, menu items, and user interaction elements.

## Components Structure

### 1. Header.tsx (Main Component)
- Main header container with dark background (#1d1d36)
- Manages active menu state
- Contains logo, navigation menu, and right-side icons

### 2. NavItem.tsx
- Individual navigation menu item
- Supports active state with yellow highlight (#ffe369)
- Includes hover effects and tooltips

### 3. HeaderIcon.tsx
- Icon button component for message and notification icons
- Supports notification badges with count display

### 4. ProfileDropdown.tsx
- Profile avatar with dropdown menu
- Click-outside-to-close functionality
- User menu options (Profile, Sign out)

## Icons Used (from lucide-react)

### Navigation Menu Icons:
- `Home` - Home icon (outlined)
- `ShoppingBag` - Expenses icon (outlined)
- `Star` - Favs icon (outlined)
- `TrendingUp` - Statistics icon (outlined)
- `Compass` - Explore icon (outlined)
- `Settings` - Settings icon (outlined)

### Right Side Icons:
- `MessageSquare` - Messages icon
- `Bell` - Notifications icon
- `ChevronDown` - Profile dropdown arrow

### Profile Menu Icons:
- `User` - Profile icon
- `LogOut` - Sign out icon

## Design Specifications

### Colors:
- **Header Background**: `#1d1d36` (dark indigo/purple)
- **Active/Hover Color**: `#ffe369` (bright yellow)
- **Text Color (Header)**: White (#FFFFFF)
- **Hover Background**: `#2a2a4a` (slightly lighter dark)

### Typography:
- **Font**: Inter (loaded via Next.js font optimization)
- **Logo Text**: Bold, uppercase, tracking-wide
- **Menu Labels**: Uppercase, text-xs, font-medium

### Spacing:
- Header padding: `px-4 py-3 sm:px-6 lg:px-8`
- Menu item gap: `gap-1`
- Icon container gap: `gap-2 sm:gap-3`

### Responsive Breakpoints:
- Mobile: Menu hidden, hamburger button shown
- Desktop (lg): Full menu visible, hamburger hidden

## Features Implemented

### ✅ Menu Navigation
- Active state management (HOME selected by default)
- Click handlers that log to console (ready for routing integration)
- Visual feedback with yellow highlight and underline

### ✅ Tooltips
- Hover tooltips on menu items (e.g., "Go to Favs")
- Native browser tooltips via `title` attribute

### ✅ Profile Dropdown
- Click to open/close dropdown menu
- Click outside to close
- Dropdown arrow animation (rotates when open)
- Menu items: Profile, Sign out

### ✅ Notification Badges
- Message icon: 3 unread (dummy)
- Notification icon: 5 unread (dummy)
- Badges show "9+" for counts > 9

### ✅ Responsive Design
- Mobile: Hamburger menu, collapsed navigation
- Desktop: Full horizontal menu
- Touch-friendly button sizes (min 44px)

## Logo Design

The logo uses an inline SVG with:
- Gradient fill: Orange (#FFA500) → Pink (#FF6B9D) → Purple (#C084FC)
- Four-pointed star/X geometric shape
- Matches the gradient-card theme

## Dummy Data

- **Active Menu**: HOME (default)
- **Message Count**: 3
- **Notification Count**: 5
- **User Name**: "Mafruh Faruqi"
- **Avatar**: Placeholder image (can be replaced with actual user image)

## Usage

The Header is automatically included in the root layout (`app/layout.tsx`) and appears on all pages.

```tsx
import Header from "@/components/header/Header";

// Header is already integrated in layout.tsx
```

## Future Enhancements

- Replace console.log with actual routing (Next.js router)
- Connect to authentication system for profile data
- Real-time notification counts from API
- Add animation transitions for menu changes
- Implement mobile menu slide-in animation




