"use client";

import React from "react";
import { Target, Zap, AlertTriangle, TrendingUp } from "lucide-react";
import { StatBox } from "../molecules/StatBox";

interface StatsGridProps {
  stats: any;
  totalPnL: number;
}

export function StatsGrid({ stats, totalPnL }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <StatBox 
        icon={Target}
        label="Total Win Rate"
        value={`${stats.winRate || '0'}%`}
        sub={Number(stats.winRate || 0) >= 65 ? "↑" : "↓"}
        bg="bg-indigo-50"
        color="text-indigo-600"
      />
      <StatBox 
        icon={Zap}
        label="Avg R-Multiple"
        value={`${stats.avgRMultiple || '0.0'}R`}
        sub={Number(stats.avgRMultiple || 0) >= 2 ? "↑" : "↓"}
        bg="bg-purple-50"
        color="text-purple-600"
      />
      <StatBox 
        icon={AlertTriangle}
        label="Current Drawdown"
        value={`${stats.drawdownPercent || '0.0'}%`}
        sub={Number(stats.drawdownPercent || 0) > 3 ? "↓" : "→"}
        bg={Number(stats.drawdownPercent || 0) >= 6 ? "bg-rose-50" : "bg-orange-50"}
        color={Number(stats.drawdownPercent || 0) >= 6 ? "text-rose-600" : "text-orange-600"}
      />
      <StatBox 
        icon={TrendingUp}
        label="Realized PnL"
        value={`$${totalPnL.toLocaleString()}`}
        sub={totalPnL > 0 ? "↑" : totalPnL < 0 ? "↓" : "→"}
        bg="bg-emerald-50"
        color="text-emerald-600"
      />
    </div>
  );
}
