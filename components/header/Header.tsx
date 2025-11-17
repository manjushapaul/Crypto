"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Star,
  TrendingUp,
  Compass,
  Settings,
  MessageSquare,
  Bell,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import NavItem from "./NavItem";
import HeaderIcon from "./HeaderIcon";
import ProfileDropdown from "./ProfileDropdown";
import AlertNotificationPanel, { Alert } from "./AlertNotificationPanel";
import MobileSlideOutMenu from "./MobileSlideOutMenu";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

/**
 * Header Component Props
 * 
 * @property {string} activeTab - Currently active navigation tab
 * @property {(tab: string) => void} onTabChange - Callback when navigation tab is clicked
 * @property {number} messageCount - Number of unread messages
 * @property {Alert[]} alerts - Array of price alert notifications
 * @property {(alertId: string) => void} onAlertClick - Callback when an alert is clicked
 * @property {() => void} onClearAlerts - Callback to clear all alerts
 * @property {() => void} onMessageClick - Callback when message icon is clicked
 */
interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  messageCount?: number;
  alerts?: Alert[];
  onAlertClick?: (alertId: string) => void;
  onClearAlerts?: () => void;
  onMessageClick?: () => void;
}

/**
 * Header - Main application header matching the Tixx design
 * 
 * Features:
 * - Fixed top navigation with dark background (#22243A)
 * - Left: Logo and app name "TIXX"
 * - Center: 5 navigation tabs (HOME, EXPENSES, FAVS, STATISTICS, EXPLORE, SETTINGS)
 * - Active tab: Yellow accent (#ffe369), bold text, underline
 * - Right: Message icon (badge with unread count), Alert bell with dropdown panel, User avatar with dropdown
 * - Full alert notification system with dropdown panel
 * - Click outside to close, Escape key support
 * - Keyboard navigation through alerts
 * - Fully responsive with mobile menu
 * - Keyboard accessible with ARIA labels
 * 
 * Alert Notification System:
 * - Badge shows unread alert count on bell icon
 * - Clicking bell opens dropdown panel below icon
 * - Panel displays all triggered price alerts with coin logos, messages, and timestamps
 * - Alerts can be clicked to view details or mark as read
 * - Clear All button removes all alerts
 * - Panel closes on click outside or Escape key
 * - Fully keyboard navigable (Tab through alerts, Enter/Space to activate)
 * 
 * @example
 * ```tsx
 * const [alerts, setAlerts] = useState<Alert[]>([...]);
 * 
 * <Header
 *   activeTab="EXPENSES"
 *   onTabChange={(tab) => router.push(`/${tab.toLowerCase()}`)}
 *   messageCount={3}
 *   alerts={alerts}
 *   onAlertClick={(id) => console.log('Alert clicked:', id)}
 *   onClearAlerts={() => setAlerts([])}
 *   onMessageClick={() => openMessagesModal()}
 * />
 * ```
 */
export default function Header({
  activeTab = "HOME",
  onTabChange,
  messageCount = 3,
  alerts = [],
  onAlertClick,
  onClearAlerts,
  onMessageClick,
}: HeaderProps = {}) {
  const pathname = usePathname();
  // Theme context
  const { theme, toggleTheme } = useTheme();
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Alert panel state
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [localAlerts, setLocalAlerts] = useState<Alert[]>(alerts);
  const [isMounted, setIsMounted] = useState(false);
  const bellButtonRef = useRef<HTMLDivElement>(null);

  /**
   * Get page title for mobile header
   */
  const getPageTitle = () => {
    if (pathname === "/") return "Home";
    if (pathname?.startsWith("/expenses")) return "Expenses";
    if (pathname?.startsWith("/favs")) return "Favs";
    if (pathname?.startsWith("/statistics")) return "Statistics";
    if (pathname?.startsWith("/explore")) return "Explore";
    if (pathname?.startsWith("/settings")) return "Settings";
    if (pathname?.startsWith("/inbox")) return "Messages";
    if (pathname?.startsWith("/profile")) return "Profile";
    return "Home";
  };

  /**
   * Track client-side mount to prevent hydration mismatch
   * Badge counts should only reflect actual data after hydration
   */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Sync local alerts with props when they change
   */
  useEffect(() => {
    setLocalAlerts(alerts);
  }, [alerts]);

  /**
   * Calculate unread alerts count
   * Only show actual count after client hydration to prevent mismatch
   */
  const unreadCount = isMounted ? localAlerts.filter(alert => !alert.isRead).length : 0;

  /**
   * Handles navigation tab click
   */
  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  /**
   * Toggle alert notification panel
   */
  const handleBellClick = () => {
    setShowAlertPanel(!showAlertPanel);
  };

  /**
   * Close alert panel
   */
  const handleCloseAlertPanel = () => {
    setShowAlertPanel(false);
  };

  /**
   * Handle alert click - mark as read and invoke callback
   */
  const handleAlertClick = (alertId: string) => {
    // Mark alert as read locally
    setLocalAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );

    // Invoke parent callback
    if (onAlertClick) {
      onAlertClick(alertId);
    }
  };

  /**
   * Mark specific alert as read
   */
  const handleMarkAsRead = (alertId: string) => {
    setLocalAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  /**
   * Clear all alerts
   */
  const handleClearAll = () => {
    setLocalAlerts([]);
    setShowAlertPanel(false);
    
    if (onClearAlerts) {
      onClearAlerts();
    }
  };

  // Navigation menu items with icons and labels
  const menuItems = [
    {
      id: "HOME",
      label: "HOME",
      icon: <Home className="h-5 w-5" />,
      tooltip: "Go to Home",
    },
    {
      id: "EXPENSES",
      label: "EXPENSES",
      icon: <ShoppingBag className="h-5 w-5" />,
      tooltip: "Go to Expenses",
    },
    {
      id: "FAVS",
      label: "FAVS",
      icon: <Star className="h-5 w-5" />,
      tooltip: "Go to Favorites",
    },
    {
      id: "STATISTICS",
      label: "STATISTICS",
      icon: <TrendingUp className="h-5 w-5" />,
      tooltip: "Go to Statistics",
    },
    {
      id: "EXPLORE",
      label: "EXPLORE",
      icon: <Compass className="h-5 w-5" />,
      tooltip: "Go to Explore",
    },
    {
      id: "SETTINGS",
      label: "SETTINGS",
      icon: <Settings className="h-5 w-5" />,
      tooltip: "Go to Settings",
    },
  ];

  /**
   * Handle mobile menu toggle
   */
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * Handle mobile menu close
   */
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className="sticky top-0 z-50 w-full bg-[#22243A] dark:bg-gray-950 px-4 py-3 shadow-lg dark:shadow-gray-900/50 sm:px-6 lg:px-8"
        role="banner"
      >
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Logo Icon - Gradient Diamond shape */}
            <div className="flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10">
              <svg
                className="h-full w-full"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFA500" />
                    <stop offset="50%" stopColor="#FF6B9D" />
                    <stop offset="100%" stopColor="#C084FC" />
                  </linearGradient>
                </defs>
                <path
                  d="M20 5 L35 20 L20 35 L5 20 Z M20 12 L28 20 L20 28 L12 20 Z"
                  fill="url(#logoGradient)"
                  stroke="url(#logoGradient)"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* Logo Text - Always show TIXX, with page title on mobile after it */}
            <h1 className="text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
              <span className="hidden lg:inline">TIXX</span>
              <span className="lg:hidden flex items-center gap-2">
                <span>TIXX</span>
               
              </span>
            </h1>
          </div>

          {/* Center: Navigation Menu (Desktop Only) */}
          <nav className="hidden items-center gap-1 lg:flex shrink-0" role="navigation">
            {menuItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeTab === item.id}
                onClick={() => handleTabClick(item.id)}
                tooltip={item.tooltip}
              />
            ))}
          </nav>

          {/* Right: Icons and Profile (Desktop) / Hamburger + Icons (Mobile) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Message Icon - Hidden on mobile (in menu instead) */}
            <div className="hidden lg:block">
              <HeaderIcon
                icon={<MessageSquare className="h-5 w-5" />}
                onClick={onMessageClick || (() => console.log("Open messages"))}
                badge={messageCount}
                ariaLabel="Messages"
              />
            </div>

            {/* Alert Notification Icon with Dropdown - Hidden on mobile */}
            <div ref={bellButtonRef} className="hidden lg:block relative">
              <HeaderIcon
                icon={<Bell className="h-5 w-5" />}
                onClick={handleBellClick}
                badge={unreadCount}
                ariaLabel="Price alerts"
              />
              
              {/* Alert Notification Panel */}
              <AlertNotificationPanel
                alerts={localAlerts}
                isOpen={showAlertPanel}
                onClose={handleCloseAlertPanel}
                onAlertClick={handleAlertClick}
                onClearAll={handleClearAll}
                onMarkAsRead={handleMarkAsRead}
              />
            </div>

            {/* Theme Toggle Button - Hidden on mobile (in menu instead) */}
            <button
              onClick={toggleTheme}
              className={cn(
                "hidden lg:flex relative h-10 w-10 items-center justify-center rounded-lg",
                "bg-[#1d1d36] dark:bg-gray-800 text-white transition-colors duration-200",
                "hover:bg-[#2a2a4a] dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ffe369]/50 dark:focus:ring-blue-400/50"
              )}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Profile Dropdown - Hidden on mobile (in menu instead) */}
            <div className="hidden lg:block">
              <ProfileDropdown />
            </div>

            {/* Mobile Hamburger Menu Button - On the right */}
            <button
              className="lg:hidden"
              aria-label="Toggle mobile menu"
              onClick={handleMobileMenuToggle}
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Menu */}
      <MobileSlideOutMenu
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </>
  );
}

// Export the props interface
export type { HeaderProps };
