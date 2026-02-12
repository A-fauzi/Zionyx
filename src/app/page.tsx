"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, Activity, Lock, Terminal, 
  ShieldCheck, BarChart3, TrendingUp, Zap,
  BrainCircuit, Target, BookOpen, Quote
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
      <nav className="w-full max-w-6xl mx-auto px-6 h-20 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
             <Terminal className="text-white w-4 h-4" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">PersonalTrade<span className="text-indigo-600">.</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-3">
           <StatusBadge icon={<Activity size={12} />} label="Market: NY Session" color="text-emerald-600" bg="bg-emerald-50" />
           <StatusBadge icon={<ShieldCheck size={12} />} label="System: Active" color="text-indigo-600" bg="bg-indigo-50" />
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto px-6 z-10 py-12 md:py-20">
        
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 w-full">
            
            {/* LEFT: TEXT CONTENT */}
            <div className="flex-1 space-y-8 text-center md:text-left">
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-500 mb-6 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        V2.0 System Ready
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                    Discipline is <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                        The Bridge to Profit.
                    </span>
                    </h1>
                    
                    <p className="text-base text-slate-500 max-w-md mx-auto md:mx-0 leading-relaxed font-medium">
                    An integrated trading platform exclusively for Zi. Combining automated Risk Management, SMC/SnD Journal, and Trading Psychology in one dashboard.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
                >
                    <Link href="/dashboard" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200">
                            Launch Dashboard <ArrowRight size={16} />
                        </button>
                    </Link>
                    
                    <Link 
  href="/trading-plan" 
  className="px-8 py-4 rounded-2xl font-bold text-sm text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition-all flex items-center justify-center gap-2"
>
  <BookOpen size={16} /> Read Trading Plan
</Link>

                    
                </motion.div>

                <div className="pt-8 border-t border-slate-200/60 grid grid-cols-3 gap-8 md:w-fit mx-auto md:mx-0">
                    <StatMini value="1-2%" label="Max Risk" />
                    <StatMini value="1:2" label="Min RRR" />
                    <StatMini value="64%" label="Win Rate" />
                </div>
            </div>

            {/* RIGHT: VISUAL PREVIEW (Glass Card) */}
            <div className="flex-1 w-full max-w-md relative hidden md:block">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
                    className="relative z-10"
                >
                    {/* Card Container */}
                    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-2xl shadow-indigo-200/40 transform hover:-translate-y-2 transition-transform duration-500">
                        {/* Header Card */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Equity</p>
                                <h3 className="text-3xl font-black text-slate-900">$1,240.50</h3>
                            </div>
                            <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Zap className="text-white w-5 h-5" />
                            </div>
                        </div>
                        
                        {/* Visual Chart Bars */}
                        <div className="h-32 flex items-end gap-3 mb-8 px-2">
                            {[35, 55, 45, 75, 60, 90, 100].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-100 rounded-lg relative overflow-hidden group" style={{ height: `${h}%` }}>
                                    <motion.div 
                                        initial={{ height: 0 }}
                                        animate={{ height: "100%" }}
                                        transition={{ duration: 1, delay: i * 0.1 }}
                                        className="absolute bottom-0 w-full bg-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity" 
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Stats Row */}
                        <div className="flex gap-4">
                            <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <TrendingUp size={12} className="text-emerald-600" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">PnL Today</p>
                                </div>
                                <p className="text-lg font-black text-slate-900">+$120.00</p>
                            </div>
                            <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <BarChart3 size={12} className="text-indigo-600" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Win Rate</p>
                                </div>
                                <p className="text-lg font-black text-slate-900">65%</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Blob */}
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-[80px] -z-10 opacity-20" />
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full blur-[80px] -z-10 opacity-20" />
                </motion.div>
            </div>
        </div>

        {/* --- FEATURES GRID (NEW SECTION) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
            <FeatureCard 
                icon={<ShieldCheck className="text-indigo-600" />}
                title="Risk Guardian"
                desc="Automatic lot calculator limits maximum loss to 2% per trade. Anti margin call."
            />
            <FeatureCard 
                icon={<BrainCircuit className="text-emerald-600" />}
                title="SMC Logic"
                desc="Focus on Smart Money Concept setups: Liquidity Sweep, BOS, and Inducement."
            />
            <FeatureCard 
                icon={<Activity className="text-orange-600" />}
                title="Psychology First"
                desc="Mandatory pre-trading checklist to prevent FOMO and Revenge Trading."
            />
        </div>
        
        {/* --- WISDOM SECTION --- */}
        <div className="w-full max-w-3xl mt-24 text-center relative">
            {/* Decorative Quotes Background */}
            <div className="absolute top-0 left-0 -mt-10 -ml-10 text-slate-100 opacity-50 transform -scale-x-100">
                <Quote size={120} className="fill-current" />
            </div>

            <div className="relative z-10 space-y-8">
                <h2 className="text-2xl md:text-4xl font-serif font-medium text-slate-700 leading-relaxed italic">
                    "If you can learn to create a state of mind that is not affected by the market's behavior, the struggle will cease to exist."
                </h2>
                
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4" />
                    <p className="font-black text-slate-900 uppercase tracking-widest text-sm">Mark Douglas</p>
                    <p className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                        Author, Trading in the Zone
                    </p>
                </div>
            </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full py-8 text-center border-t border-slate-100 mt-10">
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
           Built for Professional Consistency
         </p>
         <p className="text-xs text-slate-300">
           © 2026 Zi Trading Systems. All Rights Reserved.
         </p>
      </footer>

    </div>
  );
}

// --- SUB COMPONENTS ---

function StatusBadge({ icon, label, color, bg }: any) {
   return (
      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent transition-all hover:border-slate-200", bg)}>
         <div className={color}>{icon}</div>
         <span className={cn("text-[10px] font-bold uppercase tracking-wide", color)}>{label}</span>
      </div>
   )
}

function StatMini({ value, label }: { value: string, label: string }) {
  return (
    <div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-slate-100 transition-colors">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {desc}
            </p>
        </div>
    )
}
