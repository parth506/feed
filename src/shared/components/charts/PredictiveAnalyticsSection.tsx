import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { ChartContainer } from "../cards/ChartContainer";
import { ForecastPoint } from "../../types/analytics";

interface PredictiveAnalyticsProps {
  forecast: ForecastPoint[];
}

export const PredictiveAnalyticsSection: React.FC<PredictiveAnalyticsProps> = ({ forecast = [] }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            12. Predictive Analytics & 90-Day Forecasting
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Time-series ARIMA/Prophet predictions with 95% confidence bands and expected churn metrics.
          </p>
        </div>
      </div>

      <ChartContainer title="90-Day Expected Feedback Volume & Confidence Intervals" subtitle="Upper and Lower Bound prediction interval">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
              <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="upperBound" name="Upper Confidence Limit" stroke="#c084fc" fill="url(#colorBand)" />
              <Area type="monotone" dataKey="predictedFeedback" name="Predicted Volume" stroke="#8b5cf6" strokeWidth={2} fill="none" />
              <Area type="monotone" dataKey="lowerBound" name="Lower Confidence Limit" stroke="#e9d5ff" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </div>
  );
};
