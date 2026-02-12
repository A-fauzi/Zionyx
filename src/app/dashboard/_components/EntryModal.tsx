"use client";

import React, { useState } from "react";
import { X, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addTradeAction } from "../actions";
import { useRouter } from "next/navigation";

export function EntryModal({ onClose, balance }: any) {
  const router = useRouter();
  const [formData, setFormData] = useState({ pair: "XAUUSD", type: "SELL", slPips: 30, riskPercent: 1, setup: "SMC Sweep" });

  const riskAmount = (balance * formData.riskPercent) / 100;
  const lotSize = (riskAmount / (formData.slPips * 1)).toFixed(2); 

  const handleSubmit = async () => {
    await addTradeAction({
      ...formData,
      lot: parseFloat(lotSize),
      risk: riskAmount,
      status: "OPEN",
    });
    onClose();
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/60" />
      <div className="relative bg-white w-full max-w-lg rounded-t-[2rem] md:rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">Execute Plan</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase">Risk %</Label>
              <Input type="number" value={formData.riskPercent} onChange={e => setFormData({...formData, riskPercent: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase">SL (Pips)</Label>
              <Input type="number" value={formData.slPips} onChange={e => setFormData({...formData, slPips: Number(e.target.value)})} />
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-end border">
             <div>
                <p className="text-[10px] font-bold text-slate-400">Calculated Lot</p>
                <p className="text-2xl font-black text-indigo-600">{lotSize}</p>
             </div>
             <Calculator className="text-indigo-200" size={32} />
          </div>

          <Button onClick={handleSubmit} className="w-full bg-indigo-600 h-12 rounded-xl font-bold">EXECUTE PLAN</Button>
        </div>
      </div>
    </div>
  );
}
