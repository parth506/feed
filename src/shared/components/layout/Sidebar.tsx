import React from "react";
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  Smile,
  Hash,
  Brain,
  LineChart,
  FileText,
  Settings,
} from "lucide-react";

export type ActiveTab =
  | "dashboard"
  | "feedback"
  | "analytics"
  | "sentiment"
  | "topics"
  | "insights"
  | "prediction"
  | "reports"
  | "settings";

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const menuItems: Array<{ id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "dashboard", label: "Executive Overview", icon: LayoutDashboard },
    { id: "feedback", label: "Feedback Feed", icon: MessageSquare },
    { id: "analytics", label: "Time Series", icon: TrendingUp },
    { id: "sentiment", label: "Sentiment Intelligence", icon: Smile },
    { id: "topics", label: "Topic Analytics", icon: Hash },
    { id: "insights", label: "AI Insights", icon: Brain },
    { id: "prediction", label: "Predictive Analytics", icon: LineChart },
    { id: "reports", label: "Reports & Audit", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur min-h-[calc(100vh-4rem)] p-3">
      <nav className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Platform Views
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30 font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
