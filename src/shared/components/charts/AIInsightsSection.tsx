import React from "react";
import { Sparkles } from "lucide-react";
import { ChartContainer } from "../cards/ChartContainer";
import { AIInsightItem } from "../../types/analytics";

interface AIInsightsProps {
  insights: AIInsightItem[];
}

export const AIInsightsSection: React.FC<AIInsightsProps> = ({ insights }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            11. AI Executive Insights & Recommendations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            LLM-generated natural language summaries, root cause diagnostic, and prioritized risk alerts.
          </p>
        </div>
      </div>

      {/* Natural Language Executive Summary */}
      <div className="p-4 rounded-xl border border-brand-200 dark:border-brand-900/60 bg-gradient-to-r from-brand-500/10 via-indigo-500/5 to-purple-500/10 dark:from-brand-950/40 dark:to-slate-950/60 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-brand-500 animate-pulse" />
          AI Executive Summary & Digest
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
          Overall feedback sentiment remains strong at <strong className="text-emerald-600 dark:text-emerald-400">+0.68 Index (78% Positive)</strong>, driven by praise for the UI speed and SDK documentation. However, an automated NLP cluster detected a localized 14% sentiment drop in <strong>Checkout Payments</strong> due to 3D Secure WebKit mobile timeouts affecting 1,420 users.
        </p>
      </div>

      {/* AI Insight Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item) => (
          <ChartContainer
            key={item.id}
            title={item.title}
            headerAction={
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                item.severity === "critical"
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                  : item.severity === "warning"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              }`}>
                {item.severity}
              </span>
            }
          >
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Action</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{item.suggestedAction}</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span>Impact Score: <strong className="text-slate-700 dark:text-slate-200">{item.impactScore}/100</strong></span>
                <span>{item.affectedUsersCount} users</span>
              </div>
            </div>
          </ChartContainer>
        ))}
      </div>
    </div>
  );
};
