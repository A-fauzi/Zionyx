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
            <h3 className="text-[13px] font-semibold text-rose-900 mb-1.5 tracking-tight">
              Zionyx Protocol: Lockdown Active
            </h3>
            <p className="text-[12px] text-slate-500 font-normal leading-relaxed max-w-2xl">
              Your daily drawdown has reached{" "}
              <span className="font-semibold text-rose-600">{drawdown}%</span>.
              Per Trading Protocol V3.0, all new executions are frozen to protect your capital. Step away — the market opens again tomorrow.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 md:text-right shrink-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl font-semibold text-[10px] uppercase tracking-widest shadow-lg shadow-rose-200">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            System Locked
          </div>
          <p className="text-[10px] font-medium text-slate-400 tracking-wide">
            Automated Risk Defense
          </p>
        </div>
      </div>
    </div>
  );
}
