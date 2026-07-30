import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColorClass: string;
  cardColorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColorClass,
  cardColorClass = "",
}) => {
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 rounded-xl border border-slate-100 dark:border-slate-800 ${cardColorClass}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {value}
            </h3>
          </div>
          <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 ${iconColorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
