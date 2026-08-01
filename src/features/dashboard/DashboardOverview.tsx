import React, { useEffect, useState } from "react";
import { ActiveTab } from "@/shared/components/layout/Sidebar";
import { FilterState } from "@/shared/types/analytics";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  MessageSquare,
  TrendingUp,
  Star,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Clock,
} from "lucide-react";

interface DashboardOverviewProps {
  activeTab: ActiveTab;
  filters: FilterState;
}

type Feedback = {
  id: string;
  time: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  comment: string;
};

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ activeTab }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, positive: 0, neutral: 0, negative: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.get<{
        total_feedback: number;
        positive: number;
        neutral: number;
        negative: number;
        latest_feedback: Array<{ id?: string; sentiment: string; comment?: string; created_at: string }>;
      }>("/api/dashboard");

      if (data) {
        setStats({
          total: data.total_feedback || 0,
          positive: data.positive || 0,
          neutral: data.neutral || 0,
          negative: data.negative || 0,
        });

        if (data.latest_feedback) {
          setFeedbacks(
            data.latest_feedback.map((item) => {
              const sent = item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1).toLowerCase();
              return {
                id: item.id || String(Math.random()),
                time: item.created_at
                  ? item.created_at.replace("T", " ").substring(0, 16)
                  : "",
                sentiment: (["Positive", "Neutral", "Negative"].includes(sent) ? sent : "Neutral") as
                  | "Positive"
                  | "Neutral"
                  | "Negative",
                comment: item.comment || "No comment provided.",
              };
            })
          );
        }
      }
    } catch (err) {
      console.warn("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const total = stats.total > 0 ? stats.total : 1;
  const posPct = Math.round((stats.positive / total) * 100);
  const neuPct = Math.round((stats.neutral / total) * 100);
  const negPct = Math.round((stats.negative / total) * 100);
  const csatScore = stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0;
  const npsScore = stats.total > 0 ? Math.round(((stats.positive - stats.negative) / stats.total) * 100) : 0;
  const avgRating = stats.total > 0
    ? ((stats.positive * 5 + stats.neutral * 3 + stats.negative * 1) / stats.total).toFixed(1)
    : "0.0";

  // Sentiment donut arc calculations (circumference = 2*PI*44 ≈ 276.46)
  const C = 276.46;
  const posArc = (stats.positive / total) * C;
  const neuArc = (stats.neutral / total) * C;
  const negArc = (stats.negative / total) * C;

  const sentimentColor = (s: string) => {
    if (s === "Positive") return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
    if (s === "Negative") return "bg-rose-500/15 text-rose-400 border border-rose-500/30";
    return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
  };

  const sentimentDot = (s: string) => {
    if (s === "Positive") return "bg-emerald-400";
    if (s === "Negative") return "bg-rose-400";
    return "bg-amber-400";
  };

  if (activeTab !== "dashboard") {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
        <MessageSquare className="h-10 w-10 opacity-30" />
        <p className="text-sm">This section is coming soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100 min-h-screen pb-16 font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Feedback Analytics</h1>
          <p className="text-xs text-slate-400 mt-0.5">Live insights from your customer feedback database</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="h-9 text-xs gap-2 bg-[#161C30] border-slate-700 text-slate-300 hover:bg-[#1E2540]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <FeedbackDialog
            onFeedbackSubmit={async (sentiment: "Positive" | "Neutral" | "Negative", comment: string) => {
              try {
                await api.post("/api/feedback", { sentiment: sentiment.toLowerCase(), comment });
                await fetchData();
              } catch (e) {
                console.error(e);
              }
            }}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          {
            label: "Total Feedback",
            value: stats.total.toLocaleString(),
            sub: "All time",
            icon: <MessageSquare className="h-4 w-4 text-indigo-400" />,
            accent: "border-indigo-500/30",
          },
          {
            label: "Positive",
            value: `${stats.positive}`,
            sub: `${posPct}% of total`,
            icon: <ThumbsUp className="h-4 w-4 text-emerald-400" />,
            accent: "border-emerald-500/30",
          },
          {
            label: "Neutral",
            value: `${stats.neutral}`,
            sub: `${neuPct}% of total`,
            icon: <Minus className="h-4 w-4 text-amber-400" />,
            accent: "border-amber-500/30",
          },
          {
            label: "Negative",
            value: `${stats.negative}`,
            sub: `${negPct}% of total`,
            icon: <ThumbsDown className="h-4 w-4 text-rose-400" />,
            accent: "border-rose-500/30",
          },
          {
            label: "CSAT Score",
            value: `${csatScore}%`,
            sub: npsScore >= 0 ? "Healthy" : "Needs attention",
            icon: <TrendingUp className="h-4 w-4 text-sky-400" />,
            accent: "border-sky-500/30",
          },
          {
            label: "Avg Rating",
            value: avgRating,
            sub: "out of 5.0",
            icon: <Star className="h-4 w-4 text-yellow-400" />,
            accent: "border-yellow-500/30",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`p-4 rounded-xl bg-[#161C30] border ${card.accent} shadow-sm flex flex-col gap-2 min-h-[100px]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{card.label}</span>
              {card.icon}
            </div>
            <span className="text-2xl font-black text-white">{loading ? "—" : card.value}</span>
            <span className="text-[10px] text-slate-500">{card.sub}</span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">

        {/* Trend SVG Chart */}
        <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm flex flex-col gap-4 min-h-[260px] xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Feedback Trend</h3>
              <p className="text-[10px] text-slate-500">Volume and sentiment history</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-400 inline-block" />Total</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />Positive</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-400 inline-block" />Negative</span>
            </div>
          </div>
          <div className="flex-1 min-h-[160px]">
            <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="grad-total" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="grad-pos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[40, 80, 120].map((y) => (
                <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#1e293b" strokeWidth="1" />
              ))}
              {/* Fill areas */}
              <path d="M0,120 Q75,100 150,110 T300,60 T450,80 T600,40 L600,160 L0,160Z" fill="url(#grad-total)" />
              <path d="M0,130 Q75,115 150,125 T300,85 T450,100 T600,70 L600,160 L0,160Z" fill="url(#grad-pos)" />
              {/* Lines */}
              <path d="M0,120 Q75,100 150,110 T300,60 T450,80 T600,40" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0,130 Q75,115 150,125 T300,85 T450,100 T600,70" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <path d="M0,145 Q75,138 150,142 T300,130 T450,136 T600,125" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </svg>
          </div>
          <div className="flex justify-between text-[9px] text-slate-600 border-t border-slate-800 pt-2 font-mono">
            <span>30 days ago</span>
            <span>20 days ago</span>
            <span>10 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Sentiment Donut */}
        <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm flex flex-col gap-4 min-h-[260px]">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Sentiment Breakdown</h3>
            <p className="text-[10px] text-slate-500">Distribution of customer emotions</p>
          </div>
          <div className="flex items-center gap-5 flex-1">
            {/* Donut SVG */}
            <div className="relative shrink-0 w-28 h-28">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                <circle cx="56" cy="56" r="44" fill="none" stroke="#1e293b" strokeWidth="12" />
                {/* Positive */}
                <circle
                  cx="56" cy="56" r="44" fill="none"
                  stroke="#10b981" strokeWidth="12"
                  strokeDasharray={`${posArc} ${C - posArc}`}
                  strokeDashoffset="0"
                  className="transition-all duration-700"
                />
                {/* Neutral */}
                <circle
                  cx="56" cy="56" r="44" fill="none"
                  stroke="#f59e0b" strokeWidth="12"
                  strokeDasharray={`${neuArc} ${C - neuArc}`}
                  strokeDashoffset={`${-posArc}`}
                  className="transition-all duration-700"
                />
                {/* Negative */}
                <circle
                  cx="56" cy="56" r="44" fill="none"
                  stroke="#f43f5e" strokeWidth="12"
                  strokeDasharray={`${negArc} ${C - negArc}`}
                  strokeDashoffset={`${-(posArc + neuArc)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-white">{stats.total}</span>
                <span className="text-[8px] text-slate-500 uppercase tracking-wide">Total</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2.5 text-xs">
              {[
                { label: "Positive", val: `${stats.positive} (${posPct}%)`, dot: "bg-emerald-400" },
                { label: "Neutral", val: `${stats.neutral} (${neuPct}%)`, dot: "bg-amber-400" },
                { label: "Negative", val: `${stats.negative} (${negPct}%)`, dot: "bg-rose-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-slate-800/60 pb-2 last:border-0 last:pb-0">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                    {item.label}
                  </span>
                  <span className="font-bold text-slate-200">{loading ? "—" : item.val}</span>
                </div>
              ))}
            </div>
          </div>
          {/* NPS */}
          <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">NPS Score</span>
            <span className={`font-black text-base ${npsScore >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {npsScore >= 0 ? "+" : ""}{npsScore}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <div className="rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Recent Feedback</h3>
            <p className="text-[10px] text-slate-500">Latest submissions from your customers</p>
          </div>
          <span className="text-[10px] text-slate-500">{feedbacks.length} records</span>
        </div>
        <div className="divide-y divide-slate-800/40 max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="px-5 py-10 flex items-center justify-center text-slate-500 text-xs gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading feedback...
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="px-5 py-10 flex flex-col items-center justify-center text-slate-500 gap-2">
              <MessageSquare className="h-8 w-8 opacity-30" />
              <p className="text-xs">No feedback yet. Submit the first one!</p>
            </div>
          ) : (
            feedbacks.map((fb) => (
              <div key={fb.id} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-900/30 transition-colors">
                {/* Dot */}
                <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${sentimentDot(fb.sentiment)}`} />
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 truncate">
                    {fb.comment || <span className="italic text-slate-600">No comment provided.</span>}
                  </p>
                </div>
                {/* Right side */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${sentimentColor(fb.sentiment)}`}>
                    {fb.sentiment}
                  </span>
                  <span className="text-[9px] text-slate-600 flex items-center gap-1 font-mono">
                    <Clock className="h-2.5 w-2.5" />{fb.time}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
