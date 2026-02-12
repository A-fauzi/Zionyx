"use client";

import React, { useState } from "react";
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis } from "recharts";
import {
  Activity, ShieldAlert, Target, Zap, Plus,
  TrendingUp, AlertTriangle, Wallet, Menu, 
  BrainCircuit, ArrowUpRight, ArrowDownRight, X, History
} from "lucide-react";

// --- IMPORTS UTILS & DATA ---
import { cn } from "@/lib/utils";
import { 
  USER_PROFILE, 
  CHART_DATA, 
  INITIAL_TRADES, 
  TRADING_STATS, 
  PERFORMANCE_BY_SETUP 
} from "@/lib/data";

// --- SHADCN COMPONENTS ---
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- CUSTOM COMPONENTS ---
import { StatBox } from "./_components/StatBox";
import { EntryModal } from "./_components/EntryModal";

export default function DashboardPage() {
  const [trades, setTrades] = useState(INITIAL_TRADES);
  const [isEntryModalOpen, setEntryModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Performance Calculation (Real-time based on trades state if needed, here mostly static for demo)
  const todayPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
  const drawdownPercent = (todayPnL / USER_PROFILE.balance) * -100;
  const isDangerZone = drawdownPercent >= 4;

  const handleAddTrade = (trade: any) => {
    setTrades([trade, ...trades]);
    setEntryModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-24 md:pb-10 relative">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="text-white w-4 h-4" />
          </div>
          <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900">
            ZenTrade<span className="text-indigo-600">.</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Balance</p>
            <p className="text-sm font-black text-slate-900">${USER_PROFILE.balance.toLocaleString()}</p>
          </div>
          <Button onClick={() => setEntryModalOpen(true)} className="bg-slate-900 hover:bg-slate-800">
            <Plus size={16} className="mr-2" /> New Entry
          </Button>
        </div>

        <Button 
          variant="ghost" size="icon"
          className="md:hidden text-slate-600 hover:bg-slate-100 rounded-full"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </nav>

      {/* --- MOBILE MENU OVERLAY (Zero Animation) --- */}
      {isMobileMenuOpen && (
        <>
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          />
          <div className="fixed top-16 left-0 w-full bg-white border-b border-slate-200 z-50 shadow-xl overflow-hidden md:hidden rounded-b-2xl">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Balance</p>
                   <p className="text-2xl font-black text-slate-900">${USER_PROFILE.balance.toLocaleString()}</p>
                 </div>
                 <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Wallet className="text-indigo-600 w-5 h-5" />
                 </div>
              </div>
              <Button 
                className="w-full bg-slate-900 hover:bg-slate-800 h-12 text-base font-bold shadow-lg shadow-slate-200" 
                onClick={() => { setEntryModalOpen(true); setMobileMenuOpen(false); }}
              >
                <Plus size={18} className="mr-2" /> New Entry
              </Button>
            </div>
          </div>
        </>
      )}

      {/* --- MAIN DASHBOARD CONTENT --- */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
        
        {/* --- SECTION 1: WELCOME & RISK METER --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border-slate-100 shadow-sm rounded-2xl md:rounded-3xl">
            <CardContent className="p-6">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                   <Zap className="w-40 h-40" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Halo, {USER_PROFILE.name}</h2>
                  <p className="text-xs md:text-sm text-slate-500 mb-4 md:mb-6 max-w-md leading-relaxed">
                      Ingat prinsip dasar: Loss adalah biaya bisnis. Fokus pada eksekusi setup terbaik sesuai sistem.
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                          <ShieldAlert size={12} className="mr-1" /> Risk Max 2%
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                          <Target size={12} className="mr-1" /> RRR 1:2+
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                          <BrainCircuit size={12} className="mr-1" /> SMC / SnD
                      </Badge>
                  </div>
                </div>
            </CardContent>
          </Card>

          <Card className={cn("rounded-2xl md:rounded-3xl border shadow-sm", isDangerZone ? "bg-rose-50 border-rose-100" : "bg-white border-slate-100")}>
             <CardContent className="p-6 h-full flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div className={cn("p-2 rounded-lg", isDangerZone ? "bg-rose-100" : "bg-emerald-50")}>
                            <AlertTriangle size={16} className={isDangerZone ? "text-rose-500" : "text-emerald-500"} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daily Limit</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-2xl font-black text-slate-900">{Math.abs(drawdownPercent).toFixed(1)}%</h3>
                        <span className="text-xs font-medium text-slate-400">/ 6%</span>
                    </div>
                    <p className={cn("text-[10px] font-bold mt-1", isDangerZone ? "text-rose-600" : "text-emerald-600")}>
                        {isDangerZone ? "STOP TRADING!" : "Safe Zone"}
                    </p>
                </div>
                <div className="w-full bg-slate-200/50 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div 
                        className={cn("h-full rounded-full transition-all duration-500", isDangerZone ? "bg-rose-500" : "bg-emerald-500")}
                        style={{ width: `${Math.min((Math.abs(drawdownPercent) / 6) * 100, 100)}%` }}
                    />
                </div>
             </CardContent>
          </Card>
        </div>

        {/* --- SECTION 2: PERFORMANCE ANALYTICS (THE ENGINE) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="lg:col-span-2 rounded-2xl md:rounded-3xl border-slate-100 shadow-sm flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp size={16} className="text-indigo-600" /> Growth Curve
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">Konsistensi saldo dalam 30 hari terakhir</p>
                    </div>
                    <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                        {['1W', '1M', '3M', 'YTD'].map((t, i) => (
                        <button key={t} className={cn(
                            "px-3 py-1.5 text-[10px] font-bold rounded-md transition-all",
                            i === 1 ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                        )}>{t}</button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CHART_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}
                            formatter={(value: number) => [`$${value}`, "Equity"]}
                        />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                        <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={3} fill="url(#colorEquity)" animationDuration={1000} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <StatBox label="Win Rate" value={`${TRADING_STATS.winRate}%`} sub="Target: >55%" color={TRADING_STATS.winRate > 50 ? "text-emerald-600" : "text-rose-600"} bg={TRADING_STATS.winRate > 50 ? "bg-emerald-50" : "bg-rose-50"} icon={Target} />
            <StatBox label="Profit Factor" value={TRADING_STATS.profitFactor.toString()} sub="Gross Win / Gross Loss" color="text-indigo-600" bg="bg-indigo-50" icon={Wallet} />
            <StatBox label="Avg Risk:Reward" value={`1:${TRADING_STATS.avgRR}`} sub="Risk $1 to make $2.4" color="text-violet-600" bg="bg-violet-50" icon={Activity} />
            <StatBox label="Current Streak" value={`${TRADING_STATS.currentStreak} Wins`} sub="Keep the momentum!" color="text-orange-600" bg="bg-orange-50" icon={Zap} />
          </div>
        </div>

        {/* --- SECTION 3: STRATEGY & PAIR INSIGHTS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="rounded-2xl md:rounded-3xl border-slate-100 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <BrainCircuit size={16} className="text-slate-500" /> Setup Efficiency
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {PERFORMANCE_BY_SETUP.map((setup, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mb-1">
                                    <span>{setup.name}</span>
                                    <span className={setup.winRate >= 50 ? "text-emerald-600" : "text-rose-500"}>
                                        WR: {setup.winRate}% ({setup.count} Trades)
                                    </span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className={cn("h-full rounded-full transition-all duration-500", 
                                            setup.winRate >= 60 ? "bg-emerald-500" : setup.winRate >= 40 ? "bg-amber-400" : "bg-rose-400"
                                        )}
                                        style={{ width: `${setup.winRate}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl md:rounded-3xl border-slate-100 shadow-sm bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10"><Activity size={100} className="text-indigo-400" /></div>
                <CardContent className="p-6 relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-6">Top Performing Asset</h3>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-3xl font-black text-white tracking-tight">{TRADING_STATS.bestPair}</h2>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-0 hover:bg-emerald-500/30">Best Win Rate</Badge>
                        </div>
                        <p className="text-sm text-slate-400 max-w-xs">Kamu memiliki edge statistik tertinggi di pair ini. Prioritaskan setup di sini saat market overlap.</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-700/50 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Worst Pair</p>
                            <p className="text-sm font-bold text-rose-400">{TRADING_STATS.worstPair}</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white text-xs h-8 rounded-lg bg-transparent">View Full Report</Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* --- SECTION 4: TRADE JOURNAL --- */}
        <Card className="p-0 overflow-hidden rounded-2xl md:rounded-3xl border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
                <History size={16} className="text-slate-500" />
                <h3 className="font-bold text-sm text-slate-900">Execution Log</h3>
            </div>
            <div className="flex gap-2">
                 <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 text-[10px] shadow-sm">{trades.length} Trades</Badge>
                 <Button variant="ghost" size="sm" className="h-6 text-[10px] text-indigo-600 hover:bg-indigo-50 px-2">View All</Button>
            </div>
          </div>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="px-6 py-4">Time & Setup</th>
                  <th className="px-6 py-4">Asset & Direction</th>
                  <th className="px-6 py-4">Risk Management</th>
                  <th className="px-6 py-4">Outcome</th>
                  <th className="px-6 py-4 text-right">Net P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs md:text-sm">
                {trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{trade.setup}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{trade.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border",
                                trade.type === 'BUY' ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-orange-50 border-orange-100 text-orange-600"
                           )}>
                                {trade.type === 'BUY' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                           </div>
                           <div>
                                <div className="font-bold text-slate-900">{trade.pair}</div>
                                <div className={cn("text-[10px] font-bold uppercase", trade.type === 'BUY' ? "text-indigo-500" : "text-orange-500")}>{trade.type}</div>
                           </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-600 font-medium">{trade.lot} Lot</span>
                            <span className="text-[10px] text-slate-400">Risk: ${trade.risk} (1%)</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className={cn("text-[10px] font-black uppercase shadow-none border px-2 py-0.5",
                        trade.status === 'WIN' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        trade.status === 'LOSS' ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-slate-50 text-slate-600 border-slate-100"
                      )}>{trade.status}</Badge>
                    </td>
                    <td className={cn("px-6 py-4 text-right font-black text-sm", trade.pnl > 0 ? "text-emerald-600" : "text-rose-600")}>
                      {trade.pnl > 0 ? '+' : ''}{trade.pnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

      </main>

      {/* --- ENTRY MODAL --- */}
      {isEntryModalOpen && (
        <EntryModal onClose={() => setEntryModalOpen(false)} balance={USER_PROFILE.balance} onSubmit={handleAddTrade} />
      )}
    </div>
  );
}
