"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Zap,
  BrainCircuit,
  Microscope,
  ClipboardCheck,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { addTradeAction } from "../../actions";
import { useRouter } from "next/navigation";

// UI Components
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

/**
 * Pip value per lot (standard lot = 100,000 units):
 *
 * XAUUSD : Gold — 1 pip = $0.10/lot × 100 (1 pip = 0.01 price move for XAU)
 *   Standard: 1 lot XAUUSD, 1 pip ($0.10 price move) = $10.00
 *   → pipValuePerLot = 10
 *
 * EURUSD : 1 pip = 0.0001 price move
 *   Standard: 1 lot EURUSD, 1 pip = $10.00
 *   → pipValuePerLot = 10
 *
 * Formula:
 *   lotSize = riskAmount / (slPips × pipValuePerLot)
 *
 * Example: balance=$10,000, risk=1%, SL=20 pips, XAUUSD
 *   riskAmount = 10000 × 0.01 = $100
 *   lotSize    = 100 / (20 × 10) = 100 / 200 = 0.50 lots ✓
 */
const PIP_VALUE_PER_LOT: Record<string, number> = {
  XAUUSD: 10, // $10 per pip per standard lot
  EURUSD: 10, // $10 per pip per standard lot
};

export function EntryModal({
  onClose,
  balance,
}: {
  onClose: () => void;
  balance: number;
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
    psychology: "FOCUSED",
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

  const calculation = useMemo(() => {
    // Clamp riskPercent to [0.01, 100] to avoid nonsensical values
    const clampedRiskPercent = Math.min(Math.max(formData.riskPercent || 0, 0), 100);

    // riskAmount = how many dollars we are willing to lose on this trade
    const riskAmount = (balance * clampedRiskPercent) / 100;

    // pipValuePerLot = dollar value of 1 pip for 1 standard lot of the chosen pair
    const pipValue = PIP_VALUE_PER_LOT[formData.pair] ?? 10;

    // lotSize = riskAmount / (slPips × pipValuePerLot)
    let lotSize = 0;
    if (formData.slPips > 0) {
      lotSize = riskAmount / (formData.slPips * pipValue);
    }

    // Round lot size to 2 decimal places (broker standard minimum 0.01)
    const lotSizeRounded = Math.max(0, lotSize);

    return {
      riskAmount,
      lotSize: lotSizeRounded.toFixed(2),
      pipValue,
    };
  }, [formData, balance]);

  const handleSubmit = async () => {
    if (!isSopCompliant) return;
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
        description: "Lot size tidak valid. Cek SL lo lagi.",
      });
    }
    if (!formData.reason || formData.reason.length < 3) {
      return toast({
        variant: "destructive",
        title: "Audit Violation",
        description: "Alasan teknis (Reason) wajib diisi untuk jurnal.",
      });
    }

    setLoading(true);
    try {
      await addTradeAction({
        ...formData,
        lot: parseFloat(calculation.lotSize),
        risk: calculation.riskAmount,
        status: "OPEN",
      });
      onClose();
      router.refresh();
    } catch (error) {
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
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
      />

      {/* Modal Shell */}
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
        {/* Drag Handle (mobile) */}
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
            className="
              w-7 h-7 flex items-center justify-center
              rounded-full bg-black/[0.05]
              text-gray-400 hover:text-gray-600
              hover:bg-black/[0.08]
              transition-all duration-150
              mt-0.5
            "
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <Separator className="bg-black/[0.05]" />

        {/* ── SCROLLABLE BODY ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-6 py-5 space-y-6">

            {/* ── STEP 1: MODEL SELECTION ── */}
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

              {/* Progress bar */}
              <div className="h-0.5 rounded-full bg-black/[0.05] overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isSopCompliant ? "bg-emerald-500" : "bg-indigo-400"
                  )}
                  style={{
                    width: `${(sopProgress.checked / sopProgress.total) * 100}%`,
                  }}
                />
              </div>

              <div className="space-y-1.5">
                {SOP_CONFIG[formData.setup].map((req) => (
                  <label
                    key={req}
                    htmlFor={req}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition-all duration-150 group",
                      checkedItems[req]
                        ? "bg-indigo-50/70 border border-indigo-100"
                        : "bg-black/[0.025] border border-transparent hover:bg-black/[0.04]"
                    )}
                  >
                    <Checkbox
                      id={req}
                      checked={checkedItems[req] || false}
                      onCheckedChange={(checked) =>
                        setCheckedItems((prev) => ({
                          ...prev,
                          [req]: !!checked,
                        }))
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
                      <SelectItem value="BUY" className="font-medium py-2">📈 BUY</SelectItem>
                      <SelectItem value="SELL" className="font-medium py-2">📉 SELL</SelectItem>
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
                      setFormData({
                        ...formData,
                        riskPercent: Number(e.target.value),
                      })
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
                      setFormData({
                        ...formData,
                        slPips: Number(e.target.value),
                      })
                    }
                    className="h-10 bg-black/[0.03] border-0 rounded-xl text-[13px] font-semibold font-mono text-gray-800 focus:ring-1 focus:ring-indigo-400/30"
                  />
                </FieldGroup>
              </div>

              <FieldGroup
                label="Mental State"
                icon={<BrainCircuit size={9} className="text-indigo-400" />}
              >
                <Select
                  value={formData.psychology}
                  onValueChange={(v) => setFormData({ ...formData, psychology: v })}
                >
                  <SelectTrigger className="h-10 bg-black/[0.03] border-0 rounded-xl text-[12px] font-semibold text-gray-700 focus:ring-1 focus:ring-indigo-400/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[200] rounded-xl border-black/[0.08] shadow-xl text-[12px]">
                    <SelectItem value="FOCUSED" className="font-medium py-2">💎 FOCUSED</SelectItem>
                    <SelectItem value="FOMO" className="font-medium py-2">🚀 FOMO</SelectItem>
                    <SelectItem value="REVENGE" className="font-medium py-2">😡 REVENGE</SelectItem>
                    <SelectItem value="BORED" className="font-medium py-2">😴 BORED</SelectItem>
                  </SelectContent>
                </Select>
              </FieldGroup>

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

            {/* ── LOT SIZE CARD ── */}
            <section>
              <div className="relative rounded-2xl overflow-hidden bg-gray-950 p-5">
                {/* Ambient glow */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />

                <div className="relative flex items-center justify-between">
                  {/* Left: Lot Size */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Zap size={9} className="fill-indigo-400 text-indigo-400" />
                      <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-indigo-400">
                        Lot Size
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[42px] font-bold tracking-tight text-white font-mono leading-none">
                        {calculation.lotSize}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-600 mt-1.5 font-medium">
                      {formData.pair} · {formData.slPips > 0 ? `${formData.slPips} pips SL` : "Set SL to calculate"}
                    </p>
                  </div>

                  {/* Right: Risk breakdown */}
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

                {/* Formula hint */}
                <div className="relative mt-4 pt-3.5 border-t border-white/[0.06]">
                  <p className="text-[9px] text-gray-600 font-mono">
                    lot = risk ÷ (sl_pips × pip_value) &nbsp;·&nbsp; {calculation.riskAmount.toFixed(2)} ÷ ({formData.slPips} × {calculation.pipValue}) = {calculation.lotSize}
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-6 pb-6 pt-4 shrink-0 bg-white/80 backdrop-blur-sm border-t border-black/[0.04]">
          <Button
            disabled={loading || !isSopCompliant}
            onClick={handleSubmit}
            className={cn(
              "w-full h-12 rounded-xl text-[12px] font-semibold tracking-wide transition-all duration-200 flex items-center justify-between px-5",
              isSopCompliant
                ? "bg-gray-900 hover:bg-gray-800 text-white shadow-sm active:scale-[0.99]"
                : "bg-black/[0.04] text-gray-300 cursor-not-allowed shadow-none"
            )}
          >
            <span className="uppercase tracking-[0.15em] text-[11px]">
              {loading
                ? "Deploying…"
                : isSopCompliant
                ? "Deploy Protocol"
                : "Complete SOP First"}
            </span>
            {isSopCompliant ? (
              <Zap size={14} className="fill-indigo-400 text-indigo-400 transition-transform group-hover:scale-110" />
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

// ── Sub-components ─────────────────────────────────────────

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
        <Label className="text-[10px] font-medium text-gray-400">
          {label}
        </Label>
      </div>
      {children}
    </div>
  );
}
