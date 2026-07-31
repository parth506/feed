import React, { useEffect, useState } from "react";
import { registerAllAnalyticsWidgets } from "@/shared/registry/analyticsWidgetRegistry";
import { WidgetRegistry } from "@/shared/registry/WidgetRegistry";
import { WidgetRenderer } from "@/shared/components/widgets/WidgetRenderer";
import { ActiveTab } from "@/shared/components/layout/Sidebar";
import { FilterState } from "@/shared/types/analytics";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { api } from "@/api";
import { useToast } from "@/hooks/use-toast";
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
    if (activeTab === "dashboard") return true;
    if (activeTab === "analytics") return ["kpi", "time_series", "categories", "geo", "segmentation", "correlations"].includes(category);
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

  return (
    <div className="space-y-8 pb-16">
      {allWidgets
        .filter((widget) => isWidgetVisible(widget.category))
        .map((widget) => (
          <WidgetRenderer
            key={widget.widgetId}
            config={widget}
            filters={filters}
            fallbackData={getFallbackDataForWidget(widget.widgetId)}
          />
        ))}

      {/* Floating Feedback Dialog */}
      <FeedbackDialog onFeedbackSubmit={handleNewFeedbackSubmit} />
    </div>
  );
};
