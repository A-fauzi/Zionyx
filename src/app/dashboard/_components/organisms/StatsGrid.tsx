"use client";

import React from "react";
import { Target, Zap, AlertTriangle, TrendingUp } from "lucide-react";
import { StatBox } from "../molecules/StatBox";

export function StatsGrid({ stats, totalPnL }: any) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <StatBox 
        icon={Target}
        label="Total Win Rate"
        value={`${stats.winRate || '0'}%`}
        sub={Number(stats.winRate || 0) >= 65 ? "↑" : "↓"}
        bg="bg-indigo-50"
        color="text-indigo-600"
        infoTitle="Win Rate"
        infoDescription="Persentase trade yang profit. Membantu mengukur akurasi strategi entry Anda."
      />
      <StatBox 
        icon={Zap}
        label="Avg R-Multiple"
        value={`${stats.avgRMultiple || '0.0'}R`}
        sub={Number(stats.avgRMultiple || 0) >= 2 ? "↑" : "↓"}
        bg="bg-purple-50"
        color="text-purple-600"
        infoTitle="Avg R-Multiple"
        infoDescription="Rata-rata kualitas profit dibandingkan risiko. Nilai > 2R menandakan manajemen risiko yang sehat."
      />
      <StatBox 
        icon={AlertTriangle}
        label="Current Drawdown"
        value={`${stats.drawdownPercent || '0.0'}%`}
        sub={Number(stats.drawdownPercent || 0) > 3 ? "↓" : "→"}
        bg={Number(stats.drawdownPercent || 0) >= 6 ? "bg-rose-50" : "bg-orange-50"}
        color={Number(stats.drawdownPercent || 0) >= 6 ? "text-rose-600" : "text-orange-600"}
        infoTitle="Drawdown"
        infoDescription="Penurunan saldo dari titik tertinggi. Penting untuk memantau risiko kebangkrutan akun."
      />
      <StatBox 
        icon={TrendingUp}
        label="Realized PnL"
        value={`$${totalPnL.toLocaleString()}`}
        sub={totalPnL > 0 ? "↑" : totalPnL < 0 ? "↓" : "→"}
        bg="bg-emerald-50"
        color="text-emerald-600"
        infoTitle="Realized P&L"
        infoDescription="Total keuntungan/kerugian bersih yang sudah dikunci dari posisi yang telah ditutup."
      />
    </div>
  );
}
