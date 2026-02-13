"use client";

import React from "react";
import { Activity, ShieldAlert, Clock, Zap, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTradingClock } from "../../_hooks/useTradingClock";

interface NavbarProps {
  balance: number;
  isCritical: boolean;
  onOpenModal: () => void;
}

export function Navbar({ balance, isCritical, onOpenModal }: NavbarProps) {
  const { timeString, status, isRestricted, countdown } = useTradingClock();

  // Tombol dikunci jika Limit Drawdown tercapai ATAU masuk Restricted Zone
  const isButtonDisabled = isCritical || isRestricted;

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 md:px-10 h-24 flex items-center justify-between shadow-sm">
      
      {/* 1. BRAND IDENTITY: Selalu Muncul di Semua Device */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 group cursor-pointer">
          <Activity className="text-white w-5 h-5 group-hover:rotate-12 transition-transform" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
            Zionyx Terminal
          </span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">
            Professional Analyst Edition
          </span>
        </div>
      </div>

      {/* 2. CENTER: TIME & PROTOCOL STATUS - Hanya muncul di layar besar (Desktop) */}
      <div className="hidden lg:flex items-center gap-8 border-x border-slate-100 px-10 h-full">
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
                <Clock size={12} className="text-indigo-500" />
                <span 
                  className="text-sm font-black font-mono text-slate-900 italic"
                  suppressHydrationWarning
                >
                  {timeString}
                </span>
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">WIB Terminal Time</span>
        </div>

        <div className="flex flex-col items-center min-w-[140px]">
            <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full border mb-1 transition-all",
                isRestricted ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
            )}>
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isRestricted ? "bg-rose-500" : "bg-emerald-500")} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{status}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
                <Timer size={10} />
                <span 
                  className="text-[9px] font-bold font-mono uppercase italic"
                  suppressHydrationWarning
                >
                  {countdown}
                </span>
            </div>
        </div>
      </div>

      {/* 3. RIGHT: ACCOUNT & ACTION - Disembunyikan di Mobile (md:hidden diganti md:flex) */}
      <div className="hidden md:flex items-center gap-8">
        <div className="text-right hidden lg:block">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Net Liquidity</p>
          <p className="text-lg font-black text-slate-900 font-mono tracking-tighter italic">
            ${balance.toLocaleString()}
          </p>
        </div>

        <Button 
          disabled={isButtonDisabled}
          onClick={onOpenModal} 
          className={cn(
            "h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-2xl",
            isButtonDisabled 
              ? "bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed shadow-none" 
              : "bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-100"
          )}
        >
          {isRestricted ? (
             <div className="flex items-center gap-2">
                <ShieldAlert size={16} />
                <span>Restricted</span>
             </div>
          ) : isCritical ? (
             <div className="flex items-center gap-2 text-rose-500">
                <ShieldAlert size={16} />
                <span>Lockdown Active</span>
             </div>
          ) : (
            <div className="flex items-center gap-2">
               <Zap size={16} className="fill-current" />
               <span>Deploy Strategy</span>
            </div>
          )}
        </Button>
      </div>
    </nav>
  );
}
