"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";

interface RiskLockdownProps {
  drawdown: string | number;
}

export function RiskLockdown({ drawdown }: RiskLockdownProps) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl border border-rose-100 bg-white group">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 opacity-70" />
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-all duration-700" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 bg-rose-500 rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-xl shadow-rose-100 animate-pulse">
            <ShieldAlert className="text-white" size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-rose-900 mb-2 uppercase tracking-tight">
                Zionyx Protocol: Lockdown Active
            </h3>
            <p className="text-slate-600 font-medium leading-relaxed max-w-2xl">
              Batas drawdown harian lo sudah mencapai <span className="font-black text-rose-600">{drawdown}%</span>. 
              Sesuai **Trading Protocol V3.0**, semua eksekusi baru dibekukan untuk melindungi modal lo. Tarik napas, *market* besok masih buka.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 md:text-right shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-200">
            <div className="w-2 h-2 bg-white rounded-full animate-ping" />
            System Locked
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Automated Risk Defense</p>
        </div>
      </div>
    </div>
  );
}
