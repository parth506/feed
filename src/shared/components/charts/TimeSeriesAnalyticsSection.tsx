import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { ChartContainer } from "../cards/ChartContainer";
import { TimeSeriesPoint } from "../../types/analytics";

interface TimeSeriesProps {
  data: TimeSeriesPoint[];
}

export const TimeSeriesAnalyticsSection: React.FC<TimeSeriesProps> = ({ data = [] }) => {
  const [granularity, setGranularity] = useState<"daily" | "weekly" | "monthly">("daily");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            3. Time Series Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Historical volume trends, moving averages, and sentiment seasonality decomposition.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Feedback Volume & Sentiment Trends Area Chart */}
        <ChartContainer
          title="Feedback Volume & Sentiment Breakdown"
          subtitle="Rolling 30-day feedback volume distribution"
          headerAction={
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-xs">
              {(["daily", "weekly", "monthly"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGranularity(g)}
                  className={`px-2 py-0.5 rounded capitalize font-medium transition-all ${
                    granularity === g
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorNeg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="positive" name="Positive" stroke="#10b981" fillOpacity={1} fill="url(#colorPos)" />
                <Area type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" fillOpacity={1} fill="url(#colorNeg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* 7-Day Moving Average Line Chart */}
        <ChartContainer
          title="7-Day Moving Average vs Total Volume"
          subtitle="Smoothed trend line to filter short-term noise"
        >
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                <Legend verticalAlign="top" height={36} />
                <Line type="monotone" dataKey="totalVolume" name="Total Volume" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="movingAverage" name="7-Day Moving Avg" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};
