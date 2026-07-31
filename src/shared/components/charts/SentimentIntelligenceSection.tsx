import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "../cards/ChartContainer";
import { EmotionDistribution, TimeSeriesPoint } from "../../types/analytics";

interface SentimentIntelligenceProps {
  emotions: EmotionDistribution[];
  timeSeries: TimeSeriesPoint[];
}

export const SentimentIntelligenceSection: React.FC<SentimentIntelligenceProps> = ({
  emotions,
  timeSeries,
}) => {
  const pieData = [
    { name: "Positive", value: 78, color: "#10b981" },
    { name: "Neutral", value: 14, color: "#f59e0b" },
    { name: "Negative", value: 8, color: "#ef4444" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            4. Sentiment Intelligence & Emotion Breakdown
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-dimensional NLP sentiment evaluation & 6-factor psychological emotion distribution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sentiment Share Donut */}
        <ChartContainer title="Sentiment Share" subtitle="Category proportion">
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Emotion Radar Chart */}
        <ChartContainer title="6-Factor Emotion Radar" subtitle="Joy, Trust, Surprise, Frustration, Anger, Sadness">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={emotions}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 11, fill: "#64748b" }} />
                <PolarRadiusAxis angle={30} domain={[0, 50]} />
                <Radar name="Emotion Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                <RechartsTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Sentiment Evolution Stacked Area Chart */}
        <ChartContainer title="Sentiment Evolution Timeline" subtitle="Proportional shift over time">
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                <RechartsTooltip />
                <Area type="monotone" dataKey="positive" stackId="1" stroke="#10b981" fill="#10b981" />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
                <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};
