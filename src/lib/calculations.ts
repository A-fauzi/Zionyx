/**
 * Menghitung semua metrik trading Zi secara otomatis.
 */
export function calculateStats(trades: any[], balance: number) {
  const closedTrades = trades.filter((t) => t.status !== "OPEN");
  const wins = closedTrades.filter((t) => t.status === "WIN");
  const losses = closedTrades.filter((t) => t.status === "LOSS");

  const winRate = closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0;
  const totalProfit = wins.reduce((acc, t) => acc + t.pnl, 0);
  const totalLoss = Math.abs(losses.reduce((acc, t) => acc + t.pnl, 0));
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 99 : 0;

  // --- LOGIKA AUTO-RESET JAM 05:00 WIB ---
  const now = new Date();
  const resetTime = new Date();
  resetTime.setHours(5, 0, 0, 0); 

  let sessionStart: Date;
  if (now < resetTime) {
    sessionStart = new Date(resetTime);
    sessionStart.setDate(sessionStart.getDate() - 1);
  } else {
    sessionStart = resetTime;
  }

  const sessionTrades = trades.filter((t) => new Date(t.createdAt) >= sessionStart);
  const sessionPnL = sessionTrades.reduce((acc, t) => acc + t.pnl, 0);
  const drawdownPercent = (sessionPnL / balance) * -100;

  return {
    winRate: winRate.toFixed(1),
    profitFactor: profitFactor.toFixed(2),
    todayPnL: sessionPnL.toFixed(2),
    drawdownPercent: drawdownPercent < 0 ? "0.0" : drawdownPercent.toFixed(1),
    sessionStart: sessionStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

/**
 * Menghasilkan data Growth Curve & Target Line secara akumulatif.
 */
export function generateEquityData(trades: any[], initialBalance: number) {
  const closedTrades = trades
    .filter((t) => t.status !== "OPEN")
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  let currentEquity = initialBalance;
  const targetMonthlyProfit = 200; // Target profit Zi $200/bulan.
  const steps = Math.max(closedTrades.length, 10);
  const targetStep = targetMonthlyProfit / steps;

  const chartData = [{ date: "Start", equity: initialBalance, target: initialBalance }];

  closedTrades.forEach((trade, index) => {
    currentEquity += trade.pnl;
    chartData.push({
      date: new Date(trade.createdAt).toLocaleDateString([], { day: '2-digit', month: 'short' }),
      equity: Number(currentEquity.toFixed(2)),
      target: Number((initialBalance + (targetStep * (index + 1))).toFixed(2))
    });
  });

  // Melanjutkan garis target ke masa depan jika data masih sedikit
  if (chartData.length < 10) {
    for (let i = chartData.length; i <= 10; i++) {
      chartData.push({
        date: `P-${i}`,
        equity: undefined as any,
        target: Number((initialBalance + (targetStep * i)).toFixed(2))
      });
    }
  }

  return chartData;
}
