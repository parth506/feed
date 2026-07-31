import React, { useState, useMemo } from "react";
import { Clock, Download, Search, Filter } from "lucide-react";
import { ChartContainer } from "../cards/ChartContainer";
import { Button } from "@/components/ui/button";

interface RealtimeMonitoringProps {
  feedbacks: Array<{
    id: string;
    time: string;
    sentiment: "Positive" | "Neutral" | "Negative";
    comment: string;
  }>;
}

export const RealtimeMonitoringSection: React.FC<RealtimeMonitoringProps> = ({ feedbacks = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState<"All" | "Positive" | "Neutral" | "Negative">("All");

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

  // Perform local search and filters
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      const matchesSearch = item.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSentiment = selectedSentiment === "All" || item.sentiment === selectedSentiment;
      return matchesSearch && matchesSentiment;
    });
  }, [feedbacks, searchTerm, selectedSentiment]);

  // Dynamic sentiment statistics
  const stats = useMemo(() => {
    const total = feedbacks.length;
    if (total === 0) return { positive: 0, neutral: 0, negative: 0, index: "0.00", status: "NEUTRAL", color: "text-slate-400" };

    const pos = feedbacks.filter((f) => f.sentiment === "Positive").length;
    const neu = feedbacks.filter((f) => f.sentiment === "Neutral").length;
    const neg = feedbacks.filter((f) => f.sentiment === "Negative").length;

    const positivePct = Math.round((pos / total) * 100);
    const neutralPct = Math.round((neu / total) * 100);
    const negativePct = Math.round((neg / total) * 100);
    const indexVal = (pos - neg) / total;

    let status = "HEALTHY";
    let color = "text-emerald-500";
    if (indexVal < -0.1) {
      status = "CRITICAL";
      color = "text-rose-500";
    } else if (indexVal < 0.2) {
      status = "MODERATE";
      color = "text-amber-500";
    }

    return {
      positive: positivePct,
      neutral: neutralPct,
      negative: negativePct,
      index: indexVal >= 0 ? `+${indexVal.toFixed(2)}` : indexVal.toFixed(2),
      status,
      color,
    };
  }, [feedbacks]);

  // Client-side CSV Exporter
  const handleExportCSV = () => {
    if (filteredFeedbacks.length === 0) return;
    const headers = ["ID", "Time", "Sentiment", "Comment"];
    const rows = filteredFeedbacks.map((f) => [
      f.id,
      f.time,
      f.sentiment,
      `"${f.comment.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `feedback_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Client-side JSON Exporter
  const handleExportJSON = () => {
    if (filteredFeedbacks.length === 0) return;
    const jsonContent = JSON.stringify(filteredFeedbacks, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `feedback_export_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Clock className="h-5 w-5 text-brand-500" /> 2. Real-Time Monitoring & Stream
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live feedback feed stream with continuous sentiment gauge.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Feed Stream */}
        <div className="lg:col-span-2 space-y-3">
          <ChartContainer
            title="Live Feedback Stream"
            subtitle="Auto-refreshing live customer feedback comments"
            headerAction={
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportCSV}
                  className="h-6 text-[10px] px-2 gap-1"
                >
                  <Download className="h-3 w-3" /> CSV
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportJSON}
                  className="h-6 text-[10px] px-2 gap-1"
                >
                  <Download className="h-3 w-3" /> JSON
                </Button>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE
                </span>
              </div>
            }
          >
            {/* Inline Filtering Controls */}
            <div className="flex flex-col sm:flex-row gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter stream comments locally..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-100/50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 text-[11px] placeholder:text-slate-400 focus:outline-none focus:border-brand-500/50"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                {(["All", "Positive", "Neutral", "Negative"] as const).map((sent) => (
                  <button
                    key={sent}
                    onClick={() => setSelectedSentiment(sent)}
                    className={`h-7 px-2.5 rounded-md text-[10px] font-semibold border transition-all ${
                      selectedSentiment === sent
                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 border-transparent shadow-xs"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    {sent}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable feed list */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {filteredFeedbacks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No matching feed stream found.
                </div>
              ) : (
                filteredFeedbacks.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeColor(
                          item.sentiment
                        )}`}
                      >
                        {item.sentiment}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
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
            subtitle={`Aggregate sentiment score (${stats.index} Index)`}
          >
            <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
              {/* Semi-circle Gauge representation */}
              <div className="relative w-44 h-24 flex items-end justify-center">
                <div className="w-44 h-44 rounded-full border-[14px] border-slate-100 dark:border-slate-800 border-t-emerald-500 border-r-emerald-500 border-b-transparent border-l-rose-500 -rotate-45 animate-pulse" />
                <div className="absolute bottom-0 text-center">
                  <span className={`text-3xl font-black tracking-tight ${stats.color}`}>
                    {stats.index}
                  </span>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                    {stats.status}
                  </p>
                </div>
              </div>

              <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <span className="block font-bold">{stats.positive}%</span>
                  <span className="text-[10px]">Positive</span>
                </div>
                <div className="p-2 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  <span className="block font-bold">{stats.neutral}%</span>
                  <span className="text-[10px]">Neutral</span>
                </div>
                <div className="p-2 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400">
                  <span className="block font-bold">{stats.negative}%</span>
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

