"use client";

import React, { useState } from "react";
import { X, Calculator, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Sub-component Checklist
function CheckItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <div 
      onClick={() => setChecked(!checked)}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors", // Ganti active:scale jadi transition-colors biasa
        checked ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100 hover:bg-slate-50"
      )}
    >
       <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors", checked ? "bg-emerald-500" : "bg-slate-200")}>
          {checked && <Check size={12} className="text-white" />}
       </div>
       <span className={cn("text-xs md:text-sm font-bold select-none", checked ? "text-slate-800" : "text-slate-500")}>{label}</span>
    </div>
  )
}

export function EntryModal({ onClose, balance, onSubmit }: any) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ pair: "XAUUSD", type: "SELL", slPips: 30, riskPercent: 1 });

  const riskAmount = (balance * formData.riskPercent) / 100;
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
    // Container Fixed memenuhi layar
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4">
      
      {/* BACKDROP: Layer Hitam Transparan (Tanpa Animasi, Tanpa Blur) */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60"
      />
      
      {/* MODAL CONTENT: Kotak Putih Statis */}
      <div className="relative bg-white w-full max-w-lg rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Progress Bar: Menggunakan CSS Transition biasa (Ringan) */}
        <div className="h-1.5 bg-slate-100 w-full shrink-0">
           <div 
             className="h-full bg-indigo-600 transition-all duration-300 ease-in-out"
             style={{ width: step === 1 ? '50%' : '100%' }}
           />
        </div>

        <div className="p-6 overflow-y-auto">
           {/* Header */}
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg md:text-xl font-black text-slate-900">
                {step === 1 ? "Psychology Check" : "Technical Setup"}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-100">
                <X size={20} />
              </Button>
           </div>

           {/* Content Steps */}
           {step === 1 ? (
             <div className="space-y-3">
               <p className="text-xs text-slate-500 font-medium mb-2">Validasi kondisi mental sebelum entry:</p>
               <CheckItem label="Kondisi tenang (tidak emosional)" />
               <CheckItem label="Bukan revenge trading" />
               <CheckItem label="Siap menerima risiko loss" />
               <CheckItem label="Setup valid sesuai Plan" />
               
               <Button className="w-full mt-6 bg-slate-900 hover:bg-slate-800 rounded-xl" size="lg" onClick={() => setStep(2)}>
                 Mental Aman, Lanjut
               </Button>
             </div>
           ) : (
             <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase">Pair</Label>
                      <div className="relative">
                        <select 
                            className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm font-bold ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.pair} onChange={e => setFormData({...formData, pair: e.target.value})}
                        >
                            <option>XAUUSD</option><option>EURUSD</option><option>GBPUSD</option>
                        </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase">Risk %</Label>
                      <select 
                        className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm font-bold ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.riskPercent} onChange={e => setFormData({...formData, riskPercent: Number(e.target.value)})}
                      >
                         <option value={1}>1% (Safe)</option><option value={2}>2% (Std)</option><option value={3}>3% (Aggr)</option>
                      </select>
                   </div>
                </div>

                <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-100">
                   {['BUY', 'SELL'].map(type => (
                      <button 
                        key={type}
                        onClick={() => setFormData({...formData, type: type})} 
                        className={cn(
                          "flex-1 py-3 rounded-lg text-xs font-black transition-colors", // Transition CSS biasa
                          formData.type === type 
                            ? (type === 'BUY' ? "bg-indigo-600 text-white shadow-md" : "bg-orange-600 text-white shadow-md") 
                            : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {type}
                      </button>
                   ))}
                </div>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3 relative overflow-hidden">
                   <div className="flex items-center gap-2 mb-1 text-indigo-600">
                      <Calculator size={14} />
                      <span className="text-[10px] font-black uppercase">Auto Calc</span>
                   </div>
                   <div>
                      <Label className="text-[10px] font-bold text-slate-400 uppercase">Stop Loss (Pips)</Label>
                      <Input 
                        type="number" 
                        value={formData.slPips}
                        onChange={e => setFormData({...formData, slPips: Number(e.target.value)})}
                        className="bg-white font-bold mt-1 h-11 rounded-lg"
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

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl h-12 text-base font-bold shadow-lg shadow-indigo-200" onClick={handleSubmit}>
                    EXECUTE PLAN
                </Button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
