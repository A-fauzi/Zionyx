"use client";

import React, { useState, useMemo } from "react";
import { 
  BarChart3, Clock, ArrowUpRight, ArrowDownRight, 
  Microscope, BrainCircuit, Target, ShieldCheck,
  ChevronLeft, ChevronRight, Filter, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ExecutionTableProps {
  trades: any[];
  onCloseTrade: (id: string, status: "WIN" | "LOSS", pnl: number) => void;
  balance: number;
}

type StatusFilter = "all" | "OPEN" | "WIN" | "LOSS";
type SetupFilter = "all" | "ICT" | "SnD" | "SnR";

export function ExecutionTable({ trades, onCloseTrade, balance }: ExecutionTableProps) {
  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [setupFilter, setSetupFilter] = useState<SetupFilter>("all");
  const [pairFilter, setPairFilter] = useState<string>("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique pairs for filter
  const uniquePairs = useMemo(() => {
    const pairs = new Set(trades.map((t) => t.pair));
    return Array.from(pairs).sort();
  }, [trades]);

  // Filter trades
  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const matchStatus = statusFilter === "all" || trade.status === statusFilter;
      const matchSetup = setupFilter === "all" || trade.setup === setupFilter;
      const matchPair = pairFilter === "all" || trade.pair === pairFilter;
      return matchStatus && matchSetup && matchPair;
    });
  }, [trades, statusFilter, setupFilter, pairFilter]);

  // Paginate
  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  const paginatedTrades = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredTrades.slice(start, end);
  }, [filteredTrades, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, setupFilter, pairFilter]);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    setSetupFilter("all");
    setPairFilter("all");
  };

  const hasActiveFilters = statusFilter !== "all" || setupFilter !== "all" || pairFilter !== "all";

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <BarChart3 size={22} />
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight leading-none">
              Execution Audit
            </h3>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">
              Verified Zionyx Protocol Log
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 tracking-wide">
            Active Records:
          </span>
          <span className="text-sm font-bold text-slate-900 font-mono">
            {filteredTrades.length}
          </span>
          {hasActiveFilters && (
            <span className="text-[9px] text-slate-400">
              / {trades.length} total
            </span>
          )}
        </div>
      </div>

      {/* FILTERS BAR */}
      <Card className="rounded-2xl border-slate-200 bg-white p-4">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
            <Filter size={14} className="text-slate-400" />
            <span>Filter Trades</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1">
              {(["all", "OPEN", "WIN", "LOSS"] as StatusFilter[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200",
                    statusFilter === status
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {status === "all" ? "All Status" : status}
                </button>
              ))}
            </div>

            {/* Setup Filter */}
            <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1">
              {(["all", "ICT", "SnD", "SnR"] as SetupFilter[]).map((setup) => (
                <button
                  key={setup}
                  onClick={() => setSetupFilter(setup)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200",
                    setupFilter === setup
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {setup === "all" ? "All Setups" : setup}
                </button>
              ))}
            </div>

            {/* Pair Filter */}
            <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1">
              <button
                onClick={() => setPairFilter("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200",
                  pairFilter === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                All Pairs
              </button>
              {uniquePairs.map((pair) => (
                <button
                  key={pair}
                  onClick={() => setPairFilter(pair)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all duration-200",
                    pairFilter === pair
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {pair}
                </button>
              ))}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X size={12} />
                Clear
              </button>
            )}
          </div>
        </div>
      </Card>

      <Card className="rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/60 overflow-hidden bg-white">
        {/* DESKTOP VIEW */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-semibold text-slate-400 tracking-wide">
              <tr>
                <th className="px-8 py-6">Timestamp & Strategy</th>
                <th className="px-6 py-6">Asset</th>
                <th className="px-6 py-6 text-center">Audit Layer</th>
                <th className="px-6 py-6">Risk Protocol</th>
                <th className="px-6 py-6">Execution</th>
                <th className="px-8 py-6 text-right">Result (PnL)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm font-medium">
              {paginatedTrades.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                        <Filter size={24} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">No trades found</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Try adjusting your filters
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTrades.map((trade) => {
                  const rMultiple = trade.status !== "OPEN" ? (trade.pnl / trade.risk).toFixed(1) : "-";
                  const riskPercent = ((trade.risk / balance) * 100).toFixed(1);

                  return (
                    <tr key={trade.id} className="hover:bg-slate-50/30 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors shrink-0">
                            <Clock size={14} className="shrink-0" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs tracking-tight truncate">
                              {trade.setup}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400 font-mono">
                              {new Date(trade.createdAt).toLocaleDateString([], {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center border-2 shadow-sm transition-transform group-hover:scale-105 shrink-0",
                              trade.type === "BUY"
                                ? "bg-white border-indigo-100 text-indigo-600"
                                : "bg-white border-orange-100 text-orange-600"
                            )}
                          >
                            {trade.type === "BUY" ? (
                              <ArrowUpRight size={18} strokeWidth={3} className="shrink-0" />
                            ) : (
                              <ArrowDownRight size={18} strokeWidth={3} className="shrink-0" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 font-mono text-sm leading-none mb-1">
                              {trade.pair}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[8px] font-bold py-0 px-1.5 border-none",
                                trade.type === "BUY"
                                  ? "bg-indigo-50 text-indigo-600"
                                  : "bg-orange-50 text-orange-600"
                              )}
                            >
                              {trade.type}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={cn(
                              "px-3 py-1 rounded-lg text-[9px] font-bold tracking-wide border shadow-sm shrink-0",
                              trade.psychology === "LOW"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : trade.psychology === "HIGH"
                                ? "bg-rose-50 text-rose-600 border-rose-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                            )}
                          >
                            {trade.psychology || "LOW"}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 max-w-[150px] w-full justify-center">
                            <Microscope size={10} className="shrink-0" />
                            <span
                              className="text-[10px] font-medium tracking-tight truncate"
                              title={trade.reason}
                            >
                              {trade.reason || "SOP ALIGNED"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1.5 min-w-[100px]">
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-slate-900 font-mono">
                              {trade.lot} LOTS
                            </span>
                            <span className="text-[9px] font-medium text-slate-400 tracking-tight">
                              {riskPercent}% Risk
                            </span>
                          </div>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                Number(riskPercent) > 2 ? "bg-rose-500" : "bg-indigo-500"
                              )}
                              style={{ width: `${Math.min(Number(riskPercent) * 20, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {trade.status === "OPEN" ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => onCloseTrade(trade.id, "WIN", trade.risk * 2)}
                              className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95 tracking-wide"
                            >
                              WIN
                            </button>
                            <button
                              onClick={() => onCloseTrade(trade.id, "LOSS", -trade.risk)}
                              className="h-8 px-4 border border-slate-200 text-slate-500 hover:bg-slate-50 text-[10px] font-bold rounded-xl transition-all active:scale-95 tracking-wide"
                            >
                              LOSS
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <Badge
                              className={cn(
                                "text-[9px] font-bold px-3 py-1 rounded-lg border-2 shrink-0",
                                trade.status === "WIN"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  : "bg-rose-50 text-rose-700 border-rose-100"
                              )}
                            >
                              {trade.status === "WIN" ? "TARGET HIT" : "STOP LOSS"}
                            </Badge>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                              {rMultiple}R
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span
                          className={cn(
                            "text-lg font-bold font-mono tracking-tighter transition-all",
                            trade.status === "OPEN"
                              ? "text-slate-300 animate-pulse italic"
                              : trade.pnl > 0
                              ? "text-emerald-600"
                              : "text-rose-600"
                          )}
                        >
                          {trade.status === "OPEN"
                            ? "PENDING"
                            : `${trade.pnl > 0 ? "+" : ""}$${trade.pnl.toLocaleString()}`}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="lg:hidden divide-y divide-slate-100">
          {paginatedTrades.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <Filter size={24} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">No trades found</p>
                  <p className="text-[11px] text-slate-500 mt-1">Try adjusting your filters</p>
                </div>
              </div>
            </div>
          ) : (
            paginatedTrades.map((trade) => (
              <div key={trade.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0",
                        trade.type === "BUY"
                          ? "bg-white border-indigo-100 text-indigo-600"
                          : "bg-white border-orange-100 text-orange-600"
                      )}
                    >
                      {trade.type === "BUY" ? (
                        <ArrowUpRight size={18} strokeWidth={3} className="shrink-0" />
                      ) : (
                        <ArrowDownRight size={18} strokeWidth={3} className="shrink-0" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 font-mono text-base tracking-tight leading-none truncate">
                        {trade.pair}
                      </h4>
                      <p className="text-[10px] font-medium text-slate-400 tracking-wide mt-1 truncate">
                        {trade.setup}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={cn(
                        "text-lg font-bold font-mono tracking-tighter",
                        trade.status === "OPEN"
                          ? "text-slate-300 animate-pulse"
                          : trade.pnl > 0
                          ? "text-emerald-600"
                          : "text-rose-600"
                      )}
                    >
                      {trade.status === "OPEN"
                        ? "---"
                        : `${trade.pnl > 0 ? "+" : ""}$${trade.pnl.toLocaleString()}`}
                    </p>
                    <p className="text-[9px] font-medium text-slate-400 tracking-wide font-mono">
                      {new Date(trade.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-y border-slate-50 gap-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <BrainCircuit size={12} className="text-slate-300 shrink-0" />
                    <span
                      className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-md border shrink-0",
                        trade.psychology === "LOW"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      )}
                    >
                      {trade.psychology || "LOW"}
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 truncate max-w-[80px]">
                      {trade.reason}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-900 font-mono shrink-0">
                    <span>{trade.lot}L</span>
                    <span className="text-slate-200">|</span>
                    <span className="text-slate-400">${trade.risk}</span>
                  </div>
                </div>

                {trade.status === "OPEN" ? (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => onCloseTrade(trade.id, "WIN", trade.risk * 2)}
                      className="h-12 bg-emerald-600 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-50 active:scale-95 transition-all tracking-wide flex items-center justify-center gap-2"
                    >
                      <Target size={14} className="shrink-0" /> WIN (2R)
                    </button>
                    <button
                      onClick={() => onCloseTrade(trade.id, "LOSS", -trade.risk)}
                      className="h-12 border border-slate-200 text-slate-500 text-xs font-bold rounded-2xl active:scale-95 transition-all tracking-wide flex items-center justify-center gap-2"
                    >
                      LOSS (-1R)
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-2 gap-4">
                    <div className="flex items-center gap-1.5 text-slate-400 min-w-0">
                      <Microscope size={12} className="shrink-0" />
                      <span className="text-[10px] font-medium tracking-tight truncate">
                        {trade.reason || "SOP COMPLIANT"}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-bold rounded-lg px-3 py-1 shrink-0",
                        trade.status === "WIN"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      )}
                    >
                      {trade.status === "WIN" ? "TARGET HIT" : "STOP LOSS"}
                    </Badge>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-[11px] text-slate-500 font-medium">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredTrades.length)} of{" "}
            {filteredTrades.length} trades
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 px-3 rounded-xl disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, current, and neighbors
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, idx, arr) => {
                  // Add ellipsis
                  if (idx > 0 && page - arr[idx - 1] > 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="px-2 text-slate-400">...</span>
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-9 h-9 rounded-xl text-[11px] font-semibold transition-all",
                            currentPage === page
                              ? "bg-slate-900 text-white"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-9 h-9 rounded-xl text-[11px] font-semibold transition-all",
                        currentPage === page
                          ? "bg-slate-900 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 px-3 rounded-xl disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-center gap-2 py-4">
        <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
        <span className="text-[9px] font-semibold text-slate-400 tracking-wide">
          Personal Grade Audit Protection Active
        </span>
      </div>
    </div>
  );
}
