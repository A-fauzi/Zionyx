import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Buat file prisma.ts di lib

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { secret, pair, side, entry, sl, tp } = body;

    // Security check sederhana
    if (secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trade = await prisma.trade.create({
      data: {
        pair,
        side,
        entry: parseFloat(entry),
        sl: parseFloat(sl),
        tp: parseFloat(tp),
        riskReward: Math.abs(tp - entry) / Math.abs(entry - sl)
      }
    });

    return NextResponse.json(trade, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record trade' }, { status: 500 });
  }
}
