"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeaderIconProps {
  icon: ReactNode;
  onClick?: () => void;
  badge?: number;
  ariaLabel: string;
}

/**
 * HeaderIcon Component
 * Icon button with optional notification badge
 * Used for message and notification icons
 */
export default function HeaderIcon({
  icon,
  onClick,
  badge,
  ariaLabel,
}: HeaderIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-lg",
        "bg-[#1d1d36] dark:bg-gray-800 text-white transition-colors duration-200",
        "hover:bg-[#2a2a4a] dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ffe369]/50 dark:focus:ring-blue-400/50"
      )}
      aria-label={ariaLabel}
    >
      <div className="flex h-5 w-5 items-center justify-center">
        {icon}
      </div>

      {/* Notification Badge */}
      {badge !== undefined && badge > 0 && (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ffe369] dark:bg-blue-500 text-[10px] font-bold text-[#1d1d36] dark:text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  );
}




