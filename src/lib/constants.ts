export const SOP_CONFIG = {
  ICT: [
    "HTF Liquidity Swept (Internal/External)",
    "Market Structure Shift + Displacement",
    "Fair Value Gap (FVG) / Orderblock Entry",
    "Killzone Time Window (London/NY Open)"
  ],
  SnD: [
    "Fresh Supply/Demand Zone Identified",
    "Aggressive Departure (Imbalance)",
    "Clean Profit Margin (RR 1:3+)",
    "Trend HTF Alignment"
  ],
  SnR: [
    "Major S/R Level Rejection",
    "Candlestick Momentum Exhaustion",
    "Breakout & Retest Confirmation",
    "Confluence with Psychological Level"
  ]
};

export type StrategyType = keyof typeof SOP_CONFIG;
