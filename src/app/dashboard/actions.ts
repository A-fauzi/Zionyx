"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Mengambil histori trade Zi dari database.
 */
export async function getTrades() {
  try {
    return await prisma.trade.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error("Gagal mengambil data trades:", error);
    return [];
  }
}

/**
 * Menyimpan trade baru dengan status OPEN ke database.
 */
export async function addTradeAction(data: any) {
  try {
    await prisma.trade.create({
      data: {
        pair: data.pair,
        type: data.type,
        setup: data.setup,
        lot: parseFloat(data.lot),
        risk: parseFloat(data.risk),
        pnl: 0,
        status: "OPEN",
      }
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Gagal menambah trade:", error);
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
  } catch (error) {
    console.error("Gagal menutup trade:", error);
  }
}
