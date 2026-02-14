"use client";

import React, { useEffect, useRef, memo, useState } from 'react';

interface TradingViewWidgetProps {
  symbol?: string;
  height?: number;
}

// Daftar market populer
const MARKETS = [
  { symbol: "OANDA:XAUUSD", name: "Gold", category: "Commodities", icon: "🥇" },
  { symbol: "OANDA:XAGUSD", name: "Silver", category: "Commodities", icon: "⚪" },
  { symbol: "TVC:USOIL", name: "Crude Oil", category: "Commodities", icon: "🛢️" },
  { symbol: "COMEX:GC1!", name: "Gold Futures", category: "Commodities", icon: "📊" },
  
  { symbol: "FX:EURUSD", name: "EUR/USD", category: "Forex", icon: "💱" },
  { symbol: "FX:GBPUSD", name: "GBP/USD", category: "Forex", icon: "💱" },
  { symbol: "FX:USDJPY", name: "USD/JPY", category: "Forex", icon: "💱" },
  { symbol: "FX:AUDUSD", name: "AUD/USD", category: "Forex", icon: "💱" },
  { symbol: "FX:USDCHF", name: "USD/CHF", category: "Forex", icon: "💱" },
  
  { symbol: "BINANCE:BTCUSDT", name: "Bitcoin", category: "Crypto", icon: "₿" },
  { symbol: "BINANCE:ETHUSDT", name: "Ethereum", category: "Crypto", icon: "Ξ" },
  { symbol: "BINANCE:BNBUSDT", name: "BNB", category: "Crypto", icon: "🟡" },
  { symbol: "BINANCE:SOLUSDT", name: "Solana", category: "Crypto", icon: "◎" },
  { symbol: "BINANCE:XRPUSDT", name: "Ripple", category: "Crypto", icon: "✖️" },
  { symbol: "BINANCE:ADAUSDT", name: "Cardano", category: "Crypto", icon: "🔵" },
  
  { symbol: "NASDAQ:AAPL", name: "Apple", category: "US Stocks", icon: "🍎" },
  { symbol: "NASDAQ:TSLA", name: "Tesla", category: "US Stocks", icon: "🚗" },
  { symbol: "NASDAQ:NVDA", name: "NVIDIA", category: "US Stocks", icon: "🎮" },
  { symbol: "NASDAQ:MSFT", name: "Microsoft", category: "US Stocks", icon: "🪟" },
  { symbol: "NASDAQ:GOOGL", name: "Google", category: "US Stocks", icon: "🔍" },
  { symbol: "NASDAQ:AMZN", name: "Amazon", category: "US Stocks", icon: "📦" },
  { symbol: "NASDAQ:META", name: "Meta", category: "US Stocks", icon: "👤" },
  
  { symbol: "IDX:BBCA", name: "Bank BCA", category: "IDX", icon: "🏦" },
  { symbol: "IDX:BBRI", name: "Bank BRI", category: "IDX", icon: "🏦" },
  { symbol: "IDX:BMRI", name: "Bank Mandiri", category: "IDX", icon: "🏦" },
  { symbol: "IDX:TLKM", name: "Telkom", category: "IDX", icon: "📱" },
  { symbol: "IDX:ASII", name: "Astra International", category: "IDX", icon: "🚙" },
  { symbol: "IDX:UNVR", name: "Unilever", category: "IDX", icon: "🧴" },
];

const INTERVALS = [
  { value: "1", label: "1m" },
  { value: "5", label: "5m" },
  { value: "15", label: "15m" },
  { value: "30", label: "30m" },
  { value: "60", label: "1H" },
  { value: "240", label: "4H" },
  { value: "D", label: "1D" },
  { value: "W", label: "1W" },
];

function TradingViewWidget({ symbol = "OANDA:XAUUSD", height = 600 }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  
  const [selectedSymbol, setSelectedSymbol] = useState(symbol);
  const [selectedInterval, setSelectedInterval] = useState("15");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showControls, setShowControls] = useState(false);

  const categories = ["All", ...Array.from(new Set(MARKETS.map(m => m.category)))];
  
  const filteredMarkets = MARKETS.filter(m => {
    const matchCategory = selectedCategory === "All" || m.category === selectedCategory;
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       m.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  useEffect(() => {
    if (!container.current) return;

    if (scriptRef.current) {
      scriptRef.current.remove();
    }

    setIsLoading(true);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": selectedSymbol,
      "interval": selectedInterval,
      "timezone": "Asia/Jakarta",
      "theme": theme,
      "style": "1",
      "locale": "id",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "save_image": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "hide_side_toolbar": false,
      "toolbar_bg": theme === 'dark' ? "#1E222D" : "#f1f3f6",
      "withdateranges": true,
      "range": "12M",
      "studies": [
        "MASimple@tv-basicstudies",
        "MAExp@tv-basicstudies",
        "RSI@tv-basicstudies",
        "MACD@tv-basicstudies",
        "Volume@tv-basicstudies",
        "BB@tv-basicstudies"
      ],
      "show_popup_button": true,
      "popup_width": "1000",
      "popup_height": "650",
      "support_host": "https://www.tradingview.com",
      "calendar": true,
      "news": ["headlines"],
      "details": true,
      "hotlist": true,
      "watchlist": MARKETS.slice(0, 10).map(m => m.symbol),
      "gridColor": theme === 'dark' ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
      "backgroundColor": theme === 'dark' ? "#131722" : "#ffffff",
      "enabled_features": [
        "study_templates",
        "use_localstorage_for_settings",
        "save_chart_properties_to_local_storage",
        "chart_style_hilo",
        "items_favoriting",
        "datasource_copypaste"
      ],
      "time_frames": [
        { "text": "5y", "resolution": "1W" },
        { "text": "1y", "resolution": "1D" },
        { "text": "6m", "resolution": "240" },
        { "text": "3m", "resolution": "60" },
        { "text": "1m", "resolution": "30" },
        { "text": "5d", "resolution": "5" },
        { "text": "1d", "resolution": "1" }
      ],
      "container_id": "tradingview_widget"
    });

    script.onload = () => {
      setTimeout(() => setIsLoading(false), 500);
    };
    
    script.onerror = () => {
      setIsLoading(false);
      console.error('Failed to load TradingView widget');
    };

    container.current.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
    };
  }, [selectedSymbol, selectedInterval, theme]);

  const currentMarket = MARKETS.find(m => m.symbol === selectedSymbol);
  const currentInterval = INTERVALS.find(i => i.value === selectedInterval);

  return (
    <div className="relative w-full h-full">
      {/* Toggle Control Button - Floating */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute top-4 right-4 z-20 px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-white border border-slate-200 rounded-xl shadow-lg text-xs font-bold text-slate-700 transition-all hover:scale-105 flex items-center gap-2"
      >
        <span className={`transform transition-transform ${showControls ? 'rotate-180' : ''}`}>⚙️</span>
        {showControls ? 'Hide' : 'Controls'}
      </button>

      {/* Advanced Controls Panel - Collapsible */}
      {showControls && (
        <div className="absolute top-16 right-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-2xl max-h-[500px] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Chart Controls
              </h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">
                Advanced Trading Tools
              </p>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              {theme === 'light' ? '🌙' : '☀️'}
              <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
          </div>

          {/* Main Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            
            {/* Market Selector */}
            <div className="md:col-span-2">
              <label className="block text-[9px] font-black text-slate-600 uppercase tracking-wider mb-1.5">
                📊 Market
              </label>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                {filteredMarkets.map((market) => (
                  <option key={market.symbol} value={market.symbol}>
                    {market.icon} {market.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Interval Selector */}
            <div>
              <label className="block text-[9px] font-black text-slate-600 uppercase tracking-wider mb-1.5">
                ⏱️ Timeframe
              </label>
              <select
                value={selectedInterval}
                onChange={(e) => setSelectedInterval(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                {INTERVALS.map((interval) => (
                  <option key={interval.value} value={interval.value}>
                    {interval.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-[9px] font-black text-slate-600 uppercase tracking-wider mb-1.5">
                🏷️ Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-black text-slate-600 uppercase tracking-wider mb-1.5">
                🔍 Search
              </label>
              <input
                type="text"
                placeholder="Search market..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div>
            <label className="block text-[9px] font-black text-slate-600 uppercase tracking-wider mb-2">
              ⚡ Quick Select
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MARKETS.slice(0, 6).map((market) => (
                <button
                  key={market.symbol}
                  onClick={() => setSelectedSymbol(market.symbol)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    selectedSymbol === market.symbol
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {market.icon} {market.name}
                </button>
              ))}
            </div>
          </div>

          {/* Current Selection Info */}
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-600 uppercase tracking-wider">Active:</span>
                <span className="px-2 py-0.5 bg-indigo-100 rounded font-bold text-indigo-700">
                  {currentMarket?.icon} {currentMarket?.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-600 uppercase tracking-wider">TF:</span>
                <span className="px-2 py-0.5 bg-purple-100 rounded font-bold text-purple-700">
                  {currentInterval?.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Container */}
      <div className="relative w-full h-full">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10 rounded-[2.5rem]">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-indigo-200 rounded-full"></div>
                <div className="w-12 h-12 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-slate-700 uppercase tracking-tight">
                  Loading {currentMarket?.name || 'Chart'}
                </p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">
                  Preparing analysis...
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div 
          className="tradingview-widget-container h-full w-full" 
          ref={container}
        >
          <div 
            id="tradingview_widget"
            className="tradingview-widget-container__widget h-full w-full"
          ></div>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
