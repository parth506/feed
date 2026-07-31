import { api } from "@/api";
import {
  TimeSeriesPoint,
  EmotionDistribution,
  TopicItem,
  AIInsightItem,
  ForecastPoint,
} from "@/shared/types/analytics";

export const analyticsService = {
  async getTimeSeries(): Promise<TimeSeriesPoint[]> {
    return api.get<TimeSeriesPoint[]>("/api/v1/analytics/time-series");
  },

  async getEmotions(): Promise<EmotionDistribution[]> {
    return api.get<EmotionDistribution[]>("/api/v1/sentiment/emotions");
  },

  async getTopics(): Promise<TopicItem[]> {
    return api.get<TopicItem[]>("/api/v1/topics/importance");
  },

  async getAIRecommendations(): Promise<AIInsightItem[]> {
    return api.get<AIInsightItem[]>("/api/v1/ai-insights/recommendations");
  },

  async getForecast(): Promise<ForecastPoint[]> {
    return api.get<ForecastPoint[]>("/api/v1/predictions/forecast");
  },
};
