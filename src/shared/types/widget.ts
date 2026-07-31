import React from "react";
import { FilterState } from "./analytics";

export type RefreshStrategy = "realtime" | "poll" | "onFilterChange" | "manual";

export interface WidgetConfig {
  widgetId: string;
  title: string;
  subtitle?: string;
  category:
    | "kpi"
    | "stream"
    | "time_series"
    | "sentiment"
    | "topics"
    | "distribution"
    | "categories"
    | "geo"
    | "segmentation"
    | "ml"
    | "insights"
    | "predictions"
    | "correlations"
    | "operations";
  apiEndpoint: string;
  refreshStrategy: RefreshStrategy;
  pollIntervalMs?: number;
  requiredPermissions: string[];
  filterDependencies: (keyof FilterState)[];
  component: React.ComponentType<any>;
}
