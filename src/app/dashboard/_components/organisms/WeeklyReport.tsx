"use client";

import React from "react";
import { Trophy, AlertCircle, Brain, TrendingUp, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WeeklyReportProps {
  trades: any[];
}

export function WeeklyReport({ trades }: WeeklyReportProps) {
  // Filter trade 7 hari terakhir
  const last7Days = trades.filter(t => {
    const tradeDate = new Date(t.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return tradeDate >= sevenDaysAgo;
  });

  const weeklyPnL = last7Days.reduce((acc, t) => acc + (t.pnl || 0), 0);
  const winRate = last7Days.length > 0 
    ? (last7Days.filter(t => t.status === "WIN").length / last7Days.length) * 100 
    : 0;

  // Deteksi Tren Psikologi (Opsi 2 Integration)
  const fomoTrades = last7Days.filter(t => t.psychology === "FOMO").length;

  return (
    <Card className="rounded-[2.5rem] border-0 shadow-2xl bg-slate-950 text-white overflow-hidden p-10 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Weekly Settlement Report</span>
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase">Market Review.</h2>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-right">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Weekly Performance</p>
            <p className={cn("text-2xl font-black font-mono", weeklyPnL >= 0 ? "text-emerald-400" : "text-rose-500")}>
              {weeklyPnL >= 0 ? "+" : ""}${weeklyPnL.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Win Rate Stats */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Trophy size={18} className="text-amber-400" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Efficiency</span>
            </div>
            <div className="text-3xl font-black font-mono">{winRate.toFixed(1)}%</div>
            <p className="text-[10px] text-slate-500 font-medium">Win Rate dalam 7 hari terakhir.</p>
          </div>

          {/* Psychology Audit (The "Real" Data) */}
          <div className="space-y-4 border-l border-white/5 pl-8">
            <div className="flex items-center gap-3">
              <Brain size={18} className="text-purple-400" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Psychology Audit</span>
            </div>
            <div className="text-3xl font-black font-mono text-rose-400">{fomoTrades}</div>
            <p className="text-[10px] text-slate-500 font-medium">Trade terdeteksi dilakukan karena FOMO.</p>
          </div>

          {/* Strategic Action */}
          <div className="space-y-4 border-l border-white/5 pl-8">
            <div className="flex items-center gap-3">
              <AlertCircle size={18} className="text-indigo-400" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Strategic Tip</span>
            </div>
            <p className="text-sm font-bold text-slate-200 leading-relaxed italic">
              "{fomoTrades > 0 ? "Hentikan FOMO untuk melindungi modal 20 juta lo." : "Disiplin lo luar biasa minggu ini. Maintain the edge."}"
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
