"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, Tooltip, ResponsiveContainer, XAxis
} from "recharts";
import {
  Activity, ShieldAlert, Target, Zap, Plus,
  History, X, Check, TrendingUp, AlertTriangle, Calculator,
  ArrowUpRight, ArrowDownRight, Menu, BrainCircuit, Wallet
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- DATA DUMMY ---
const USER_PROFILE = {
  name: "Zi",
  balance: 1000,
  dailyLossLimit: 6, // 6%
};

const CHART_DATA = [
  { day: "Sen", equity: 1000 }, { day: "Sel", equity: 980 },
  { day: "Rab", equity: 1050 }, { day: "Kam", equity: 1120 },
  { day: "Jum", equity: 1080 }, { day: "Sab", equity: 1250 },
];

const INITIAL_TRADES = [
  { id: 1, pair: "XAUUSD", type: "SELL", price: 2045.50, lot: 0.10, risk: 20, pnl: 85.00, status: "WIN", setup: "SMC: Liquidity Sweep", date: "14:30" },
  { id: 2, pair: "EURUSD", type: "BUY", price: 1.0850, lot: 0.10, risk: 20, pnl: -20.00, status: "LOSS", setup: "SnD: RBD", date: "10:15" },
];

// --- MAIN COMPONENT ---
export default function ZenTradeResponsive() {
  const [trades, setTrades] = useState(INITIAL_TRADES);
  const [isEntryModalOpen, setEntryModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Performance Calculation
  const todayPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
  const drawdownPercent = (todayPnL / USER_PROFILE.balance) * -100;
  const isDangerZone = drawdownPercent >= 4;

  const handleAddTrade = (trade: any) => {
    setTrades([trade, ...trades]);
    setEntryModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-24 md:pb-10">
      
      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Activity className="text-white w-4 h-4" />
          </div>
          <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900">
            ZenTrade<span className="text-indigo-600">.</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Balance</p>
            <p className="text-sm font-black text-slate-900">${USER_PROFILE.balance.toLocaleString()}</p>
          </div>
          <Button onClick={() => setEntryModalOpen(true)} icon={<Plus size={16} />}>
            New Entry
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full"
        >
          <Menu size={20} />
        </button>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                 <span className="text-sm font-medium text-slate-500">Balance</span>
                 <span className="text-lg font-black text-slate-900">${USER_PROFILE.balance}</span>
              </div>
              <Button fullWidth onClick={() => { setEntryModalOpen(true); setMobileMenuOpen(false); }}>
                <Plus size={16} /> New Entry
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
        
        {/* --- SECTION 1: WELCOME & RISK METER --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          
          {/* Welcome Card */}
          <Card className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-white to-slate-50">
            <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
              <Zap className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-1">Halo, {USER_PROFILE.name}</h2>
              <p className="text-xs md:text-sm text-slate-500 mb-4 md:mb-6 max-w-md leading-relaxed">
                Ingat prinsip dasar: Loss adalah biaya bisnis. Fokus pada eksekusi setup terbaik sesuai sistem.
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Badge icon={<ShieldAlert size={12} />} label="Risk Max 2%" />
                <Badge icon={<Target size={12} />} label="RRR 1:2+" />
                <Badge icon={<BrainCircuit size={12} />} label="SMC / SnD" />
              </div>
            </div>
          </Card>

          {/* Daily Limit Meter */}
          <Card className={cn(
            "flex flex-col justify-between",
            isDangerZone ? "bg-rose-50 border-rose-100" : "bg-white"
          )}>
             <div>
                <div className="flex justify-between items-start mb-2">
                   <div className={cn("p-2 rounded-lg", isDangerZone ? "bg-rose-100" : "bg-emerald-50")}>
                      <AlertTriangle size={16} className={isDangerZone ? "text-rose-500" : "text-emerald-500"} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daily Limit</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-2xl font-black text-slate-900">
                    {Math.abs(drawdownPercent).toFixed(1)}%
                  </h3>
                  <span className="text-xs font-medium text-slate-400">/ 6%</span>
                </div>
                <p className={cn("text-[10px] font-bold mt-1", isDangerZone ? "text-rose-600" : "text-emerald-600")}>
                  {isDangerZone ? "STOP TRADING!" : "Safe Zone"}
                </p>
             </div>
             <div className="w-full bg-slate-200/50 h-1.5 rounded-full mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((Math.abs(drawdownPercent) / 6) * 100, 100)}%` }}
                  className={cn("h-full rounded-full", isDangerZone ? "bg-rose-500" : "bg-emerald-500")}
                />
             </div>
          </Card>
        </div>

        {/* --- SECTION 2: CHARTS & STATS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Equity Chart */}
          <Card className="lg:col-span-2 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                 <TrendingUp size={16} className="text-indigo-600" /> Equity Growth
               </h3>
               <div className="flex gap-1">
                 {['1W', '1M'].map(t => (
                   <button key={t} className="px-2 py-1 text-[10px] font-bold rounded bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">{t}</button>
                 ))}
               </div>
            </div>
            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA}>
                  <defs>
                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b' }}
                  />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                  <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={2} fill="url(#colorEquity)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <StatBox label="Win Rate" value="65%" sub="+5% vs Last Wk" color="text-emerald-600" bg="bg-emerald-50" icon={Target} />
            <StatBox label="Avg R:R" value="1:2.5" sub="Optimal" color="text-indigo-600" bg="bg-indigo-50" icon={Activity} />
            <StatBox label="Profit Factor" value="1.8" sub="Healthy" color="text-violet-600" bg="bg-violet-50" icon={Wallet} />
          </div>
        </div>

        {/* --- SECTION 3: JOURNAL TABLE --- */}
        <Card className="p-0 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-bold text-sm text-slate-900">Recent Trades</h3>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-md">{trades.length} LOGS</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Pair & Time</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Setup</th>
                  <th className="px-5 py-3">Lot/Risk</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs md:text-sm">
                {trades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-700">{trade.pair}</div>
                      <div className="text-[10px] text-slate-400">{trade.date}</div>
                    </td>
                    <td className="px-5 py-3.5">
                       <span className={cn("inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[10px]", 
                         trade.type === 'BUY' ? "bg-indigo-50 text-indigo-600" : "bg-orange-50 text-orange-600")}>
                          {trade.type === 'BUY' ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}
                          {trade.type}
                       </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-600">{trade.setup}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-700">{trade.lot} Lot</div>
                      <div className="text-[10px] text-slate-400">${trade.risk} Risk</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("px-2 py-1 rounded-full text-[10px] font-black uppercase",
                        trade.status === 'WIN' ? "bg-emerald-100 text-emerald-700" :
                        trade.status === 'LOSS' ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
                      )}>{trade.status}</span>
                    </td>
                    <td className={cn("px-5 py-3.5 text-right font-bold", trade.pnl > 0 ? "text-emerald-600" : "text-rose-600")}>
                      {trade.pnl > 0 ? '+' : ''}{trade.pnl}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </main>

      {/* --- ENTRY MODAL --- */}
      <AnimatePresence>
        {isEntryModalOpen && (
          <EntryModal onClose={() => setEntryModalOpen(false)} balance={USER_PROFILE.balance} onSubmit={handleAddTrade} />
        )}
      </AnimatePresence>

    </div>
  );
}

// --- MODULAR SUB-COMPONENTS ---

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm p-5 md:p-6", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, icon, fullWidth }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-200",
      fullWidth && "w-full py-3"
    )}
  >
    {icon} {children}
  </button>
);

const Badge = ({ icon, label }: any) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-600">
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
  </div>
);

const StatBox = ({ label, value, sub, color, bg, icon: Icon }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
    <div className="flex justify-between items-start mb-2">
      <div className={cn("p-1.5 rounded-lg", bg)}>
        <Icon size={14} className={color} />
      </div>
      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", bg, color)}>{sub}</span>
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-xl md:text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

// --- COMPLEX ENTRY MODAL ---

function EntryModal({ onClose, balance, onSubmit }: any) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ pair: "XAUUSD", type: "SELL", slPips: 30, riskPercent: 1 });

  const riskAmount = (balance * formData.riskPercent) / 100;
  // Rumus sederhana: Lot = Risk / SL (Standard Lot approx for Gold)
  // Note: Ini penyederhanaan. Di real app perlu tick value calculation.
  const lotSize = (riskAmount / (formData.slPips * 1)).toFixed(2); 

  const handleSubmit = () => {
    onSubmit({
      id: Date.now(),
      ...formData,
      lot: lotSize,
      risk: riskAmount,
      pnl: 0,
      status: "OPEN",
      setup: "Manual Entry",
      date: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white w-full max-w-lg rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full shrink-0">
           <motion.div animate={{ width: step === 1 ? "50%" : "100%" }} className="h-full bg-indigo-600" />
        </div>

        <div className="p-6 overflow-y-auto">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg md:text-xl font-black text-slate-900">
                {step === 1 ? "Psychology Check" : "Technical Setup"}
              </h2>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={16} /></button>
           </div>

           {step === 1 ? (
             <div className="space-y-3">
               <p className="text-xs text-slate-500 font-medium mb-2">Validasi kondisi mental sebelum entry:</p>
               <CheckItem label="Kondisi tenang (tidak emosional)" />
               <CheckItem label="Bukan revenge trading" />
               <CheckItem label="Siap menerima risiko loss" />
               <CheckItem label="Setup valid sesuai Plan" />
               <Button fullWidth onClick={() => setStep(2)} className="mt-4">
                 Mental Aman, Lanjut
               </Button>
             </div>
           ) : (
             <div className="space-y-5">
                {/* Inputs Grid */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Pair</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20"
                        value={formData.pair} onChange={e => setFormData({...formData, pair: e.target.value})}
                      >
                         <option>XAUUSD</option><option>EURUSD</option><option>GBPUSD</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Risk %</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none"
                        value={formData.riskPercent} onChange={e => setFormData({...formData, riskPercent: Number(e.target.value)})}
                      >
                         <option value={1}>1% (Safe)</option><option value={2}>2% (Std)</option><option value={3}>3% (Aggr)</option>
                      </select>
                   </div>
                </div>

                {/* Direction Toggle */}
                <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100">
                   {['BUY', 'SELL'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setFormData({...formData, type: type})} 
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-black transition-all",
                          formData.type === type 
                            ? (type === 'BUY' ? "bg-indigo-600 text-white shadow-md" : "bg-orange-600 text-white shadow-md") 
                            : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {type}
                      </button>
                   ))}
                </div>

                {/* Calculator Widget */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3 relative overflow-hidden">
                   <div className="flex items-center gap-2 mb-1 text-indigo-600">
                      <Calculator size={14} />
                      <span className="text-[10px] font-black uppercase">Auto Calc</span>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Stop Loss (Pips)</label>
                      <input 
                        type="number" value={formData.slPips}
                        onChange={e => setFormData({...formData, slPips: Number(e.target.value)})}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm font-bold mt-1"
                      />
                   </div>
                   <div className="pt-3 border-t border-slate-200 flex justify-between items-end">
                      <div>
                         <p className="text-[10px] text-slate-400 font-bold">Risk Amount</p>
                         <p className="text-sm font-black text-slate-800">${riskAmount}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-slate-400 font-bold">Lot Size</p>
                         <p className="text-xl font-black text-indigo-600 leading-none">{lotSize}</p>
                      </div>
                   </div>
                </div>

                <Button fullWidth onClick={handleSubmit}>EXECUTE PLAN</Button>
             </div>
           )}
        </div>
      </motion.div>
    </div>
  );
}

function CheckItem({ label }: { label: string }) {
   const [checked, setChecked] = useState(false);
   return (
      <div 
        onClick={() => setChecked(!checked)}
        className={cn(
          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
          checked ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100"
        )}
      >
         <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all", checked ? "bg-emerald-500" : "bg-slate-200")}>
            {checked && <Check size={12} className="text-white" />}
         </div>
         <span className={cn("text-xs md:text-sm font-bold select-none", checked ? "text-slate-800" : "text-slate-500")}>{label}</span>
      </div>
   )
}
