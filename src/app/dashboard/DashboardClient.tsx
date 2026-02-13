"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// --- ORGANISMS ---
import { Navbar } from "./_components/organisms/Navbar";
import { StatsGrid } from "./_components/organisms/StatsGrid";
import { RiskLockdown } from "./_components/organisms/RiskLockdown";
import { GrowthChart } from "./_components/organisms/GrowthChart";
import { StrategyGrid } from "./_components/organisms/StrategyGrid";
import { ExecutionTable } from "./_components/organisms/ExecutionTable";
import { MobileActionBar } from "./_components/organisms/MobileActionBar"; // IMPORT BARU

// --- LOGIC & MODALS ---
import { useDashboardStats } from "./_hooks/useDashboardStats";
import { closeTradeAction } from "./actions";
import { EntryModal } from "./_components/EntryModal";

export default function DashboardClient({ initialTrades, userProfile }: any) {
  const router = useRouter();
  const [isEntryModalOpen, setEntryModalOpen] = useState(false);

  const { 
    stats, 
    dynamicChartData, 
    currentBalance, 
    isCriticalZone, 
    setupPerformance,
    totalPnL,
    drawdownPercent
  } = useDashboardStats(initialTrades, userProfile.balance);

  const handleCloseTrade = async (id: string, status: "WIN" | "LOSS", pnl: number) => {
    await closeTradeAction(id, status, pnl);
    router.refresh(); 
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-32 md:pb-10 relative font-sans">
      
      {/* 1. Navbar: Hanya Logo & Status di mobile */}
      <Navbar 
        balance={currentBalance} 
        isCritical={isCriticalZone} 
        onOpenModal={() => setEntryModalOpen(true)} 
      />

      <main className="px-6 md:px-10 pt-8 md:pt-10 space-y-10 max-w-[1600px] mx-auto">
        <StatsGrid stats={stats} totalPnL={totalPnL} />

        {isCriticalZone && <RiskLockdown drawdown={drawdownPercent} />}

        <div className="grid md:grid-cols-3 gap-8">
          <GrowthChart data={dynamicChartData} />
          
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
             <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Session Protocol</p>
                <h3 className="text-xl font-black tracking-tight leading-tight uppercase">Capital Preservation is the Priority.</h3>
             </div>
             <div className="relative z-10 mt-8 pt-6 border-t border-white/5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target Recovery</p>
                <p className="text-lg font-black text-emerald-400 font-mono">20,000,000 IDR</p>
             </div>
          </div>
        </div>

        <StrategyGrid performance={setupPerformance} />
        <ExecutionTable trades={initialTrades} balance={userProfile.balance} onCloseTrade={handleCloseTrade} />
      </main>

      {/* --- MOBILE ACTION BAR: Selalu terlihat di bawah HP Zi --- */}
      <MobileActionBar 
        balance={currentBalance} 
        todayPnL={stats.todayPnL} 
        isCritical={isCriticalZone} 
        onOpenModal={() => setEntryModalOpen(true)} 
      />

      {isEntryModalOpen && <EntryModal onClose={() => setEntryModalOpen(false)} balance={userProfile.balance} />}
    </div>
  );
}
