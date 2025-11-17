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

/**
 * Formats a number as currency with proper thousand separators and decimal places
 * 
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 2)
 * @param includeDollarSign - Whether to include $ symbol (default: true)
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(40213.18) // "$40,213.18"
 * formatCurrency(21171999345) // "$21,171,999,345.00"
 * formatCurrency(40213.18, 2, false) // "40,213.18"
 */
export function formatCurrency(
  value: number,
  decimals: number = 2,
  includeDollarSign: boolean = true
): string {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return includeDollarSign ? `$${formatted}` : formatted;
}

/**
 * Formats large numbers with abbreviations (K, M, B, T)
 * 
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Abbreviated number string
 * 
 * @example
 * formatCompactNumber(1234) // "1.2K"
 * formatCompactNumber(1234567) // "1.2M"
 * formatCompactNumber(1234567890) // "1.2B"
 */
export function formatCompactNumber(value: number, decimals: number = 1): string {
  const units = ["", "K", "M", "B", "T"];
  const k = 1000;
  
  if (value < k) {
    return value.toString();
  }
  
  const exp = Math.floor(Math.log(value) / Math.log(k));
  const unitIndex = Math.min(exp, units.length - 1);
  const scaledValue = value / Math.pow(k, unitIndex);
  
  return scaledValue.toFixed(decimals) + units[unitIndex];
}

