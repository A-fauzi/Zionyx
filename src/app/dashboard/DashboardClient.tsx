"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis } from "recharts";
import {
  Activity, ShieldAlert, Target, Zap, Plus,
  TrendingUp, AlertTriangle, Wallet, Menu, 
  BrainCircuit, ArrowUpRight, ArrowDownRight, X, History
} from "lucide-react";

import { cn } from "@/lib/utils";
// Integrasi: Fungsi hitung otomatis dan Server Actions
import { calculateStats } from "@/lib/calculations";
import { closeTradeAction } from "./actions";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatBox } from "./_components/StatBox";
import { EntryModal } from "./_components/EntryModal";

export default function DashboardClient({ initialTrades, userProfile, chartData }: any) {
  const router = useRouter();
  const [isEntryModalOpen, setEntryModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // INTEGRASI DATA: Menghitung statistik harian Zi secara real-time
  const stats = calculateStats(initialTrades, userProfile.balance);
  
  // Risk Guard Logic: Mengunci sistem jika loss mencapai 6%
  const drawdownPercent = Number(stats.drawdownPercent);
  const isWarningZone = drawdownPercent >= 4;
  const isCriticalZone = drawdownPercent >= 6; 
  const isDangerZone = isWarningZone || isCriticalZone;

  // Fungsionalitas: Menutup trade (WIN/LOSS)
  const handleCloseTrade = async (id: string, status: "WIN" | "LOSS", pnl: number) => {
    try {
      await closeTradeAction(id, status, pnl);
      router.refresh(); // Segarkan data agar stats terupdate
    } catch (error) {
      console.error("Gagal menutup trade:", error);
    }
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
            <p className="text-sm font-black text-slate-900">${userProfile.balance.toLocaleString()}</p>
          </div>
          {/* Fungsionalitas: Tombol New Entry terkunci jika Critical Zone */}
          <Button 
            disabled={isCriticalZone}
            onClick={() => setEntryModalOpen(true)} 
            className={cn(
                "bg-slate-900 hover:bg-slate-800 transition-all",
                isCriticalZone && "opacity-50 cursor-not-allowed bg-slate-400"
            )}
          >
            {isCriticalZone ? <ShieldAlert size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
            {isCriticalZone ? "Limit Reached" : "New Entry"}
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

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <>
          <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 top-16 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden" />
          <div className="fixed top-16 left-0 w-full bg-white border-b border-slate-200 z-50 shadow-xl md:hidden rounded-b-2xl">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                 <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Balance</p>
                   <p className="text-2xl font-black text-slate-900">${userProfile.balance.toLocaleString()}</p>
                 </div>
                 <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Wallet className="text-indigo-600 w-5 h-5" />
                 </div>
              </div>
              <Button 
                disabled={isCriticalZone}
                className={cn(
                    "w-full h-12 font-bold shadow-lg transition-all",
                    isCriticalZone ? "bg-slate-300 text-slate-500" : "bg-slate-900 text-white"
                )} 
                onClick={() => { 
                    if (!isCriticalZone) {
                        setEntryModalOpen(true); 
                        setMobileMenuOpen(false); 
                    }
                }}
              >
                {isCriticalZone ? "Daily Loss Limit Reached" : "New Entry"}
              </Button>
            </div>
          </div>
        </>
      )}

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
        
        {/* --- SECTION 1: WELCOME & RISK METER --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border-slate-100 shadow-sm rounded-2xl md:rounded-3xl">
            <CardContent className="p-6">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03]"><Zap className="w-40 h-40" /></div>
                <div className="relative z-10">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Halo, {userProfile.name}</h2>
                  <p className="text-xs md:text-sm text-slate-500 mb-4 md:mb-6 max-w-md leading-relaxed">
                      Tetap disiplin pada setup XAUUSD kamu. Jangan biarkan emosi mengambil alih.
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">Risk Max 2%</Badge>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">RRR 1:2+</Badge>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">SMC / SnD</Badge>
                  </div>
                </div>
            </CardContent>
          </Card>

          {/* Dinamis: Menampilkan drawdown real-time harian */}
          <Card className={cn(
            "rounded-2xl md:rounded-3xl border shadow-sm transition-all duration-500", 
            isCriticalZone ? "bg-rose-100 border-rose-300" : isWarningZone ? "bg-orange-50 border-orange-100" : "bg-white border-slate-100"
          )}>
             <CardContent className="p-6 h-full flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <div className={cn("p-2 rounded-lg", isDangerZone ? "bg-rose-200" : "bg-emerald-50")}>
                            <AlertTriangle size={16} className={isDangerZone ? "text-rose-600" : "text-emerald-500"} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daily Limit</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <h3 className="text-2xl font-black text-slate-900">{drawdownPercent}%</h3>
                        <span className="text-xs font-medium text-slate-400">/ 6%</span>
                    </div>
                    <p className={cn("text-[10px] font-bold mt-1", isDangerZone ? "text-rose-600" : "text-emerald-600")}>
                        {isCriticalZone ? "STOP TRADING: LIMIT REACHED!" : isWarningZone ? "CAUTION: NEAR LIMIT" : "Safe Zone"}
                    </p>
                </div>
                <div className="w-full bg-slate-200/50 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div 
                        className={cn(
                            "h-full rounded-full transition-all duration-700", 
                            isCriticalZone ? "bg-rose-600" : isWarningZone ? "bg-orange-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${Math.min((drawdownPercent / 6) * 100, 100)}%` }}
                    />
                </div>
             </CardContent>
          </Card>
        </div>

        {/* --- SECTION 2: PERFORMANCE ANALYTICS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="lg:col-span-2 rounded-2xl md:rounded-3xl border-slate-100 shadow-sm flex flex-col">
            <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp size={16} className="text-indigo-600" /> Growth Curve
                    </h3>
                </div>
                <div className="flex-1 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                        <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={3} fill="url(#colorEquity)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <StatBox label="Win Rate" value={`${stats.winRate}%`} sub="Real-time Data" color={Number(stats.winRate) > 50 ? "text-emerald-600" : "text-rose-600"} bg={Number(stats.winRate) > 50 ? "bg-emerald-50" : "bg-rose-50"} icon={Target} />
            <StatBox label="Profit Factor" value={stats.profitFactor} sub="Sustainability Index" color="text-indigo-600" bg="bg-indigo-50" icon={Wallet} />
            <StatBox label="Total Trades" value={initialTrades.length} sub="Logs Recorded" color="text-violet-600" bg="bg-violet-50" icon={Activity} />
            <StatBox label="Today's P&L" value={`$${stats.todayPnL}`} sub="XAUUSD Session" color="text-slate-900" bg="bg-slate-50" icon={Zap} />
          </div>
        </div>

        {/* --- SECTION 3: JOURNAL TABLE --- */}
        <Card className="p-0 overflow-hidden rounded-2xl md:rounded-3xl border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-sm text-slate-900">Execution Log</h3>
            <Badge variant="outline" className="bg-white border-slate-200 text-slate-600 text-[10px]">{initialTrades.length} Logs</Badge>
          </div>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-slate-50/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider sticky top-0">
                <tr>
                  <th className="px-6 py-4">Time & Setup</th>
                  <th className="px-6 py-4">Asset & Direction</th>
                  <th className="px-6 py-4">Risk Management</th>
                  <th className="px-6 py-4 text-right">Actions / Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs md:text-sm">
                {initialTrades.map((trade: any) => (
                  <tr key={trade.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{trade.setup}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{new Date(trade.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border",
                                trade.type === 'BUY' ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-orange-50 border-orange-100 text-orange-600"
                           )}>
                                {trade.type === 'BUY' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                           </div>
                           <div><div className="font-bold text-slate-900">{trade.pair}</div><div className="text-[10px] font-bold uppercase">{trade.type}</div></div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-600 font-medium">{trade.lot} Lot</span>
                            <span className="text-[10px] text-slate-400">Risk: ${trade.risk}</span>
                        </div>
                    </td>
                    
                    {/* Fungsionalitas: Tombol aksi jika status OPEN */}
                    <td className="px-6 py-4 text-right">
                      {trade.status === "OPEN" ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            className="h-8 bg-emerald-500 hover:bg-emerald-600 text-[10px] font-bold rounded-lg shadow-lg shadow-emerald-200"
                            onClick={() => handleCloseTrade(trade.id, "WIN", trade.risk * 2)}
                          >
                            WIN (2R)
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-bold rounded-lg"
                            onClick={() => handleCloseTrade(trade.id, "LOSS", -trade.risk)}
                          >
                            LOSS
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                            <Badge variant="secondary" className={cn("text-[9px] font-black uppercase border px-2 py-0.5 mb-1",
                                trade.status === 'WIN' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                            )}>{trade.status === 'WIN' ? "TP HIT" : "SL HIT"}</Badge>
                            <span className={cn("font-black text-sm", trade.pnl > 0 ? "text-emerald-600" : "text-rose-600")}>
                                {trade.pnl > 0 ? '+' : ''}{trade.pnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                            </span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </main>

      {isEntryModalOpen && (
        <EntryModal onClose={() => setEntryModalOpen(false)} balance={userProfile.balance} />
      )}
    </div>
  );
}
