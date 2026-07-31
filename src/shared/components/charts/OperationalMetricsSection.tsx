import React from "react";
import { UserCheck } from "lucide-react";
import { ChartContainer } from "../cards/ChartContainer";
import { OperationalAgent } from "../../types/analytics";

interface OperationalMetricsProps {
  agents: OperationalAgent[];
}

export const OperationalMetricsSection: React.FC<OperationalMetricsProps> = ({ agents }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            14. Operational Metrics & Agent Performance
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Support team efficiency, ticket escalation rates, and agent CSAT leaderboard.
          </p>
        </div>
      </div>

      <ChartContainer title="Support Agent SLA Leaderboard" subtitle="Tickets resolved, avg response minutes, and CSAT scores">
        <div className="overflow-x-auto max-h-[300px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="py-2.5 px-4">Agent Name</th>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Resolved Tickets</th>
                <th className="py-2.5 px-4">Avg Response Time</th>
                <th className="py-2.5 px-4">Agent CSAT</th>
                <th className="py-2.5 px-4">Escalation %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {agents.map((ag) => (
                <tr key={ag.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-brand-500" />
                    {ag.name}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{ag.department}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{ag.resolvedTickets}</td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">{ag.avgResponseMinutes} min</td>
                  <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">{ag.csatRating} ★</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{ag.escalationRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartContainer>
    </div>
  );
};
