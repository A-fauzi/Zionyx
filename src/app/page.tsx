"use client";

import React from "react";
import Link from "next/link";
import { 
  Activity, 
  ArrowRight, 
  Zap, 
  Target, 
  FileText,
  ShieldCheck,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- LOGO AREA: Institutional Branding --- */}
      <div className="mb-12 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-slate-200 group cursor-pointer transition-all hover:rotate-90">
          <Activity className="text-white w-10 h-10" />
        </div>
        <div className="text-center">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Zionyx Terminal</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Terminal Interface</p>
        </div>
      </div>

      {/* --- ACCESS GATEWAY CARD: Professional Focus --- */}
      <div className="w-full max-w-md bg-white border border-slate-100 p-10 rounded-[3rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] text-center space-y-8 animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60" />

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 mb-2">
             <ShieldCheck size={12} className="text-indigo-600" />
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Institutional Gateway</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Terminal Access</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed font-medium px-2">
          Verify market conditions and risk parameters. All executions must align with the established institutional framework for long-term capital preservation.
        </p>

        {/* --- STRATEGIC ACTIONS --- */}
        <div className="flex flex-col gap-4 pt-2 relative z-10">
          <Link href="/dashboard" className="w-full">
            <Button className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-base shadow-2xl shadow-slate-200 active:scale-95 transition-all flex justify-between px-8 group">
              Initialize Terminal <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>

          <Link href="/trading-plan" className="w-full">
            <Button variant="outline" className="w-full h-14 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-sm flex gap-3 active:scale-95 transition-all border-2">
              <FileText size={18} className="text-slate-400" /> Review Risk Protocol
            </Button>
          </Link>
        </div>

        {/* --- OPERATIONAL OBJECTIVES --- */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
          <div className="flex flex-col items-center gap-1.5">
            <Zap size={18} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Growth Forecast</span>
            <span className="text-sm font-black text-slate-800 font-mono">+20.00%</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Target size={18} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Primary Asset</span>
            <span className="text-sm font-black text-slate-800 font-mono">XAUUSD</span>
          </div>
        </div>
      </div>

      {/* --- SYSTEM FOOTER --- */}
      <footer className="mt-12 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200 opacity-60">
            <Lock size={12} className="text-slate-400" />
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Secure Session: 256-bit AES</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
          Discipline is the foundation of capital management
        </p>
      </footer>

    </div>
  );
}
