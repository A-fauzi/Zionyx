"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, ShieldAlert, Target, BrainCircuit, 
  Clock, BookOpen, CheckCircle2, ChevronRight,
  Zap, Hash, AlertTriangle, LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SECTIONS = [
  { id: "mindset", label: "01. Mindset", icon: BrainCircuit },
  { id: "risk", label: "02. Risk Rules", icon: ShieldAlert },
  { id: "strategy", label: "03. Strategy", icon: Target },
  { id: "routine", label: "04. Routine", icon: Clock },
];

export default function TradingPlanPage() {
  const [activeSection, setActiveSection] = useState("mindset");

  // Simple scroll spy logic (optional enhancement)
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      
      {/* --- TOP NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 text-slate-500">
                    <ArrowLeft size={20} />
                </Button>
            </Link>
            <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-600" />
                <span className="font-bold text-sm text-slate-900 tracking-tight">Trading Bible V2.0</span>
            </div>
        </div>
        <Link href="/dashboard">
            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-lg">
                Open Dashboard
            </Button>
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* --- LEFT: STICKY SIDEBAR (Desktop) --- */}
            <div className="hidden lg:block lg:col-span-3 relative">
                <div className="sticky top-24 space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">Table of Contents</p>
                    {SECTIONS.map((item) => (
                        <a 
                            key={item.id} 
                            href={`#${item.id}`}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 group",
                                activeSection === item.id 
                                    ? "bg-indigo-50 text-indigo-700" 
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            <item.icon size={16} className={cn("transition-colors", activeSection === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                            {item.label}
                            {activeSection === item.id && (
                                <motion.div layoutId="active-dot" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            )}
                        </a>
                    ))}
                </div>
            </div>

            {/* --- RIGHT: CONTENT --- */}
            <div className="lg:col-span-9 space-y-16">
                
                {/* HERO TITLE */}
                <div className="space-y-4 border-b border-slate-100 pb-10">
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 mb-2">Internal System Rules</Badge>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        Sistem Trading Komprehensif
                    </h1>
                    <p className="text-slate-500 text-base md:text-lg max-w-2xl leading-relaxed">
                        Dokumen hidup yang mengatur setiap keputusan trading. Baca ini sebelum membuka chart untuk kalibrasi mental.
                    </p>
                </div>

                {/* 1. MINDSET SECTION */}
                <section id="mindset" className="scroll-mt-24">
                    <SectionHeader title="01. Prinsip Dasar" subtitle="Foundational Mindset" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <MindsetCard 
                            title="Probabilitas > Prediksi" 
                            desc="Kita tidak meramal masa depan. Kita hanya mengeksekusi edge statistik yang berulang."
                            idx={1}
                        />
                        <MindsetCard 
                            title="Cost of Business" 
                            desc="Loss adalah biaya operasional wajar. Selama risk terjaga, loss hanyalah data."
                            idx={2}
                        />
                        <MindsetCard 
                            title="Capital Preservation" 
                            desc="Tugas utama trader adalah melindungi modal. Profit adalah produk sampingan dari perlindungan modal."
                            idx={3}
                        />
                        <MindsetCard 
                            title="Boredom is Good" 
                            desc="Trading yang baik itu membosankan. Jika berdebar-debar, berarti risk terlalu besar atau plan tidak jelas."
                            idx={4}
                        />
                    </div>
                </section>

                {/* 2. RISK MANAGEMENT SECTION */}
                <section id="risk" className="scroll-mt-24">
                    <SectionHeader title="02. The Iron Laws" subtitle="Risk Management Protocol" />
                    
                    <div className="mt-6 bg-slate-900 text-white rounded-[2rem] p-8 relative overflow-hidden shadow-2xl shadow-slate-200">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldAlert size={120} />
                        </div>
                        
                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
                            <div className="text-center px-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Max Risk / Trade</p>
                                <p className="text-4xl md:text-5xl font-black text-emerald-400">1-2%</p>
                                <p className="text-xs text-slate-400 mt-2 font-medium">Jangan pernah melanggar ini.</p>
                            </div>
                            <div className="text-center px-4 pt-8 md:pt-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Daily Loss Limit</p>
                                <p className="text-4xl md:text-5xl font-black text-rose-400">6%</p>
                                <p className="text-xs text-slate-400 mt-2 font-medium">Force stop trading hari ini.</p>
                            </div>
                            <div className="text-center px-4 pt-8 md:pt-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Min RRR</p>
                                <p className="text-4xl md:text-5xl font-black text-indigo-400">1:2</p>
                                <p className="text-xs text-slate-400 mt-2 font-medium">Risk $1 untuk dapat $2.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. STRATEGY SECTION */}
                <section id="strategy" className="scroll-mt-24">
                    <SectionHeader title="03. Strategi Eksekusi" subtitle="Setup & Validation" />
                    
                    <div className="grid grid-cols-1 gap-6 mt-6">
                        {/* Setup A */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 hover:border-indigo-200 transition-colors group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                        <Hash size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">Setup A: Supply & Demand</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Trend Following</p>
                                    </div>
                                </div>
                                <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none">High Probability</Badge>
                            </div>
                            <div className="space-y-3 pl-4 border-l-2 border-slate-100 group-hover:border-indigo-100 transition-colors">
                                <CheckItem text="Identifikasi Tren Utama (H4/Daily) harus jelas." />
                                <CheckItem text="Cari Zona Fresh (Rally-Base-Drop / Drop-Base-Rally)." />
                                <CheckItem text="Tunggu harga retrace masuk zona." />
                                <CheckItem text="Entry saat ada Rejection Candle atau LTF Confirmation (M15)." />
                            </div>
                        </div>

                        {/* Setup B */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 hover:border-orange-200 transition-colors group">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">Setup B: SMC Sweep</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Reversal / Continuation</p>
                                    </div>
                                </div>
                                <Badge className="bg-orange-50 text-orange-600 hover:bg-orange-100 border-none">Aggressive</Badge>
                            </div>
                            <div className="space-y-3 pl-4 border-l-2 border-slate-100 group-hover:border-orange-100 transition-colors">
                                <CheckItem text="Tandai Liquidity Pool (Equal Highs/Lows)." />
                                <CheckItem text="Tunggu harga 'Sweep' likuiditas tersebut." />
                                <CheckItem text="Tunggu Break of Structure (BOS) berlawanan arah." />
                                <CheckItem text="Entry Limit di Fair Value Gap (FVG) terdekat." />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. ROUTINE SECTION */}
                <section id="routine" className="scroll-mt-24">
                    <SectionHeader title="04. Rutinitas & Waktu" subtitle="Discipline Framework" />
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-emerald-500" /> Trading Windows (WIB)
                            </h4>
                            <div className="space-y-3">
                                <TimeRow label="London Open" time="14:00 - 17:00" />
                                <TimeRow label="NY Overlap" time="19:00 - 23:00" highlight />
                                <div className="mt-4 p-3 bg-rose-50 rounded-xl flex gap-3 items-start">
                                    <AlertTriangle size={16} className="text-rose-500 mt-0.5" />
                                    <p className="text-xs text-rose-600 font-medium">Dilarang trading pukul 03:00 - 08:00 (Spread Lebar)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <LayoutDashboard size={18} className="text-indigo-500" /> Pre-Flight Checklist
                            </h4>
                            <ul className="space-y-3">
                                <CheckItem text="Cek High Impact News (ForexFactory)." />
                                <CheckItem text="Analisa Daily Bias & H4 Structure." />
                                <CheckItem text="Kondisi fisik & mental prima (tidak ngantuk/emosi)." />
                                <CheckItem text="Reset Daily Loss Limit di Dashboard." />
                            </ul>
                        </div>
                    </div>
                </section>

                {/* BOTTOM CTA */}
                <div className="pt-10 pb-10 text-center">
                    <p className="text-slate-400 text-sm font-medium mb-4">Sudah paham aturannya?</p>
                    <Link href="/dashboard">
                        <Button size="lg" className="bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl px-8 h-14 text-base font-bold shadow-xl shadow-slate-200 transition-all active:scale-95">
                            Ready to Execute <ArrowLeft size={18} className="rotate-180 ml-2" />
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function SectionHeader({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">{subtitle}</p>
        </div>
    )
}

function MindsetCard({ title, desc, idx }: { title: string, desc: string, idx: number }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
            <span className="text-[10px] font-black text-slate-300 mb-2 block">0{idx}</span>
            <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {desc}
            </p>
        </div>
    )
}

function CheckItem({ text }: { text: string }) {
    return (
        <div className="flex gap-3 items-start">
            <div className="mt-0.5 bg-emerald-100 text-emerald-600 rounded-full p-0.5">
                <CheckCircle2 size={12} />
            </div>
            <span className="text-slate-600 font-medium text-sm leading-relaxed">{text}</span>
        </div>
    )
}

function TimeRow({ label, time, highlight }: { label: string, time: string, highlight?: boolean }) {
    return (
        <div className={cn(
            "flex justify-between items-center p-3 rounded-xl border transition-colors",
            highlight ? "bg-indigo-50 border-indigo-100" : "bg-slate-50 border-slate-100"
        )}>
            <span className={cn("text-xs font-bold uppercase", highlight ? "text-indigo-600" : "text-slate-500")}>{label}</span>
            <span className={cn("text-sm font-black font-mono", highlight ? "text-indigo-900" : "text-slate-700")}>{time}</span>
        </div>
    )
}
