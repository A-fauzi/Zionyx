"use client";

import React, { useState, useMemo } from "react";
import { 
  X, Zap, ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle2, BrainCircuit, Microscope 
} from "lucide-react"; 
import { cn } from "@/lib/utils";
import { addTradeAction } from "../actions";
import { useRouter } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function EntryModal({ onClose, balance }: { onClose: () => void, balance: number }) {
  const router = useRouter();
  const { toast } = useToast(); 
  const [loading, setLoading] = useState(false);
  
  // State Data Entry (Updated with Psychology & Reason)
  const [formData, setFormData] = useState({
    pair: "XAUUSD",
    type: "SELL",
    setup: "SMC Sweep",
    riskPercent: 1.0, 
    slPips: 0,
    psychology: "FOCUSED", // Default: Focused
    reason: ""             // Technical Reason
  });

  // Logika Kalkulasi Lot Real-time
  const calculation = useMemo(() => {
    const riskAmount = (balance * formData.riskPercent) / 100;
    const multiplier = formData.pair === "XAUUSD" ? 1 : 10;
    
    let lotSize = 0;
    if (formData.slPips > 0) {
      lotSize = riskAmount / (formData.slPips * multiplier);
    }
    
    return {
      riskAmount,
      lotSize: lotSize.toFixed(2),
      pairCode: formData.pair.substring(0, 3) 
    };
  }, [formData, balance]);

  const handleSubmit = async () => {
    if (formData.slPips <= 0) return toast({ variant: "destructive", title: "Input Error", description: "Stop Loss wajib diisi." });
    if (parseFloat(calculation.lotSize) <= 0) return toast({ variant: "destructive", title: "Kalkulasi Error", description: "Lot Size tidak valid." });
    if (!formData.reason) return toast({ variant: "destructive", title: "Audit Error", description: "Technical reason wajib diisi untuk audit." });
    
    setLoading(true);
    try {
      await addTradeAction({ 
        ...formData, 
        lot: parseFloat(calculation.lotSize), 
        risk: calculation.riskAmount, 
        status: "OPEN" 
      });
      
      toast({ 
        title: "Protocol Executed", 
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={16} />
            <span>Position {formData.pair} {formData.type} saved to Zionyx Database.</span>
          </div>
        )
      });
      onClose();
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "System Error", description: "Gagal menyimpan data eksekusi." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4 font-sans">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
      
      <div className="relative bg-white w-full sm:max-w-[520px] h-auto max-h-[95vh] flex flex-col rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        
        {/* HEADER */}
        <div className="px-8 pb-4 pt-6 flex justify-between items-center shrink-0 border-b border-slate-50">
            <div>
                <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase">Deploy Strategy</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Zionyx Execution Protocol</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all active:scale-90">
                <X size={20} />
            </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
            
            {/* SEGMENTED CONTROL: Direction */}
            <div className="bg-slate-100 p-1.5 rounded-[1.25rem] flex relative shadow-inner">
                <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: "BUY"})}
                    className={cn(
                        "flex-1 py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-widest",
                        formData.type === "BUY" ? "bg-white text-indigo-600 shadow-lg" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <ArrowUpRight size={16} strokeWidth={3} /> BUY
                </button>
                <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: "SELL"})}
                    className={cn(
                        "flex-1 py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all duration-300 uppercase tracking-widest",
                        formData.type === "SELL" ? "bg-white text-orange-600 shadow-lg" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <ArrowDownRight size={16} strokeWidth={3} /> SELL
                </button>
            </div>

            <div className="space-y-6">
                {/* ROW 1: ASSET & SETUP */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Instrument</Label>
                        <Select value={formData.pair} onValueChange={(v) => setFormData({...formData, pair: v})}>
                            <SelectTrigger className="h-14 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl font-black text-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-[200] rounded-2xl border-slate-100 shadow-2xl">
                                <SelectItem value="XAUUSD" className="font-bold py-3 uppercase tracking-tight">XAUUSD</SelectItem>
                                <SelectItem value="EURUSD" className="font-bold py-3 uppercase tracking-tight">EURUSD</SelectItem>
                                <SelectItem value="BTCUSD" className="font-bold py-3 uppercase tracking-tight">BTCUSD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Alpha Model</Label>
                        <Select value={formData.setup} onValueChange={(v) => setFormData({...formData, setup: v})}>
                            <SelectTrigger className="h-14 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl font-black text-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-[200] rounded-2xl border-slate-100 shadow-2xl">
                                <SelectItem value="SMC Sweep" className="font-bold py-3 uppercase">SMC Sweep</SelectItem>
                                <SelectItem value="SnD RBD" className="font-bold py-3 uppercase">SnD RBD</SelectItem>
                                <SelectItem value="Breakout" className="font-bold py-3 uppercase">Breakout</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* ROW 2: RISK & SL */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Risk Intensity (%)</Label>
                        <Input 
                            type="number" step="0.1" 
                            value={formData.riskPercent} 
                            onChange={(e) => setFormData({...formData, riskPercent: Number(e.target.value)})} 
                            className="h-14 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl font-black text-slate-900 text-lg font-mono" 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Stop Loss (Pips)</Label>
                        <Input 
                            type="number" placeholder="0" 
                            value={formData.slPips || ""} 
                            onChange={(e) => setFormData({...formData, slPips: Number(e.target.value)})} 
                            className="h-14 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl font-black text-slate-900 text-lg font-mono" 
                        />
                    </div>
                </div>

                {/* ROW 3: PSYCHOLOGY & REASON (Audit Layer) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                           <BrainCircuit size={10} className="text-indigo-500" /> Mental State
                        </Label>
                        <Select value={formData.psychology} onValueChange={(v) => setFormData({...formData, psychology: v})}>
                            <SelectTrigger className="h-14 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl font-black text-slate-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-[200] rounded-2xl border-slate-100 shadow-2xl">
                                <SelectItem value="FOCUSED" className="font-bold py-3">💎 FOCUSED</SelectItem>
                                <SelectItem value="FOMO" className="font-bold py-3">🚀 FOMO</SelectItem>
                                <SelectItem value="REVENGE" className="font-bold py-3">😡 REVENGE</SelectItem>
                                <SelectItem value="BORED" className="font-bold py-3">😴 BORED</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
                           <Microscope size={10} className="text-indigo-500" /> Technical Reason
                        </Label>
                        <Input 
                            value={formData.reason} 
                            onChange={(e) => setFormData({...formData, reason: e.target.value})} 
                            placeholder="e.g. FVG Fill + CHoCH" 
                            className="h-14 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-700" 
                        />
                    </div>
                </div>
            </div>

            {/* LOT CALCULATION CARD */}
            <div className="bg-slate-900 rounded-[2rem] p-6 flex items-center justify-between relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 -mr-10 -mt-10" />
                <div className="relative z-10">
                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                        <Zap size={10} className="fill-indigo-300" /> Calculated Lot
                    </p>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-5xl font-black text-white tracking-tighter font-mono">{calculation.lotSize}</span>
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Lots</span>
                    </div>
                </div>
                <div className="relative z-10 text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Risk Exposure</p>
                    <p className="text-xl font-black text-white font-mono tracking-tight">${calculation.riskAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>
        
        {/* FOOTER ACTION */}
        <div className="p-8 pt-4 bg-white shrink-0 border-t border-slate-50">
            <Button 
                disabled={loading} 
                onClick={handleSubmit} 
                className="w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-base shadow-2xl shadow-indigo-100 transition-all active:scale-[0.98] flex justify-between px-8 group"
            >
                <span className="uppercase tracking-widest">Execute Strategy</span>
                <span className="opacity-50 group-hover:translate-x-2 transition-transform">→</span>
            </Button>
            <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                    <AlertCircle size={12} className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Protocol: Adhere to Risk Limits</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
