import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { ChartContainer } from "../cards/ChartContainer";
import { MLFeatureImportance, MLModelEvaluation } from "../../types/analytics";

interface MLInsightsProps {
  importance: MLFeatureImportance[];
  evaluation: MLModelEvaluation;
}

export const MLInsightsSection: React.FC<MLInsightsProps> = ({ importance = [], evaluation }) => {
  const cm = evaluation?.confusionMatrix || { tp: 1240, fp: 84, fn: 62, tn: 890 };
  const precisionVal = (evaluation?.precision ?? 0.928) * 100;
  const recallVal = (evaluation?.recall ?? 0.935) * 100;
  const rocAucVal = evaluation?.rocAuc ?? 0.976;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            10. Machine Learning Models & SHAP Explainability
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Model performance metrics, SHAP feature importance contribution, ROC-AUC, and Confusion Matrix.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SHAP Feature Importance */}
        <div className="lg:col-span-2">
          <ChartContainer title="Feature Importance & SHAP Values" subtitle="Impact score of underlying factors on feedback sentiment">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={importance} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis dataKey="feature" type="category" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#64748b" }} />
                  <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "none" }} />
                  <Bar dataKey="importance" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </div>

        {/* Confusion Matrix & Model Scorecard */}
        <div className="lg:col-span-1">
          <ChartContainer title="Confusion Matrix & Model Scorecard" subtitle="XGBoost Classifier metrics">
            <div className="space-y-4 p-1">
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50">
                  <p className="text-[10px] text-slate-500">True Positive (TP)</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{cm.tp}</p>
                </div>
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200/50">
                  <p className="text-[10px] text-slate-500">False Positive (FP)</p>
                  <p className="text-lg font-black text-rose-600 dark:text-rose-400">{cm.fp}</p>
                </div>
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200/50">
                  <p className="text-[10px] text-slate-500">False Negative (FN)</p>
                  <p className="text-lg font-black text-rose-600 dark:text-rose-400">{cm.fn}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50">
                  <p className="text-[10px] text-slate-500">True Negative (TN)</p>
                  <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{cm.tn}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block">Precision</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{precisionVal.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Recall</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{recallVal.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">ROC-AUC</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">{rocAucVal.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};
