import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { ChartContainer } from "../cards/ChartContainer";
import { DepartmentMetric } from "../../types/analytics";

interface CategoryAnalyticsProps {
  departments: DepartmentMetric[];
}

export const CategoryAnalyticsSection: React.FC<CategoryAnalyticsProps> = ({ departments }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            7. Category & Department Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Department-wise feedback distribution and resolution efficiency.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Department Volume Horizontal Bar */}
        <ChartContainer title="Department Feedback Volume" subtitle="Total issues per department">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis dataKey="department" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
                <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* Resolved vs Unresolved Stacked Bar */}
        <ChartContainer title="Resolved vs Unresolved Feedback" subtitle="Closure SLA performance per department">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="resolved" name="Resolved" stackId="a" fill="#10b981" />
                <Bar dataKey="unresolved" name="Unresolved" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};
