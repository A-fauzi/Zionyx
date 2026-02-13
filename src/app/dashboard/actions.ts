"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Mengambil histori trade Zionyx dari database.
 * Digunakan untuk Audit Visual dan Analisa Performa.
 */
export async function getTrades() {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: { 
        createdAt: 'desc' 
      },
    });
    return trades;
  } catch (error) {
    console.error("CRITICAL_LOG [Zionyx]: Gagal mengambil data trades:", error);
    return [];
  }
}

/**
 * Menyimpan trade baru dengan status OPEN.
 * Mengintegrasikan Dynamic SOP Model dan Audit Psikologi.
 */
export async function addTradeAction(data: any) {
  try {
    // Memastikan nilai numerik valid untuk kalkulasi ekuitas
    const lotValue = parseFloat(data.lot);
    const riskValue = parseFloat(data.risk);

    if (isNaN(lotValue) || isNaN(riskValue)) {
      throw new Error("Invalid numeric values for Lot or Risk.");
    }

    await prisma.trade.create({
      data: {
        pair: data.pair,
        type: data.type,
        setup: data.setup, // Menyimpan model strategi (ICT/SnD/SnR)
        lot: lotValue,
        risk: riskValue,
        // Audit Layer: Melacak disiplin mental founder
        psychology: data.psychology || "FOCUSED", 
        reason: data.reason || "SOP Compliant - No specific notes",
        pnl: 0,
        status: "OPEN",
      }
    });

    // Refresh dashboard untuk melihat antrian trade baru
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("CRITICAL_LOG [Zionyx]: Gagal menambah trade:", error);
    throw new Error("Gagal menyimpan data eksekusi ke Zionyx Protocol.");
  }
}

/**
 * Menutup trade dan melakukan settlement PnL secara real-time.
 * Krusial untuk memantau progres pelunasan target 20 juta IDR.
 */
export async function closeTradeAction(id: string, status: "WIN" | "LOSS", pnl: number) {
  try {
    await prisma.trade.update({
      where: { id },
      data: { 
        status, 
        pnl: parseFloat(pnl.toFixed(2)) 
      },
    });

    revalidatePath("/dashboard"); 
    return { success: true };
  } catch (error) {
    console.error("CRITICAL_LOG [Zionyx]: Gagal settlement trade:", error);
    throw new Error("Gagal melakukan settlement trade pada Zionyx Protocol.");
  }
}
