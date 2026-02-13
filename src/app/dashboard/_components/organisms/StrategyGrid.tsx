"use client";

import React from "react";
import { BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StrategyGridProps {
  performance: any[];
}

export function StrategyGrid({ performance }: StrategyGridProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {performance.map((setup) => (
        <Card key={setup.name} className="relative overflow-hidden rounded-[2.5rem] border-0 shadow-2xl shadow-slate-200">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0f172a] to-indigo-950" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          
          <div className="relative z-10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-[1.25rem] flex items-center justify-center text-white border border-white/20">
                <BrainCircuit size={20} />
              </div>
              <Badge variant="secondary" className="px-3 py-1 bg-white/10 backdrop-blur-xl text-white font-black text-[10px] rounded-full border border-white/20">
                {setup.count} EXEC
              </Badge>
            </div>

            <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{setup.name}</h4>
            <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-6">Alpha Model Performance</p>
            
            <div className="relative">
              <div className="flex items-end justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Win Rate</span>
                <span className="text-4xl font-black text-white font-mono">{setup.winRate}%</span>
              </div>
              <div className="h-3 bg-white/10 backdrop-blur-xl rounded-full overflow-hidden border border-white/10">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000", 
                    setup.winRate >= 60 ? "bg-emerald-400" : setup.winRate >= 50 ? "bg-amber-400" : "bg-rose-400"
                  )} 
                  style={{ width: `${setup.winRate}%` }} 
                />
              </div>
            </div>

            {setup.winRate >= 65 && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-xl backdrop-blur-xl border border-white/10 mt-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Optimal Alpha Source</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
