"use client";

import React, { useMemo } from "react";
import { ChartDataPoint } from "@/types";

/**
 * MicroChart Component Props
 * 
 * @property {ChartDataPoint[]} data - Array of chart data points with date and value
 * @property {number} width - Width of the chart in pixels (default: 80)
 * @property {number} height - Height of the chart in pixels (default: 40)
 * @property {string} lineColor - Color of the trend line (default: "#10B981" - green)
 * @property {string} fillColor - Color of the shaded area below peak (default: "#FEF3C7" - yellow)
 * @property {boolean} showPeak - Whether to show the peak point indicator (default: true)
 */
interface MicroChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  lineColor?: string;
  fillColor?: string;
  showPeak?: boolean;
}

/**
 * MicroChart - A lightweight SVG-based micro trend chart
 * 
 * Displays a simple trend line with optional peak highlighting and shaded area.
 * Perfect for inline asset performance visualization.
 * 
 * Features:
 * - Pure SVG implementation (no external chart library needed)
 * - Responsive scaling
 * - Peak point highlighting
 * - Gradient fill under peak
 * - Lightweight and performant
 * 
 * @example
 * ```tsx
 * <MicroChart 
 *   data={[
 *     { date: "2024-01-10", value: 100 },
 *     { date: "2024-01-11", value: 120 },
 *     { date: "2024-01-12", value: 110 }
 *   ]}
 * />
 * ```
 */
export default function MicroChart({
  data,
  width = 80,
  height = 40,
  lineColor = "#10B981",
  fillColor = "#FEF3C7",
  showPeak = true,
}: MicroChartProps) {
  // Calculate chart path and peak position
  const { linePath, fillPath, peakPoint } = useMemo(() => {
    if (!data || data.length === 0) {
      return { linePath: "", fillPath: "", peakPoint: null };
    }

    // Extract values
    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1; // Avoid division by zero

    // Calculate points with padding
    const padding = 4;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const stepX = chartWidth / (data.length - 1 || 1);

    // Generate path points
    const points = data.map((point, index) => {
      const x = padding + index * stepX;
      const normalizedValue = (point.value - minValue) / valueRange;
      const y = padding + chartHeight - normalizedValue * chartHeight;
      return { x, y, value: point.value };
    });

    // Find peak point
    const peakIndex = values.indexOf(maxValue);
    const peak = points[peakIndex];

    // Create line path
    const line = points
      .map((point, index) => {
        const command = index === 0 ? "M" : "L";
        return `${command} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
      })
      .join(" ");

    // Create fill path (shaded area around peak)
    // Fill from peak area to bottom
    const fillStartIndex = Math.max(0, peakIndex - 1);
    const fillEndIndex = Math.min(points.length - 1, peakIndex + 1);
    
    const fillPoints = points.slice(fillStartIndex, fillEndIndex + 1);
    const fill =
      fillPoints.length > 0
        ? `M ${fillPoints[0].x} ${height - padding} ` +
          fillPoints.map((p) => `L ${p.x} ${p.y}`).join(" ") +
          ` L ${fillPoints[fillPoints.length - 1].x} ${height - padding} Z`
        : "";

    return {
      linePath: line,
      fillPath: fill,
      peakPoint: peak,
    };
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <span className="text-xs text-gray-400">No data</span>
      </div>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-label="Price trend micro chart"
      role="img"
    >
      {/* Fill area under peak */}
      {fillPath && (
        <path
          d={fillPath}
          fill={fillColor}
          fillOpacity="0.4"
          className="transition-all duration-300"
        />
      )}

      {/* Trend line */}
      <path
        d={linePath}
        fill="none"
        stroke={lineColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />

      {/* Peak point indicator */}
      {showPeak && peakPoint && (
        <circle
          cx={peakPoint.x}
          cy={peakPoint.y}
          r="3"
          fill={lineColor}
          className="transition-all duration-300"
        >
          <title>Peak: {peakPoint.value.toFixed(2)}</title>
        </circle>
      )}
    </svg>
  );
}





