import React from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ZAxis,
} from "recharts";
import { ChartContainer } from "../cards/ChartContainer";
import { CustomerClusterPoint } from "../../types/analytics";

interface CustomerSegmentationProps {
  clusters: CustomerClusterPoint[];
}

export const CustomerSegmentationSection: React.FC<CustomerSegmentationProps> = ({ clusters }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            9. Customer Segmentation & RFM Clustering
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unsupervised K-Means clustering, Recency-Frequency-Monetary (RFM) scoring, and churn risk segments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Scatter Plot: Income vs Satisfaction vs Monetary Value */}
        <ChartContainer title="K-Means Cluster Scatter (Income vs CSAT)" subtitle="Bubble size represents Monetary Account ARR">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="incomeK" name="Income ($k)" unit="k" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis dataKey="satisfactionScore" name="CSAT Rating" unit="★" domain={[2, 5]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                <ZAxis dataKey="monetaryValue" range={[50, 400]} name="ARR ($)" />
                <RechartsTooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ borderRadius: "8px", border: "none" }} />
                <Scatter name="Customers" data={clusters} fill="#6366f1" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        {/* RFM Segment Breakdown Table */}
        <ChartContainer title="RFM Customer Segment Health" subtitle="Champions, Loyal, At-Risk & Churn Watch">
          <div className="overflow-x-auto max-h-[280px]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2.5 px-3">Account</th>
                  <th className="py-2.5 px-3">Segment</th>
                  <th className="py-2.5 px-3">CSAT</th>
                  <th className="py-2.5 px-3">Recency</th>
                  <th className="py-2.5 px-3">ARR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {clusters.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{c.customerName}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.segment === "Champions"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : c.segment === "At-Risk"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                          : "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                      }`}>
                        {c.segment}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">{c.satisfactionScore} ★</td>
                    <td className="py-2.5 px-3 text-slate-500">{c.recencyDays}d ago</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-slate-100">${c.monetaryValue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};
