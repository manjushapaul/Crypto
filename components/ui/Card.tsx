import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Card Component
 * Reusable card container with consistent styling
 * Supports hover effects and custom className overrides
 */
export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-white p-6 shadow-card transition-shadow duration-200 dark:bg-gray-900",
        className
      )}
    >
      {children}
    </div>
  );
}

