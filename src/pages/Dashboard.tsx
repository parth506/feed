import React, { useEffect, useState } from "react";
import { MessageSquare, Smile, Meh, Frown, RefreshCw } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { DashboardCharts } from "@/components/DashboardCharts";
import { FeedbackTable } from "@/components/FeedbackTable";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { FeedbackItem } from "@/types/feedback";
import { api } from "@/api";
import { useToast } from "@/hooks/use-toast";

interface DashboardApiResponse {
  total_feedback: number;
  positive: number;
  neutral: number;
  negative: number;
  latest_feedback: Array<{
    id?: string;
    sentiment: string;
    comment?: string;
    created_at: string;
  }>;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    neutral: 0,
    negative: 0,
  });
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      const data = await api.get<DashboardApiResponse>("/api/dashboard");
      setStats({
        total: data.total_feedback,
        positive: data.positive,
        neutral: data.neutral,
        negative: data.negative,
      });

      const formattedFeedbacks: FeedbackItem[] = (data.latest_feedback || []).map((item) => {
        const sentimentFormatted =
          item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1).toLowerCase();
        return {
          id: item.id || String(Math.random()),
          time: item.created_at
            ? item.created_at.replace("T", " ").substring(0, 19)
            : new Date().toISOString().replace("T", " ").substring(0, 19),
          sentiment: (["Positive", "Neutral", "Negative"].includes(sentimentFormatted)
            ? sentimentFormatted
            : "Positive") as "Positive" | "Neutral" | "Negative",
          comment: item.comment || "",
        };
      });

      setFeedbacks(formattedFeedbacks);
    } catch (err) {
      console.error("Failed to load dashboard stats from backend:", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleNewFeedback = async (
    sentiment: "Positive" | "Neutral" | "Negative",
    comment: string
  ) => {
    try {
      await api.post("/api/feedback", {
        sentiment: sentiment.toLowerCase(),
        comment: comment,
      });
      // Re-fetch live stats and feedbacks from database
      await fetchDashboardData();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast({
        title: "Submission Error",
        description: "Failed to store feedback in database.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    toast({
      title: "Stats Refreshed",
      description: "Dashboard view updated from database.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/60 pb-16">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              F
            </div>
            <div>
              <h1 className="font-bold text-slate-900 dark:text-slate-50 tracking-tight leading-none text-base">
                FeedbackIQ
              </h1>
              <p className="text-[10px] text-slate-400 mt-0.5">Enterprise Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <h2 className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-300">
              Overview
            </h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4.5 w-4.5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Body */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Statistics section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Feedback"
            value={stats.total}
            icon={MessageSquare}
            iconColorClass="text-brand-600 dark:text-brand-400"
          />
          <StatCard
            title="Positive"
            value={stats.positive}
            icon={Smile}
            iconColorClass="text-emerald-500"
          />
          <StatCard
            title="Neutral"
            value={stats.neutral}
            icon={Meh}
            iconColorClass="text-amber-500"
          />
          <StatCard
            title="Negative"
            value={stats.negative}
            icon={Frown}
            iconColorClass="text-rose-500"
          />
        </section>

        {/* Charts Section */}
        <section>
          <DashboardCharts
            positive={stats.positive}
            neutral={stats.neutral}
            negative={stats.negative}
          />
        </section>

        {/* Table Section */}
        <section>
          <FeedbackTable items={feedbacks} />
        </section>
      </main>

      {/* Floating Action Button & Dialog */}
      <FeedbackDialog onFeedbackSubmit={handleNewFeedback} />
    </div>
  );
};
export default Dashboard;
