export const USER_PROFILE = {
  name: "Zi",
  balance: 1000,
  dailyLossLimit: 6, // 6%
};

export const CHART_DATA = [
  { day: "Sen", equity: 1000 }, 
  { day: "Sel", equity: 980 },
  { day: "Rab", equity: 1050 }, 
  { day: "Kam", equity: 1120 },
  { day: "Jum", equity: 1080 }, 
  { day: "Sab", equity: 1250 },
  { day: "Min", equity: 1320 },
];

export const INITIAL_TRADES = [
  { id: 1, pair: "XAUUSD", type: "SELL", price: 2045.50, lot: 0.10, risk: 20, pnl: 85.00, status: "WIN", setup: "SMC: Liquidity Sweep", date: "14:30" },
  { id: 2, pair: "EURUSD", type: "BUY", price: 1.0850, lot: 0.10, risk: 20, pnl: -20.00, status: "LOSS", setup: "SnD: RBD", date: "10:15" },
  { id: 3, pair: "GBPUSD", type: "SELL", price: 1.2650, lot: 0.05, risk: 10, pnl: 35.00, status: "WIN", setup: "Breakout Retest", date: "Yesterday" },
  { id: 4, pair: "XAUUSD", type: "BUY", price: 2030.00, lot: 0.10, risk: 20, pnl: -20.00, status: "LOSS", setup: "SMC: CHoCH", date: "Yesterday" },
];

// --- DATA BARU UNTUK ANALYTICS ---
export const TRADING_STATS = {
  winRate: 64, // %
  profitFactor: 2.1, 
  avgRR: 2.4, 
  currentStreak: 3, 
  bestPair: "XAUUSD",
  worstPair: "GBPUSD"
};

export const PERFORMANCE_BY_SETUP = [
  { name: "SMC: Liquidity Sweep", winRate: 75, count: 12 },
  { name: "SnD: RBD Zone", winRate: 60, count: 20 },
  { name: "Breakout Retest", winRate: 40, count: 10 },
];
