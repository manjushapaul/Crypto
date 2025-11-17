"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

/**
 * NavItem Component
 * Individual navigation menu item with icon and label
 * Supports active state with yellow highlight and underline
 */
export default function NavItem({
  icon,
  label,
  isActive = false,
  onClick,
  tooltip,
}: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center gap-1 px-2 py-2 transition-all duration-200",
        "hover:text-[#ffe369]",
        isActive
          ? "text-[#ffe369]"
          : "text-white"
      )}
      title={tooltip}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Icon */}
      <div className={cn(
        "flex h-5 w-5 items-center justify-center transition-colors duration-200",
        isActive ? "text-[#ffe369]" : "text-white group-hover:text-[#ffe369]"
      )}>
        {icon}
      </div>

      {/* Label */}
      <span className={cn(
        "text-xs uppercase tracking-wide",
        isActive ? "font-bold" : "font-medium"
      )}>
        {label}
      </span>

      {/* Active Underline */}
      {isActive && (
        <div className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 bg-[#ffe369] transition-all duration-200" />
      )}

      {/* Hover Underline (subtle) */}
      {!isActive && (
        <div className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-[#ffe369] transition-all duration-200 group-hover:w-6" />
      )}
    </button>
  );
}

