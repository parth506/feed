import React, { useEffect, useState } from "react";
import { registerAllAnalyticsWidgets } from "@/shared/registry/analyticsWidgetRegistry";
import { WidgetRegistry } from "@/shared/registry/WidgetRegistry";
import { WidgetRenderer } from "@/shared/components/widgets/WidgetRenderer";
import { ActiveTab } from "@/shared/components/layout/Sidebar";
import { FilterState } from "@/shared/types/analytics";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { api } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  MOCK_GEO_REGIONS,
  MOCK_CUSTOMER_CLUSTERS,
  MOCK_ML_IMPORTANCE,
  MOCK_ML_EVALUATION,
  MOCK_AI_INSIGHTS,
  MOCK_FORECAST,
  MOCK_CORRELATIONS,
  MOCK_OPERATIONAL_AGENTS,
} from "@/shared/constants/mockAnalytics";
import { X, Bell, Calendar, Download, RefreshCw, Star, Layers } from "lucide-react";

// Register all widgets on module evaluation
registerAllAnalyticsWidgets();

interface DashboardOverviewProps {
  activeTab: ActiveTab;
  filters: FilterState;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ activeTab, filters }) => {
  const [feedbacks, setFeedbacks] = useState<
    Array<{ id: string; time: string; sentiment: "Positive" | "Neutral" | "Negative"; comment: string }>
  >([]);
  const { toast } = useToast();

  const fetchBackendData = async () => {
    try {
      const data = await api.get<{
        total_feedback: number;
        positive: number;
        neutral: number;
        negative: number;
        latest_feedback: Array<{ id?: string; sentiment: string; comment?: string; created_at: string }>;
      }>("/api/dashboard");

      if (data && data.latest_feedback) {
        const formatted = data.latest_feedback.map((item) => {
          const sent = item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1).toLowerCase();
          return {
            id: item.id || String(Math.random()),
            time: item.created_at
              ? item.created_at.replace("T", " ").substring(0, 19)
              : new Date().toISOString().replace("T", " ").substring(0, 19),
            sentiment: (["Positive", "Neutral", "Negative"].includes(sent) ? sent : "Positive") as
              | "Positive"
              | "Neutral"
              | "Negative",
            comment: item.comment || "",
          };
        });
        setFeedbacks(formatted);
      }
    } catch (err) {
      console.warn("Backend API offline fallback:", err);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  const handleNewFeedbackSubmit = async (
    sentiment: "Positive" | "Neutral" | "Negative",
    comment: string
  ) => {
    try {
      await api.post("/api/feedback", {
        sentiment: sentiment.toLowerCase(),
        comment: comment,
      });
      await fetchBackendData();
      toast({
        title: "Feedback Saved to Database",
        description: "Stored successfully in MongoDB Atlas cluster.",
      });
    } catch (err) {
      console.warn("Backend save fallback:", err);
      setFeedbacks((prev) => [
        {
          id: String(Date.now()),
          time: new Date().toISOString().replace("T", " ").substring(0, 19),
          sentiment,
          comment,
        },
        ...prev,
      ]);
    }
  };

  // Map category matching activeTab selection
  const isWidgetVisible = (category: string): boolean => {
    if (activeTab === "dashboard") return ["kpi", "insights", "stream"].includes(category);
    if (activeTab === "analytics") return ["time_series", "categories", "geo", "segmentation", "correlations"].includes(category);
    if (activeTab === "feedback") return ["stream", "distribution"].includes(category);
    if (activeTab === "sentiment") return ["sentiment"].includes(category);
    if (activeTab === "topics") return ["topics"].includes(category);
    if (activeTab === "insights") return ["ml", "insights"].includes(category);
    if (activeTab === "prediction") return ["predictions"].includes(category);
    if (activeTab === "reports") return ["operations"].includes(category);
    return true;
  };

  // Map fallback data for each widget
  const getFallbackDataForWidget = (widgetId: string) => {
    switch (widgetId) {
      case "kpi-overview": {
        const total = feedbacks.length;
        const positive = feedbacks.filter((f) => f.sentiment === "Positive").length;
        const neutral = feedbacks.filter((f) => f.sentiment === "Neutral").length;
        const negative = feedbacks.filter((f) => f.sentiment === "Negative").length;

        const avgRating = total > 0 ? ((positive * 5 + neutral * 3 + negative * 1) / total).toFixed(2) : "0.00";
        const sentimentIdx = total > 0 ? ((positive - negative) / total).toFixed(2) : "0.00";
        const csat = total > 0 ? ((positive / total) * 100).toFixed(1) : "0.0";
        const nps = total > 0 ? Math.round(((positive - negative) / total) * 100) : 0;

        return {
          metrics: [
            { id: "total_feedback", title: "Total Feedback", value: String(total), change: 0, period: "Live", trend: "up", sparkline: [total], color: "#6366f1" },
            { id: "feedback_today", title: "Feedback Today", value: String(total), change: 0, period: "Live", trend: "up", sparkline: [total], color: "#3b82f6" },
            { id: "avg_rating", title: "Average Rating", value: `${avgRating} / 5`, change: 0, period: "Live", trend: "up", sparkline: [Number(avgRating)], color: "#10b981" },
            { id: "avg_sentiment", title: "Avg Sentiment Index", value: sentimentIdx.startsWith("-") ? sentimentIdx : `+${sentimentIdx}`, change: 0, period: "Live", trend: "up", sparkline: [Number(sentimentIdx)], color: "#8b5cf6" },
            { id: "response_rate", title: "Response Rate", value: "100%", change: 0, period: "Live", trend: "up", sparkline: [100], color: "#ec4899" },
            { id: "resolved_issues", title: "Resolved Issues", value: String(positive), change: 0, period: "Live", trend: "up", sparkline: [positive], color: "#14b8a6" },
            { id: "csat_score", title: "CSAT Score", value: `${csat}%`, change: 0, period: "Live", trend: "up", sparkline: [Number(csat)], color: "#f59e0b" },
            { id: "nps_score", title: "NPS Score", value: nps >= 0 ? `+${nps}` : String(nps), change: 0, period: "Live", trend: "up", sparkline: [nps], color: "#06b6d4" },
          ],
        };
      }
      case "realtime-feed":
        return { feedbacks };
      case "time-series-volume":
        return { data: [] };
      case "sentiment-radar":
        return { emotions: [], timeSeries: [] };
      case "topic-importance":
        return { topics: [] };
      case "feedback-ratings-histogram":
        return { ratings: [] };
      case "category-department-sla":
        return { departments: [] };
      case "geo-sentiment-map":
        return { regions: MOCK_GEO_REGIONS };
      case "customer-rfm-segmentation":
        return { clusters: MOCK_CUSTOMER_CLUSTERS };
      case "ml-shap-importance":
        return { importance: MOCK_ML_IMPORTANCE, evaluation: MOCK_ML_EVALUATION };
      case "ai-executive-digest":
        return { insights: MOCK_AI_INSIGHTS };
      case "predictive-forecasting":
        return { forecast: MOCK_FORECAST };
      case "correlation-heatmap":
        return { correlations: MOCK_CORRELATIONS };
      case "operational-sla-leaderboard":
        return { agents: MOCK_OPERATIONAL_AGENTS };
      default:
        return {};
    }
  };

  const allWidgets = WidgetRegistry.getAll();
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  const getDrawerFeedbacks = () => {
    if (activeDrawer === "csat_score") {
      return feedbacks.filter((f) => f.sentiment === "Positive");
    }
    if (activeDrawer === "nps_score") {
      return feedbacks.filter((f) => f.sentiment === "Positive" || f.sentiment === "Negative");
    }
    return feedbacks;
  };

  const getDrawerTitle = () => {
    if (activeDrawer === "csat_score") return "Customer Satisfaction (CSAT) Comments";
    if (activeDrawer === "nps_score") return "Net Promoter Score (NPS) Comments";
    return "Total Feedback Comment Database";
  };

  const handleMetricClick = (metricId: string) => {
    setActiveDrawer(metricId);
  };

  // Dynamic calculations
  const totalFeedbackCount = feedbacks.length;
  const positiveCount = feedbacks.filter((f) => f.sentiment === "Positive").length;
  const neutralCount = feedbacks.filter((f) => f.sentiment === "Neutral").length;
  const negativeCount = feedbacks.filter((f) => f.sentiment === "Negative").length;

  const csatScore = totalFeedbackCount > 0 ? Math.round((positiveCount / totalFeedbackCount) * 100) : 0;
  const npsScore = totalFeedbackCount > 0 ? Math.round(((positiveCount - negativeCount) / totalFeedbackCount) * 100) : 0;
  const avgRatingValue = totalFeedbackCount > 0
    ? ((positiveCount * 5 + neutralCount * 3 + negativeCount * 1) / totalFeedbackCount).toFixed(2)
    : "0.00";

  const mockNames = ["Priya Sharma", "Rahul Verma", "Ananya Iyer", "Vikram Patel", "Sarah Connor", "Arjun Nair"];
  const mockAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100"
  ];

  return (
    <div className="space-y-6 text-slate-100 bg-[#0B0F19] min-h-screen pb-16 select-none font-sans">
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Feedback Analytics Dashboard</h1>
          <p className="text-xs text-slate-400">Comprehensive overview of customer feedback insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 text-xs gap-2 bg-[#161C30] border-slate-850 text-slate-300 hover:bg-[#1E2540]">
            <Calendar className="h-3.5 w-3.5 text-slate-400" /> May 20 - Jun 18, 2026
          </Button>
          <Button variant="outline" size="sm" className="h-9 text-xs gap-2 bg-[#161C30] border-slate-855 text-slate-300 hover:bg-[#1E2540]">
            <Layers className="h-3.5 w-3.5 text-slate-400" /> Filters
          </Button>
          <Button className="h-9 text-xs gap-2 bg-[#6366F1] hover:bg-[#5053C9] text-white">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button variant="outline" size="icon" onClick={fetchBackendData} className="h-9 w-9 bg-[#161C30] border-slate-850 text-slate-300 hover:bg-[#1E2540]">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left Side Content Grid */}
        <div className="flex-1 space-y-6 w-full">
          {/* Row 1: KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="p-4 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Feedback</span>
              <span className="text-2xl font-black text-white block mt-1">{totalFeedbackCount.toLocaleString()}</span>
              <span className="text-[9px] text-emerald-400 font-semibold block mt-1">▲ 18.6% vs Apr 20 - May 19</span>
            </div>

            <div className="p-4 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Rating</span>
              <span className="text-2xl font-black text-white block mt-1">{avgRatingValue} / 5</span>
              <span className="text-[9px] text-emerald-400 font-semibold block mt-1">▲ 0.35 vs Apr 20 - May 19</span>
            </div>

            <div className="p-4 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overall Satisfaction (CSAT)</span>
              <span className="text-2xl font-black text-white block mt-1">{csatScore}%</span>
              <span className="text-[9px] text-emerald-400 font-semibold block mt-1">▲ 6% vs Apr 20 - May 19</span>
            </div>

            <div className="p-4 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Net Promoter Score (NPS)</span>
              <span className="text-2xl font-black text-white block mt-1">{npsScore >= 0 ? `+${npsScore}` : npsScore}</span>
              <span className="text-[9px] text-emerald-400 font-semibold block mt-1">▲ 8 vs Apr 20 - May 19</span>
            </div>

            <div className="p-4 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Response Rate</span>
              <span className="text-2xl font-black text-white block mt-1">68%</span>
              <span className="text-[9px] text-emerald-400 font-semibold block mt-1">▲ 7% vs Apr 20 - May 19</span>
            </div>

            <div className="p-4 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resolved Feedback</span>
              <span className="text-2xl font-black text-white block mt-1">{positiveCount.toLocaleString()}</span>
              <span className="text-[9px] text-emerald-400 font-semibold block mt-1">▲ 15% vs Apr 20 - May 19</span>
            </div>
          </div>

          {activeTab === "dashboard" ? (
            <>
              {/* Row 2: Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Trend line */}
                <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Feedback Trend Over Time</h3>
                      <p className="text-[10px] text-slate-500">Volume and sentiment history</p>
                    </div>
                    <select className="h-6 px-1.5 rounded bg-[#0B0F19] border border-slate-800 text-[10px] text-slate-400">
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                  </div>
                  <div className="h-[220px] w-full flex items-center justify-center text-slate-500 text-xs">
                    <div className="relative w-full h-full flex flex-col justify-between pt-2">
                      <svg className="w-full h-36 overflow-visible">
                        <path d="M 0,100 Q 40,80 80,120 T 160,50 T 240,90 T 320,30 T 400,60" fill="none" stroke="#6366F1" strokeWidth="2.5" />
                        <path d="M 0,110 Q 40,95 80,130 T 160,65 T 240,105 T 320,45 T 400,80" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6" />
                        <path d="M 0,130 Q 40,120 80,140 T 160,110 T 240,130 T 320,95 T 400,120" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.6" />
                      </svg>
                      <div className="flex justify-between text-[9px] text-slate-500 border-t border-slate-800/80 pt-1">
                        <span>May 20</span>
                        <span>Jun 01</span>
                        <span>Jun 10</span>
                        <span>Jun 17</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sentiment Analysis */}
                <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">Sentiment Analysis</h3>
                    <p className="text-[10px] text-slate-500">Breakdown of customer emotion segments</p>
                  </div>
                  <div className="flex items-center gap-6 h-[220px]">
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle cx="56" cy="56" r="44" className="stroke-slate-800 fill-none" strokeWidth="12" />
                        <circle cx="56" cy="56" r="44" className="stroke-[#10b981] fill-none" strokeWidth="12" strokeDasharray="276" strokeDashoffset="77" />
                        <circle cx="56" cy="56" r="44" className="stroke-[#f59e0b] fill-none" strokeWidth="12" strokeDasharray="276" strokeDashoffset="220" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-black text-white">{totalFeedbackCount}</span>
                        <span className="text-[8px] text-slate-500 uppercase font-semibold">Feedbacks</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 text-[10px]">
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-xs bg-[#10b981]" /> Positive</span>
                        <span className="font-bold">{totalFeedbackCount > 0 ? Math.round((positiveCount/totalFeedbackCount)*100) : 0}%</span>
                      </div>
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-xs bg-[#f59e0b]" /> Neutral</span>
                        <span className="font-bold">{totalFeedbackCount > 0 ? Math.round((neutralCount/totalFeedbackCount)*100) : 0}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-xs bg-[#ef4444]" /> Negative</span>
                        <span className="font-bold">{totalFeedbackCount > 0 ? Math.round((negativeCount/totalFeedbackCount)*100) : 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Horizontal Bars */}
                <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Feedback by Category</h3>
                      <p className="text-[10px] text-slate-500">Distribution by feature department</p>
                    </div>
                    <span className="text-[9px] text-[#6366F1] font-semibold cursor-pointer">View All</span>
                  </div>
                  <div className="space-y-2.5 h-[220px] overflow-y-auto pr-1">
                    {[
                      { label: "User Interface / UX", value: "2,487 (19.4%)", pct: 85, color: "bg-[#6366F1]" },
                      { label: "Performance", value: "1,986 (15.5%)", pct: 70, color: "bg-emerald-500" },
                      { label: "Payments", value: "1,765 (13.7%)", pct: 60, color: "bg-[#ec4899]" },
                      { label: "Features", value: "1,543 (12.0%)", pct: 50, color: "bg-amber-500" },
                      { label: "Customer Support", value: "1,234 (9.6%)", pct: 40, color: "bg-purple-500" }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1 text-[10px]">
                        <div className="flex justify-between text-slate-400 font-medium">
                          <span>{item.label}</span>
                          <span className="text-slate-300 font-bold">{item.value}</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#0B0F19] rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Keywords Cloud, Issues table, Feature Requests */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Keywords Cloud */}
                <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Top Keywords</h3>
                      <p className="text-[10px] text-slate-500">Most mentioned keywords in reviews</p>
                    </div>
                    <span className="text-[9px] text-[#6366F1] font-semibold cursor-pointer">View All</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5 justify-center items-center h-[180px] p-2">
                    {[
                      { text: "payment", size: "text-lg font-black text-rose-500" },
                      { text: "slow", size: "text-md font-extrabold text-[#6366F1]" },
                      { text: "bug", size: "text-md font-bold text-amber-500" },
                      { text: "crash", size: "text-sm font-semibold text-rose-400" },
                      { text: "dark mode", size: "text-sm font-semibold text-emerald-400" },
                      { text: "dashboard", size: "text-xs font-medium text-slate-300" },
                      { text: "helpful", size: "text-xs font-normal text-slate-400" },
                      { text: "easy", size: "text-xs font-normal text-slate-400" }
                    ].map((item, idx) => (
                      <span key={idx} className={`${item.size} hover:scale-105 transition-transform duration-200 cursor-pointer`}>
                        {item.text}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Issues Table */}
                <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Top Recurring Issues</h3>
                      <p className="text-[10px] text-slate-500">Track anomalies and frictions</p>
                    </div>
                    <span className="text-[9px] text-[#6366F1] font-semibold cursor-pointer">View All</span>
                  </div>
                  <div className="overflow-x-auto h-[180px]">
                    <table className="w-full text-left text-[10px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500">
                          <th className="pb-2 font-bold uppercase">Issue</th>
                          <th className="pb-2 font-bold uppercase">Mentions</th>
                          <th className="pb-2 font-bold uppercase">Priority</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {[
                          { title: "Payment Failure", count: 432, priority: "Critical", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
                          { title: "App Performance Slow", count: 389, priority: "High", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
                          { title: "Login Issues", count: 256, priority: "High", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
                          { title: "Unable to Export Data", count: 198, priority: "Medium", color: "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20" }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/30">
                            <td className="py-2.5 font-medium text-slate-200">{row.title}</td>
                            <td className="py-2.5 font-bold">{row.count}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${row.color}`}>
                                {row.priority}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Feature Requests list */}
                <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Feature Requests</h3>
                      <p className="text-[10px] text-slate-500">Most requested product additions</p>
                    </div>
                    <span className="text-[9px] text-[#6366F1] font-semibold cursor-pointer">View All</span>
                  </div>
                  <div className="space-y-3 h-[180px] overflow-y-auto pr-1">
                    {[
                      { label: "Dark Mode Support", pct: 65, count: "1,120" },
                      { label: "Export as PDF/Excel", pct: 50, count: "895" },
                      { label: "API Integrations", pct: 40, count: "742" },
                      { label: "Multi-language Support", pct: 35, count: "632" }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1 text-[10px]">
                        <div className="flex justify-between text-slate-400 font-medium">
                          <span>{item.label}</span>
                          <span className="text-slate-300 font-bold">{item.count}</span>
                        </div>
                        <div className="w-full h-1 bg-[#0B0F19] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 4: Averages, Demographics, country map & Heatmap */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {/* Average Rating by Page */}
                <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm space-y-4 xl:col-span-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200">Average Rating by Page</h3>
                      <p className="text-[10px] text-slate-500">Feedback metrics mapped to layout modules</p>
                    </div>
                    <span className="text-[9px] text-[#6366F1] font-semibold cursor-pointer">View All</span>
                  </div>
                  <div className="overflow-x-auto h-[160px]">
                    <table className="w-full text-left text-[10px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500">
                          <th className="pb-2 font-bold uppercase">Page Module</th>
                          <th className="pb-2 font-bold uppercase">Avg Rating</th>
                          <th className="pb-2 font-bold uppercase">Total Feedbacks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {[
                          { page: "Dashboard Overview", rating: 4.7, count: "2,342" },
                          { page: "Customers CRM Grid", rating: 4.4, count: "1,824" },
                          { page: "Account Settings", rating: 4.6, count: "1,254" },
                          { page: "Reports & Auditing", rating: 4.0, count: "1,210" }
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/30">
                            <td className="py-2 font-semibold text-slate-200">{row.page}</td>
                            <td className="py-2 text-[#f59e0b] font-bold flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {row.rating}
                            </td>
                            <td className="py-2 font-bold text-slate-400">{row.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Heatmap Time distribution */}
                <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">Feedback by Time of Day</h3>
                    <p className="text-[10px] text-slate-500">Peak hours load volume analysis</p>
                  </div>
                  <div className="grid grid-cols-6 gap-1 h-[140px] pt-2">
                    {Array.from({ length: 24 }).map((_, idx) => {
                      const intensities = ["bg-slate-900/40", "bg-[#6366F1]/10", "bg-[#6366F1]/30", "bg-[#6366F1]/60", "bg-emerald-500/80"];
                      const val = intensities[idx % intensities.length];
                      return (
                        <div key={idx} className={`rounded-sm ${val} hover:scale-105 transition-transform duration-200`} />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[8px] text-slate-500 border-t border-slate-800/85 pt-1">
                    <span>12 AM</span>
                    <span>8 AM</span>
                    <span>4 PM</span>
                    <span>11 PM</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            allWidgets
              .filter((widget) => isWidgetVisible(widget.category))
              .map((widget) => (
                <WidgetRenderer
                  key={widget.widgetId}
                  config={widget}
                  filters={filters}
                  fallbackData={getFallbackDataForWidget(widget.widgetId)}
                  onMetricClick={handleMetricClick}
                />
              ))
          )}
        </div>

        {/* Right Side Sidebar Panel (Alerts center, Action tracker, Recent feeds) */}
        <div className="w-full lg:w-80 shrink-0 space-y-5">
          {/* Alerts Card */}
          <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-200 flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#6366F1]" /> Alerts Center
              </h3>
              <span className="text-[9px] text-[#6366F1] font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-2.5">
              {[
                { title: "Payment Failure", desc: "spiked by 24% in mobile webkit", severity: "High", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
                { title: "App Performance Slow", desc: "reported latency spike on Android", severity: "High", color: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
                { title: "Reports Failures", desc: "120+ users unable to generate CSVs", severity: "Medium", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#0B0F19]/40 border border-slate-800/80 space-y-1 hover:border-[#6366F1]/20 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-100">{item.title}</span>
                    <span className={`px-1.5 py-0.5 rounded-full border text-[8px] font-bold ${item.color}`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Tracker Card */}
          <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-200">Action Tracker</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" className="stroke-slate-800 fill-none" strokeWidth="5.5" />
                  <circle cx="32" cy="32" r="26" className="stroke-[#6366F1] fill-none" strokeWidth="5.5" strokeDasharray="163" strokeDashoffset="45" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black text-white">72%</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <span className="text-[11px] font-bold text-slate-100 block">SLA Target Met</span>
                <span>Resolved: <strong>1,836 / 2,543</strong></span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-center text-[9px] pt-2 border-t border-slate-800">
              <div className="p-1 rounded bg-rose-500/5 text-rose-500">
                <span className="block font-bold">6</span>
                <span>Critical</span>
              </div>
              <div className="p-1 rounded bg-[#6366F1]/5 text-[#6366F1]">
                <span className="block font-bold">15</span>
                <span>Active</span>
              </div>
              <div className="p-1 rounded bg-amber-500/5 text-amber-500">
                <span className="block font-bold">24</span>
                <span>Open</span>
              </div>
              <div className="p-1 rounded bg-emerald-500/5 text-emerald-500">
                <span className="block font-bold">38</span>
                <span>Done</span>
              </div>
            </div>
          </div>

          {/* Recent Feedback Feed list */}
          <div className="p-5 rounded-xl bg-[#161C30] border border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200">Recent Feedbacks</h3>
              <span className="text-[9px] text-[#6366F1] font-bold cursor-pointer">View All</span>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {feedbacks.slice(0, 5).map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#0B0F19]/40 border border-slate-800/80 space-y-2 hover:border-[#6366F1]/20 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <img src={mockAvatars[idx % mockAvatars.length]} className="h-6 w-6 rounded-full object-cover shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-slate-200 block truncate">{mockNames[idx % mockNames.length]}</span>
                      <span className="text-[8px] text-slate-500 font-mono block">15m ago</span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${
                      item.sentiment === "Positive"
                        ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20"
                        : item.sentiment === "Neutral"
                        ? "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"
                        : "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20"
                    }`}>
                      {item.sentiment}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-normal line-clamp-2">
                    {item.comment || "No comment content provided."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Feedback Dialog */}
      <FeedbackDialog onFeedbackSubmit={handleNewFeedbackSubmit} />

      {/* Side Drill-down Drawer */}
      {activeDrawer && (
        <>
          <div
            className="fixed inset-0 bg-slate-950/20 dark:bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity"
            onClick={() => setActiveDrawer(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#161C30] border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between animate-slide-in text-slate-100">
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-xs font-bold text-slate-100">
                    {getDrawerTitle()}
                  </h3>
                  <span className="text-[10px] text-slate-505 font-medium">
                    Filtered dynamically from Atlas MongoDB
                  </span>
                </div>
                <button
                  onClick={() => setActiveDrawer(null)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable feedback comments */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1 py-2">
                {getDrawerFeedbacks().length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-8">
                    No comments match this segment.
                  </p>
                ) : (
                  getDrawerFeedbacks().map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-slate-800 bg-[#0B0F19]/40 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span
                          className={`px-1.5 py-0.5 rounded-full font-bold ${
                            item.sentiment === "Positive"
                              ? "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20"
                              : item.sentiment === "Neutral"
                              ? "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20"
                              : "bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20"
                          }`}
                        >
                          {item.sentiment}
                        </span>
                        <span className="text-slate-500 font-mono">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-normal">
                        {item.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-4 flex justify-end">
              <Button size="sm" variant="outline" className="border-slate-800 text-slate-300 hover:bg-[#1E2540]" onClick={() => setActiveDrawer(null)}>
                Close Panel
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

