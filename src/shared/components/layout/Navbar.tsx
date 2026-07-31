import { useState } from "react";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  User,
  ChevronDown,
  Layers,
  Check,
  Activity,
  Database,
  Cpu,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";


interface NavbarProps {
  onSearchChange?: (query: string) => void;
  activeWorkspace?: string;
  onSelectWorkspace?: (ws: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
  activeWorkspace = "Production Cluster",
  onSelectWorkspace,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const { data: healthStatus } = useQuery<{ db_status: string; cache_status: string }>({
    queryKey: ["admin-health"],
    queryFn: async () => {
      try {
        return await api.get("/api/v1/admin/health");
      } catch {
        return { db_status: "disconnected", cache_status: "disconnected" };
      }
    },
    refetchInterval: 10000,
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearchChange?.(e.target.value);
  };

  const workspaces = [
    "Production Cluster",
    "Staging Environment",
    "Mobile App Analytics",
    "EU Enterprise Region",
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Workspace Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-brand-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-50 text-lg tracking-tight leading-none flex items-center gap-1.5">
                FeedbackIQ <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-300">AI Enterprise</span>
              </span>
            </div>
          </div>

          {/* Workspace Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 border-slate-200 dark:border-slate-800 text-xs font-medium">
                <Layers className="h-3.5 w-3.5 text-brand-500" />
                <span>{activeWorkspace}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-xs font-semibold text-slate-400">
                Workspaces
              </DropdownMenuLabel>
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws}
                  onClick={() => onSelectWorkspace?.(ws)}
                  className="flex items-center justify-between text-xs cursor-pointer"
                >
                  <span>{ws}</span>
                  {ws === activeWorkspace && <Check className="h-3.5 w-3.5 text-brand-500" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search sentiments, topics, keywords or feedback comments..."
              value={searchVal}
              onChange={handleSearch}
              className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-100/80 dark:bg-slate-900 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* Right: Actions, Notifications, Dark Mode & User Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
                <Bell className="h-4 w-4" />
                {(healthStatus?.db_status !== "healthy" || healthStatus?.cache_status !== "connected") && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-4 glass-card shadow-lg rounded-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-brand-500" /> System Alerts Center
                </h4>
              </div>
              <div className="space-y-3 mt-3 text-xs">
                {/* MongoDB Status Alert Card */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">MongoDB database</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    healthStatus?.db_status === "healthy"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${healthStatus?.db_status === "healthy" ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`} />
                    {healthStatus?.db_status === "healthy" ? "Healthy" : "Offline"}
                  </span>
                </div>

                {/* Redis Status Alert Card */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">Redis Cache Pool</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    healthStatus?.cache_status === "connected"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${healthStatus?.cache_status === "connected" ? "bg-emerald-500" : "bg-rose-500 animate-pulse"}`} />
                    {healthStatus?.cache_status === "connected" ? "Online" : "Disconnected"}
                  </span>
                </div>

                {/* Custom Sentiment Spikes Warnings */}
                {healthStatus?.db_status !== "healthy" && (
                  <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-800 dark:text-rose-300 flex gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                    <div>
                      <p className="font-bold">Critical Database Error</p>
                      <p className="text-[10px] opacity-90 mt-0.5">Could not reach MongoDB cluster. Analytics rendering holds stale cache.</p>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="h-9 w-9 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-2 gap-2 text-xs font-semibold">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" />
                  <AvatarFallback className="bg-brand-600 text-white text-xs font-bold">PA</AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline-block text-slate-700 dark:text-slate-200">Parth Architect</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">Parth (Staff Architect)</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs cursor-pointer">
                <User className="h-3.5 w-3.5 mr-2" /> Profile & Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs cursor-pointer text-rose-600">
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
