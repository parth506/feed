import React from "react";
import { FeedbackItem } from "@/types/feedback";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeedbackTableProps {
  items: FeedbackItem[];
}

export const FeedbackTable: React.FC<FeedbackTableProps> = ({ items }) => {
  const getSentimentBadgeClass = (sentiment: FeedbackItem["sentiment"]) => {
    switch (sentiment) {
      case "Positive":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50";
      case "Neutral":
        return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50";
      case "Negative":
        return "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200/50";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200/50";
    }
  };

  return (
    <Card className="rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
      <CardHeader className="border-b border-slate-50 dark:border-slate-800/60 pb-4">
        <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
          Latest Feedbacks
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/40 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-50 dark:border-slate-800/60">
                <th className="py-3 px-6">Time</th>
                <th className="py-3 px-6">Sentiment</th>
                <th className="py-3 px-6">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-slate-400">
                    No feedbacks submitted yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono text-xs whitespace-nowrap">
                      {item.time}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentBadgeClass(item.sentiment)}`}>
                        {item.sentiment}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-normal line-clamp-2 leading-relaxed">
                      {item.comment || <span className="text-slate-400 italic">No comment provided</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
