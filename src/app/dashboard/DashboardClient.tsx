"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Line, ComposedChart 
} from "recharts";
import {
  Activity, ShieldAlert, Target, Zap, Plus,
  TrendingUp, AlertTriangle, Wallet,
  BrainCircuit, ArrowUpRight, ArrowDownRight,
  Trophy, LayoutDashboard, Settings, Clock, BarChart3, ChevronRight, MoreHorizontal
} from "lucide-react";

import { cn } from "@/lib/utils";
import { calculateStats, generateEquityData } from "@/lib/calculations";
import { closeTradeAction } from "./actions";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatBox } from "./_components/StatBox";
import { EntryModal } from "./_components/EntryModal";

export default function DashboardClient({ initialTrades, userProfile }: any) {
  const router = useRouter();
  const [isEntryModalOpen, setEntryModalOpen] = useState(false);

  // --- LOGIC: DATA DINAMIS ---
  const stats = calculateStats(initialTrades, userProfile.balance);
  const dynamicChartData = useMemo(() => 
    generateEquityData(initialTrades, userProfile.balance), 
  [initialTrades, userProfile.balance]);

  const totalPnL = useMemo(() => {
    return initialTrades.reduce((acc: number, trade: any) => acc + (trade.pnl || 0), 0);
  }, [initialTrades]);
  const currentBalance = userProfile.balance + totalPnL;

  const drawdownPercent = Number(stats.drawdownPercent);
  const isCriticalZone = drawdownPercent >= 6; 

  const setupPerformance = useMemo(() => {
    const setups = ["SMC Sweep", "SnD RBD", "Breakout"];
    return setups.map(name => {
      const filtered = initialTrades.filter((t: any) => t.setup === name && t.status !== "OPEN");
      const wins = filtered.filter((t: any) => t.status === "WIN").length;
      return {
        name,
        count: filtered.length,
        winRate: filtered.length > 0 ? Math.round((wins / filtered.length) * 100) : 0
      };
    });
  }, [initialTrades]);

  const handleCloseTrade = async (id: string, status: "WIN" | "LOSS", pnl: number) => {
    await closeTradeAction(id, status, pnl);
    router.refresh(); 
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-24 md:pb-10 relative font-sans selection:bg-indigo-100 selection:text-indigo-900">

      {/* --- NAVBAR: Updated with Zionyx Brand --- */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 md:px-10 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 group cursor-pointer">
            <Activity className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 leading-none">Zionyx Terminal</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Professional Analyst Edition</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {/* Daily Limit Protection Indicator */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-slate-100 bg-white/60 backdrop-blur-sm">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isCriticalZone ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
            )} />
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Daily Limit</p>
              <p className={cn(
                "text-xs font-black font-mono tracking-tight mt-0.5",
                isCriticalZone ? "text-rose-600" : "text-emerald-600"
              )}>
                {isCriticalZone ? "LOCKED" : "ACTIVE"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 font-mono">Total Capital</p>
            <p className="text-base font-black text-slate-900 font-mono tracking-tight">${currentBalance.toLocaleString()}</p>
          </div>
          <Button 
            disabled={isCriticalZone}
            onClick={() => setEntryModalOpen(true)} 
            className={cn(
              "h-12 px-6 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-xl shadow-slate-200",
              isCriticalZone ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            {isCriticalZone ? <ShieldAlert size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
            {isCriticalZone ? "Limit Protection Active" : "Deploy Strategy"}
          </Button>
        </div>
      </nav>

      {/* --- MOBILE BALANCE & EXECUTE CARD (MOVED FROM MENU OVERLAY) --- */}
      <div className="md:hidden px-6 pt-6">
        <div className="relative overflow-hidden rounded-[2.5rem] p-6 shadow-2xl shadow-slate-300">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0f172a] to-indigo-950" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Wallet className="text-indigo-400 w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em]">Net Liquidity</p>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter">${currentBalance.toLocaleString()}</h2>
              </div>
            </div>
            <div className="inline-flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", Number(stats.todayPnL || 0) >= 0 ? "bg-emerald-500 text-white" : "bg-rose-500 text-white")}>
                {Number(stats.todayPnL || 0) >= 0 ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Daily Change:</span>
                <span className={cn("text-xs font-black", Number(stats.todayPnL || 0) >= 0 ? "text-emerald-400" : "text-rose-400")}>
                  {Number(stats.todayPnL || 0) >= 0 ? "+" : ""}${stats.todayPnL || '0.00'}
                </span>
              </div>
            </div>
            <Button 
              disabled={isCriticalZone}
              onClick={() => setEntryModalOpen(true)} 
              className={cn(
                "w-full h-12 rounded-xl font-bold text-sm transition-all active:scale-95 mt-6",
                isCriticalZone 
                  ? "bg-white/10 text-slate-400 cursor-not-allowed border border-white/10" 
                  : "bg-white text-slate-900 hover:bg-white/90 shadow-lg shadow-white/20"
              )}
            >
              {isCriticalZone ? (
                <>
                  <ShieldAlert size={18} className="mr-2" />
                  Limit Protection Active
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Deploy Strategy
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="px-6 md:px-10 pt-8 md:pt-10 space-y-8 md:space-y-10 max-w-[1600px] mx-auto">
        
        {/* ROW 1: DASHBOARD STATS */}
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
            bg={isCriticalZone ? "bg-rose-50" : "bg-orange-50"}
            color={isCriticalZone ? "text-rose-600" : "text-orange-600"}
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

        {/* CRITICAL ZONE ALERT */}
        {isCriticalZone && (
          <div className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl border border-rose-100">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50" />
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-rose-500 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-xl shadow-rose-100">
                  <ShieldAlert className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-rose-900 mb-2 uppercase tracking-tight">Zionyx Protocol: Lockdown Active</h3>
                  <p className="text-slate-600 font-medium leading-relaxed max-w-2xl">
                    Your daily drawdown has reached <span className="font-black text-rose-600">{stats.drawdownPercent || '0.0'}%</span>. 
                    All new positions are suspended until capital recovery or next trading session. This is a mandatory protection measure.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 md:text-right shrink-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rose-200">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  System Locked
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Automated Risk Defense</p>
              </div>
            </div>
          </div>
        )}

        {/* ROW 2: EQUITY CURVE + DAILY PERFORMANCE */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {/* EQUITY GROWTH CHART */}
          <Card className="col-span-full md:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-xl p-8 bg-white">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center text-indigo-600 border border-indigo-100">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Capital Growth Trajectory</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Live Equity Curve vs. Zionyx Target Projection</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Target</p>
                <p className="text-base font-black text-indigo-600">+20%</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={dynamicChartData}>
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "11px", fontWeight: 700 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "11px", fontWeight: 700 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#0f172a", 
                    border: "none", 
                    borderRadius: "16px", 
                    padding: "12px 16px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                  }}
                  labelStyle={{ color: "#cbd5e1", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}
                  itemStyle={{ color: "#fff", fontSize: "13px", fontWeight: 900 }}
                />
                <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={3} fill="url(#equityGradient)" />
                <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="8 8" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-sm" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Actual Equity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-dashed border-amber-500 rounded-sm" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Target Projection</span>
                </div>
              </div>
              <Badge variant="outline" className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700 border-indigo-200 rounded-lg">
                {dynamicChartData.length} DATA POINTS
              </Badge>
            </div>
          </Card>

          {/* DAILY PERFORMANCE SUMMARY */}
          <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl p-8 bg-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-purple-50 rounded-[1.25rem] flex items-center justify-center text-purple-600 border border-purple-100">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Today</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Session Metrics</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Result</span>
                  <span className={cn("text-2xl font-black font-mono", Number(stats.todayPnL || 0) >= 0 ? "text-emerald-600" : "text-rose-600")}>
                    {Number(stats.todayPnL || 0) >= 0 ? "+" : ""}${stats.todayPnL || '0.00'}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", Number(stats.todayPnL || 0) >= 0 ? "bg-emerald-500" : "bg-rose-500")} style={{width: `${Math.min(Math.abs(Number(stats.todayPnL || 0)) * 2, 100)}%`}} />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Positions Executed</span>
                  <span className="text-base font-black text-slate-900">{stats.todayTrades || '0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Win Rate (Today)</span>
                  <span className="text-base font-black text-slate-900">{stats.todayWinRate || '0'}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Drawdown Status</span>
                  <Badge variant="outline" className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-md", isCriticalZone ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200")}>
                    {isCriticalZone ? "CRITICAL" : "SAFE"}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ROW 3: STRATEGY PERFORMANCE BREAKDOWN */}
        <div className="grid md:grid-cols-3 gap-6">
          {setupPerformance.map((setup) => (
            <Card key={setup.name} className="rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden bg-white">
              <div className="relative overflow-hidden rounded-[2.5rem] p-6 shadow-2xl shadow-slate-300">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0f172a] to-indigo-950" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-[1.25rem] flex items-center justify-center text-white border border-white/20">
                      <BrainCircuit size={20} />
                    </div>
                    <Badge variant="secondary" className="px-3 py-1 bg-white/10 backdrop-blur-xl text-white font-black text-[10px] rounded-full border border-white/20">
                      {setup.count} EXEC
                    </Badge>
                  </div>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{setup.name}</h4>
                  <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-6">Alpha Model Performance</p>
                  
                  <div className="relative">
                    <div className="flex items-end justify-between mb-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Win Rate</span>
                      <span className="text-4xl font-black text-white font-mono">{setup.winRate}%</span>
                    </div>
                    <div className="h-3 bg-white/10 backdrop-blur-xl rounded-full overflow-hidden border border-white/10">
                      <div className={cn("h-full rounded-full transition-all duration-500", setup.winRate >= 60 ? "bg-emerald-400" : setup.winRate >= 50 ? "bg-amber-400" : "bg-rose-400")} style={{width: `${setup.winRate}%`}} />
                    </div>
                  </div>
                  {setup.winRate >= 65 && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-xl backdrop-blur-xl border border-white/10 mt-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Optimal Alpha Source</span>
                    </div>
                  )}
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between relative z-10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Observation</p>
                    <p className="text-sm font-black text-rose-400 uppercase tracking-tight">{setup.winRate < 50 ? "Strategy Conflict" : "High Confidence"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Capital Risk</p>
                    <p className="text-sm font-black text-white font-mono tracking-wider">$20.00 Fixed</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ROW 4: EXECUTION LOG */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden bg-white">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-900 border border-slate-100">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Execution Audit</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Verified Zionyx Protocol Record</p>
              </div>
            </div>
            <Badge variant="secondary" className="px-4 py-1.5 bg-slate-900 text-white font-black text-[10px] rounded-full border-0 shadow-lg shadow-slate-200">
              {initialTrades.length} POSITIONS LOGGED
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1050px]">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-6">Timestamp & Protocol</th>
                  <th className="px-6 py-6">Instrument</th>
                  <th className="px-6 py-6">Risk Parameters</th>
                  <th className="px-6 py-6">Audit Status</th>
                  <th className="px-8 py-6 text-right">Settlement (PnL)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {initialTrades.map((trade: any) => {
                  const rMultiple = trade.status !== "OPEN" ? (trade.pnl / trade.risk).toFixed(1) : "-";
                  const riskPercent = ((trade.risk / userProfile.balance) * 100).toFixed(1);

                  return (
                    <tr key={trade.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <Clock size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                          <div>
                            <p className="font-black text-slate-900 mb-0.5 uppercase tracking-tight">{trade.setup}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                              {new Date(trade.createdAt).toLocaleDateString([], {day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center border-2 shrink-0 shadow-sm",
                            trade.type === 'BUY' ? "bg-white border-indigo-100 text-indigo-600" : "bg-white border-orange-100 text-orange-600"
                          )}>
                            {trade.type === 'BUY' ? <ArrowUpRight size={16} strokeWidth={3} /> : <ArrowDownRight size={16} strokeWidth={3} />}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 leading-none mb-1 font-mono">{trade.pair}</p>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest", trade.type === 'BUY' ? "text-indigo-500" : "text-orange-500")}>
                              Direction: {trade.type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 font-mono">{trade.lot} LOTS</span>
                            <span className="text-[10px] text-slate-200">/</span>
                            <span className="font-bold text-slate-500 text-[10px] uppercase tracking-tighter">${trade.risk} RISK</span>
                          </div>
                          <div className="w-28 h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div className={cn("h-full rounded-full", Number(riskPercent) > 2 ? "bg-rose-500" : "bg-indigo-600")} style={{width: `${Math.min(Number(riskPercent) * 20, 100)}%`}} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {trade.status === "OPEN" ? (
                          <div className="flex gap-2.5">
                            <button className="h-8 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg shadow-lg shadow-emerald-100 transition-all active:scale-95 uppercase tracking-widest" onClick={() => handleCloseTrade(trade.id, "WIN", trade.risk * 2)}>Win (2R)</button>
                            <button className="h-8 px-5 border-2 border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] font-black rounded-lg transition-all active:scale-95 uppercase tracking-widest" onClick={() => handleCloseTrade(trade.id, "LOSS", -trade.risk)}>Loss</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-md border-2", trade.status === 'WIN' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100")}>
                              {trade.status === 'WIN' ? "Target Hit" : "Invalid Setup"}
                            </Badge>
                            <div className="px-2 py-0.5 bg-slate-100 rounded-md">
                              <span className="text-[10px] font-black text-slate-500 font-mono">{rMultiple}R</span>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={cn(
                          "text-base font-black font-mono tracking-tighter",
                          trade.status === 'OPEN' ? "text-slate-300 animate-pulse" : 
                          trade.pnl > 0 ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {trade.status === 'OPEN' ? "UNSETTLED" : `${trade.pnl > 0 ? "+" : ""}$${trade.pnl.toLocaleString()}`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {isEntryModalOpen && <EntryModal onClose={() => setEntryModalOpen(false)} balance={userProfile.balance} />}
    </div>
  );
}
