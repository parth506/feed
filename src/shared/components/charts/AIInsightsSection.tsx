import React, { useState } from "react";
import { Sparkles, CheckCircle2, ChevronRight, Activity, TrendingUp } from "lucide-react";
import { AIInsightItem } from "../../types/analytics";
import { Button } from "@/components/ui/button";

interface AIInsightsProps {
  insights: AIInsightItem[];
  onActionTrigger?: (actionName: string) => void;
}

export const AIInsightsSection: React.FC<AIInsightsProps> = ({
  insights = [],
  onActionTrigger,
}) => {
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);

  const handleResolve = (id: string, title: string) => {
    setResolvedIds((prev) => [...prev, id]);
    onActionTrigger?.(`Resolve: ${title}`);
  };

  const activeInsights = insights.filter((item) => !resolvedIds.includes(item.id));

  // Partition insights into a 2x2 Priority Matrix Quadrant dynamically
  const quickWins = activeInsights.filter((item) => item.impactScore >= 70 && item.severity !== "critical");
  const majorProjects = activeInsights.filter((item) => item.impactScore >= 70 && item.severity === "critical");
  const fillIns = activeInsights.filter((item) => item.impactScore < 70 && item.severity !== "critical");
  const thanklessTasks = activeInsights.filter((item) => item.impactScore < 70 && item.severity === "critical");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" /> AI Insights & Strategic Planning
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            LLM-generated diagnostic summaries, quadrant priority matrices, and automated action paths.
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 border-slate-200 dark:border-slate-800">
          Export AI Report <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Notion AI-Style Executive Summary Card */}
      <div className="relative overflow-hidden rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50 via-purple-50/50 to-indigo-50/30 dark:from-indigo-950/20 dark:to-slate-950/40 p-5 shadow-xs">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="h-24 w-24 text-indigo-500" />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
          AI Executive Summary & Digest
        </div>
        <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium max-w-4xl space-y-2">
          <p>
            Overall platform satisfaction index remains high, led by praise for interface speed and API stability.
            However, our NLP clustering models detected a <strong>14% negative spike in payment modules</strong>. 
            This friction is primary caused by transaction timeouts on mobile Safari sessions during 3D Secure redirects.
          </p>
          <p className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-semibold">
            Next Critical Action: Fix Safari Mobile 3D-Secure timeouts to recover $42k in monthly run-rate.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Matrix Column (Linear / Stripe style 2x2 Grid) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur shadow-xs flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-brand-500" /> Priority Matrix (Impact vs. Severity)
            </h3>
            
            <div className="grid grid-cols-2 gap-3 min-h-[300px]">
              {/* Quadrant 1: Quick Wins */}
              <div className="p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Quick Wins (High Impact, Low Effort)</span>
                  <div className="mt-2 space-y-1.5">
                    {quickWins.length === 0 ? (
                      <p className="text-[10px] text-slate-400">All quick wins completed</p>
                    ) : (
                      quickWins.map((w) => (
                        <div key={w.id} className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="truncate">{w.title}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 text-right mt-2 block">Action Immediately</span>
              </div>

              {/* Quadrant 2: Major Projects */}
              <div className="p-3.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Major Projects (High Impact, High Effort)</span>
                  <div className="mt-2 space-y-1.5">
                    {majorProjects.length === 0 ? (
                      <p className="text-[10px] text-slate-400">No major projects pending</p>
                    ) : (
                      majorProjects.map((w) => (
                        <div key={w.id} className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          <span className="truncate">{w.title}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 text-right mt-2 block">Plan Resources</span>
              </div>

              {/* Quadrant 3: Fill-ins */}
              <div className="p-3.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Fill-ins (Low Impact, Low Effort)</span>
                  <div className="mt-2 space-y-1.5">
                    {fillIns.length === 0 ? (
                      <p className="text-[10px] text-slate-400">No fill-ins found</p>
                    ) : (
                      fillIns.map((w) => (
                        <div key={w.id} className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          <span className="truncate">{w.title}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 text-right mt-2 block">Snoozeable</span>
              </div>

              {/* Quadrant 4: Thankless Tasks */}
              <div className="p-3.5 rounded-lg bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">Risks / Outliers (Low Impact, High Severity)</span>
                  <div className="mt-2 space-y-1.5">
                    {thanklessTasks.length === 0 ? (
                      <p className="text-[10px] text-slate-400">No outlier anomalies</p>
                    ) : (
                      thanklessTasks.map((w) => (
                        <div key={w.id} className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                          <span className="truncate">{w.title}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 text-right mt-2 block">Evaluate Strategy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Recommendations Column */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur shadow-xs flex-1 flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-500" /> Strategic Action Items
            </h3>
            
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {activeInsights.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">All alerts resolved!</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Your platform customer sentiment is healthy.</p>
                </div>
              ) : (
                activeInsights.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 space-y-2 hover:border-brand-500/20 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-50 leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {item.title}
                      </h4>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        item.severity === "critical"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/20"
                          : item.severity === "warning"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/20"
                          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/20"
                      }`}>
                        {item.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                      <span className="text-[10px] text-slate-400">Impact Score: <strong>{item.impactScore}/100</strong></span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(item.id, item.title)}
                        className="h-6 text-[10px] px-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

