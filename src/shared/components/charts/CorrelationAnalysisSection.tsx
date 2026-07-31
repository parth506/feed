import React from "react";
import { ChartContainer } from "../cards/ChartContainer";
import { CorrelationMetric } from "../../types/analytics";

interface CorrelationAnalysisProps {
  correlations: CorrelationMetric[];
}

export const CorrelationAnalysisSection: React.FC<CorrelationAnalysisProps> = ({ correlations }) => {
  const getCellColor = (coeff: number) => {
    if (coeff > 0.7) return "bg-emerald-500 text-white font-bold";
    if (coeff > 0.3) return "bg-emerald-200 text-emerald-900 font-semibold";
    if (coeff < -0.7) return "bg-rose-500 text-white font-bold";
    if (coeff < -0.3) return "bg-rose-200 text-rose-900 font-semibold";
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            13. Correlation Analysis & Feature Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pearson correlation coefficients between operational SLA factors and customer sentiment outcomes.
          </p>
        </div>
      </div>

      <ChartContainer title="Feature Correlation Heatmap Matrix" subtitle="Coefficients range from -1.0 (Strong Negative) to +1.0 (Strong Positive)">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-2">
          {correlations.map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col justify-between space-y-3"
            >
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {c.featureA} <span className="text-slate-400">vs</span> {c.featureB}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-lg text-sm font-mono ${getCellColor(c.coefficient)}`}>
                  {c.coefficient > 0 ? `+${c.coefficient.toFixed(2)}` : c.coefficient.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {Math.abs(c.coefficient) > 0.75 ? "High Correlation" : "Moderate Correlation"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ChartContainer>
    </div>
  );
};
