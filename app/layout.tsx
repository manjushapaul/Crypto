"use client";

import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";
import Header from "@/components/header/Header";
import { PortfolioProvider, usePortfolio } from "@/context/PortfolioContext";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MessagesProvider, useMessages } from "@/context/MessagesContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/**
 * Layout Content Component
 * Uses Portfolio Context for state management
 */
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { alerts, clearAllAlerts, markAlertAsRead } = usePortfolio();
  const { unreadCount } = useMessages();

  // Determine active tab from pathname
  const getActiveTab = () => {
    if (pathname === "/") return "HOME";
    if (pathname?.startsWith("/expenses")) return "EXPENSES";
    if (pathname?.startsWith("/inbox")) return "MESSAGES";
    if (pathname?.startsWith("/favs")) return "FAVS";
    if (pathname?.startsWith("/statistics")) return "STATISTICS";
    if (pathname?.startsWith("/explore")) return "EXPLORE";
    if (pathname?.startsWith("/settings")) return "SETTINGS";
    if (pathname?.startsWith("/profile")) return "HOME"; // Profile doesn't have a nav tab
    return "HOME";
  };

  /**
   * Handle tab navigation
   */
  const handleTabChange = (tab: string) => {
    const routes: Record<string, string> = {
      HOME: "/",
      EXPENSES: "/expenses",
      MESSAGES: "/inbox",
      FAVS: "/favs",
      STATISTICS: "/statistics",
      EXPLORE: "/explore",
      SETTINGS: "/settings",
    };
    
    const route = routes[tab] || "/";
    router.push(route);
  };

  /**
   * Handle message icon click
   */
  const handleMessageClick = () => {
    router.push("/inbox");
  };

  /**
   * Handle alert click
   */
  const handleAlertClick = (alertId: string) => {
    markAlertAsRead(alertId);
    console.log("Alert clicked:", alertId);
  };

  return (
    <>
      <Header 
        activeTab={getActiveTab()}
        onTabChange={handleTabChange}
        messageCount={unreadCount}
        alerts={alerts}
        onAlertClick={handleAlertClick}
        onClearAlerts={clearAllAlerts}
        onMessageClick={handleMessageClick}
      />
      <div className="min-h-screen pt-0">
        {children}
      </div>
    </>
  );
}

/**
 * Root Layout
 * Wraps app in UserProvider and PortfolioProvider for global state management
 * UserProvider enables real-time profile sync between Settings and Navbar
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 
          Prevent flash of unstyled content (FOUC) 
          Apply dark class immediately before React hydrates
          This script runs synchronously before page render
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('crypto-dashboard-theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased font-sans bg-[#eaecff] dark:bg-gray-900`} suppressHydrationWarning>
        <ThemeProvider>
          <UserProvider>
            <PortfolioProvider>
              <MessagesProvider>
                <LayoutContent>{children}</LayoutContent>
              </MessagesProvider>
            </PortfolioProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
