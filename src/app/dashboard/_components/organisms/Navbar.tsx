"use client";

import React from "react";
import { Activity, ShieldAlert, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  balance: number;
  isCritical: boolean;
  onOpenModal: () => void;
}

export function Navbar({ balance, isCritical, onOpenModal }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 md:px-10 h-20 flex items-center justify-between shadow-sm">
      {/* Brand Logo & Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-200 group cursor-pointer font-black">
          <Activity className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tight text-slate-900 leading-none underline decoration-indigo-500/30">
            Zionyx Terminal
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Professional Analyst Edition
          </span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {/* Status Protection Indicator */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-slate-100 bg-white/60 backdrop-blur-sm">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isCritical ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
          )} />
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Daily Limit</p>
            <p className={cn(
              "text-xs font-black font-mono tracking-tight mt-0.5",
              isCritical ? "text-rose-600" : "text-emerald-600"
            )}>
              {isCritical ? "LOCKED" : "ACTIVE"}
            </p>
          </div>
        </div>

        {/* Equity Display */}
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 font-mono">Total Capital</p>
          <p className="text-base font-black text-slate-900 font-mono tracking-tight">
            ${balance.toLocaleString()}
          </p>
        </div>

        {/* Action Button */}
        <Button 
          disabled={isCritical}
          onClick={onOpenModal} 
          className={cn(
            "h-12 px-6 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-xl shadow-slate-200",
            isCritical ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-slate-800"
          )}
        >
          {isCritical ? <ShieldAlert size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
          {isCritical ? "Limit Protection Active" : "Deploy Strategy"}
        </Button>
      </div>
    </nav>
  );
}
