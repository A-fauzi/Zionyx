export function calculateStats(trades: any[], balance: number) {
  const closedTrades = trades.filter((t) => t.status !== "OPEN");
  const wins = closedTrades.filter((t) => t.status === "WIN");
  const losses = closedTrades.filter((t) => t.status === "LOSS");

  const winRate = closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0;

  const totalProfit = wins.reduce((acc, t) => acc + t.pnl, 0);
  const totalLoss = Math.abs(losses.reduce((acc, t) => acc + t.pnl, 0));
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? 99 : 0;

  // Hitung Drawdown Hari Ini
  const today = new Date().toDateString();
  const todayPnL = trades
    .filter((t) => new Date(t.createdAt || Date.now()).toDateString() === today)
    .reduce((acc, t) => acc + t.pnl, 0);

  // Drawdown adalah penurunan, jadi jika PnL negatif (-20), drawdown jadi positif (2%)
  const drawdownPercent = (todayPnL / balance) * -100;

  return {
    winRate: winRate.toFixed(1),
    profitFactor: profitFactor.toFixed(2),
    todayPnL,
    drawdownPercent: drawdownPercent < 0 ? 0 : drawdownPercent, // Jangan tampilkan negatif jika sedang profit
    currentStreak: 0 // Bisa ditambah logika streak nanti
  };
}
