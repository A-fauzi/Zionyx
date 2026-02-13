"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatBoxProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  bg: string;
  color: string;
}

export function StatBox({ icon: Icon, label, value, sub, bg, color }: StatBoxProps) {
  return (
    <Card className="rounded-[2rem] border border-slate-100 shadow-sm p-6 bg-white hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110", bg, color)}>
          <Icon size={20} />
        </div>
        {sub && (
          <span className={cn("text-sm font-black font-mono", color)}>
            {sub}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">
          {label}
        </p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight font-mono">
          {value}
        </h3>
      </div>
    </Card>
  );
}
