import React from "react";
import { Clock } from "lucide-react";
import { ChartContainer } from "../cards/ChartContainer";

interface RealtimeMonitoringProps {
  feedbacks: Array<{
    id: string;
    time: string;
    sentiment: "Positive" | "Neutral" | "Negative";
    comment: string;
  }>;
}

export const RealtimeMonitoringSection: React.FC<RealtimeMonitoringProps> = ({ feedbacks }) => {
  const getBadgeColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50";
      case "neutral":
        return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50";
      case "negative":
        return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            2. Real-Time Monitoring & Stream
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live feedback feed stream with continuous sentiment gauge.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Real-time Feed Stream */}
        <div className="lg:col-span-2">
          <ChartContainer
            title="Live Feedback Stream"
            subtitle="Auto-refreshing live customer feedback comments"
            headerAction={
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                LIVE STREAM
              </span>
            }
          >
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {feedbacks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No recent feedback stream.</div>
              ) : (
                feedbacks.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-300 dark:hover:border-brand-700 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getBadgeColor(item.sentiment)}`}>
                        {item.sentiment}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 mt-2 font-normal leading-relaxed">
                      {item.comment || <span className="italic text-slate-400">No comment provided</span>}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ChartContainer>
        </div>

        {/* Live Sentiment Gauge Widget */}
        <div>
          <ChartContainer
            title="Live Sentiment Health Gauge"
            subtitle="Aggregate sentiment score (+0.68 Index)"
          >
            <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
              {/* Semi-circle Gauge representation */}
              <div className="relative w-44 h-24 flex items-end justify-center">
                <div className="w-44 h-44 rounded-full border-[14px] border-slate-100 dark:border-slate-800 border-t-emerald-500 border-r-emerald-500 border-b-transparent border-l-rose-500 -rotate-45" />
                <div className="absolute bottom-0 text-center">
                  <span className="text-3xl font-black tracking-tight text-emerald-500">+0.68</span>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">HEALTHY</p>
                </div>
              </div>

              <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <span className="block font-bold">78%</span>
                  <span className="text-[10px]">Positive</span>
                </div>
                <div className="p-2 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  <span className="block font-bold">14%</span>
                  <span className="text-[10px]">Neutral</span>
                </div>
                <div className="p-2 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400">
                  <span className="block font-bold">8%</span>
                  <span className="text-[10px]">Negative</span>
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};
