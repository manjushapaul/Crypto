"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Star,
  TrendingUp,
  Compass,
  Settings,
  MessageSquare,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";

/**
 * Mobile Slide-Out Menu Component Props
 */
interface MobileSlideOutMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

/**
 * MobileSlideOutMenu - Slide-out navigation menu for mobile devices
 * 
 * Features:
 * - Slides in from left with smooth animation
 * - User profile section at top
 * - Navigation items matching desktop order
 * - Theme toggle with pill buttons
 * - Keyboard accessible (focus trap, ESC to close)
 * - Overlay backdrop that closes menu on click
 * - Matches existing dashboard UI patterns exactly
 */
export default function MobileSlideOutMenu({
  isOpen,
  onClose,
  activeTab = "HOME",
  onTabChange,
}: MobileSlideOutMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, getInitials } = useUser();
  const menuRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  // Navigation menu items with icons and labels (matching desktop)
  const menuItems = [
    {
      id: "HOME",
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      id: "EXPENSES",
      label: "Expenses",
      icon: ShoppingBag,
      path: "/expenses",
    },
    {
      id: "MESSAGES",
      label: "Messages",
      icon: MessageSquare,
      path: "/inbox",
    },
    {
      id: "FAVS",
      label: "Favs",
      icon: Star,
      path: "/favs",
    },
    {
      id: "STATISTICS",
      label: "Statistics",
      icon: TrendingUp,
      path: "/statistics",
    },
    {
      id: "EXPLORE",
      label: "Explore",
      icon: Compass,
      path: "/explore",
    },
    {
      id: "SETTINGS",
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  /**
   * Handle menu item click
   */
  const handleMenuItemClick = (item: typeof menuItems[0]) => {
    router.push(item.path);
    if (onTabChange) {
      onTabChange(item.id);
    }
    onClose();
  };

  /**
   * Handle theme change
   */
  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
  };

  /**
   * Handle ESC key to close menu
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Focus first element when menu opens
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  /**
   * Handle focus trap - keep focus within menu when open
   */
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = menuRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  /**
   * Prevent body scroll when menu is open
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Out Menu */}
      <div
        ref={menuRef}
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[280px] max-w-[85vw]",
          "bg-white dark:bg-gray-800",
          "shadow-xl dark:shadow-gray-900/50",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex h-full flex-col">
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              {/* Logo Icon - Gradient Diamond shape */}
              <div className="flex h-8 w-8 items-center justify-center">
                <svg
                  className="h-full w-full"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="mobileMenuLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFA500" />
                      <stop offset="50%" stopColor="#FF6B9D" />
                      <stop offset="100%" stopColor="#C084FC" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M20 5 L35 20 L20 35 L5 20 Z M20 12 L28 20 L20 28 L12 20 Z"
                    fill="url(#mobileMenuLogoGradient)"
                    stroke="url(#mobileMenuLogoGradient)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              {/* Logo Text */}
              <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 dark:text-white">TIXX</h2>
            </div>
            <button
              ref={firstFocusableRef}
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#22243A] dark:bg-gray-700 text-base font-semibold text-[#ffe369] dark:text-yellow-400">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4" role="navigation" aria-label="Main navigation">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id || pathname === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2",
                      isActive
                        ? "bg-[#ffe369]/20 dark:bg-yellow-500/20 text-gray-900 dark:text-white font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isActive
                          ? "text-[#ff9500] dark:text-yellow-400"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Theme Toggle Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Theme
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleThemeChange("light")}
                  className={cn(
                    "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2",
                    theme === "light"
                      ? "bg-[#22243A] dark:bg-gray-700 text-[#ffe369] dark:text-yellow-400 shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                  aria-pressed={theme === "light"}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </div>
                </button>
                <button
                  ref={lastFocusableRef}
                  onClick={() => handleThemeChange("dark")}
                  className={cn(
                    "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-[#ff9500] focus:ring-offset-2",
                    theme === "dark"
                      ? "bg-[#22243A] dark:bg-gray-700 text-[#ffe369] dark:text-yellow-400 shadow-md"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                  aria-pressed={theme === "dark"}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

