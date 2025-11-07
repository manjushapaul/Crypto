"use client";

import { useState } from "react";
import {
  Home,
  ShoppingBag,
  Star,
  TrendingUp,
  Compass,
  Settings,
  MessageSquare,
  Bell,
} from "lucide-react";
import NavItem from "./NavItem";
import HeaderIcon from "./HeaderIcon";
import ProfileDropdown from "./ProfileDropdown";

/**
 * Header Component
 * Main application header matching the Tixx design
 * Features navigation menu, icons, and profile dropdown
 */
export default function Header() {
  const [activeMenu, setActiveMenu] = useState("HOME");

  // Navigation menu items with icons and labels
  const menuItems = [
    {
      id: "HOME",
      label: "HOME",
      icon: <Home className="h-5 w-5" />,
      tooltip: "Go to Home",
      onClick: () => {
        console.log("Navigate to Home");
        setActiveMenu("HOME");
      },
    },
    {
      id: "EXPENSES",
      label: "EXPENSES",
      icon: <ShoppingBag className="h-5 w-5" />,
      tooltip: "Go to Expenses",
      onClick: () => {
        console.log("Navigate to Expenses");
        setActiveMenu("EXPENSES");
      },
    },
    {
      id: "FAVS",
      label: "FAVS",
      icon: <Star className="h-5 w-5" />,
      tooltip: "Go to Favs",
      onClick: () => {
        console.log("Navigate to Favs");
        setActiveMenu("FAVS");
      },
    },
    {
      id: "STATISTICS",
      label: "STATISTICS",
      icon: <TrendingUp className="h-5 w-5" />,
      tooltip: "Go to Statistics",
      onClick: () => {
        console.log("Navigate to Statistics");
        setActiveMenu("STATISTICS");
      },
    },
    {
      id: "EXPLORE",
      label: "EXPLORE",
      icon: <Compass className="h-5 w-5" />,
      tooltip: "Go to Explore",
      onClick: () => {
        console.log("Navigate to Explore");
        setActiveMenu("EXPLORE");
      },
    },
    {
      id: "SETTIGS",
      label: "SETTIGS",
      icon: <Settings className="h-5 w-5" />,
      tooltip: "Go to Settings",
      onClick: () => {
        console.log("Navigate to Settings");
        setActiveMenu("SETTIGS");
      },
    },
  ];

  // Dummy notification counts
  const messageCount = 3;
  const notificationCount = 5;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1d1d36] px-4 py-3 shadow-lg sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          {/* Logo Icon - Gradient Star/X shape */}
          <div className="flex h-8 w-8 items-center justify-center sm:h-10 sm:w-10">
            <svg
              className="h-full w-full"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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

          {/* Logo Text */}
          <h1 className="text-xl font-bold uppercase tracking-wide text-white sm:text-2xl">
            Tixx
          </h1>
        </div>

        {/* Center: Navigation Menu */}
        <nav className="hidden items-center gap-1 lg:flex">
          {menuItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeMenu === item.id}
              onClick={item.onClick}
              tooltip={item.tooltip}
            />
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          aria-label="Menu"
          onClick={() => console.log("Open mobile menu")}
        >
          <div className="flex h-6 w-6 flex-col justify-between">
            <span className="h-0.5 w-full bg-white transition-all duration-200"></span>
            <span className="h-0.5 w-full bg-white transition-all duration-200"></span>
            <span className="h-0.5 w-full bg-white transition-all duration-200"></span>
          </div>
        </button>

        {/* Right: Icons and Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Message Icon */}
          <HeaderIcon
            icon={<MessageSquare className="h-5 w-5" />}
            onClick={() => console.log("Open messages")}
            badge={messageCount}
            ariaLabel="Messages"
          />

          {/* Notification Icon */}
          <HeaderIcon
            icon={<Bell className="h-5 w-5" />}
            onClick={() => console.log("Open notifications")}
            badge={notificationCount}
            ariaLabel="Notifications"
          />

          {/* Profile Dropdown */}
          <ProfileDropdown />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <nav className="mt-3 flex flex-wrap items-center justify-center gap-2 border-t border-[#2a2a4a] pt-3 lg:hidden">
        {menuItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeMenu === item.id}
            onClick={item.onClick}
            tooltip={item.tooltip}
          />
        ))}
      </nav>
    </header>
  );
}

