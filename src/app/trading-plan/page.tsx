"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, ShieldAlert, Target, BrainCircuit, 
  Clock, BookOpen, CheckCircle2, ChevronRight,
  Zap, Hash, AlertTriangle, LayoutDashboard, ShieldCheck, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const SECTIONS = [
  { id: "mindset", label: "01. Mindset", icon: BrainCircuit },
  { id: "risk", label: "02. Risk Rules", icon: ShieldAlert },
  { id: "strategy", label: "03. Strategy", icon: Target },
  { id: "routine", label: "04. Routine", icon: Clock },
];

export default function TradingPlanPage() {
  const [activeSection, setActiveSection] = useState("mindset");

  useEffect(() => {
    const handleScroll = () => {
      const sections = SECTIONS.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 100;

      sections.forEach(section => {
        if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- TOP NAVIGATION: Institutional Style --- */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 md:px-10 h-20 flex items-center justify-between">
        <div className="flex items-center gap-6">
            <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-100 text-slate-500 transition-all active:scale-95">
                    <ArrowLeft size={20} />
                </Button>
            </Link>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-indigo-600" />
                    <span className="font-black text-sm text-slate-900 tracking-tight uppercase">Zionyx Protocol V1.2</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest mt-0.5 uppercase">Standard Operating Procedure</span>
            </div>
        </div>
        <Link href="/dashboard">
            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-black rounded-xl h-10 px-5 shadow-lg shadow-slate-200">
                Return to Terminal
            </Button>
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-10 pt-16 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* --- LEFT: STICKY SIDEBAR --- */}
            <div className="hidden lg:block lg:col-span-3">
                <div className="sticky top-32 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-4">Navigation</p>
                    {SECTIONS.map((item) => (
                        <a 
                            key={item.id} 
                            href={`#${item.id}`}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-[1.25rem] text-sm font-black transition-all duration-300 group relative overflow-hidden",
                                activeSection === item.id 
                                    ? "bg-white text-indigo-700 shadow-xl shadow-slate-200/50" 
                                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                            )}
                        >
                            <item.icon size={18} className={cn("transition-colors", activeSection === item.id ? "text-indigo-600" : "text-slate-300 group-hover:text-slate-500")} />
                            {item.label}
                            {activeSection === item.id && (
                                <motion.div layoutId="active-nav" className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-full" />
                            )}
                        </a>
                    ))}
                </div>
            </div>

            {/* --- RIGHT: CONTENT --- */}
            <div className="lg:col-span-9 space-y-24">
                
                {/* HERO HEADER */}
                <header className="space-y-6 max-w-3xl">
                    <Badge variant="secondary" className="px-4 py-1.5 bg-indigo-50 text-indigo-700 border-0 font-black text-[10px] uppercase tracking-widest rounded-full">
                        Institutional Governance
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                        Strategic Operating Framework.
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium">
                        Dokumen ini mengatur setiap parameter eksekusi. Sebagai <span className="text-slate-900 font-bold italic">Self-Made Founder</span>, Zi memahami bahwa sistem yang kaku adalah fondasi bagi kebebasan finansial.
                    </p>
                </header>

                {/* 1. MINDSET SECTION */}
                <section id="mindset" className="scroll-mt-32">
                    <SectionHeader title="01. Psychological Anchoring" subtitle="Foundational Mindset" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <MindsetCard 
                            title="Probability Engine" 
                            desc="Kita tidak meramal. Kita membangun sistem berbasis edge statistik yang berulang di market."
                            idx={1}
                        />
                        <MindsetCard 
                            title="The Cost of Growth" 
                            desc="Loss adalah biaya operasional. Selama risk management terjaga, loss hanyalah data untuk optimasi."
                            idx={2}
                        />
                        <MindsetCard 
                            title="Capital Preservation" 
                            desc="Melindungi modal adalah tugas utama. Profit adalah reward atas kedisiplinan menjaga modal tersebut."
                            idx={3}
                        />
                        <MindsetCard 
                            title="Founder Discretion" 
                            desc="Trading yang baik adalah membosankan. Jika emosi naik, berarti risk terlalu besar atau plan dilanggar."
                            idx={4}
                        />
                    </div>
                </section>

                {/* 2. RISK MANAGEMENT SECTION */}
                <section id="risk" className="scroll-mt-32">
                    <SectionHeader title="02. The Iron Protocols" subtitle="Capital Protection Rules" />
                    
                    <div className="mt-8 bg-slate-950 text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-slate-300">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600 rounded-full blur-[120px] opacity-10 -mr-40 -mt-40" />
                        
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Max Risk / Exposure</p>
                                <p className="text-5xl font-black text-white tracking-tighter font-mono">1.0%</p>
                                <p className="text-xs text-indigo-400 font-bold uppercase tracking-tight italic">Non-Negotiable</p>
                            </div>
                            <div className="space-y-2 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Daily Drawdown Cap</p>
                                <p className="text-5xl font-black text-rose-500 tracking-tighter font-mono">6.0%</p>
                                <p className="text-xs text-rose-400 font-bold uppercase tracking-tight uppercase">System Lockdown</p>
                            </div>
                            <div className="space-y-2 border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Target Efficiency</p>
                                <p className="text-5xl font-black text-emerald-500 tracking-tighter font-mono">1:2</p>
                                <p className="text-xs text-emerald-400 font-bold uppercase tracking-tight uppercase">Minimum RR</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. UPDATED STRATEGY SECTION: DYNAMIC SOP SYNC */}
                <section id="strategy" className="scroll-mt-32">
                    <SectionHeader title="03. Execution Architecture" subtitle="Dynamic Strategy Models" />
                    
                    <div className="grid grid-cols-1 gap-8 mt-10">
                        {/* Setup A: ICT Protocol */}
                        <Card className="rounded-[2.5rem] p-10 border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                                        <Zap size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-slate-900 tracking-tight uppercase italic">Alpha Model A: ICT Protocol</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Institutional Orderflow Matrix</p>
                                    </div>
                                </div>
                                <Badge className="bg-slate-900 text-white px-4 py-1.5 rounded-full border-0 font-black text-[10px] uppercase tracking-widest self-start md:self-auto uppercase">Advanced</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                                <CheckItem text="HTF Liquidity Swept (Internal/External Range)." />
                                <CheckItem text="Market Structure Shift (MSS) + Displacement." />
                                <CheckItem text="Fair Value Gap (FVG) or Orderblock entry point." />
                                <CheckItem text="Time Window Alignment: Killzone (London/NY Open)." />
                            </div>
                        </Card>

                        {/* Setup B: SnD Dynamics */}
                        <Card className="rounded-[2.5rem] p-10 border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                                        <BarChart3 size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-slate-900 tracking-tight uppercase italic">Alpha Model B: SnD Dynamics</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Supply & Demand Imbalance</p>
                                    </div>
                                </div>
                                <Badge className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full border-0 font-black text-[10px] uppercase tracking-widest self-start md:self-auto uppercase">Trend Following</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                                <CheckItem text="Fresh Supply/Demand Zone Identified on H4/D1." />
                                <CheckItem text="Strong Aggressive Departure showing Imbalance." />
                                <CheckItem text="Verify Clean Profit Margin (RR Minimum 1:3)." />
                                <CheckItem text="Confirmed Higher Timeframe Trend Alignment." />
                            </div>
                        </Card>

                        {/* Setup C: SnR Architecture */}
                        <Card className="rounded-[2.5rem] p-10 border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner">
                                        <Target size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl text-slate-900 tracking-tight uppercase italic">Alpha Model C: SnR Architecture</h3>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">S/R Rejection & Price Action</p>
                                    </div>
                                </div>
                                <Badge className="bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full border-0 font-black text-[10px] uppercase tracking-widest self-start md:self-auto uppercase">High Prob</Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2">
                                <CheckItem text="Major S/R Level Rejection or Retest." />
                                <CheckItem text="Momentum Exhaustion on LTF Candlestick." />
                                <CheckItem text="Breakout & Retest Confirmation on M15 timeframe." />
                                <CheckItem text="Confluence with Psychological / Round Numbers." />
                            </div>
                        </Card>
                    </div>
                </section>

                {/* 4. ROUTINE SECTION */}
                <section id="routine" className="scroll-mt-32">
                    <SectionHeader title="04. Operational Windows" subtitle="Time & Discipline Discipline" />
                    
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <Clock size={20} className="text-indigo-600" />
                                <h4 className="font-black text-slate-900 uppercase tracking-tight">Trading Sessions (WIB)</h4>
                            </div>
                            <div className="space-y-4">
                                <TimeRow label="London Open" time="14:00 - 17:00" />
                                <TimeRow label="NY Overlap" time="19:00 - 23:00" highlight />
                                <div className="mt-6 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex gap-4 items-start">
                                    <AlertTriangle size={18} className="text-rose-600 mt-1 shrink-0" />
                                    <p className="text-xs text-rose-700 font-bold leading-relaxed">
                                        RESTRICTED ZONE: Pukul 03:00 - 08:00 WIB. Spread tidak stabil, likuiditas rendah.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <LayoutDashboard size={20} className="text-indigo-600" />
                                <h4 className="font-black text-slate-900 uppercase tracking-tight">Pre-Flight Checklist</h4>
                            </div>
                            <div className="space-y-6">
                                <CheckItem text="Macro Audit: Check high-impact news on ForexFactory." />
                                <CheckItem text="Bias Audit: Confirm Daily Bias & Market Structure." />
                                <CheckItem text="Mental Audit: Ensure peak state (No Fatigue/Emotion)." />
                                <CheckItem text="Terminal Audit: Confirm Daily Loss Limit status." />
                            </div>
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <footer className="pt-20 pb-20 border-t border-slate-100 text-center space-y-8">
                    <div className="space-y-2">
                        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Ready for Deployment</p>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Eksekusi Dimulai Dari Kedisiplinan.</h3>
                    </div>
                    <Link href="/dashboard">
                        <Button className="h-16 px-12 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-base shadow-2xl shadow-slate-300 transition-all active:scale-95 gap-3 group">
                            Return to Trading Terminal <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </footer>

            </div>
        </div>
      </div>
    </div>
  );
}

// --- REFINED SUB COMPONENTS ---

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div className="border-l-4 border-indigo-600 pl-6">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{title}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">{subtitle}</p>
        </div>
    )
}

function MindsetCard({ title, desc, idx }: { title: string, desc: string, idx: number }) {
    return (
        <Card className="bg-white p-8 rounded-[2rem] border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group">
            <span className="text-[10px] font-black text-indigo-200 mb-4 block group-hover:text-indigo-500 transition-colors tracking-widest">PRINCIPLE 0{idx}</span>
            <h3 className="font-black text-slate-900 mb-3 tracking-tight uppercase leading-none">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {desc}
            </p>
        </Card>
    )
}

function CheckItem({ text }: { text: string }) {
    return (
        <div className="flex gap-4 items-start group">
            <div className="mt-1 bg-emerald-50 text-emerald-600 rounded-lg p-1 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <CheckCircle2 size={12} strokeWidth={3} />
            </div>
            <span className="text-slate-600 font-bold text-[11px] leading-relaxed tracking-tight uppercase">{text}</span>
        </div>
    )
}

function TimeRow({ label, time, highlight }: { label: string, time: string, highlight?: boolean }) {
    return (
        <div className={cn(
            "flex justify-between items-center p-4 rounded-2xl border transition-all duration-300",
            highlight ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" : "bg-slate-50 border-slate-100 text-slate-500"
        )}>
            <span className={cn("text-[10px] font-black uppercase tracking-widest", highlight ? "text-indigo-400" : "text-slate-400")}>{label}</span>
            <span className={cn("text-sm font-black font-mono tracking-wider uppercase", highlight ? "text-white" : "text-slate-700")}>{time}</span>
        </div>
    )
}
