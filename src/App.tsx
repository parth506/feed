import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/shared/components/layout/Navbar";
import { Sidebar, ActiveTab } from "@/shared/components/layout/Sidebar";
import { DashboardOverview } from "@/features/dashboard/DashboardOverview";
import { FilterState } from "@/shared/types/analytics";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
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

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans antialiased">
        {/* Top Navigation */}
        <Navbar
          onSearchChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        />

        {/* Main Layout */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

          <main className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[#0B0F19]">
            <DashboardOverview activeTab={activeTab} filters={filters} />
          </main>
        </div>

        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
