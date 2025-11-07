"use client";

import { useId, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { performanceData } from "@/lib/dummy-data";
import CoinAssets from "@/components/dashboard/CoinAssets";
import { cn } from "@/lib/utils";

// Top tab navigation
function TabNav({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  const tabs = ["PORTFOLIO", "ASSETS", "FUNDING", "P2P"];
  return (
    <div className="mb-6 flex gap-2 pt-10 px-6 pb-0 justify-center">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "relative rounded-md px-4 py-4 text-xs font-semibold tracking-wider transition-all duration-200",
            active === tab
              ? "bg-white text-[#1d1d36] shadow-sm"
              : "text-[#6b7280] hover:text-[#1f2937] hover:bg-white/50"
          )}
          aria-current={active === tab ? "page" : undefined}
        >
          {tab}
          {active === tab && (
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}

// Left card: comparison with chart
function CardComparison() {
  const rid = useId().replace(/[:]/g, "-");
  const gradientId = `cmpBlue-${rid}`;
  return (
    <div className="rounded-card bg-[#1f2564] pt-6  text-white shadow-card">
      <div className="flex items-baseline px-6 gap-2">
        <span className="text-3xl font-normal sm:text-4xl">84.02%</span>
        <div className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1">
          <TrendingUp className="h-3 w-3 text-[#10B981]" />
          <span className="text-xs text-[#10B981]">+5.32</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-white/80 px-6">Compared to the $1,232.21 last week</p>
      <div className="mt-4 h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceData.chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#23307a" strokeDasharray="0" vertical={false} />
            <XAxis hide={true} />
            <YAxis hide={true} />
            <Tooltip
              contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", color: "#fff", borderRadius: 8, fontSize: 12 }}
            />
            <Area type="monotone" dataKey="value" stroke="#60A5FA" strokeWidth={2} fill={`url(#${gradientId})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Right card: accounts summary (spending, savings, trend)
function CardAccounts() {
  const rows = [
    { label: "Spending", color: "#6366F1", value: "9,496", unit: "USD" },
    { label: "Savings", color: "#F43F5E", value: "11,496", unit: "USD" },
  ];
  return (
    <div className="rounded-card bg-white p-6 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#6b7280]">ACCOUNTS</h3>
        <svg
          className="h-4 w-4 text-[#9ca3af]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-normal text-[#111827]">{r.label}</p>
              <p className="text-xs text-[#9ca3af]">Last 12 days</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-24 items-end gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-t"
                    style={{ height: `${20 + ((i * 7) % 24)}px`, backgroundColor: r.color, opacity: 0.8 }}
                  />
                ))}
              </div>
              <div className="text-right">
                <p className="text-base font-normal text-[#0f172a]">{r.value}</p>
                <p className="text-xs text-[#9ca3af]">{r.unit}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-base font-normal text-[#111827]">Trend</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-normal text-[#10B981]">+4.32</span>
            <TrendingUp className="h-4 w-4 text-[#10B981]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TabbedCards() {
  const [active, setActive] = useState("PORTFOLIO");

  return (
    <section className="mx-auto max-w-screen-2xl">
      {/* Tabs - full width */}
      <TabNav active={active} onChange={setActive} />

      {/* Content area - 3 cards in a row when PORTFOLIO is active */}
      {active === "PORTFOLIO" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 p-6">
          <CardComparison />
          <CoinAssets />
          <CardAccounts />
        </div>
      )}

      {active !== "PORTFOLIO" && (
        <div className="rounded-card bg-white p-8 text-center text-sm text-[#6b7280] shadow-card">
          {active} content placeholder (dummy state)
        </div>
      )}
    </section>
  );
}
