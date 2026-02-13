import { useMemo } from "react";
import { calculateStats, generateEquityData } from "@/lib/calculations";

export function useDashboardStats(initialTrades: any[], initialBalance: number) {
  // 1. Hitung Stats Dasar (Win Rate, PnL, dll)
  const stats = useMemo(() => 
    calculateStats(initialTrades, initialBalance), 
  [initialTrades, initialBalance]);

  // 2. Generate Data Grafik Equity
  const dynamicChartData = useMemo(() => 
    generateEquityData(initialTrades, initialBalance), 
  [initialTrades, initialBalance]);

  // 3. Kalkulasi Saldo Berjalan (Net Liquidity)
  const totalPnL = useMemo(() => {
    return initialTrades.reduce((acc: number, trade: any) => acc + (trade.pnl || 0), 0);
  }, [initialTrades]);

  const currentBalance = initialBalance + totalPnL;

  // 4. Proteksi Drawdown (Critical Zone Check)
  const drawdownPercent = Number(stats.drawdownPercent || 0);
  const isCriticalZone = drawdownPercent >= 6; 

  // 5. Analisa Performa Per Strategi (Alpha Models)
  const setupPerformance = useMemo(() => {
    const setups = ["SMC Sweep", "SnD RBD", "Breakout"];
    return setups.map(name => {
      const filtered = initialTrades.filter((t: any) => t.setup === name && t.status !== "OPEN");
      const wins = filtered.filter((t: any) => t.status === "WIN").length;
      return {
        name,
        count: filtered.length,
        winRate: filtered.length > 0 ? Math.round((wins / filtered.length) * 100) : 0
      };
    });
  }, [initialTrades]);

  return {
    stats,
    dynamicChartData,
    currentBalance,
    drawdownPercent,
    isCriticalZone,
    setupPerformance,
    totalPnL
  };
}
