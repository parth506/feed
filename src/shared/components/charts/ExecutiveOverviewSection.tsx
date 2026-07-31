import React from "react";
import { KPICard } from "../cards/KPICard";
import { KPIMetric } from "../../types/analytics";
import { Activity, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ExecutiveOverviewProps {
  metrics: KPIMetric[];
  onMetricClick?: (id: string) => void;
}

export const ExecutiveOverviewSection: React.FC<ExecutiveOverviewProps> = ({
  metrics,
  onMetricClick,
}) => {
  // Parse metrics dynamically to calculate a unified Business Health Score (0-100)
  const csatMetric = metrics.find((m) => m.id === "csat_score");
  const npsMetric = metrics.find((m) => m.id === "nps_score");
  const totalMetric = metrics.find((m) => m.id === "total_feedback");

  const csatVal = csatMetric ? parseFloat(String(csatMetric.value)) || 85.0 : 85.0;
  const npsVal = npsMetric ? parseInt(String(npsMetric.value).replace("+", "")) || 40 : 40;
  const totalVal = totalMetric ? parseInt(String(totalMetric.value).replace(/,/g, "")) || 0 : 0;

  // Scale NPS (-100 to +100) to (0 to 100)
  const scaledNps = (npsVal + 100) / 2;
  const healthScore = totalVal > 0 ? Math.round(csatVal * 0.6 + scaledNps * 0.4) : 0;

  // SVG Gauge calculations (radius = 38, circumference = 238.76)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (healthScore / 100) * circumference;

  const getHealthColorClass = (score: number) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500";
    if (score >= 60) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand-500" /> Platform Executive Summary
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time business performance indicators & customer satisfaction SLA benchmarks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Unified Business Health Score SVG Circular Gauge */}
        <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden glow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business Health</span>
            {healthScore >= 75 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-pulse" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-amber-500 animate-bounce" />
            )}
          </div>

          <div className="my-4 flex items-center justify-center relative">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-900 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                className={`fill-none transition-all duration-500 ${getHealthColorClass(healthScore)}`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                {healthScore}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Index Score</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {healthScore >= 80
                ? "Excellent Customer Sentiment"
                : healthScore >= 60
                ? "Moderate Friction Spike"
                : "High Churn Vulnerability"}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Weighted index of CSAT & NPS metrics
            </p>
          </div>
        </div>

        {/* Remaining KPI Metrics Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <KPICard
              key={metric.id}
              metric={metric}
              onClick={
                metric.id === "csat_score" || metric.id === "nps_score" || metric.id === "total_feedback"
                  ? () => onMetricClick?.(metric.id)
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

