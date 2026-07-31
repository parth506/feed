import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterState } from "../../types/analytics";

interface HeaderFiltersProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export const HeaderFilters: React.FC<HeaderFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-slate-200/80 dark:border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
          <Filter className="h-4 w-4 text-brand-500" />
          <span>Global Filters:</span>
        </div>

        {/* Filters Grid */}
        <div className="flex flex-wrap items-center gap-2 flex-1 max-w-4xl">
          {/* Date Range */}
          <Select
            value={filters.dateRange}
            onValueChange={(val: string) => onFilterChange({ dateRange: val as FilterState["dateRange"] })}
          >
            <SelectTrigger className="h-8 w-28 text-xs border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last 1 Year</SelectItem>
            </SelectContent>
          </Select>

          {/* Department */}
          <Select
            value={filters.department}
            onValueChange={(val: string) => onFilterChange({ department: val })}
          >
            <SelectTrigger className="h-8 w-32 text-xs border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              <SelectItem value="Product & UX">Product & UX</SelectItem>
              <SelectItem value="Billing & Sales">Billing & Sales</SelectItem>
              <SelectItem value="Engineering & Dev">Engineering & Dev</SelectItem>
              <SelectItem value="Customer Care">Customer Care</SelectItem>
            </SelectContent>
          </Select>

          {/* Sentiment */}
          <Select
            value={filters.sentiment}
            onValueChange={(val: string) => onFilterChange({ sentiment: val })}
          >
            <SelectTrigger className="h-8 w-28 text-xs border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sentiment</SelectItem>
              <SelectItem value="positive">Positive</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="negative">Negative</SelectItem>
            </SelectContent>
          </Select>

          {/* Rating */}
          <Select
            value={filters.rating}
            onValueChange={(val: string) => onFilterChange({ rating: val })}
          >
            <SelectTrigger className="h-8 w-24 text-xs border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          {/* Country */}
          <Select
            value={filters.country}
            onValueChange={(val: string) => onFilterChange({ country: val })}
          >
            <SelectTrigger className="h-8 w-28 text-xs border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="IN">India</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="h-8 text-xs gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
