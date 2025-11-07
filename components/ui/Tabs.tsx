"use client";

import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 sm:gap-4 dark:border-gray-800">
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "min-h-[44px] px-3 py-2 text-sm font-medium transition-all duration-200",
              "border-b-2 border-transparent",
              "touch-manipulation", // Improves touch responsiveness
              isActive
                ? "border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

