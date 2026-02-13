"use client";

import React from "react";
import { 
  BarChart3, Clock, ArrowUpRight, ArrowDownRight, 
  Microscope, BrainCircuit, Target, ShieldCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExecutionTableProps {
  trades: any[];
  onCloseTrade: (id: string, status: "WIN" | "LOSS", pnl: number) => void;
  balance: number;
}

export function ExecutionTable({ trades, onCloseTrade, balance }: ExecutionTableProps) {
  return (
    <div className="space-y-4">
      {/* HEADER: Professional Audit Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <BarChart3 size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Execution Audit</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">Verified Zionyx Protocol Log</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Records:</span>
          <span className="text-sm font-black text-slate-900 font-mono">{trades.length}</span>
        </div>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/60 overflow-hidden bg-white">
        {/* DESKTOP VIEW: Clean Institutional Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Timestamp & Strategy</th>
                <th className="px-6 py-6">Asset</th>
                <th className="px-6 py-6 text-center">Audit Layer</th>
                <th className="px-6 py-6">Risk Protocol</th>
                <th className="px-6 py-6">Execution</th>
                <th className="px-8 py-6 text-right">Result (PnL)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium">
              {trades.map((trade) => {
                const rMultiple = trade.status !== "OPEN" ? (trade.pnl / trade.risk).toFixed(1) : "-";
                const riskPercent = ((trade.risk / balance) * 100).toFixed(1);

                return (
                  <tr key={trade.id} className="hover:bg-slate-50/30 transition-all duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors shrink-0">
                          <Clock size={14} className="shrink-0" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-slate-900 uppercase text-xs tracking-tight truncate">{trade.setup}</p>
                          <p className="text-[10px] font-bold text-slate-400 font-mono">
                            {new Date(trade.createdAt).toLocaleDateString([], {day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border-2 shadow-sm transition-transform group-hover:scale-105 shrink-0",
                          trade.type === 'BUY' ? "bg-white border-indigo-100 text-indigo-600" : "bg-white border-orange-100 text-orange-600"
                        )}>
                          {trade.type === 'BUY' ? <ArrowUpRight size={18} strokeWidth={3} className="shrink-0" /> : <ArrowDownRight size={18} strokeWidth={3} className="shrink-0" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 font-mono text-sm leading-none mb-1">{trade.pair}</p>
                          <Badge variant="outline" className={cn(
                            "text-[8px] font-black uppercase py-0 px-1.5 border-none",
                            trade.type === 'BUY' ? "bg-indigo-50 text-indigo-600" : "bg-orange-50 text-orange-600"
                          )}>
                            {trade.type}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className={cn(
                          "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm shrink-0",
                          trade.psychology === 'FOCUSED' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                          trade.psychology === 'FOMO' ? "bg-rose-50 text-rose-600 border-rose-100 animate-pulse" : 
                          "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {trade.psychology || 'FOCUSED'}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 max-w-[150px] w-full justify-center">
                          <Microscope size={10} className="shrink-0" />
                          <span className="text-[10px] font-bold uppercase tracking-tighter truncate" title={trade.reason}>
                            {trade.reason || 'SOP ALIGNED'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1.5 min-w-[100px]">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-slate-900 font-mono">{trade.lot} LOTS</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{riskPercent}% Risk</span>
                        </div>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-500", Number(riskPercent) > 2 ? "bg-rose-500" : "bg-indigo-500")} style={{width: `${Math.min(Number(riskPercent) * 20, 100)}%`}} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {trade.status === "OPEN" ? (
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => onCloseTrade(trade.id, "WIN", trade.risk * 2)} className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95 uppercase tracking-widest">WIN</button>
                          <button onClick={() => onCloseTrade(trade.id, "LOSS", -trade.risk)} className="h-8 px-4 border border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] font-black rounded-xl transition-all active:scale-95 uppercase tracking-widest">LOSS</button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Badge className={cn("text-[9px] font-black uppercase px-3 py-1 rounded-lg border-2 shrink-0", trade.status === 'WIN' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100")}>
                            {trade.status === 'WIN' ? "TARGET HIT" : "STOP LOSS"}
                          </Badge>
                          <span className="text-[10px] font-black text-slate-400 font-mono">{rMultiple}R</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={cn(
                        "text-lg font-black font-mono tracking-tighter transition-all",
                        trade.status === 'OPEN' ? "text-slate-300 animate-pulse italic" : trade.pnl > 0 ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {trade.status === 'OPEN' ? "PENDING" : `${trade.pnl > 0 ? "+" : ""}$${trade.pnl.toLocaleString()}`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW: Stacked Cards for Better UX */}
        <div className="lg:hidden divide-y divide-slate-100">
          {trades.map((trade) => (
            <div key={trade.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0",
                    trade.type === 'BUY' ? "bg-white border-indigo-100 text-indigo-600" : "bg-white border-orange-100 text-orange-600"
                  )}>
                    {trade.type === 'BUY' ? <ArrowUpRight size={18} strokeWidth={3} className="shrink-0" /> : <ArrowDownRight size={18} strokeWidth={3} className="shrink-0" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-slate-900 font-mono text-base tracking-tight leading-none uppercase truncate">{trade.pair}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{trade.setup}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn(
                    "text-lg font-black font-mono tracking-tighter",
                    trade.status === 'OPEN' ? "text-slate-300 animate-pulse" : trade.pnl > 0 ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {trade.status === 'OPEN' ? "---" : `${trade.pnl > 0 ? "+" : ""}$${trade.pnl.toLocaleString()}`}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    {new Date(trade.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-slate-50 gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <BrainCircuit size={12} className="text-slate-300 shrink-0" />
                  <span className={cn(
                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-md border shrink-0",
                    trade.psychology === 'FOCUSED' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                  )}>
                    {trade.psychology || 'FOCUSED'}
                  </span>
                  {/* Truncated reason for mobile */}
                  <span className="text-[9px] font-bold text-slate-400 uppercase truncate max-w-[80px]">
                    {trade.reason}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-900 font-mono shrink-0">
                  <span>{trade.lot}L</span>
                  <span className="text-slate-200">|</span>
                  <span className="text-slate-400">${trade.risk}</span>
                </div>
              </div>

              {trade.status === "OPEN" ? (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button onClick={() => onCloseTrade(trade.id, "WIN", trade.risk * 2)} className="h-12 bg-emerald-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-50 active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                    <Target size={14} className="shrink-0" /> WIN (2R)
                  </button>
                  <button onClick={() => onCloseTrade(trade.id, "LOSS", -trade.risk)} className="h-12 border border-slate-200 text-slate-500 text-xs font-black rounded-2xl active:scale-95 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                     LOSS (-1R)
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2 gap-4">
                  <div className="flex items-center gap-1.5 text-slate-400 min-w-0">
                    <Microscope size={12} className="shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-tight truncate">{trade.reason || 'SOP COMPLIANT'}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[9px] font-black uppercase rounded-lg px-3 py-1 shrink-0", trade.status === 'WIN' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100")}>
                    {trade.status === 'WIN' ? "TARGET HIT" : "STOP LOSS"}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
      
      {/* FOOTER: Automated Compliance Note */}
      <div className="flex items-center justify-center gap-2 py-4">
        <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Grade Audit Protection Active</span>
      </div>
    </div>
  );
}
