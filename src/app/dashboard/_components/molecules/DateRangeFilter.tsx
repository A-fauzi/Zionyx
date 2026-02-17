"use client";

import { cn } from "@/lib/utils";

type DateRange = "7d" | "30d" | "90d" | "all";

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const RANGES: { value: DateRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "all", label: "All" },
];

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
      {RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200",
            value === range.value
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
