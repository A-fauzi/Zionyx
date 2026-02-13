"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Mengambil histori trade Zionyx dari database.
 * Digunakan di Server Component (page.tsx).
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
    console.error("CRITICAL_ERROR: Gagal mengambil data trades dari Zionyx Database:", error);
    return [];
  }
}

/**
 * Menyimpan trade baru dengan status OPEN dan audit psikologi.
 */
export async function addTradeAction(data: any) {
  try {
    // Memastikan nilai angka valid untuk menghindari error database
    const lotValue = parseFloat(data.lot);
    const riskValue = parseFloat(data.risk);

    if (isNaN(lotValue) || isNaN(riskValue)) {
      throw new Error("Invalid numeric values for Lot or Risk.");
    }

    await prisma.trade.create({
      data: {
        pair: data.pair,
        type: data.type,
        setup: data.setup,
        lot: lotValue,
        risk: riskValue,
        // Audit Layer: Melacak kondisi mental saat eksekusi
        psychology: data.psychology || "FOCUSED", 
        reason: data.reason || "No technical reason provided",
        pnl: 0,
        status: "OPEN",
      }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("CRITICAL_ERROR: Gagal menambah trade ke Zionyx Database:", error);
    throw new Error("Gagal menyimpan data eksekusi.");
  }
}

/**
 * Menutup trade dan memperbarui PnL real-time.
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
    console.error("CRITICAL_ERROR: Gagal menutup trade:", error);
    throw new Error("Gagal melakukan settlement trade.");
  }
}
