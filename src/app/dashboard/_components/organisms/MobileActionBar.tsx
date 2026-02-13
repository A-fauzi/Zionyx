"use client";

import React from "react";
import { Wallet, Plus, ShieldAlert, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileActionBarProps {
  balance: number;
  todayPnL: string | number;
  isCritical: boolean;
  onOpenModal: () => void;
}

export function MobileActionBar({ balance, todayPnL, isCritical, onOpenModal }: MobileActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden px-4 pb-6 pt-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between gap-4">
        {/* Balance Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Wallet size={10} className="text-slate-400" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Net Liquidity</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900 font-mono tracking-tighter">
                ${balance.toLocaleString()}
            </span>
            <span className={cn(
                "text-[10px] font-bold font-mono",
                Number(todayPnL) >= 0 ? "text-emerald-500" : "text-rose-500"
            )}>
                {Number(todayPnL) >= 0 ? "+" : ""}${todayPnL}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          disabled={isCritical}
          onClick={onOpenModal} 
          className={cn(
            "flex-1 h-14 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2",
            isCritical 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                : "bg-slate-900 text-white shadow-slate-200"
          )}
        >
          {isCritical ? <ShieldAlert size={18} /> : <Plus size={18} />}
          <span>{isCritical ? "Locked" : "Deploy Strategy"}</span>
        </Button>
      </div>
    </div>
  );
}
