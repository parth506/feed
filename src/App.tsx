import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/shared/components/layout/Navbar";
import { Sidebar, ActiveTab } from "@/shared/components/layout/Sidebar";
import { HeaderFilters } from "@/shared/components/layout/HeaderFilters";
import { DashboardOverview } from "@/features/dashboard/DashboardOverview";
import { FilterState } from "@/shared/types/analytics";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [workspace, setWorkspace] = useState("Production Cluster");

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#0B0F19] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
        {/* Top Navigation */}
        <Navbar
          onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
          activeWorkspace={workspace}
          onSelectWorkspace={setWorkspace}
        />

        {/* Global Interactive Filters Bar */}
        <HeaderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Main Workspace Layout */}
        <div className="flex-1 flex overflow-hidden w-full mx-auto">
          {/* Left Sidebar */}
          <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

          {/* Dashboard Content Body */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0B0F19]">
            <DashboardOverview activeTab={activeTab} filters={filters} />
          </main>
        </div>

        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
