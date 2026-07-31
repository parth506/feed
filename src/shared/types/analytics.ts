export type SentimentCategory = "positive" | "neutral" | "negative";
export type PriorityLevel = "critical" | "high" | "medium" | "low";
export type ChannelType = "web" | "mobile" | "email" | "chat" | "survey" | "social";

export interface KPIMetric {
  id: string;
  title: string;
  value: string | number;
  change: number; // percentage change e.g. +12.4
  period: string; // "vs last 30d"
  trend: "up" | "down" | "neutral";
  target?: string | number;
  sparkline: number[];
  unit?: string;
  color: string;
}

export interface TimeSeriesPoint {
  timestamp: string;
  date: string;
  totalVolume: number;
  positive: number;
  neutral: number;
  negative: number;
  movingAverage: number;
  csatScore: number;
  npsScore: number;
}

export interface EmotionDistribution {
  emotion: "Joy" | "Surprise" | "Frustration" | "Anger" | "Sadness" | "Trust";
  score: number;
  percentage: number;
  color: string;
}

export interface TopicItem {
  id: string;
  name: string;
  category: string;
  volume: number;
  importanceScore: number; // 0 - 100
  sentimentScore: number; // -1 to +1
  growthRate: number;
  color: string;
}

export interface RatingHistogramItem {
  rating: number; // 1 to 5
  count: number;
  percentage: number;
}

export interface DepartmentMetric {
  department: string;
  total: number;
  resolved: number;
  unresolved: number;
  avgResolutionTimeHours: number;
  satisfactionScore: number;
}

export interface GeographicRegion {
  country: string;
  code: string;
  state?: string;
  city?: string;
  totalFeedback: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  avgRating: number;
  lat: number;
  lng: number;
}

export interface CustomerClusterPoint {
  id: string;
  customerName: string;
  segment: "Champions" | "Loyal" | "At-Risk" | "Needs Attention" | "Lost";
  satisfactionScore: number; // 1-5
  age: number;
  incomeK: number;
  frequency: number;
  recencyDays: number;
  monetaryValue: number;
}

export interface MLFeatureImportance {
  feature: string;
  importance: number;
  shapValue: number;
  impact: "positive" | "negative";
}

export interface MLModelEvaluation {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  confusionMatrix: {
    tp: number;
    fp: number;
    tn: number;
    fn: number;
  };
  rocCurve: Array<{ fpr: number; tpr: number }>;
  precisionRecallCurve: Array<{ recall: number; precision: number }>;
}

export interface AIInsightItem {
  id: string;
  title: string;
  category: "root_cause" | "risk_alert" | "action_item" | "opportunity";
  severity: "critical" | "warning" | "info" | "success";
  description: string;
  impactScore: number;
  suggestedAction: string;
  affectedUsersCount: number;
  timestamp: string;
}

export interface ForecastPoint {
  date: string;
  actualFeedback?: number;
  predictedFeedback: number;
  upperBound: number;
  lowerBound: number;
  predictedRating: number;
  predictedChurnRate: number;
}

export interface CorrelationMetric {
  featureA: string;
  featureB: string;
  coefficient: number; // -1.0 to 1.0
}

export interface OperationalAgent {
  id: string;
  name: string;
  department: string;
  resolvedTickets: number;
  avgResponseMinutes: number;
  csatRating: number;
  reopenRate: number;
  escalationRate: number;
}

export interface FilterState {
  searchQuery: string;
  dateRange: "24h" | "7d" | "30d" | "90d" | "1y" | "all";
  department: string;
  product: string;
  country: string;
  sentiment: string;
  rating: string;
  channel: string;
}
