"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Activity } from "lucide-react"; // Import ikon tambahan

import TradingViewWidget from "@/components/charts/TradingViewWidget";

// --- ORGANISMS ---
import { Navbar } from "./_components/organisms/Navbar";
import { StatsGrid } from "./_components/organisms/StatsGrid";
import { RiskLockdown } from "./_components/organisms/RiskLockdown";
import { GrowthChart } from "./_components/organisms/GrowthChart";
import { StrategyGrid } from "./_components/organisms/StrategyGrid";
import { ExecutionTable } from "./_components/organisms/ExecutionTable";
import { MobileActionBar } from "./_components/organisms/MobileActionBar";

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
      
      <Navbar 
        balance={currentBalance} 
        isCritical={isCriticalZone} 
        onOpenModal={() => setEntryModalOpen(true)} 
      />

      <main className="px-6 md:px-10 pt-8 md:pt-10 space-y-12 max-w-[1600px] mx-auto">
        
        {/* 1. STATS OVERVIEW */}
        <StatsGrid stats={stats} totalPnL={totalPnL} />

        {/* 2. EMERGENCY LOCKDOWN (If drawdown >= 6%) */}
        {isCriticalZone && <RiskLockdown drawdown={drawdownPercent} />}

        {/* 3. MARKET INTELLIGENCE: LIVE ANALYSIS */}
        <div className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
                Market Intelligence.
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                Real-Time Analysis Protocol
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
               <Zap size={12} className="text-indigo-600 fill-indigo-600" />
               <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">NY Overlap Active</span>
            </div>
          </div>
          
          <div className="w-full h-[600px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
            {/* Widget TradingView Advanced Chart */}
            <TradingViewWidget symbol="OANDA:XAUUSD" />
          </div>
        </div>

        {/* 4. PERFORMANCE ANALYTICS: GROWTH TRAJECTORY */}
        <div className="space-y-6">
          <div className="px-2">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
              Equity Evolution.
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
              Portfolio Growth vs Target Projection (+20%/MO)
            </p>
          </div>
          <GrowthChart data={dynamicChartData} />
        </div>

        {/* 5. STRATEGY AUDIT: ALPHA MODELS */}
        <StrategyGrid performance={setupPerformance} />

        {/* 6. TRADE LOGS: EXECUTION HISTORY */}
        <ExecutionTable trades={initialTrades} balance={userProfile.balance} onCloseTrade={handleCloseTrade} />
      </main>

      <MobileActionBar 
        balance={currentBalance} 
        todayPnL={stats.todayPnL} 
        isCritical={isCriticalZone} 
        onOpenModal={() => setEntryModalOpen(true)} 
      />

      {isEntryModalOpen && (
        <EntryModal 
          onClose={() => setEntryModalOpen(false)} 
          balance={userProfile.balance} 
        />
      )}
    </div>
  );
}
