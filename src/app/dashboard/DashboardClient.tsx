"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Line, ComposedChart 
} from "recharts";
import {
  Activity, ShieldAlert, Target, Zap, Plus,
  TrendingUp, AlertTriangle, Wallet, Menu, 
  BrainCircuit, ArrowUpRight, ArrowDownRight, X, History,
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
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      
      {/* --- NAVBAR: Institutional Style --- */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 md:px-10 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 group cursor-pointer">
            <Activity className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 leading-none">Z Trade Terminal</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Professional Analyst Edition</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
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
            {isCriticalZone ? "Drawdown Limit Reached" : "Deploy Strategy"}
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl" 
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[110] md:hidden overflow-hidden">
          <div onClick={() => setMobileMenuOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300" />
          <div className="absolute top-0 left-0 w-full bg-white border-b border-slate-100 shadow-2xl pt-24 pb-8 px-6 rounded-b-[3rem] animate-in slide-in-from-top duration-300">
            <div className="space-y-6">
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
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", Number(stats.todayPnL) >= 0 ? "bg-emerald-500 text-white" : "bg-rose-500 text-white")}>
                          {Number(stats.todayPnL) >= 0 ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Daily Change:</span>
                          <span className={cn("text-xs font-black", Number(stats.todayPnL) >= 0 ? "text-emerald-400" : "text-rose-400")}>
                            {Number(stats.todayPnL) >= 0 ? "+" : ""}${stats.todayPnL}
                          </span>
                        </div>
                    </div>
                 </div>
              </div>
              <Button 
                disabled={isCriticalZone}
                className={cn(
                  "w-full h-16 rounded-[1.5rem] font-bold text-base shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3",
                  isCriticalZone ? "bg-slate-100 text-slate-400" : "bg-slate-900 text-white shadow-slate-200"
                )}
                onClick={() => { if (!isCriticalZone) { setEntryModalOpen(true); setMobileMenuOpen(false); } }}
              >
                  {isCriticalZone ? <ShieldAlert size={20} /> : <Plus size={20} />}
                  <span>{isCriticalZone ? "Limit Protection Active" : "Execute New Strategy"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- DASHBOARD CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8 space-y-8">
        
        {/* ROW 1: WELCOME & RISK METER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 relative overflow-hidden bg-white border border-slate-100 shadow-sm rounded-[2.5rem] p-8 group transition-all duration-300 hover:shadow-xl hover:shadow-slate-100">
             <div className="absolute top-0 right-0 p-10 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity"><BrainCircuit className="w-64 h-64" /></div>
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trading Engine Online</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight uppercase">Trading Intelligence</h2>
                <p className="text-sm md:text-base text-slate-500 mb-8 leading-relaxed max-w-lg font-medium">
                    Strict adherence to the risk management protocol is mandatory. Maintain discipline through the strategic capital appreciation phase.
                </p>
                <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
                        <Target size={14} className="text-indigo-500" />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Growth Objective: +20% / Mo</span>
                    </div>
                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 shadow-sm">
                        <Zap size={14} className="text-amber-500" />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Focus Asset: XAUUSD</span>
                    </div>
                </div>
             </div>
          </Card>

          <Card className={cn(
              "rounded-[2.5rem] border shadow-sm p-8 flex flex-col justify-between transition-all duration-500", 
              isCriticalZone ? "bg-rose-50 border-rose-100" : "bg-white border-slate-100"
          )}>
             <div className="flex justify-between items-start">
                <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1 font-mono">Current Exposure</span>
                    <div className="flex items-baseline gap-1">
                        <h3 className={cn("text-5xl font-black tracking-tighter", isCriticalZone ? "text-rose-600" : "text-slate-950")}>{drawdownPercent}%</h3>
                        <span className="text-sm font-bold text-slate-400 font-mono">/ 6.0</span>
                    </div>
                </div>
                <div className={cn("p-4 rounded-[1.25rem] shadow-sm", isCriticalZone ? "bg-rose-100 text-rose-600" : "bg-emerald-50 text-emerald-600")}>
                    {isCriticalZone ? <AlertTriangle size={24} /> : <ShieldAlert size={24} />}
                </div>
             </div>
             
             <div className="mt-8">
                 <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2.5 font-mono">
                     <span>Operating Range</span>
                     <span>Risk Limit</span>
                 </div>
                 <div className="w-full bg-slate-100 h-3.5 rounded-full overflow-hidden shadow-inner">
                    <div className={cn("h-full transition-all duration-1000 rounded-full", isCriticalZone ? "bg-rose-500" : "bg-emerald-500")}
                         style={{ width: `${Math.min((drawdownPercent / 6) * 100, 100)}%` }} />
                 </div>
                 <p className={cn("text-[10px] font-black mt-4 uppercase text-center tracking-widest", isCriticalZone ? "text-rose-600" : "text-emerald-600")}>
                    {isCriticalZone ? "PROTOCOL: STOP EXECUTION" : "PROTOCOL: EXECUTION AUTHORIZED"}
                 </p>
             </div>
          </Card>
        </div>

        {/* ROW 2: GRAPH & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-sm bg-white p-8 group transition-all duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                        Performance Curve <ChevronRight size={16} className="text-slate-200" />
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Equity Trajectory vs Forecast</p>
                </div>
                <Badge variant="outline" className="h-8 rounded-xl px-4 text-[10px] font-black border-slate-200 bg-slate-50 text-slate-500 uppercase tracking-widest">
                    Live Session
                </Badge>
            </div>
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={dynamicChartData} margin={{ left: -20, right: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorEq" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.08}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#cbd5e1', textAnchor: 'middle'}} dy={15} />
                        <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                        <Tooltip 
                            cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.15)', padding: '16px' }} 
                            labelStyle={{ color: '#94a3b8', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}
                        />
                        <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="6 6" dot={false} activeDot={false} />
                        <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={4} fill="url(#colorEq)" animationDuration={2000} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <StatBox label="Execution WR" value={`${stats.winRate}%`} sub="Win/Loss Ratio" color={Number(stats.winRate) > 50 ? "text-emerald-600" : "text-rose-600"} icon={Target} />
            <StatBox label="Profit Factor" value={stats.profitFactor} sub="Commercial Efficiency" color="text-indigo-600" icon={Wallet} />
            <StatBox label="Net Session P&L" value={`$${stats.todayPnL}`} sub="Daily Performance" color={Number(stats.todayPnL) >= 0 ? "text-slate-950" : "text-rose-600"} icon={Zap} />
            <StatBox label="Order Count" value={initialTrades.length} sub="Strategic Deployments" color="text-slate-900" icon={History} />
          </div>
        </div>

        {/* ROW 3: SETUP & ASSET INSIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-[2.5rem] p-8 border border-slate-100 shadow-sm bg-white transition-all hover:shadow-lg">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Strategy Efficiency</h3>
                    <MoreHorizontal size={18} className="text-slate-300" />
                </div>
                <div className="space-y-7">
                    {setupPerformance.map((setup, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-[10px] font-black uppercase mb-2.5 tracking-wider">
                                <span className="text-slate-500">{setup.name}</span>
                                <span className={setup.winRate >= 50 ? "text-emerald-600 font-black" : "text-slate-400 font-bold"}>{setup.winRate}% SR</span>
                            </div>
                            <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden shadow-inner border border-slate-100">
                                <div className={cn("h-full transition-all duration-1000 rounded-full", setup.winRate >= 60 ? "bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.3)]" : "bg-slate-300")}
                                     style={{ width: `${setup.winRate}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="rounded-[2.5rem] p-8 bg-slate-950 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-10 -mr-32 -mt-32 transition-opacity group-hover:opacity-20" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy size={16} className="text-amber-400" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Primary Trading Asset</h3>
                    </div>
                    <h2 className="text-6xl font-black tracking-tighter mb-2 group-hover:scale-105 transition-transform origin-left">XAUUSD</h2>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-xl backdrop-blur-xl border border-white/10 mt-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Optimal Alpha Source</span>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between relative z-10">
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Observation</p>
                        <p className="text-sm font-black text-rose-400 uppercase tracking-tight">Strategy Conflict: Breakout</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Capital Risk</p>
                        <p className="text-sm font-black text-white font-mono tracking-wider">$20.00 Fixed</p>
                    </div>
                </div>
            </Card>
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
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Verified Institutional Grade Record</p>
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
