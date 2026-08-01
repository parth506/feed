import { useState, useEffect } from "react";
import { Search, Bell, Database, Activity, LogOut, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

interface User {
  name: string;
  email: string;
  organization: string;
}

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  user?: User | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchChange, user, onLogout }) => {
  const [searchVal, setSearchVal] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const { data: healthStatus } = useQuery<{ db_status: string }>({
    queryKey: ["admin-health"],
    queryFn: async () => {
      try {
        return await api.get("/api/v1/admin/health");
      } catch {
        // Try the basic health endpoint instead
        try {
          const res = await api.get<{ status: string }>("/health");
          return { db_status: res.status === "ok" ? "connected" : "disconnected" };
        } catch {
          return { db_status: "disconnected" };
        }
      }
    },
    refetchInterval: 15000,
  });

  const isConnected = healthStatus?.db_status === "connected";
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "FQ";

  return (
    <header className="h-14 bg-[#0B0F19] border-b border-slate-800 flex items-center px-5 gap-4 shrink-0 sticky top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow shadow-indigo-900/40">
          <Activity className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-sm text-white">FeedbackIQ</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xs relative ml-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
        <input
          type="text"
          placeholder="Search feedback..."
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            onSearchChange?.(e.target.value);
          }}
          className="w-full h-8 pl-8 pr-3 bg-[#161C30] border border-slate-800 rounded-lg text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* DB Status */}
      <div className="flex items-center gap-1.5 text-[10px] font-medium select-none">
        <Database className="h-3 w-3 text-slate-600" />
        <span className={`flex items-center gap-1.5 ${isConnected ? "text-emerald-400" : "text-rose-400"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
          {isConnected ? "Connected" : "Offline"}
        </span>
      </div>

      {/* Bell */}
      <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-300">
        <Bell className="h-4 w-4" />
      </button>

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 h-8 px-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
            {initials}
          </div>
          {user && (
            <span className="text-xs text-slate-400 hidden sm:block max-w-[100px] truncate">
              {user.name}
            </span>
          )}
          <ChevronDown className="h-3 w-3 text-slate-500" />
        </button>

        {showUserMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
            <div className="absolute right-0 top-full mt-2 w-52 bg-[#161C30] border border-slate-800 rounded-xl shadow-xl z-20 py-1">
              {user && (
                <div className="px-3 py-3 border-b border-slate-800">
                  <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  <p className="text-[10px] text-indigo-400 mt-0.5 truncate">{user.organization}</p>
                </div>
              )}
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout?.();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
