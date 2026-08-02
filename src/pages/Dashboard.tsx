import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/shared/components/layout/Navbar";
import { Sidebar, ActiveTab } from "@/shared/components/layout/Sidebar";
import { DashboardOverview } from "@/features/dashboard/DashboardOverview";
import { FilterState } from "@/shared/types/analytics";

const DEFAULT_FILTERS: FilterState = {
  searchQuery: "",
  dateRange: "30d",
  department: "all",
  product: "all",
  country: "all",
  sentiment: "all",
  rating: "all",
  channel: "all",
};

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("dashboard");
  const [filters] = React.useState<FilterState>(DEFAULT_FILTERS);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans antialiased">
      <Navbar user={user!} onLogout={logout} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[#0B0F19]">
          <DashboardOverview activeTab={activeTab} filters={filters} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
