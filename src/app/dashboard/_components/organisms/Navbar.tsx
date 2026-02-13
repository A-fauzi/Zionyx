"use client";

import React from "react";
import { Activity, ShieldAlert, Clock, Zap, Timer, Wallet, AlertTriangle } from "lucide-react";
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
    <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-2xl border-b border-slate-100 shadow-sm">
      {/* DESKTOP & TABLET LAYOUT */}
      <div className="hidden md:block">
        <div className="px-6 lg:px-10 py-4">
          {/* TOP ROW: Brand + Session Status */}
          <div className="flex items-center justify-between mb-4">
            {/* BRAND IDENTITY */}
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

            {/* SESSION PROTOCOL - Clean horizontal layout */}
            <div className="flex items-center gap-6">
              {/* Time */}
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

              <div className="h-3 w-px bg-slate-100" />

              {/* Status */}
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

              {/* Countdown */}
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

          {/* BOTTOM ROW: Balance + Action Button */}
          <div className="flex items-center justify-between">
            {/* Net Liquidity */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Wallet size={10} className="text-slate-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  Net Liquidity
                </span>
              </div>
              <span className="text-lg font-black text-slate-900 font-mono tracking-tighter leading-none">
                ${balance.toLocaleString()}
              </span>
            </div>

            {/* Deploy Button */}
            <Button 
              disabled={isButtonDisabled}
              onClick={onOpenModal} 
              className={cn(
                "h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2",
                isButtonDisabled 
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
        </div>

        {/* RESTRICTED WARNING BANNER - hanya muncul saat restricted */}
        {isRestricted && (
          <div className="px-6 lg:px-10 pb-3">
            <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl">
              <p className="text-[8px] font-bold text-rose-600 leading-tight uppercase text-center">
                Restricted: 03:00 - 08:00 WIB. High Spread & Low Liquidity. Protect your capital.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE LAYOUT - Minimal brand only */}
      <div className="md:hidden px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg shadow-slate-200">
            <Activity className="text-white w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-tight text-slate-900 leading-none">
              Zionyx Terminal
            </span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] mt-0.5 italic">
              Professional Analyst Edition
            </span>
          </div>
        </div>

        {/* Mobile session indicator */}
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            isRestricted ? "bg-rose-500" : "bg-emerald-500"
          )} />
          <span className={cn(
            "text-[9px] font-black uppercase tracking-tighter",
            isRestricted ? "text-rose-600" : "text-emerald-600"
          )}>
            {isRestricted ? "RESTRICTED" : status}
          </span>
        </div>
      </div>
    </nav>
  );
}

