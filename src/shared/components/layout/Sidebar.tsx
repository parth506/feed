import React from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Brain,
  FileText,
  Settings,
  Users,
  Folder,
  Bell,
  Sparkles,
  CheckSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const menuItems: Array<{ id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }> = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "insights", label: "Insights", icon: Brain, badge: "New" },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "customers", label: "Customers", icon: Users },
    { id: "categories", label: "Categories", icon: Folder },
    { id: "alerts", label: "Alerts", icon: Bell },
    { id: "sentiment", label: "AI Insights", icon: Sparkles },
    { id: "actions", label: "Action Tracker", icon: CheckSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const filterFields = [
    { label: "All Platforms", options: ["All Platforms", "iOS App", "Android App", "Web Platform"] },
    { label: "All Pages", options: ["All Pages", "Dashboard", "Checkout", "Pricing", "Settings"] },
    { label: "All Categories", options: ["All Categories", "UI/UX", "Payments", "Bugs", "Performance"] },
    { label: "All Users", options: ["All Users", "New Users", "Returning", "Premium"] },
    { label: "All Devices", options: ["All Devices", "Mobile", "Desktop", "Tablet"] },
    { label: "All Countries", options: ["All Countries", "India", "USA", "UK", "Canada"] },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200/50 dark:border-slate-800 bg-[#0F1322] min-h-[calc(100vh-4rem)] p-4 text-slate-300">
      <div className="space-y-6">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#6366F1]/10 text-[#6366F1] font-bold border-l-2 border-[#6366F1]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#6366F1]" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#6366F1] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Filter Section */}
        <div className="space-y-2 border-t border-slate-800/80 pt-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-1">
            Quick Filter
          </span>
          <div className="space-y-1.5">
            {filterFields.map((field) => (
              <div key={field.label} className="relative">
                <select className="w-full h-8 px-2 rounded bg-[#161C30] border border-slate-800 text-[10px] text-slate-300 focus:outline-none focus:border-[#6366F1]/60 appearance-none cursor-pointer">
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
                  ▼
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full h-8 mt-2 bg-[#6366F1] hover:bg-[#5053C9] text-xs font-bold text-white rounded-lg shadow-sm">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Suggestion Banner */}
      <div className="p-3.5 mt-6 rounded-xl bg-[#161C30] border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-200">Have suggestions?</span>
          <span className="text-[11px] text-slate-500 cursor-pointer">✕</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          We'd love to hear your ideas
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full h-7 text-[10px] text-slate-300 border-slate-700 hover:border-[#6366F1] hover:bg-slate-900"
        >
          Share Feedback ⊕
        </Button>
      </div>
    </aside>
  );
};

