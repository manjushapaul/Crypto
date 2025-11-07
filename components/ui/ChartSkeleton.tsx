"use client";

/**
 * Skeleton loader component for charts
 * Provides a loading state while chart data is being fetched
 */
export default function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-full w-full rounded-lg bg-gray-200 dark:bg-gray-700">
        {/* Animated shimmer effect */}
        <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      </div>
    </div>
  );
}

/**
 * Mini chart skeleton for smaller chart components
 */
export function MiniChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-full w-full rounded bg-gray-200 dark:bg-gray-700">
        <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      </div>
    </div>
  );
}




