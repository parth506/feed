import React, { useState } from "react";
import { Maximize2, Minimize2, Info, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  infoText?: string;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  infoText,
  children,
  headerAction,
  className = "",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleExport = (format: "csv" | "png" | "json") => {
    alert(`Exporting ${title} as ${format.toUpperCase()}`);
  };

  return (
    <Card
      className={`relative rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 backdrop-blur shadow-sm transition-all duration-200 ${
        isFullscreen
          ? "fixed inset-4 z-50 overflow-auto max-h-[95vh] shadow-2xl border-brand-500"
          : "hover:border-slate-300 dark:hover:border-slate-700"
      } ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100 dark:border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </CardTitle>
            {infoText && (
              <span className="cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" title={infoText}>
                <Info className="h-4 w-4" />
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {headerAction}

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("png")}>
                Export PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("json")}>
                Export JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 w-8 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  );
};
