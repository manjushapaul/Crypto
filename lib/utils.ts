import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes properly.
 * Combines clsx for conditional classes and tailwind-merge to resolve conflicts.
 * 
 * @example
 * cn('base-classes', conditionalClass && 'extra-class', className)
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'hover:bg-blue-600')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

