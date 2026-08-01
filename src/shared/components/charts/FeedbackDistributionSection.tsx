import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Cell,
} from "recharts";
import { ChartContainer } from "../cards/ChartContainer";
import { RatingHistogramItem } from "../../types/analytics";

interface FeedbackDistributionProps {
  ratings: RatingHistogramItem[];
  lengthDistribution?: { range: string; count: number }[];
}

export const FeedbackDistributionSection: React.FC<FeedbackDistributionProps> = ({
  ratings = [],
  lengthDistribution: propLengthDistribution,
}) => {
  const lengthDistribution = propLengthDistribution || [
    { range: "<50 chars", count: 0 },
    { range: "50-150 chars", count: 0 },
    { range: "150-300 chars", count: 0 },
    { range: "300-500 chars", count: 0 },
    { range: ">500 chars", count: 0 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            6. Feedback Distribution & Length Density
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Star rating distribution, review character length density, and outlier detection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Star Rating Histogram */}
        <ChartContainer title="Star Ratings Histogram (1 - 5 Stars)" subtitle="Total ratings spread">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="rating" tickLine={false} axisLine={false} tickFormatter={(val) => `${val} ★`} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {ratings.map((r, idx) => (
                    <Cell key={idx} fill={r.rating >= 4 ? "#10b981" : r.rating === 3 ? "#f59e0b" : "#ef4444"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Review Character Length Density */}
        <ChartContainer title="Feedback Length Density Plot" subtitle="Character length distribution of user comments">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lengthDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};
