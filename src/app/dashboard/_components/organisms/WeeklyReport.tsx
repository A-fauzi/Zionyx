"use client";

import React from "react";
import { Trophy, AlertCircle, Brain, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WeeklyReportProps {
  trades: any[];
  balance: number;
}

export function WeeklyReport({ trades, balance }: WeeklyReportProps) {
  // Filter trades from last 7 days
  const last7Days = trades.filter((t) => {
    const tradeDate = new Date(t.createdAt ?? t.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return tradeDate >= sevenDaysAgo;
  });

  const closedTrades = last7Days.filter((t) => t.status !== "OPEN");

  // Weekly P&L
  const weeklyPnL = last7Days.reduce((acc, t) => acc + (t.pnl || 0), 0);

  // Win Rate (only from closed trades)
  const winRate =
    closedTrades.length > 0
      ? (closedTrades.filter((t) => t.status === "WIN").length /
          closedTrades.length) *
        100
      : 0;

  // Psychology audit — count HIGH/MODERATE risk trades
  // Sesuaikan dengan hasil assessment sistem (LOW/MODERATE/HIGH)
  const highRiskTrades = last7Days.filter(
    (t) => t.psychology === "HIGH" || t.psychology === "MODERATE"
  ).length;

  // Strategic message
  const strategicMessage =
    highRiskTrades >= 3
      ? "Multiple high-risk entries detected. Consider session cooldown."
      : highRiskTrades > 0
      ? "Some elevated risk signals this week. Stay mindful."
      : closedTrades.length > 0
      ? "Discipline maintained. Consistency is your edge."
      : "No activity this week. Market awaits your protocol.";

  return (
    <Card className="rounded-[2.5rem] border-0 shadow-2xl bg-slate-950 text-white overflow-hidden p-8 md:p-10 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={12} className="text-indigo-400" />
              <span className="text-[10px] font-semibold tracking-widest uppercase text-indigo-400">
                Weekly Settlement Report
              </span>
            </div>
            <h2 className="text-[17px] font-semibold tracking-tight">
              Market Review
            </h2>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right shrink-0">
            <p className="text-[10px] font-medium text-slate-500 tracking-wide mb-1">
              Weekly Performance
            </p>
            <p
              className={cn(
                "text-[22px] font-bold font-mono",
                weeklyPnL >= 0 ? "text-emerald-400" : "text-rose-500"
              )}
            >
              {weeklyPnL >= 0 ? "+" : ""}${weeklyPnL.toFixed(2)}
            </p>
            <p className="text-[9px] text-slate-600 mt-1 font-medium">
              {((weeklyPnL / balance) * 100).toFixed(2)}% account change
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Win Rate */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Trophy size={16} className="text-amber-400" />
              <span className="text-[11px] font-semibold tracking-tight text-slate-400">
                Efficiency
              </span>
            </div>
            <div className="text-[28px] font-bold font-mono">
              {winRate.toFixed(1)}%
            </div>
            <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
              Win rate over {closedTrades.length} closed trade
              {closedTrades.length !== 1 ? "s" : ""} this week
            </p>
          </div>

          {/* Psychology Audit */}
          <div className="space-y-3 border-l border-white/5 pl-6">
            <div className="flex items-center gap-2.5">
              <Brain size={16} className="text-purple-400" />
              <span className="text-[11px] font-semibold tracking-tight text-slate-400">
                Psychology Audit
              </span>
            </div>
            <div
              className={cn(
                "text-[28px] font-bold font-mono",
                highRiskTrades >= 3
                  ? "text-rose-400"
                  : highRiskTrades > 0
                  ? "text-amber-400"
                  : "text-emerald-400"
              )}
            >
              {highRiskTrades}
            </div>
            <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
              {highRiskTrades === 0
                ? "No elevated risk signals detected"
                : `Trade${highRiskTrades > 1 ? "s" : ""} flagged with elevated psychological risk`}
            </p>
          </div>

          {/* Strategic Action */}
          <div className="space-y-3 border-l border-white/5 pl-6">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={16} className="text-indigo-400" />
              <span className="text-[11px] font-semibold tracking-tight text-slate-400">
                Strategic Insight
              </span>
            </div>
            <p className="text-[12px] font-normal text-slate-200 leading-relaxed italic">
              "{strategicMessage}"
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
