"use client";

import React, { useState, useMemo } from "react";
import { 
  X, Zap, ArrowUpRight, ArrowDownRight, AlertCircle, CheckCircle2 
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
  
  // State Data Entry
  const [formData, setFormData] = useState({
    pair: "XAUUSD",
    type: "SELL",
    setup: "SMC Sweep",
    riskPercent: 1.0, 
    slPips: 0,
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
    
    setLoading(true);
    try {
      await addTradeAction({ ...formData, lot: parseFloat(calculation.lotSize), risk: calculation.riskAmount, status: "OPEN" });
      toast({ 
        title: "Plan Executed", 
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={16} />
            <span>{formData.pair} {formData.type} saved.</span>
          </div>
        )
      });
      onClose();
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "System Error", description: "Gagal menyimpan data." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4 font-sans">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity" />
      
      {/* MODAL CARD */}
      <div className="relative bg-white w-full sm:max-w-[480px] h-auto max-h-[92vh] flex flex-col rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
        
        {/* MOBILE HANDLE BAR */}
        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-pointer" onClick={onClose}>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* HEADER */}
        <div className="px-6 pb-2 pt-2 sm:pt-6 flex justify-between items-center shrink-0">
            <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">New Entry</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Record your setup details</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors">
                <X size={18} />
            </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            
            {/* SEGMENTED CONTROL: Direction */}
            <div className="bg-slate-100 p-1 rounded-2xl flex relative">
                <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: "BUY"})}
                    className={cn(
                        "flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200",
                        formData.type === "BUY" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <ArrowUpRight size={16} /> BUY
                </button>
                <button 
                    type="button" 
                    onClick={() => setFormData({...formData, type: "SELL"})}
                    className={cn(
                        "flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200",
                        formData.type === "SELL" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    <ArrowDownRight size={16} /> SELL
                </button>
            </div>

            {/* FORM GROUP */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider ml-1">Asset</Label>
                        {/* FIX: Value & onValueChange dipastikan terhubung */}
                        <Select value={formData.pair} onValueChange={(v) => setFormData({...formData, pair: v})}>
                            <SelectTrigger className="h-12 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-700">
                                <SelectValue placeholder="Select Pair" />
                            </SelectTrigger>
                            {/* FIX: Menambahkan z-[200] agar dropdown muncul DI DEPAN modal */}
                            <SelectContent className="z-[200] bg-white rounded-xl border-slate-100 shadow-xl">
                                <SelectItem value="XAUUSD" className="font-bold py-3">XAUUSD</SelectItem>
                                <SelectItem value="EURUSD" className="font-bold py-3">EURUSD</SelectItem>
                                <SelectItem value="BTCUSD" className="font-bold py-3">BTCUSD</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider ml-1">Setup</Label>
                        {/* FIX: Value & onValueChange dipastikan terhubung */}
                        <Select value={formData.setup} onValueChange={(v) => setFormData({...formData, setup: v})}>
                            <SelectTrigger className="h-12 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-700">
                                <SelectValue placeholder="Select Setup" />
                            </SelectTrigger>
                            {/* FIX: Menambahkan z-[200] agar dropdown muncul DI DEPAN modal */}
                            <SelectContent className="z-[200] bg-white rounded-xl border-slate-100 shadow-xl">
                                <SelectItem value="SMC Sweep" className="font-medium py-3">SMC Sweep</SelectItem>
                                <SelectItem value="SnD RBD" className="font-medium py-3">SnD RBD</SelectItem>
                                <SelectItem value="Breakout" className="font-medium py-3">Breakout</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider ml-1">Risk (%)</Label>
                        <Input 
                            type="number" step="0.1" 
                            value={formData.riskPercent} 
                            onChange={(e) => setFormData({...formData, riskPercent: Number(e.target.value)})} 
                            className="h-12 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-700 text-lg" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider ml-1">SL (Pips)</Label>
                        <Input 
                            type="number" placeholder="0" 
                            value={formData.slPips || ""} 
                            onChange={(e) => setFormData({...formData, slPips: Number(e.target.value)})} 
                            className="h-12 bg-slate-50 border-0 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl font-bold text-slate-700 text-lg" 
                        />
                    </div>
                </div>
            </div>

            {/* HERO CALCULATION */}
            <div className="bg-white border-2 border-slate-100 rounded-[24px] p-5 flex items-center justify-between relative overflow-hidden group hover:border-indigo-100 transition-colors">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 z-0 opacity-50" />
                
                <div className="relative z-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Zap size={10} className="text-amber-400 fill-amber-400" /> Lot Size
                    </p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">{calculation.lotSize}</span>
                        <span className="text-sm font-bold text-slate-400">lot</span>
                    </div>
                </div>

                <div className="relative z-10 text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk Value</p>
                    <p className="text-lg font-black text-slate-700">${calculation.riskAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 pt-2 bg-white shrink-0 pb-safe">
            <Button 
                disabled={loading} 
                onClick={handleSubmit} 
                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-base shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex justify-between px-6 group"
            >
                <span>Execute Plan</span>
                <span className="opacity-70 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
            
            <div className="flex justify-center mt-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                    <AlertCircle size={10} className="text-slate-400" />
                    <span className="text-[9px] font-medium text-slate-400">Strictly follow your trading plan.</span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
