import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { WidgetConfig } from "@/shared/types/widget";
import { FilterState } from "@/shared/types/analytics";
import { api } from "@/api";

interface WidgetRendererProps {
  config: WidgetConfig;
  filters: FilterState;
  fallbackData?: any;
  userPermissions?: string[];
  [key: string]: any;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  config,
  filters,
  fallbackData,
  userPermissions = ["admin", "read:analytics"],
  ...extraProps
}) => {
  // Permission Guard Check
  const hasPermission = config.requiredPermissions.every((perm) =>
    userPermissions.includes(perm)
  );

  // Extract dependent filter values for Query Key invalidation
  const activeDependencies = config.filterDependencies.reduce((acc, key) => {
    acc[key] = filters[key];
    return acc;
  }, {} as Record<string, any>);

  // TanStack Query for caching, background refetching & invalidation
  const { data, isLoading, isError } = useQuery({
    queryKey: [config.widgetId, config.apiEndpoint, activeDependencies],
    queryFn: async () => {
      return await api.get(config.apiEndpoint);
    },
    enabled: hasPermission,
    refetchInterval:
      config.refreshStrategy === "poll" ? config.pollIntervalMs || 10000 : false,
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
    placeholderData: fallbackData,
  });

  if (!hasPermission) {
    return (
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center space-y-2">
        <Lock className="h-6 w-6 text-amber-500 mx-auto" />
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">Access Restricted</h4>
        <p className="text-[11px] text-slate-400">
          Required permission missing: {config.requiredPermissions.join(", ")}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 animate-pulse space-y-4 min-h-[200px] flex flex-col justify-center items-center">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-24 bg-slate-100 dark:bg-slate-900 rounded w-full" />
      </div>
    );
  }

  const Component = config.component;
  let propsToPass = (data && !isError) ? data : (fallbackData || {});

  // Standardize the props interface so it aligns correctly with chart components
  const responseData = data as any;
  if (responseData) {
    if (config.widgetId === "time-series-volume" && Array.isArray(responseData)) {
      propsToPass = { data: responseData };
    } else if (config.widgetId === "topic-importance" && Array.isArray(responseData)) {
      propsToPass = { topics: responseData };
    } else if (config.widgetId === "category-department-sla" && Array.isArray(responseData)) {
      propsToPass = { departments: responseData };
    } else if (config.widgetId === "sentiment-radar" && Array.isArray(responseData)) {
      propsToPass = { emotions: responseData, timeSeries: [] };
    } else if (config.widgetId === "realtime-feed" && responseData.latest_feedback) {
      const formatted = responseData.latest_feedback.map((item: any) => {
        const sent = item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1).toLowerCase();
        return {
          id: item.id || String(Math.random()),
          time: item.created_at ? item.created_at.replace("T", " ").substring(0, 19) : "",
          sentiment: sent,
          comment: item.comment || "",
        };
      });
      propsToPass = { feedbacks: formatted };
    }
  }

  return <Component {...propsToPass} {...extraProps} filters={filters} isLoading={isLoading} />;
};
