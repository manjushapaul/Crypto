"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

export default function Dropdown({
  label,
  options,
  onChange,
  defaultValue,
  className,
}: DropdownProps) {
  return (
    <div className={cn("relative", className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-[#1E293B] dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          defaultValue={defaultValue}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10",
            "text-sm text-[#1E293B] transition-colors",
            "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            "hover:border-gray-300",
            "touch-manipulation min-h-[44px]", // Touch-friendly
            "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
            "dark:focus:border-blue-400 dark:hover:border-gray-600"
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

