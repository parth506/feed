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
import { TopicItem } from "../../types/analytics";

interface TopicAnalyticsProps {
  topics: TopicItem[];
}

export const TopicAnalyticsSection: React.FC<TopicAnalyticsProps> = ({ topics }) => {
  const keywords = [
    { text: "UI Speed", weight: 98, sentiment: "pos" },
    { text: "Checkout", weight: 88, sentiment: "neg" },
    { text: "API Docs", weight: 82, sentiment: "pos" },
    { text: "SLA Response", weight: 76, sentiment: "pos" },
    { text: "Mobile App", weight: 70, sentiment: "neg" },
    { text: "GraphQL SDK", weight: 64, sentiment: "pos" },
    { text: "Export Reports", weight: 58, sentiment: "pos" },
    { text: "Dark Mode", weight: 52, sentiment: "pos" },
    { text: "OAuth Login", weight: 46, sentiment: "pos" },
    { text: "Timeout Error", weight: 40, sentiment: "neg" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            5. Topic Analytics & Keyword Frequency
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unsupervised topic modeling, cluster importance, and natural language keyword frequency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Topic Importance Bar Chart */}
        <ChartContainer title="Topic Importance & Volume" subtitle="Volume weighted importance score (0-100)">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topics} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
                <Bar dataKey="importanceScore" radius={[0, 4, 4, 0]}>
                  {topics.map((t, idx) => (
                    <Cell key={idx} fill={t.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Word Cloud & Keyword Frequency Interactive Card */}
        <ChartContainer title="AI Keyword Frequency Cloud" subtitle="Weighted by TF-IDF & Sentiment Tag">
          <div className="h-[280px] w-full flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl">
            {keywords.map((kw, idx) => {
              const size = Math.max(12, Math.min(26, kw.weight / 3.8));
              return (
                <span
                  key={idx}
                  style={{ fontSize: `${size}px` }}
                  className={`font-bold transition-all hover:scale-110 cursor-pointer ${
                    kw.sentiment === "pos"
                      ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-500"
                      : "text-rose-600 dark:text-rose-400 hover:text-rose-500"
                  }`}
                >
                  {kw.text}
                </span>
              );
            })}
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};
