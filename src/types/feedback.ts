export interface FeedbackItem {
  id: string;
  time: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  comment: string;
}

export interface FeedbackStats {
  total: number;
  positive: number;
  neutral: number;
  negative: number;
}
