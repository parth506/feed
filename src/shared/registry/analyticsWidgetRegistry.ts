import { WidgetRegistry } from "./WidgetRegistry";
import { ExecutiveOverviewSection } from "../components/charts/ExecutiveOverviewSection";
import { RealtimeMonitoringSection } from "../components/charts/RealtimeMonitoringSection";
import { TimeSeriesAnalyticsSection } from "../components/charts/TimeSeriesAnalyticsSection";
import { SentimentIntelligenceSection } from "../components/charts/SentimentIntelligenceSection";
import { TopicAnalyticsSection } from "../components/charts/TopicAnalyticsSection";
import { FeedbackDistributionSection } from "../components/charts/FeedbackDistributionSection";
import { CategoryAnalyticsSection } from "../components/charts/CategoryAnalyticsSection";
import { GeographicalAnalyticsSection } from "../components/charts/GeographicalAnalyticsSection";
import { CustomerSegmentationSection } from "../components/charts/CustomerSegmentationSection";
import { MLInsightsSection } from "../components/charts/MLInsightsSection";
import { AIInsightsSection } from "../components/charts/AIInsightsSection";
import { PredictiveAnalyticsSection } from "../components/charts/PredictiveAnalyticsSection";
import { CorrelationAnalysisSection } from "../components/charts/CorrelationAnalysisSection";
import { OperationalMetricsSection } from "../components/charts/OperationalMetricsSection";

export function registerAllAnalyticsWidgets(): void {
  // 1. Executive KPI Overview Widget
  WidgetRegistry.register({
    widgetId: "kpi-overview",
    title: "Executive Overview & KPIs",
    subtitle: "Real-time SLAs & KPIs",
    category: "kpi",
    apiEndpoint: "/api/v1/dashboard/kpis",
    refreshStrategy: "poll",
    pollIntervalMs: 15000,
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["dateRange", "department"],
    component: ExecutiveOverviewSection,
  });

  // 2. Real-Time Monitoring Stream Widget
  WidgetRegistry.register({
    widgetId: "realtime-feed",
    title: "Real-Time Monitoring Stream",
    subtitle: "Live activity feed",
    category: "stream",
    apiEndpoint: "/api/dashboard",
    refreshStrategy: "realtime",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["sentiment"],
    component: RealtimeMonitoringSection,
  });

  // 3. Time Series Analytics Widget
  WidgetRegistry.register({
    widgetId: "time-series-volume",
    title: "Time Series Analytics",
    subtitle: "Volume trends & moving average",
    category: "time_series",
    apiEndpoint: "/api/v1/analytics/time-series",
    refreshStrategy: "onFilterChange",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["dateRange", "department", "sentiment"],
    component: TimeSeriesAnalyticsSection,
  });

  // 4. Sentiment Intelligence Widget
  WidgetRegistry.register({
    widgetId: "sentiment-radar",
    title: "Sentiment Intelligence",
    subtitle: "6-Factor Emotion Radar",
    category: "sentiment",
    apiEndpoint: "/api/v1/sentiment/emotions",
    refreshStrategy: "onFilterChange",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["dateRange", "department"],
    component: SentimentIntelligenceSection,
  });

  // 5. Topic Analytics Widget
  WidgetRegistry.register({
    widgetId: "topic-importance",
    title: "Topic Analytics",
    subtitle: "TF-IDF keyword cloud & topics",
    category: "topics",
    apiEndpoint: "/api/v1/topics/importance",
    refreshStrategy: "onFilterChange",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["dateRange", "sentiment"],
    component: TopicAnalyticsSection,
  });

  // 6. Feedback Distribution Widget
  WidgetRegistry.register({
    widgetId: "feedback-ratings-histogram",
    title: "Feedback Distribution",
    subtitle: "1-5 Star Ratings Histogram",
    category: "distribution",
    apiEndpoint: "/api/v1/analytics/ratings",
    refreshStrategy: "onFilterChange",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["rating", "department"],
    component: FeedbackDistributionSection,
  });

  // 7. Category & Department Analytics Widget
  WidgetRegistry.register({
    widgetId: "category-department-sla",
    title: "Category & Department Analytics",
    subtitle: "Closure SLA per department",
    category: "categories",
    apiEndpoint: "/api/v1/analytics/categories",
    refreshStrategy: "onFilterChange",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["department"],
    component: CategoryAnalyticsSection,
  });

  // 8. Geographical Analytics Widget
  WidgetRegistry.register({
    widgetId: "geo-sentiment-map",
    title: "Geographical Analytics",
    subtitle: "Regional sentiment breakdown",
    category: "geo",
    apiEndpoint: "/api/v1/analytics/geo",
    refreshStrategy: "onFilterChange",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["country"],
    component: GeographicalAnalyticsSection,
  });

  // 9. Customer Segmentation Widget
  WidgetRegistry.register({
    widgetId: "customer-rfm-segmentation",
    title: "Customer Segmentation",
    subtitle: "K-Means RFM clusters",
    category: "segmentation",
    apiEndpoint: "/api/v1/analytics/segmentation",
    refreshStrategy: "onFilterChange",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["dateRange"],
    component: CustomerSegmentationSection,
  });

  // 10. ML Insights Widget
  WidgetRegistry.register({
    widgetId: "ml-shap-importance",
    title: "ML Models & SHAP Explainability",
    subtitle: "Feature importance scorecard",
    category: "ml",
    apiEndpoint: "/api/v1/analytics/ml",
    refreshStrategy: "onFilterChange",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["dateRange"],
    component: MLInsightsSection,
  });

  // 11. AI Executive Insights Widget
  WidgetRegistry.register({
    widgetId: "ai-executive-digest",
    title: "AI Executive Insights",
    subtitle: "LLM summary & action alerts",
    category: "insights",
    apiEndpoint: "/api/v1/ai-insights/summary",
    refreshStrategy: "poll",
    pollIntervalMs: 30000,
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["dateRange", "sentiment"],
    component: AIInsightsSection,
  });

  // 12. Predictive Analytics Widget
  WidgetRegistry.register({
    widgetId: "predictive-forecasting",
    title: "Predictive Analytics",
    subtitle: "90-Day prediction & confidence bounds",
    category: "predictions",
    apiEndpoint: "/api/v1/predictions/forecast",
    refreshStrategy: "onFilterChange",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["dateRange"],
    component: PredictiveAnalyticsSection,
  });

  // 13. Correlation Analysis Widget
  WidgetRegistry.register({
    widgetId: "correlation-heatmap",
    title: "Correlation Analysis",
    subtitle: "Pearson correlation feature matrix",
    category: "correlations",
    apiEndpoint: "/api/v1/analytics/correlations",
    refreshStrategy: "onFilterChange",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["dateRange"],
    component: CorrelationAnalysisSection,
  });

  // 14. Operational Metrics Widget
  WidgetRegistry.register({
    widgetId: "operational-sla-leaderboard",
    title: "Operational Metrics",
    subtitle: "Support agent CSAT leaderboard",
    category: "operations",
    apiEndpoint: "/api/v1/reports/operations",
    refreshStrategy: "onFilterChange",
    requiredPermissions: ["read:analytics"],
    filterDependencies: ["department"],
    component: OperationalMetricsSection,
  });
}
