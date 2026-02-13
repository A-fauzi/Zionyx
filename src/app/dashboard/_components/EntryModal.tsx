"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  X, Zap, ArrowUpRight, ArrowDownRight, BrainCircuit, 
  Microscope, ClipboardCheck, ShieldCheck, AlertCircle 
} from "lucide-react"; 
import { cn } from "@/lib/utils";
import { addTradeAction } from "../actions";
import { useRouter } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";

const SOP_CONFIG = {
  ICT: [
    "HTF Liquidity Swept (Internal/External)",
    "Market Structure Shift + Displacement",
    "Fair Value Gap (FVG) / Orderblock Entry",
    "Killzone Time Window (London/NY Open)"
  ],
  SnD: [
    "Fresh Supply/Demand Zone Identified",
    "Aggressive Departure (Imbalance)",
    "Clean Profit Margin (RR 1:3+)",
    "Trend HTF Alignment"
  ],
  SnR: [
    "Major S/R Level Rejection",
    "Candlestick Momentum Exhaustion",
    "Breakout & Retest Confirmation",
    "Confluence with Psychological Level"
  ]
};

type StrategyModel = keyof typeof SOP_CONFIG;

export function EntryModal({ onClose, balance }: { onClose: () => void, balance: number }) {
  const router = useRouter();
  const { toast } = useToast(); 
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    pair: "XAUUSD",
    type: "SELL",
    setup: "ICT" as StrategyModel,
    riskPercent: 1.0, 
    slPips: 0,
    psychology: "FOCUSED",
    reason: ""
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialChecklist: Record<string, boolean> = {};
    SOP_CONFIG[formData.setup].forEach(req => {
      initialChecklist[req] = false;
    });
    setCheckedItems(initialChecklist);
  }, [formData.setup]);

  const isSopCompliant = useMemo(() => {
    const currentSop = SOP_CONFIG[formData.setup];
    return currentSop.every(req => checkedItems[req]);
  }, [checkedItems, formData.setup]);

  const calculation = useMemo(() => {
    const riskAmount = (balance * formData.riskPercent) / 100;
    const multiplier = formData.pair === "XAUUSD" ? 1 : 10;
    let lotSize = 0;
    if (formData.slPips > 0) lotSize = riskAmount / (formData.slPips * multiplier);
    return { riskAmount, lotSize: lotSize.toFixed(2) };
  }, [formData, balance]);

  const handleSubmit = async () => {
    // --- 1. VALIDASI INPUT ---
    if (!isSopCompliant) return;
    if (formData.slPips <= 0) {
        return toast({ variant: "destructive", title: "Risk Violation", description: "Stop Loss wajib diisi untuk proteksi kapital." });
    }
    if (parseFloat(calculation.lotSize) <= 0) {
        return toast({ variant: "destructive", title: "Calculation Error", description: "Lot size tidak valid. Cek SL lo lagi." });
    }
    if (!formData.reason || formData.reason.length < 3) {
        return toast({ variant: "destructive", title: "Audit Violation", description: "Alasan teknis (Reason) wajib diisi untuk jurnal." });
    }

    setLoading(true);
    try {
      await addTradeAction({ 
        ...formData, 
        lot: parseFloat(calculation.lotSize), 
        risk: calculation.riskAmount, 
        status: "OPEN" 
      });
      onClose();
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "System Error", description: "Gagal menyimpan data ke Zionyx Database." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4 font-sans">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
      
      <div className="relative bg-white w-full sm:max-w-[550px] h-auto max-h-[96vh] flex flex-col rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        
        {/* HEADER */}
        <div className="px-8 pb-4 pt-6 flex justify-between items-center shrink-0 border-b border-slate-50">
            <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Deploy Protocol</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Zionyx Multi-Strategy Guard</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
            
            {/* STEP 1: MODEL SELECTION */}
            <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase text-indigo-500 tracking-widest ml-1">1. Model Selection</Label>
                <div className="flex gap-2">
                    {(Object.keys(SOP_CONFIG) as StrategyModel[]).map((strat) => (
                        <button
                            key={strat}
                            onClick={() => setFormData({...formData, setup: strat})}
                            className={cn(
                                "flex-1 py-3.5 rounded-2xl text-[10px] font-black tracking-widest transition-all border-2 uppercase",
                                formData.setup === strat 
                                    ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" 
                                    : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
                            )}
                        >
                            {strat}
                        </button>
                    ))}
                </div>
            </div>

            {/* STEP 2: DYNAMIC SOP CHECKLIST */}
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                    <ClipboardCheck size={16} className="text-indigo-600" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Pre-Flight Audit: {formData.setup}</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-2.5">
                    {SOP_CONFIG[formData.setup].map((req) => (
                        <div key={req} className="flex items-center space-x-3 bg-white p-4 rounded-xl border border-slate-100/50 shadow-sm transition-all hover:border-indigo-100">
                            <Checkbox 
                                id={req} 
                                checked={checkedItems[req] || false}
                                onCheckedChange={(checked) => setCheckedItems(prev => ({ ...prev, [req]: !!checked }))}
                                className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                            />
                            <label htmlFor={req} className="text-[10px] font-black text-slate-600 leading-none cursor-pointer uppercase tracking-tight">
                                {req}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* STEP 3: INPUT TEKNIS & PSYCHOLOGY */}
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Asset</Label>
                        <Select value={formData.pair} onValueChange={(v) => setFormData({...formData, pair: v})}>
                            <SelectTrigger className="h-12 bg-slate-50 border-0 rounded-2xl font-black text-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent className="z-[200] rounded-2xl border-slate-100 shadow-2xl">
                                <SelectItem value="XAUUSD" className="font-bold py-3 uppercase">XAUUSD</SelectItem>
                                <SelectItem value="EURUSD" className="font-bold py-3 uppercase">EURUSD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Risk (%)</Label>
                        <Input type="number" step="0.1" value={formData.riskPercent} onChange={(e) => setFormData({...formData, riskPercent: Number(e.target.value)})} className="h-12 bg-slate-50 border-0 rounded-2xl font-black text-lg font-mono focus:ring-2 focus:ring-indigo-500/10" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Stop Loss (Pips)</Label>
                        <Input type="number" placeholder="0" value={formData.slPips || ""} onChange={(e) => setFormData({...formData, slPips: Number(e.target.value)})} className="h-12 bg-slate-50 border-0 rounded-2xl font-black text-lg font-mono focus:ring-2 focus:ring-indigo-500/10" />
                    </div>
                    {/* PSYCHOLOGY SELECTOR (Dibalikin!) */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                            <BrainCircuit size={10} className="text-indigo-500" /> Mental State
                        </Label>
                        <Select value={formData.psychology} onValueChange={(v) => setFormData({...formData, psychology: v})}>
                            <SelectTrigger className="h-12 bg-slate-50 border-0 rounded-2xl font-black text-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent className="z-[200] rounded-2xl border-slate-100 shadow-2xl">
                                <SelectItem value="FOCUSED" className="font-bold py-3">💎 FOCUSED</SelectItem>
                                <SelectItem value="FOMO" className="font-bold py-3">🚀 FOMO</SelectItem>
                                <SelectItem value="REVENGE" className="font-bold py-3">😡 REVENGE</SelectItem>
                                <SelectItem value="BORED" className="font-bold py-3">😴 BORED</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1 flex items-center gap-2">
                        <Microscope size={10} className="text-indigo-500" /> Technical Reason
                    </Label>
                    <Input value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} placeholder="e.g. FVG Fill + MSS" className="h-12 bg-slate-50 border-0 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10" />
                </div>
            </div>

            {/* CALCULATED LOT */}
            <div className="bg-slate-900 rounded-[2rem] p-6 flex items-center justify-between relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 -mr-10 -mt-10" />
                <div className="relative z-10 text-white">
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Zap size={10} className="fill-indigo-300" /> Lot Size</p>
                    <div className="flex items-baseline gap-1.5"><span className="text-5xl font-black tracking-tighter font-mono">{calculation.lotSize}</span></div>
                </div>
                <div className="relative z-10 text-right text-white">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Risk Exposure</p>
                    <p className="text-xl font-black font-mono tracking-tight">${calculation.riskAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>
        
        {/* FOOTER ACTION */}
        <div className="p-8 pt-4 bg-white shrink-0 border-t border-slate-50">
            <Button 
                disabled={loading || !isSopCompliant} 
                onClick={handleSubmit} 
                className={cn(
                  "w-full h-16 rounded-2xl font-black text-base shadow-2xl transition-all flex justify-between px-8 group",
                  isSopCompliant 
                    ? "bg-slate-900 hover:bg-indigo-600 text-white shadow-indigo-100 active:scale-[0.98]" 
                    : "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200 shadow-none"
                )}
            >
                <span className="uppercase tracking-[0.2em]">{isSopCompliant ? "Deploy Protocol" : "Incomplete SOP"}</span>
                {isSopCompliant ? <Zap size={18} className="fill-indigo-300 transition-transform group-hover:scale-125" /> : <ShieldCheck size={18} className="text-slate-300" />}
            </Button>
            <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                    <AlertCircle size={10} className="text-indigo-400" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic tracking-tighter">Zionyx Institutional Grade Audit Protection</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
