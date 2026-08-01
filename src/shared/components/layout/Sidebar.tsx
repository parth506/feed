import React from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Bell,
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
  | "settings"
  | "customers"
  | "categories"
  | "alerts"
  | "actions";

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const menuItems: Array<{
    id: ActiveTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }> = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col border-r border-slate-800 bg-[#0F1322] min-h-[calc(100vh-4rem)] p-4 text-slate-300">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500"
                  : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : "text-slate-600"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div className="mt-auto pt-6 border-t border-slate-800 space-y-2 text-[10px] text-slate-600">
        <p>FeedbackIQ v1.0</p>
        <p>Connected to MongoDB Atlas</p>
      </div>
    </aside>
  );
};
