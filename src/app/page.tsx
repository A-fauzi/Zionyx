"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, Activity, Lock, Terminal, 
  ShieldCheck, BarChart3, TrendingUp, Zap
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden flex flex-col">
      
      {/* --- BACKGROUND SUBTLE GRID --- */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-60"></div>
      
      {/* --- HEADER --- */}
      <nav className="w-full max-w-5xl mx-auto px-6 h-20 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <Terminal className="text-white w-4 h-4" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">ZenTrade<span className="text-indigo-600">.</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
           <StatusBadge icon={<Activity size={12} />} label="Market: NY Session" color="text-emerald-600" bg="bg-emerald-50" />
           <StatusBadge icon={<ShieldCheck size={12} />} label="System: Active" color="text-indigo-600" bg="bg-indigo-50" />
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center max-w-5xl mx-auto px-6 gap-10 md:gap-20 z-10 pb-10">
        
        {/* LEFT: TEXT --- */}
        <div className="flex-1 space-y-6 text-center md:text-left pt-8 md:pt-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 mb-4 shadow-sm">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               V2.0 System Ready
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.2] mb-4">
              Disiplin adalah <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Jembatan Profit.
              </span>
            </h1>
            
            <p className="text-sm text-slate-500 max-w-md mx-auto md:mx-0 leading-relaxed font-medium">
              Sistem trading terintegrasi untuk Zi. Kelola risiko otomatis, jurnal setup SMC/SnD, dan jaga psikologi tetap stabil.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
               <button className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                 Launch Dashboard <ArrowRight size={16} />
               </button>
            </Link>
            
            <button className="px-6 py-3 rounded-xl font-bold text-sm text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all flex items-center justify-center gap-2">
               <Lock size={14} /> View Rules
            </button>
          </motion.div>

          <div className="pt-6 border-t border-slate-200/60 grid grid-cols-3 gap-4 md:w-fit">
             <StatMini value="1-2%" label="Max Risk" />
             <StatMini value="1:2" label="Min RRR" />
             <StatMini value="68%" label="Win Rate" />
          </div>
        </div>

        {/* RIGHT: VISUAL PREVIEW --- */}
        <div className="flex-1 w-full max-w-sm relative hidden md:block">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="relative z-10"
           >
              {/* Card Container */}
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-xl shadow-slate-200/50">
                 {/* Header Card */}
                 <div className="flex justify-between items-start mb-6">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Equity</p>
                       <h3 className="text-2xl font-black text-slate-900">$1,240.50</h3>
                    </div>
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                       <TrendingUp className="text-indigo-600 w-4 h-4" />
                    </div>
                 </div>
                 
                 {/* Visual Chart Bars */}
                 <div className="h-20 flex items-end gap-2 mb-6 px-1">
                    {[30, 50, 45, 70, 60, 85, 95].map((h, i) => (
                       <div key={i} className="flex-1 bg-slate-100 rounded-md relative overflow-hidden" style={{ height: `${h}%` }}>
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: "100%" }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="absolute bottom-0 w-full bg-indigo-500 opacity-80" 
                          />
                       </div>
                    ))}
                 </div>

                 {/* Stats Row */}
                 <div className="flex gap-3">
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <div className="flex items-center gap-1.5 mb-1">
                          <Zap size={10} className="text-indigo-600" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Today</p>
                       </div>
                       <p className="text-sm font-black text-slate-900">+$120.00</p>
                    </div>
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <div className="flex items-center gap-1.5 mb-1">
                          <BarChart3 size={10} className="text-emerald-600" />
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Win Rate</p>
                       </div>
                       <p className="text-sm font-black text-slate-900">65%</p>
                    </div>
                 </div>
              </div>

              {/* Decorative Blur */}
              <div className="absolute top-10 -right-5 w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 rounded-[2rem] -z-10 opacity-10 blur-2xl transform rotate-6" />
           </motion.div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full py-6 text-center">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           © 2026 Zi Trading Systems
         </p>
      </footer>

    </div>
  );
}

// --- COMPONENTS ---

function StatusBadge({ icon, label, color, bg }: any) {
   return (
      <div className={cn("flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-transparent transition-all hover:border-slate-200", bg)}>
         <div className={color}>{icon}</div>
         <span className={cn("text-[10px] font-bold uppercase tracking-wide", color)}>{label}</span>
      </div>
   )
}

function StatMini({ value, label }: { value: string, label: string }) {
  return (
    <div>
      <p className="text-lg font-black text-slate-900">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
    </div>
  )
}
