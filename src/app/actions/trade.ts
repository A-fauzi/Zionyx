"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createTrade(formData: FormData) {
  const pair = formData.get("pair") as string
  const side = formData.get("side") as string
  const entry = parseFloat(formData.get("entry") as string)
  const sl = parseFloat(formData.get("sl") as string)
  const tp = parseFloat(formData.get("tp") as string)
  const setup = formData.get("setup") as string

  // Logika hitung Risk Reward Ratio: $RR = \frac{|TP - Entry|}{|Entry - SL|}$
  const riskReward = Math.abs(tp - entry) / Math.abs(entry - sl)

  await prisma.trade.create({
    data: {
      pair,
      side,
      entry,
      sl,
      tp,
      setup,
      riskReward,
      status: "OPEN",
    },
  })

  revalidatePath("/") // Refresh data di dashboard secara otomatis
}
