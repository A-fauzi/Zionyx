"use client";

import React from "react";
import { Wallet, ShieldAlert, Timer, Clock, Zap, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTradingClock } from "../../_hooks/useTradingClock";

interface MobileActionBarProps {
  balance: number;
  todayPnL: string | number;
  isCritical: boolean;
  onOpenModal: () => void;
}

export function MobileActionBar({ balance, todayPnL, isCritical, onOpenModal }: MobileActionBarProps) {
  const { timeString, isRestricted, status, countdown } = useTradingClock();

  // Tombol dikunci jika Limit Drawdown tercapai ATAU masuk Restricted Zone
  const isDeployLocked = isCritical || isRestricted;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden px-4 pb-6 pt-4 bg-white/90 backdrop-blur-2xl border-t border-slate-100 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.1)]">
      
      {/* --- TOP LAYER: CLOCK & SESSION PROTOCOL --- */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
            <Clock size={12} className="text-slate-400" />
            <span 
              className="text-[11px] font-black font-mono text-slate-900 tracking-tighter"
              suppressHydrationWarning
            >
              {timeString}
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">WIB</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
                <div className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    isRestricted ? "bg-rose-500" : "bg-emerald-500"
                )} />
                <span className={cn(
                    "text-[9px] font-black uppercase tracking-tighter",
                    isRestricted ? "text-rose-600" : "text-emerald-600"
                )}>
                    {status}
                </span>
            </div>
            <div className="h-3 w-px bg-slate-100" />
            <div className="flex items-center gap-1">
                <Timer size={10} className="text-indigo-500" />
                <span 
                  className="text-[9px] font-bold font-mono text-indigo-600 uppercase"
                  suppressHydrationWarning
                >
                    {countdown}
                </span>
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Balance Info */}
        <div className="flex flex-col min-w-[100px]">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Wallet size={10} className="text-slate-400" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Net Liquidity</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900 font-mono tracking-tighter leading-none">
                ${balance.toLocaleString()}
            </span>
          </div>
          <span className={cn(
                "text-[10px] font-bold font-mono mt-1",
                Number(todayPnL) >= 0 ? "text-emerald-500" : "text-rose-500"
            )}>
                {Number(todayPnL) >= 0 ? "+" : ""}${todayPnL}
          </span>
        </div>

        {/* Action Button: Dual Protection Logic */}
        <Button 
          disabled={isDeployLocked}
          onClick={onOpenModal} 
          className={cn(
            "flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2",
            isDeployLocked 
                ? "bg-slate-50 text-slate-300 border border-slate-100 shadow-none cursor-not-allowed" 
                : "bg-slate-900 text-white shadow-indigo-100 hover:bg-indigo-600"
          )}
        >
          {isRestricted ? (
            <>
                <AlertTriangle size={16} className="text-rose-400" />
                <span className="text-rose-400">Spread Warning</span>
            </>
          ) : isCritical ? (
            <>
                <ShieldAlert size={16} className="text-rose-400" />
                <span className="text-rose-400">Lockdown</span>
            </>
          ) : (
            <>
                <Zap size={16} className="fill-current" />
                <span>Deploy Strategy</span>
            </>
          )}
        </Button>
      </div>
      
      {/* Disclaimer Section */}
      {isRestricted && (
          <div className="mt-3 px-3 py-2 bg-rose-50 border border-rose-100 rounded-xl">
              <p className="text-[8px] font-bold text-rose-600 leading-tight uppercase text-center">
                  Restricted: 03:00 - 08:00 WIB. High Spread & Low Liquidity. Protect your capital.
              </p>
          </div>
      )}
    </div>
  );
}
