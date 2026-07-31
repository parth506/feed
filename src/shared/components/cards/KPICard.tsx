import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { KPIMetric } from "../../types/analytics";

interface KPICardProps {
  metric: KPIMetric;
}

export const KPICard: React.FC<KPICardProps> = ({ metric }) => {
  const isPositiveTrend = metric.change > 0;
  const isNegativeTrend = metric.change < 0;

  return (
    <Card className="relative overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 backdrop-blur shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      {/* Accent Top Border Bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: metric.color }}
      />

      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
            {metric.title}
          </p>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              isPositiveTrend
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : isNegativeTrend
                ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {isPositiveTrend ? (
              <TrendingUp className="h-3 w-3" />
            ) : isNegativeTrend ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            {metric.change > 0 ? `+${metric.change}%` : `${metric.change}%`}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {metric.value}
          </h3>
        </div>

        {/* Mini Sparkline Visualization */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
            {metric.period}
          </p>
          <div className="flex items-end gap-1 h-6 w-20">
            {metric.sparkline.map((val, idx) => {
              const min = Math.min(...metric.sparkline);
              const max = Math.max(...metric.sparkline);
              const heightPercent = max === min ? 50 : Math.max(15, ((val - min) / (max - min)) * 100);
              return (
                <div
                  key={idx}
                  className="flex-1 rounded-xs transition-all duration-300"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: metric.color,
                    opacity: 0.3 + (idx / metric.sparkline.length) * 0.7,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Mini Progress Bar */}
        <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.abs(metric.change * 5) + 40)}%`,
              backgroundColor: metric.color,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
