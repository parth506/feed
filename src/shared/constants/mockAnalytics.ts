import {
  KPIMetric,
  TimeSeriesPoint,
  EmotionDistribution,
  TopicItem,
  RatingHistogramItem,
  DepartmentMetric,
  GeographicRegion,
  CustomerClusterPoint,
  MLFeatureImportance,
  MLModelEvaluation,
  AIInsightItem,
  ForecastPoint,
  CorrelationMetric,
  OperationalAgent,
} from "../types/analytics";

export const MOCK_EXECUTIVE_KPIS: KPIMetric[] = [
  {
    id: "total_feedback",
    title: "Total Feedback",
    value: "14,892",
    change: +14.2,
    period: "vs last 30d",
    trend: "up",
    sparkline: [40, 52, 60, 58, 65, 78, 89],
    color: "#6366f1",
  },
  {
    id: "feedback_today",
    title: "Feedback Today",
    value: "348",
    change: +8.5,
    period: "vs yesterday",
    trend: "up",
    sparkline: [20, 25, 32, 28, 40, 42, 50],
    color: "#3b82f6",
  },
  {
    id: "avg_rating",
    title: "Average Rating",
    value: "4.42 / 5",
    change: +0.3,
    period: "vs prev quarter",
    trend: "up",
    sparkline: [4.1, 4.2, 4.2, 4.3, 4.35, 4.4, 4.42],
    color: "#10b981",
  },
  {
    id: "avg_sentiment",
    title: "Avg Sentiment Index",
    value: "+0.68",
    change: +5.1,
    period: "vs benchmark",
    trend: "up",
    sparkline: [0.55, 0.58, 0.60, 0.62, 0.64, 0.66, 0.68],
    color: "#8b5cf6",
  },
  {
    id: "response_rate",
    title: "Response Rate",
    value: "94.8%",
    change: +2.1,
    period: "SLA target 90%",
    trend: "up",
    sparkline: [88, 90, 91, 92, 93, 94, 94.8],
    color: "#ec4899",
  },
  {
    id: "resolved_issues",
    title: "Resolved Issues",
    value: "2,840",
    change: +11.4,
    period: "98% closed",
    trend: "up",
    sparkline: [300, 350, 400, 420, 450, 480, 510],
    color: "#14b8a6",
  },
  {
    id: "csat_score",
    title: "CSAT Score",
    value: "89.4%",
    change: +3.7,
    period: "Customer Satisfaction",
    trend: "up",
    sparkline: [82, 84, 85, 86, 87, 88.5, 89.4],
    color: "#f59e0b",
  },
  {
    id: "nps_score",
    title: "NPS Score",
    value: "+56",
    change: +6.0,
    period: "Net Promoter Score",
    trend: "up",
    sparkline: [42, 45, 48, 50, 52, 54, 56],
    color: "#06b6d4",
  },
];

export const MOCK_TIMESERIES: TimeSeriesPoint[] = [
  { timestamp: "2026-07-01", date: "Jul 01", totalVolume: 420, positive: 280, neutral: 90, negative: 50, movingAverage: 410, csatScore: 86, npsScore: 50 },
  { timestamp: "2026-07-05", date: "Jul 05", totalVolume: 480, positive: 320, neutral: 100, negative: 60, movingAverage: 440, csatScore: 87, npsScore: 51 },
  { timestamp: "2026-07-10", date: "Jul 10", totalVolume: 510, positive: 350, neutral: 110, negative: 50, movingAverage: 470, csatScore: 88, npsScore: 53 },
  { timestamp: "2026-07-15", date: "Jul 15", totalVolume: 490, positive: 330, neutral: 115, negative: 45, movingAverage: 485, csatScore: 88.5, npsScore: 54 },
  { timestamp: "2026-07-20", date: "Jul 20", totalVolume: 540, positive: 380, neutral: 105, negative: 55, movingAverage: 510, csatScore: 89, npsScore: 55 },
  { timestamp: "2026-07-25", date: "Jul 25", totalVolume: 590, positive: 410, neutral: 120, negative: 60, movingAverage: 530, csatScore: 89.2, npsScore: 56 },
  { timestamp: "2026-07-30", date: "Jul 30", totalVolume: 630, positive: 450, neutral: 125, negative: 55, movingAverage: 560, csatScore: 89.8, npsScore: 58 },
];

export const MOCK_EMOTIONS: EmotionDistribution[] = [
  { emotion: "Joy", score: 48, percentage: 48, color: "#10b981" },
  { emotion: "Trust", score: 24, percentage: 24, color: "#3b82f6" },
  { emotion: "Surprise", score: 12, percentage: 12, color: "#8b5cf6" },
  { emotion: "Frustration", score: 9, percentage: 9, color: "#f59e0b" },
  { emotion: "Anger", score: 4, percentage: 4, color: "#ef4444" },
  { emotion: "Sadness", score: 3, percentage: 3, color: "#64748b" },
];

export const MOCK_TOPICS: TopicItem[] = [
  { id: "t1", name: "UI Design & Speed", category: "UX", volume: 3420, importanceScore: 92, sentimentScore: 0.82, growthRate: 18.5, color: "#6366f1" },
  { id: "t2", name: "Checkout & Payments", category: "Billing", volume: 2150, importanceScore: 88, sentimentScore: -0.34, growthRate: -4.2, color: "#ef4444" },
  { id: "t3", name: "API Documentation", category: "Developer", volume: 1890, importanceScore: 85, sentimentScore: 0.65, growthRate: 12.0, color: "#10b981" },
  { id: "t4", name: "Customer Support SLA", category: "Support", volume: 1540, importanceScore: 81, sentimentScore: 0.45, growthRate: 8.4, color: "#f59e0b" },
  { id: "t5", name: "Mobile App Performance", category: "Mobile", volume: 1280, importanceScore: 78, sentimentScore: -0.12, growthRate: 15.1, color: "#ec4899" },
  { id: "t6", name: "Export & Analytics Reports", category: "Feature", volume: 960, importanceScore: 72, sentimentScore: 0.78, growthRate: 22.4, color: "#8b5cf6" },
];

export const MOCK_RATINGS: RatingHistogramItem[] = [
  { rating: 5, count: 8450, percentage: 56.7 },
  { rating: 4, count: 4210, percentage: 28.2 },
  { rating: 3, count: 1120, percentage: 7.5 },
  { rating: 2, count: 680, percentage: 4.6 },
  { rating: 1, count: 432, percentage: 3.0 },
];

export const MOCK_DEPARTMENTS: DepartmentMetric[] = [
  { department: "Product & UX", total: 4500, resolved: 4320, unresolved: 180, avgResolutionTimeHours: 4.2, satisfactionScore: 4.6 },
  { department: "Billing & Sales", total: 3200, resolved: 3010, unresolved: 190, avgResolutionTimeHours: 6.5, satisfactionScore: 4.1 },
  { department: "Engineering & Dev", total: 2800, resolved: 2650, unresolved: 150, avgResolutionTimeHours: 8.1, satisfactionScore: 4.4 },
  { department: "Customer Care", total: 2600, resolved: 2540, unresolved: 60, avgResolutionTimeHours: 2.1, satisfactionScore: 4.8 },
  { department: "Security & DevOps", total: 1792, resolved: 1750, unresolved: 42, avgResolutionTimeHours: 3.4, satisfactionScore: 4.7 },
];

export const MOCK_GEO_REGIONS: GeographicRegion[] = [
  { country: "United States", code: "US", totalFeedback: 6420, positivePercent: 78, neutralPercent: 14, negativePercent: 8, avgRating: 4.5, lat: 37.0902, lng: -95.7129 },
  { country: "United Kingdom", code: "GB", totalFeedback: 2410, positivePercent: 74, neutralPercent: 17, negativePercent: 9, avgRating: 4.3, lat: 55.3781, lng: -3.436 },
  { country: "Germany", code: "DE", totalFeedback: 1850, positivePercent: 72, neutralPercent: 18, negativePercent: 10, avgRating: 4.2, lat: 51.1657, lng: 10.4515 },
  { country: "India", code: "IN", totalFeedback: 2190, positivePercent: 82, neutralPercent: 12, negativePercent: 6, avgRating: 4.6, lat: 20.5937, lng: 78.9629 },
  { country: "Canada", code: "CA", totalFeedback: 1120, positivePercent: 76, neutralPercent: 16, negativePercent: 8, avgRating: 4.4, lat: 56.1304, lng: -106.3468 },
  { country: "Australia", code: "AU", totalFeedback: 902, positivePercent: 80, neutralPercent: 14, negativePercent: 6, avgRating: 4.5, lat: -25.2744, lng: 133.7751 },
];

export const MOCK_CUSTOMER_CLUSTERS: CustomerClusterPoint[] = [
  { id: "c1", customerName: "Acme Corp", segment: "Champions", satisfactionScore: 4.9, age: 34, incomeK: 140, frequency: 45, recencyDays: 2, monetaryValue: 12000 },
  { id: "c2", customerName: "TechFlow Inc", segment: "Champions", satisfactionScore: 4.8, age: 29, incomeK: 125, frequency: 38, recencyDays: 1, monetaryValue: 9800 },
  { id: "c3", customerName: "Global Logistics", segment: "Loyal", satisfactionScore: 4.2, age: 45, incomeK: 180, frequency: 28, recencyDays: 5, monetaryValue: 15400 },
  { id: "c4", customerName: "Apex Retail", segment: "At-Risk", satisfactionScore: 2.8, age: 38, incomeK: 95, frequency: 12, recencyDays: 24, monetaryValue: 3400 },
  { id: "c5", customerName: "NexGen Labs", segment: "Needs Attention", satisfactionScore: 3.4, age: 31, incomeK: 110, frequency: 19, recencyDays: 12, monetaryValue: 5600 },
  { id: "c6", customerName: "Starlight Digital", segment: "Champions", satisfactionScore: 4.9, age: 27, incomeK: 160, frequency: 52, recencyDays: 3, monetaryValue: 18900 },
];

export const MOCK_ML_IMPORTANCE: MLFeatureImportance[] = [
  { feature: "Response Latency", importance: 0.38, shapValue: +0.24, impact: "positive" },
  { feature: "UI Interaction Speed", importance: 0.26, shapValue: +0.18, impact: "positive" },
  { feature: "Payment Gateway Errors", importance: 0.18, shapValue: -0.32, impact: "negative" },
  { feature: "Support Ticket Escalations", importance: 0.11, shapValue: -0.19, impact: "negative" },
  { feature: "API Rate Limits", importance: 0.07, shapValue: -0.09, impact: "negative" },
];

export const MOCK_ML_EVALUATION: MLModelEvaluation = {
  accuracy: 0.942,
  precision: 0.928,
  recall: 0.935,
  f1Score: 0.931,
  rocAuc: 0.976,
  confusionMatrix: { tp: 840, fp: 65, tn: 910, fn: 55 },
  rocCurve: [
    { fpr: 0, tpr: 0 },
    { fpr: 0.05, tpr: 0.78 },
    { fpr: 0.10, tpr: 0.89 },
    { fpr: 0.20, tpr: 0.94 },
    { fpr: 0.50, tpr: 0.98 },
    { fpr: 1.00, tpr: 1.00 },
  ],
  precisionRecallCurve: [
    { recall: 0, precision: 1.00 },
    { recall: 0.50, precision: 0.96 },
    { recall: 0.80, precision: 0.93 },
    { recall: 0.93, precision: 0.928 },
    { recall: 1.00, precision: 0.82 },
  ],
};

export const MOCK_AI_INSIGHTS: AIInsightItem[] = [
  {
    id: "ai-1",
    title: "Payment Checkout Friction Identified",
    category: "root_cause",
    severity: "warning",
    description: "AI NLP cluster identified a 14% drop in billing sentiment due to 3D Secure timeout on mobile WebKit browsers.",
    impactScore: 89,
    suggestedAction: "Deploy hotfix for WebKit iframe postMessage event listener in Checkout v2.",
    affectedUsersCount: 1420,
    timestamp: "10 mins ago",
  },
  {
    id: "ai-2",
    title: "Surge in Developer API Satisfaction",
    category: "opportunity",
    severity: "success",
    description: "SDK 4.0 launch generated 88% positive sentiment among developer persona accounts.",
    impactScore: 94,
    suggestedAction: "Promote GraphQL SDK tutorial on developer portal homepage.",
    affectedUsersCount: 3800,
    timestamp: "1 hour ago",
  },
  {
    id: "ai-3",
    title: "Churn Risk Alert for Enterprise Tier",
    category: "risk_alert",
    severity: "critical",
    description: "Predictive model flags 4 high-ARR accounts showing sentiment decay over consecutive 30 days.",
    impactScore: 96,
    suggestedAction: "Assign Solutions Engineer for priority executive check-in review.",
    affectedUsersCount: 4,
    timestamp: "2 hours ago",
  },
];

export const MOCK_FORECAST: ForecastPoint[] = [
  { date: "Aug 01", actualFeedback: 510, predictedFeedback: 512, lowerBound: 490, upperBound: 535, predictedRating: 4.45, predictedChurnRate: 1.2 },
  { date: "Aug 05", actualFeedback: 540, predictedFeedback: 538, lowerBound: 510, upperBound: 565, predictedRating: 4.46, predictedChurnRate: 1.1 },
  { date: "Aug 10", predictedFeedback: 575, lowerBound: 540, upperBound: 610, predictedRating: 4.48, predictedChurnRate: 1.0 },
  { date: "Aug 15", predictedFeedback: 610, lowerBound: 570, upperBound: 650, predictedRating: 4.50, predictedChurnRate: 0.9 },
  { date: "Aug 20", predictedFeedback: 645, lowerBound: 600, upperBound: 690, predictedRating: 4.52, predictedChurnRate: 0.9 },
  { date: "Aug 25", predictedFeedback: 680, lowerBound: 630, upperBound: 730, predictedRating: 4.55, predictedChurnRate: 0.8 },
];

export const MOCK_CORRELATIONS: CorrelationMetric[] = [
  { featureA: "Response Time", featureB: "CSAT Score", coefficient: -0.84 },
  { featureA: "UI Speed", featureB: "NPS Score", coefficient: +0.76 },
  { featureA: "Ticket Reopens", featureB: "Churn Risk", coefficient: +0.88 },
  { featureA: "Sentiment Index", featureB: "Renewal Rate", coefficient: +0.92 },
];

export const MOCK_OPERATIONAL_AGENTS: OperationalAgent[] = [
  { id: "ag1", name: "Sarah Jenkins", department: "Customer Care", resolvedTickets: 342, avgResponseMinutes: 4.5, csatRating: 4.9, reopenRate: 1.2, escalationRate: 0.8 },
  { id: "ag2", name: "Alex Rivera", department: "Billing Support", resolvedTickets: 298, avgResponseMinutes: 6.1, csatRating: 4.8, reopenRate: 2.1, escalationRate: 1.5 },
  { id: "ag3", name: "Michael Chen", department: "Developer Relations", resolvedTickets: 276, avgResponseMinutes: 8.3, csatRating: 4.95, reopenRate: 0.9, escalationRate: 1.1 },
  { id: "ag4", name: "Emily Watson", department: "UX Support", resolvedTickets: 254, avgResponseMinutes: 5.2, csatRating: 4.7, reopenRate: 2.4, escalationRate: 2.0 },
];
