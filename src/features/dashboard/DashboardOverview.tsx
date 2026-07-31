import React, { useEffect, useState } from "react";
import { ExecutiveOverviewSection } from "@/shared/components/charts/ExecutiveOverviewSection";
import { RealtimeMonitoringSection } from "@/shared/components/charts/RealtimeMonitoringSection";
import { TimeSeriesAnalyticsSection } from "@/shared/components/charts/TimeSeriesAnalyticsSection";
import { SentimentIntelligenceSection } from "@/shared/components/charts/SentimentIntelligenceSection";
import { TopicAnalyticsSection } from "@/shared/components/charts/TopicAnalyticsSection";
import { FeedbackDistributionSection } from "@/shared/components/charts/FeedbackDistributionSection";
import { CategoryAnalyticsSection } from "@/shared/components/charts/CategoryAnalyticsSection";
import { GeographicalAnalyticsSection } from "@/shared/components/charts/GeographicalAnalyticsSection";
import { CustomerSegmentationSection } from "@/shared/components/charts/CustomerSegmentationSection";
import { MLInsightsSection } from "@/shared/components/charts/MLInsightsSection";
import { AIInsightsSection } from "@/shared/components/charts/AIInsightsSection";
import { PredictiveAnalyticsSection } from "@/shared/components/charts/PredictiveAnalyticsSection";
import { CorrelationAnalysisSection } from "@/shared/components/charts/CorrelationAnalysisSection";
import { OperationalMetricsSection } from "@/shared/components/charts/OperationalMetricsSection";
import { FeedbackDialog } from "@/components/FeedbackDialog";

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
import { ActiveTab } from "@/shared/components/layout/Sidebar";
import { FilterState, TimeSeriesPoint, EmotionDistribution, TopicItem, AIInsightItem, ForecastPoint } from "@/shared/types/analytics";
import { analyticsService } from "@/services/analyticsService";
import { api } from "@/api";
import { useToast } from "@/hooks/use-toast";

interface DashboardOverviewProps {
  activeTab: ActiveTab;
  filters: FilterState;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ activeTab, filters: _filters }) => {
  const [feedbacks, setFeedbacks] = useState<
    Array<{ id: string; time: string; sentiment: "Positive" | "Neutral" | "Negative"; comment: string }>
  >([]);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>(MOCK_TIMESERIES);
  const [emotions, setEmotions] = useState<EmotionDistribution[]>(MOCK_EMOTIONS);
  const [topics, setTopics] = useState<TopicItem[]>(MOCK_TOPICS);
  const [aiInsights, setAiInsights] = useState<AIInsightItem[]>(MOCK_AI_INSIGHTS);
  const [forecast, setForecast] = useState<ForecastPoint[]>(MOCK_FORECAST);

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
      console.warn("Backend API offline/standalone mode:", err);
    }

    // Fetch feature API v1 data
    try {
      const tsData = await analyticsService.getTimeSeries();
      if (tsData && tsData.length > 0) setTimeSeries(tsData);
    } catch (err) {
      console.warn("Time series API fallback:", err);
    }

    try {
      const emotionData = await analyticsService.getEmotions();
      if (emotionData && emotionData.length > 0) setEmotions(emotionData);
    } catch (err) {
      console.warn("Emotion API fallback:", err);
    }

    try {
      const topicData = await analyticsService.getTopics();
      if (topicData && topicData.length > 0) setTopics(topicData);
    } catch (err) {
      console.warn("Topic API fallback:", err);
    }

    try {
      const aiData = await analyticsService.getAIRecommendations();
      if (aiData && aiData.length > 0) setAiInsights(aiData);
    } catch (err) {
      console.warn("AI Insights API fallback:", err);
    }

    try {
      const forecastData = await analyticsService.getForecast();
      if (forecastData && forecastData.length > 0) setForecast(forecastData);
    } catch (err) {
      console.warn("Forecast API fallback:", err);
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
      console.warn("Backend save fallback to local:", err);
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

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Executive Overview */}
      {(activeTab === "dashboard" || activeTab === "analytics") && (
        <ExecutiveOverviewSection metrics={MOCK_EXECUTIVE_KPIS} />
      )}

      {/* 2. Real-Time Monitoring Stream */}
      {(activeTab === "dashboard" || activeTab === "feedback") && (
        <RealtimeMonitoringSection feedbacks={feedbacks} />
      )}

      {/* 3. Time Series Analytics */}
      {(activeTab === "dashboard" || activeTab === "analytics") && (
        <TimeSeriesAnalyticsSection data={timeSeries} />
      )}

      {/* 4. Sentiment Intelligence */}
      {(activeTab === "dashboard" || activeTab === "sentiment") && (
        <SentimentIntelligenceSection emotions={emotions} timeSeries={timeSeries} />
      )}

      {/* 5. Topic Analytics */}
      {(activeTab === "dashboard" || activeTab === "topics") && (
        <TopicAnalyticsSection topics={topics} />
      )}

      {/* 6. Feedback Distribution */}
      {(activeTab === "dashboard" || activeTab === "feedback") && (
        <FeedbackDistributionSection ratings={MOCK_RATINGS} />
      )}

      {/* 7. Category & Department Analytics */}
      {(activeTab === "dashboard" || activeTab === "analytics") && (
        <CategoryAnalyticsSection departments={MOCK_DEPARTMENTS} />
      )}

      {/* 8. Geographical Analytics */}
      {(activeTab === "dashboard" || activeTab === "analytics") && (
        <GeographicalAnalyticsSection regions={MOCK_GEO_REGIONS} />
      )}

      {/* 9. Customer Segmentation */}
      {(activeTab === "dashboard" || activeTab === "analytics") && (
        <CustomerSegmentationSection clusters={MOCK_CUSTOMER_CLUSTERS} />
      )}

      {/* 10. ML Insights */}
      {(activeTab === "dashboard" || activeTab === "insights") && (
        <MLInsightsSection importance={MOCK_ML_IMPORTANCE} evaluation={MOCK_ML_EVALUATION} />
      )}

      {/* 11. AI Insights */}
      {(activeTab === "dashboard" || activeTab === "insights") && (
        <AIInsightsSection insights={aiInsights} />
      )}

      {/* 12. Predictive Analytics */}
      {(activeTab === "dashboard" || activeTab === "prediction") && (
        <PredictiveAnalyticsSection forecast={forecast} />
      )}

      {/* 13. Correlation Analysis */}
      {(activeTab === "dashboard" || activeTab === "analytics") && (
        <CorrelationAnalysisSection correlations={MOCK_CORRELATIONS} />
      )}

      {/* 14. Operational Metrics */}
      {(activeTab === "dashboard" || activeTab === "reports") && (
        <OperationalMetricsSection agents={MOCK_OPERATIONAL_AGENTS} />
      )}

      {/* Floating Action Button */}
      <FeedbackDialog onFeedbackSubmit={handleNewFeedbackSubmit} />
    </div>
  );
};
