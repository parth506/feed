import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { Navbar } from "@/shared/components/layout/Navbar";
import { Sidebar, ActiveTab } from "@/shared/components/layout/Sidebar";
import { DashboardOverview } from "@/features/dashboard/DashboardOverview";
import { FilterState } from "@/shared/types/analytics";
import { Toaster } from "@/components/ui/toaster";
import { Activity } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: false, retry: 1 },
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

// Loading screen while checking session
const LoadingScreen = () => (
  <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center gap-4">
    <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center animate-pulse">
      <Activity className="h-6 w-6 text-white" />
    </div>
    <p className="text-sm text-slate-500">Loading FeedbackIQ...</p>
  </div>
);

// Auth-guarded dashboard layout
const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = React.useState<ActiveTab>("dashboard");
  const [filters] = React.useState<FilterState>(DEFAULT_FILTERS);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans antialiased">
      <Navbar user={user} onLogout={logout} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[#0B0F19]">
          <DashboardOverview activeTab={activeTab} filters={filters} />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

// Root redirect depending on auth state
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Redirect logged-in users away from auth pages
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// Redirect unauthenticated users to login
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default App;
