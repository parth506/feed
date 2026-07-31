import React from "react";
import { KPICard } from "../cards/KPICard";
import { KPIMetric } from "../../types/analytics";

interface ExecutiveOverviewProps {
  metrics: KPIMetric[];
}

export const ExecutiveOverviewSection: React.FC<ExecutiveOverviewProps> = ({ metrics }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            1. Executive Overview & KPIs
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time business performance indicators & customer satisfaction SLA benchmarks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <KPICard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
};
