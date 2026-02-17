"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Zap, Activity, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import TradingViewWidget from "@/components/charts/TradingViewWidget";

// --- ORGANISMS ---
import { Navbar } from "./_components/organisms/Navbar";
import { StatsGrid } from "./_components/organisms/StatsGrid";
import { RiskLockdown } from "./_components/organisms/RiskLockdown";
import { GrowthChart } from "./_components/organisms/GrowthChart";
import { StrategyGrid } from "./_components/organisms/StrategyGrid";
import { ExecutionTable } from "./_components/organisms/ExecutionTable";
import { MobileActionBar } from "./_components/organisms/MobileActionBar";
import { WeeklyReport } from "./_components/organisms/WeeklyReport";

// --- MOLECULES ---
import { DateRangeFilter } from "./_components/molecules/DateRangeFilter";
import { EntryModal } from "./_components/molecules/EntryModal";

// --- LOGIC ---
import { useDashboardStats } from "./_hooks/useDashboardStats";
import { closeTradeAction } from "./actions";

export default function DashboardClient({ initialTrades, userProfile }: any) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isEntryModalOpen, setEntryModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  // Filter trades based on selected date range
  const filteredTrades = useMemo(() => {
    if (dateRange === "all") return initialTrades;
    
    const now = new Date();
    const cutoff = new Date();
    
    if (dateRange === "7d") {
      cutoff.setDate(now.getDate() - 7);
    } else if (dateRange === "30d") {
      cutoff.setDate(now.getDate() - 30);
    } else if (dateRange === "90d") {
      cutoff.setDate(now.getDate() - 90);
    }
    
    return initialTrades.filter((t: any) => {
      const tradeDate = new Date(t.createdAt ?? t.created_at);
      return tradeDate >= cutoff;
    });
  }, [initialTrades, dateRange]);

  // Calculate stats from filtered trades
  const { 
    stats, 
    dynamicChartData, 
    currentBalance, 
    isCriticalZone, 
    setupPerformance,
    totalPnL,
    drawdownPercent
  } = useDashboardStats(filteredTrades, userProfile.balance);

  const handleCloseTrade = async (id: string, status: "WIN" | "LOSS", pnl: number) => {
    await closeTradeAction(id, status, pnl);
    router.refresh(); 
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-32 md:pb-10 relative font-sans">
      
      <div className="sticky top-0 z-50 bg-[#F8FAFC]/95 backdrop-blur-lg border-b border-slate-200/50">
        <Navbar 
          balance={currentBalance} 
          isCritical={isCriticalZone} 
          onOpenModal={() => setEntryModalOpen(true)} 
        />
        
        {/* Date Range Filter Bar */}
        <div className="px-6 md:px-10 py-3 flex justify-end">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <main className="px-6 md:px-10 pt-8 md:pt-10 space-y-12 max-w-[1600px] mx-auto">
        
        {/* 1. STATS OVERVIEW */}
        <StatsGrid stats={stats} totalPnL={totalPnL} />

        {/* 2. EMERGENCY LOCKDOWN (If drawdown >= 6%) */}
        {isCriticalZone && <RiskLockdown drawdown={drawdownPercent} />}

        {/* 3. MARKET INTELLIGENCE: LIVE ANALYSIS */}
        <div className="space-y-5">
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-5">

            <div className="flex justify-between items-center px-1">
              <div>
                <h2 className="text-[13px] font-semibold text-slate-900 tracking-tight leading-none">
                  Market Intelligence
                </h2>
                <p className="text-[11px] text-slate-400 tracking-normal mt-1 font-normal">
                  Real-time analysis · Advanced chart tools
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
                  <Zap size={10} className="text-indigo-500 fill-indigo-500" />
                  <span className="text-[10px] font-medium text-indigo-600 tracking-normal">NY Overlap Active</span>
                </div>
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors duration-200">
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform duration-300 ease-in-out ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                </CollapsibleTrigger>
              </div>
            </div>

            <CollapsibleContent className="space-y-4">
              {/* Widget TradingView */}
              <div className="w-full h-[600px] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 relative">
                <TradingViewWidget symbol="OANDA:XAUUSD" height={600} />
              </div>

              {/* Info Bar */}
              <div className="flex flex-wrap items-center justify-center gap-2 px-1">
                <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-md">
                  <span className="text-[10px] font-medium text-emerald-700 flex items-center gap-1">
                    <Activity size={9} className="text-emerald-500" />
                    MA · EMA · RSI · MACD · BB · Volume
                  </span>
                </div>
                <div className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-md">
                  <span className="text-[10px] font-medium text-blue-600">
                    Multi-asset support
                  </span>
                </div>
                <div className="px-2.5 py-1 bg-violet-50 border border-violet-100 rounded-md">
                  <span className="text-[10px] font-medium text-violet-600">
                    Economic calendar · News feed
                  </span>
                </div>
              </div>
            </CollapsibleContent>

          </Collapsible>
        </div>

        {/* 4. PERFORMANCE ANALYTICS: GROWTH TRAJECTORY */}
        <div className="space-y-5">
          <div className="px-1">
            <h2 className="text-[13px] font-semibold text-slate-900 tracking-tight leading-none">
              Equity Evolution
            </h2>
            <p className="text-[11px] text-slate-400 tracking-normal mt-1 font-normal">
              Portfolio growth vs target projection (+20%/mo)
            </p>
          </div>
          <GrowthChart data={dynamicChartData} />
        </div>

        {/* 5. WEEKLY SETTLEMENT REPORT */}
        <WeeklyReport 
          trades={filteredTrades} 
          balance={userProfile.balance}
          dateRange={dateRange}
        />

        {/* 6. STRATEGY AUDIT: ALPHA MODELS */}
        <StrategyGrid performance={setupPerformance} />

        {/* 7. TRADE LOGS: EXECUTION HISTORY */}
        <ExecutionTable 
          trades={filteredTrades} 
          balance={userProfile.balance} 
          onCloseTrade={handleCloseTrade} 
        />
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
          balance={currentBalance}
          trades={filteredTrades}
        />
      )}
    </div>
  );
}
