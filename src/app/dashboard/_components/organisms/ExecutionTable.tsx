"use client";

import React from "react";
import { BarChart3, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
    <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden bg-white">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 rounded-[1.25rem] flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Execution Audit</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Verified Zionyx Protocol Record</p>
          </div>
        </div>
        <Badge variant="secondary" className="px-4 py-1.5 bg-slate-900 text-white font-black text-[10px] rounded-full border-0 shadow-lg shadow-slate-200">
          {trades.length} POSITIONS LOGGED
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
            {trades.map((trade) => {
              const rMultiple = trade.status !== "OPEN" ? (trade.pnl / trade.risk).toFixed(1) : "-";
              const riskPercent = ((trade.risk / balance) * 100).toFixed(1);

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
                        "w-9 h-9 rounded-xl flex items-center justify-center border-2 shrink-0 shadow-sm transition-all group-hover:scale-110",
                        trade.type === 'BUY' ? "bg-white border-indigo-100 text-indigo-600" : "bg-white border-orange-100 text-orange-600"
                      )}>
                        {trade.type === 'BUY' ? <ArrowUpRight size={16} strokeWidth={3} /> : <ArrowDownRight size={16} strokeWidth={3} />}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none mb-1 font-mono">{trade.pair}</p>
                        <span className={cn("text-[9px] font-black uppercase tracking-widest", trade.type === 'BUY' ? "text-indigo-500" : "text-orange-500")}>
                          {trade.type}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter">
                        <span className="text-slate-900 font-mono">{trade.lot} LOTS</span>
                        <span className="text-slate-200">/</span>
                        <span className="text-slate-500">${trade.risk} RISK</span>
                      </div>
                      <div className="w-28 h-1 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div className={cn("h-full rounded-full", Number(riskPercent) > 2 ? "bg-rose-500" : "bg-indigo-600")} style={{width: `${Math.min(Number(riskPercent) * 20, 100)}%`}} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    {trade.status === "OPEN" ? (
                      <div className="flex gap-2.5">
                        <button className="h-8 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg shadow-lg shadow-emerald-100 transition-all active:scale-95 uppercase tracking-widest" onClick={() => onCloseTrade(trade.id, "WIN", trade.risk * 2)}>Win (2R)</button>
                        <button className="h-8 px-5 border-2 border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] font-black rounded-lg transition-all active:scale-95 uppercase tracking-widest" onClick={() => onCloseTrade(trade.id, "LOSS", -trade.risk)}>Loss</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={cn("text-[9px] font-black uppercase px-2.5 py-1 rounded-md border-2", trade.status === 'WIN' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100")}>
                          {trade.status === 'WIN' ? "Target Hit" : "Invalid Setup"}
                        </Badge>
                        <span className="text-[10px] font-black text-slate-400 font-mono">{rMultiple}R</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right font-black font-mono tracking-tighter">
                    <span className={cn(
                      "text-base",
                      trade.status === 'OPEN' ? "text-slate-300 italic animate-pulse" : trade.pnl > 0 ? "text-emerald-600" : "text-rose-600"
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
  );
}
