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
  MOCK_EXECUTIVE_KPIS,
  MOCK_TIMESERIES,
  MOCK_EMOTIONS,
  MOCK_TOPICS,
  MOCK_RATINGS,
  MOCK_DEPARTMENTS,
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
      case "kpi-overview":
        return { metrics: MOCK_EXECUTIVE_KPIS };
      case "realtime-feed":
        return { feedbacks };
      case "time-series-volume":
        return { data: MOCK_TIMESERIES };
      case "sentiment-radar":
        return { emotions: MOCK_EMOTIONS, timeSeries: MOCK_TIMESERIES };
      case "topic-importance":
        return { topics: MOCK_TOPICS };
      case "feedback-ratings-histogram":
        return { ratings: MOCK_RATINGS };
      case "category-department-sla":
        return { departments: MOCK_DEPARTMENTS };
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
