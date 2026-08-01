import React from "react";
import { Globe, MapPin } from "lucide-react";
import { ChartContainer } from "../cards/ChartContainer";
import { GeographicRegion } from "../../types/analytics";

interface GeoAnalyticsProps {
  regions: GeographicRegion[];
}

export const GeographicalAnalyticsSection: React.FC<GeoAnalyticsProps> = ({ regions = [] }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            8. Geographical Analytics & Regional Sentiment Map
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Global feedback volume, regional sentiment index, and country rating distribution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Country Leaderboard List */}
        <div className="lg:col-span-1">
          <ChartContainer title="Country Sentiment Leaderboard" subtitle="Top feedback volume by country">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {regions.map((reg) => (
                <div
                  key={reg.code}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-xs">
                      {reg.code}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{reg.country}</p>
                      <p className="text-[10px] text-slate-400">{reg.totalFeedback.toLocaleString()} feedbacks</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {reg.positivePercent}% Positive
                    </span>
                    <p className="text-[10px] text-slate-400">{reg.avgRating} ★ Avg Rating</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartContainer>
        </div>

        {/* Global Map Interactive SVG Grid Representation */}
        <div className="lg:col-span-2">
          <ChartContainer title="Interactive Regional Sentiment Map" subtitle="Geographical sentiment heat matrix">
            <div className="relative h-[300px] w-full rounded-xl bg-slate-900 p-4 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 text-center space-y-4 w-full max-w-lg">
                <div className="flex items-center justify-center gap-2 text-brand-400">
                  <Globe className="h-8 w-8 animate-spin-slow" />
                  <span className="text-sm font-bold text-white tracking-wide uppercase">Global Sentiment Coverage</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  {regions.slice(0, 6).map((r) => (
                    <div key={r.code} className="p-3 rounded-lg bg-white/10 backdrop-blur border border-white/10 text-white text-left space-y-1 hover:border-brand-400 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{r.country}</span>
                        <MapPin className="h-3 w-3 text-emerald-400" />
                      </div>
                      <p className="text-[11px] text-slate-300">{r.totalFeedback} Reviews</p>
                      <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full" style={{ width: `${r.positivePercent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};
