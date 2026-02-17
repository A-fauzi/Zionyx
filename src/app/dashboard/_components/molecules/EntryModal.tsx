"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Zap,
  Microscope,
  ClipboardCheck,
  ShieldCheck,
  AlertCircle,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { addTradeAction } from "../../actions";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// ─── Constants ───────────────────────────────────────────────

const SOP_CONFIG = {
  ICT: [
    "HTF Liquidity Swept (Internal/External)",
    "Market Structure Shift + Displacement",
    "Fair Value Gap (FVG) / Orderblock Entry",
    "Killzone Time Window (London/NY Open)",
  ],
  SnD: [
    "Fresh Supply/Demand Zone Identified",
    "Aggressive Departure (Imbalance)",
    "Clean Profit Margin (RR 1:3+)",
    "Trend HTF Alignment",
  ],
  SnR: [
    "Major S/R Level Rejection",
    "Candlestick Momentum Exhaustion",
    "Breakout & Retest Confirmation",
    "Confluence with Psychological Level",
  ],
};

type StrategyModel = keyof typeof SOP_CONFIG;

// pip value per standard lot — $10/pip for both XAUUSD and EURUSD
const PIP_VALUE_PER_LOT: Record<string, number> = {
  XAUUSD: 10,
  EURUSD: 10,
};

// ─── Psychological Risk Engine ────────────────────────────────
//
// Mengukur kondisi psikologis trader dari BEHAVIOR nyata,
// bukan self-report. Tiga sinyal utama:
//
//  1. Loss streak   — berapa loss berturut-turut sebelum entry ini
//  2. Overtrading   — berapa trade dalam 3 jam terakhir
//  3. Risk spike    — apakah risk% saat ini > 2× rata-rata historis
//
// Setiap sinyal menghasilkan skor 0-33, total max 100.
// Threshold: LOW < 30, MODERATE 30-59, HIGH ≥ 60

interface PsychSignal {
  label: string;
  detail: string;
  triggered: boolean;
}

interface PsychResult {
  score: number;           // 0–100
  level: "LOW" | "MODERATE" | "HIGH";
  signals: PsychSignal[];
  blocked: boolean;        // true jika score >= 80 (hard block)
}

function calcPsychRisk(
  trades: any[],
  currentRiskPercent: number
): PsychResult {
  const closed = trades.filter((t) => t.status !== "OPEN");
  const now = Date.now();
  const THREE_HOURS = 3 * 60 * 60 * 1000;

  // ── Signal 1: Consecutive loss streak ──────────────────────
  // Ambil urutan status dari trade terbaru, hitung loss beruntun
  const recent = [...closed].sort(
    (a, b) => new Date(b.createdAt ?? b.created_at ?? 0).getTime()
           - new Date(a.createdAt ?? a.created_at ?? 0).getTime()
  );
  let lossStreak = 0;
  for (const t of recent) {
    if (t.status === "LOSS") lossStreak++;
    else break;
  }
  const streakTriggered = lossStreak >= 2;
  const streakScore = lossStreak >= 3 ? 35 : lossStreak >= 2 ? 20 : 0;

  // ── Signal 2: Overtrading (semua trade, termasuk OPEN) ─────
  const allTrades = trades;
  const recentCount = allTrades.filter((t) => {
    const ts = new Date(t.createdAt ?? t.created_at ?? 0).getTime();
    return now - ts < THREE_HOURS;
  }).length;
  const overtradingTriggered = recentCount >= 3;
  const overtradingScore = recentCount >= 5 ? 35 : recentCount >= 3 ? 20 : 0;

  // ── Signal 3: Risk spike vs historical average ──────────────
  const historicalRisks = closed
    .map((t) => Number(t.riskPercent ?? t.risk_percent ?? 0))
    .filter((r) => r > 0);
  const avgRisk =
    historicalRisks.length > 0
      ? historicalRisks.reduce((a, b) => a + b, 0) / historicalRisks.length
      : 0;
  // Hanya flag jika ada data historis yang cukup (≥3 trade)
  const riskSpikeTriggered =
    historicalRisks.length >= 3 && currentRiskPercent > avgRisk * 2;
  const riskScore = riskSpikeTriggered ? 30 : 0;

  const totalScore = Math.min(streakScore + overtradingScore + riskScore, 100);

  const level: PsychResult["level"] =
    totalScore >= 60 ? "HIGH" : totalScore >= 30 ? "MODERATE" : "LOW";

  return {
    score: totalScore,
    level,
    blocked: totalScore >= 80,
    signals: [
      {
        label: "Loss Streak",
        detail:
          lossStreak > 0
            ? `${lossStreak} consecutive loss${lossStreak > 1 ? "es" : ""}`
            : "No recent losses",
        triggered: streakTriggered,
      },
      {
        label: "Trade Frequency",
        detail:
          recentCount > 0
            ? `${recentCount} trade${recentCount > 1 ? "s" : ""} in last 3h`
            : "No recent activity",
        triggered: overtradingTriggered,
      },
      {
        label: "Risk Deviation",
        detail:
          historicalRisks.length >= 3
            ? riskSpikeTriggered
              ? `${currentRiskPercent}% vs avg ${avgRisk.toFixed(1)}%`
              : `Within normal range (avg ${avgRisk.toFixed(1)}%)`
            : "Insufficient history",
        triggered: riskSpikeTriggered,
      },
    ],
  };
}

// ─── Component ───────────────────────────────────────────────

export function EntryModal({
  onClose,
  balance,
  trades = [],      // ← tambahkan prop ini, pass initialTrades dari DashboardClient
}: {
  onClose: () => void;
  balance: number;
  trades?: any[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    pair: "XAUUSD",
    type: "SELL",
    setup: "ICT" as StrategyModel,
    riskPercent: 1.0,
    slPips: 0,
    psychology: "SYSTEM_ASSESSED", // tidak lagi self-report
    reason: "",
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialChecklist: Record<string, boolean> = {};
    SOP_CONFIG[formData.setup].forEach((req) => {
      initialChecklist[req] = false;
    });
    setCheckedItems(initialChecklist);
  }, [formData.setup]);

  const isSopCompliant = useMemo(() => {
    const currentSop = SOP_CONFIG[formData.setup];
    return currentSop.every((req) => checkedItems[req]);
  }, [checkedItems, formData.setup]);

  const sopProgress = useMemo(() => {
    const currentSop = SOP_CONFIG[formData.setup];
    const checked = currentSop.filter((req) => checkedItems[req]).length;
    return { checked, total: currentSop.length };
  }, [checkedItems, formData.setup]);

  // Psychological risk — dihitung otomatis dari behavior
  const psych = useMemo(
    () => calcPsychRisk(trades, formData.riskPercent),
    [trades, formData.riskPercent]
  );

  const calculation = useMemo(() => {
    const clampedRisk = Math.min(Math.max(formData.riskPercent || 0, 0), 100);
    const riskAmount = (balance * clampedRisk) / 100;
    const pipValue = PIP_VALUE_PER_LOT[formData.pair] ?? 10;
    let lotSize = 0;
    if (formData.slPips > 0) {
      lotSize = riskAmount / (formData.slPips * pipValue);
    }
    return {
      riskAmount,
      lotSize: Math.max(0, lotSize).toFixed(2),
      pipValue,
    };
  }, [formData, balance]);

  // Deploy diblokir jika psych score ≥ 80
  const canDeploy = isSopCompliant && !psych.blocked;

  const handleSubmit = async () => {
    if (!canDeploy) return;
    if (formData.slPips <= 0) {
      return toast({
        variant: "destructive",
        title: "Risk Violation",
        description: "Stop Loss wajib diisi untuk proteksi kapital.",
      });
    }
    if (parseFloat(calculation.lotSize) <= 0) {
      return toast({
        variant: "destructive",
        title: "Calculation Error",
        description: "Lot size tidak valid. Cek SL kamu lagi.",
      });
    }
    if (!formData.reason || formData.reason.length < 3) {
      return toast({
        variant: "destructive",
        title: "Audit Violation",
        description: "Alasan teknis wajib diisi untuk jurnal.",
      });
    }

    setLoading(true);
    try {
      await addTradeAction({
        ...formData,
        psychology: psych.level, // simpan hasil assessment sistem, bukan self-report
        lot: parseFloat(calculation.lotSize),
        risk: calculation.riskAmount,
        status: "OPEN",
      });
      onClose();
      router.refresh();
    } catch {
      toast({
        variant: "destructive",
        title: "System Error",
        description: "Gagal menyimpan data ke Zionyx Database.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
      />

      <div
        className="
          relative w-full sm:max-w-[520px] max-h-[96vh]
          flex flex-col
          bg-white/95 backdrop-blur-2xl
          border border-black/[0.06]
          rounded-t-[2rem] sm:rounded-[2rem]
          shadow-[0_32px_80px_-12px_rgba(0,0,0,0.18),0_0_0_0.5px_rgba(0,0,0,0.06)]
          overflow-hidden
          animate-in slide-in-from-bottom-8 duration-500 ease-out
        "
        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-9 h-1 rounded-full bg-black/10" />
        </div>

        {/* ── HEADER ── */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-[13px] font-semibold text-gray-900 tracking-tight">
                Deploy Protocol
              </h2>
              <Badge
                variant="secondary"
                className="text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 bg-indigo-50 text-indigo-500 border-0 rounded-full"
              >
                {formData.setup}
              </Badge>
            </div>
            <p className="text-[11px] text-gray-400 font-normal">
              Zionyx Multi-Strategy Guard
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-black/[0.05] text-gray-400 hover:text-gray-600 hover:bg-black/[0.08] transition-all duration-150 mt-0.5"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <Separator className="bg-black/[0.05]" />

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-6 py-5 space-y-6">

            {/* ── STEP 1: STRATEGY MODEL ── */}
            <section className="space-y-2.5">
              <SectionLabel icon={null} step="01" label="Strategy Model" />
              <div className="flex gap-2">
                {(Object.keys(SOP_CONFIG) as StrategyModel[]).map((strat) => (
                  <button
                    key={strat}
                    onClick={() => setFormData({ ...formData, setup: strat })}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-[11px] font-semibold tracking-wider uppercase transition-all duration-200",
                      formData.setup === strat
                        ? "bg-gray-900 text-white shadow-sm"
                        : "bg-black/[0.04] text-gray-400 hover:bg-black/[0.07] hover:text-gray-600"
                    )}
                  >
                    {strat}
                  </button>
                ))}
              </div>
            </section>

            {/* ── STEP 2: PRE-FLIGHT CHECKLIST ── */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <SectionLabel
                  icon={<ClipboardCheck size={10} className="text-indigo-500" />}
                  step="02"
                  label="Pre-Flight Audit"
                />
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2.5 py-0.5 rounded-full transition-colors",
                    isSopCompliant
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {sopProgress.checked}/{sopProgress.total}
                </span>
              </div>

              <div className="h-0.5 rounded-full bg-black/[0.05] overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isSopCompliant ? "bg-emerald-500" : "bg-indigo-400"
                  )}
                  style={{ width: `${(sopProgress.checked / sopProgress.total) * 100}%` }}
                />
              </div>

              <div className="space-y-1.5">
                {SOP_CONFIG[formData.setup].map((req) => (
                  <label
                    key={req}
                    htmlFor={req}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150",
                      checkedItems[req]
                        ? "bg-indigo-50/70 border border-indigo-100"
                        : "bg-black/[0.025] border border-transparent hover:bg-black/[0.04]"
                    )}
                  >
                    <Checkbox
                      id={req}
                      checked={checkedItems[req] || false}
                      onCheckedChange={(checked) =>
                        setCheckedItems((prev) => ({ ...prev, [req]: !!checked }))
                      }
                      className={cn(
                        "h-4 w-4 rounded-md border-[1.5px] transition-colors shrink-0",
                        checkedItems[req]
                          ? "data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500"
                          : "border-black/20"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[11px] font-medium leading-snug transition-colors",
                        checkedItems[req]
                          ? "text-indigo-700 line-through decoration-indigo-300/60"
                          : "text-gray-600"
                      )}
                    >
                      {req}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* ── STEP 3: PARAMETERS ── */}
            <section className="space-y-4">
              <SectionLabel
                icon={<Microscope size={10} className="text-indigo-500" />}
                step="03"
                label="Parameters"
              />

              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Asset">
                  <Select
                    value={formData.pair}
                    onValueChange={(v) => setFormData({ ...formData, pair: v })}
                  >
                    <SelectTrigger className="h-10 bg-black/[0.03] border-0 rounded-xl text-[12px] font-semibold text-gray-700 focus:ring-1 focus:ring-indigo-400/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[200] rounded-xl border-black/[0.08] shadow-xl text-[12px]">
                      <SelectItem value="XAUUSD" className="font-medium py-2">XAUUSD</SelectItem>
                      <SelectItem value="EURUSD" className="font-medium py-2">EURUSD</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>

                <FieldGroup label="Direction">
                  <Select
                    value={formData.type}
                    onValueChange={(v) => setFormData({ ...formData, type: v })}
                  >
                    <SelectTrigger className="h-10 bg-black/[0.03] border-0 rounded-xl text-[12px] font-semibold text-gray-700 focus:ring-1 focus:ring-indigo-400/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[200] rounded-xl border-black/[0.08] shadow-xl text-[12px]">
                      <SelectItem value="BUY" className="font-medium py-2">Buy</SelectItem>
                      <SelectItem value="SELL" className="font-medium py-2">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldGroup>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FieldGroup label="Risk (%)">
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="100"
                    value={formData.riskPercent}
                    onChange={(e) =>
                      setFormData({ ...formData, riskPercent: Number(e.target.value) })
                    }
                    className="h-10 bg-black/[0.03] border-0 rounded-xl text-[13px] font-semibold font-mono text-gray-800 focus:ring-1 focus:ring-indigo-400/30"
                  />
                </FieldGroup>

                <FieldGroup label="Stop Loss (Pips)">
                  <Input
                    type="number"
                    placeholder="e.g. 20"
                    min="0"
                    value={formData.slPips || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, slPips: Number(e.target.value) })
                    }
                    className="h-10 bg-black/[0.03] border-0 rounded-xl text-[13px] font-semibold font-mono text-gray-800 focus:ring-1 focus:ring-indigo-400/30"
                  />
                </FieldGroup>
              </div>

              <FieldGroup
                label="Technical Reason"
                icon={<Microscope size={9} className="text-indigo-400" />}
              >
                <Input
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="e.g. FVG Fill + MSS"
                  className="h-10 bg-black/[0.03] border-0 rounded-xl text-[12px] font-medium text-gray-700 placeholder:text-gray-300 focus:ring-1 focus:ring-indigo-400/30"
                />
              </FieldGroup>
            </section>

            {/* ── STEP 4: PSYCHOLOGICAL RISK ASSESSMENT ── */}
            <section className="space-y-2.5">
              <SectionLabel
                icon={<BrainCircuit size={10} className="text-indigo-500" />}
                step="04"
                label="Psychological Assessment"
              />

              <div
                className={cn(
                  "rounded-2xl p-4 space-y-3 border transition-colors duration-300",
                  psych.level === "HIGH"
                    ? "bg-red-50/60 border-red-100"
                    : psych.level === "MODERATE"
                    ? "bg-amber-50/60 border-amber-100"
                    : "bg-emerald-50/40 border-emerald-100"
                )}
              >
                {/* Score header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        psych.level === "HIGH"
                          ? "bg-red-500"
                          : psych.level === "MODERATE"
                          ? "bg-amber-400"
                          : "bg-emerald-500"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        psych.level === "HIGH"
                          ? "text-red-700"
                          : psych.level === "MODERATE"
                          ? "text-amber-700"
                          : "text-emerald-700"
                      )}
                    >
                      {psych.level === "HIGH"
                        ? "High Risk — Deploy Blocked"
                        : psych.level === "MODERATE"
                        ? "Moderate Risk — Proceed with Caution"
                        : "Clear — Conditions Nominal"}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-bold font-mono",
                      psych.level === "HIGH"
                        ? "text-red-500"
                        : psych.level === "MODERATE"
                        ? "text-amber-500"
                        : "text-emerald-500"
                    )}
                  >
                    {psych.score}/100
                  </span>
                </div>

                {/* Score bar */}
                <div className="h-0.5 rounded-full bg-black/[0.06] overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      psych.level === "HIGH"
                        ? "bg-red-400"
                        : psych.level === "MODERATE"
                        ? "bg-amber-400"
                        : "bg-emerald-400"
                    )}
                    style={{ width: `${psych.score}%` }}
                  />
                </div>

                {/* Signals */}
                <div className="space-y-1.5 pt-0.5">
                  {psych.signals.map((sig) => (
                    <div key={sig.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-1 h-1 rounded-full shrink-0",
                            sig.triggered ? "bg-red-400" : "bg-gray-300"
                          )}
                        />
                        <span className="text-[10px] font-medium text-gray-500">
                          {sig.label}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-medium",
                          sig.triggered ? "text-red-500" : "text-gray-400"
                        )}
                      >
                        {sig.detail}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Hard block message */}
                {psych.blocked && (
                  <div className="pt-2 border-t border-red-100">
                    <p className="text-[10px] text-red-500 font-medium leading-relaxed">
                      Behavioral indicators suggest elevated emotional risk. Session cooldown recommended before next deployment.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ── LOT SIZE CARD ── */}
            <section>
              <div className="relative rounded-2xl overflow-hidden bg-gray-950 p-5">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Zap size={9} className="fill-indigo-400 text-indigo-400" />
                      <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-indigo-400">
                        Lot Size
                      </span>
                    </div>
                    <span className="text-[42px] font-bold tracking-tight text-white font-mono leading-none">
                      {calculation.lotSize}
                    </span>
                    <p className="text-[9px] text-gray-600 mt-1.5 font-medium">
                      {formData.pair} · {formData.slPips > 0 ? `${formData.slPips} pips SL` : "Set SL to calculate"}
                    </p>
                  </div>
                  <div className="text-right space-y-3">
                    <div>
                      <p className="text-[9px] font-medium text-gray-500 tracking-widest uppercase mb-1">
                        Risk Amount
                      </p>
                      <p className="text-[18px] font-bold font-mono tracking-tight text-white">
                        ${calculation.riskAmount.toFixed(2)}
                      </p>
                      <p className="text-[9px] text-gray-600 mt-0.5 font-medium">
                        {formData.riskPercent}% of ${balance.toLocaleString()}
                      </p>
                    </div>
                    <div className="border-t border-white/[0.06] pt-2">
                      <p className="text-[9px] font-medium text-gray-500 tracking-widest uppercase mb-1">
                        Pip Value
                      </p>
                      <p className="text-[13px] font-bold font-mono tracking-tight text-white/70">
                        ${calculation.pipValue}/pip
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative mt-4 pt-3.5 border-t border-white/[0.06]">
                  <p className="text-[9px] text-gray-600 font-mono">
                    lot = risk ÷ (sl × pip_value) · {calculation.riskAmount.toFixed(2)} ÷ ({formData.slPips} × {calculation.pipValue}) = {calculation.lotSize}
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-6 pb-6 pt-4 shrink-0 bg-white/80 backdrop-blur-sm border-t border-black/[0.04]">
          <Button
            disabled={loading || !canDeploy}
            onClick={handleSubmit}
            className={cn(
              "w-full h-12 rounded-xl text-[12px] font-semibold tracking-wide transition-all duration-200 flex items-center justify-between px-5",
              canDeploy
                ? "bg-gray-900 hover:bg-gray-800 text-white shadow-sm active:scale-[0.99]"
                : "bg-black/[0.04] text-gray-300 cursor-not-allowed shadow-none"
            )}
          >
            <span className="uppercase tracking-[0.15em] text-[11px]">
              {loading
                ? "Deploying…"
                : psych.blocked
                ? "Session Blocked"
                : !isSopCompliant
                ? "Complete SOP First"
                : "Deploy Protocol"}
            </span>
            {canDeploy ? (
              <Zap size={14} className="fill-indigo-400 text-indigo-400" />
            ) : (
              <ShieldCheck size={14} className="text-gray-300" />
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 mt-3">
            <AlertCircle size={9} className="text-gray-300" />
            <span className="text-[9px] text-gray-300 tracking-[0.12em] uppercase font-medium">
              Zionyx Institutional Grade Audit Protection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function SectionLabel({
  step,
  label,
  icon,
}: {
  step: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] font-bold text-gray-300 tabular-nums tracking-wider">
        {step}
      </span>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[11px] font-semibold text-gray-500 tracking-tight">
          {label}
        </span>
      </div>
    </div>
  );
}

function FieldGroup({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 ml-0.5">
        {icon}
        <Label className="text-[10px] font-medium text-gray-400">{label}</Label>
      </div>
      {children}
    </div>
  );
}
