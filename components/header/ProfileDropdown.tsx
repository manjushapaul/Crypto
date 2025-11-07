"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
  avatarUrl?: string;
  userName?: string;
}

/**
 * ProfileDropdown Component
 * Profile avatar with dropdown menu
 * Shows user options like Profile and Sign out
 */
export default function ProfileDropdown({
  avatarUrl,
  userName = "Mafruh Faruqi",
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate initials-based SVG avatar
  const getInitialsAvatar = (name: string): string => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
    
    const svg = `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#64748B"/><text x="20" y="28" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">${initials}</text></svg>`;
    
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  };

  // Default avatar using initials
  const defaultAvatar = getInitialsAvatar(userName);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    {
      label: "Profile",
      icon: User,
      onClick: () => {
        console.log("Navigate to Profile");
        setIsOpen(false);
      },
    },
    {
      label: "Sign out",
      icon: LogOut,
      onClick: () => {
        console.log("Sign out");
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors duration-200 hover:bg-[#2a2a4a] focus:outline-none focus:ring-2 focus:ring-[#ffe369]/50"
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        {/* Avatar */}
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <img
            src={avatarUrl || defaultAvatar}
            alt={userName}
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Fallback to initials-based SVG if external image fails
              target.src = defaultAvatar;
            }}
          />
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-white transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg bg-white shadow-lg dark:bg-gray-800">
          <div className="p-2">
            <div className="mb-2 border-b border-gray-200 px-3 py-2 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                User Account
              </p>
            </div>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

