"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Line, ComposedChart 
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GrowthChartProps {
  data: any[];
}

export function GrowthChart({ data }: GrowthChartProps) {
  return (
    <Card className="col-span-full md:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-xl p-8 bg-white hover:shadow-2xl transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-[1.25rem] flex items-center justify-center text-indigo-600 border border-indigo-100">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900 uppercase tracking-tight">Capital Growth Trajectory</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 font-mono">
                Equity Curve vs Target Projection (+20%/Mo)
            </p>
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "11px", fontWeight: 700 }} tickMargin={15} />
            <YAxis hide domain={['dataMin - 50', 'dataMax + 50']} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "16px", padding: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
              labelStyle={{ color: "#94a3b8", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}
              itemStyle={{ color: "#fff", fontSize: "12px", fontWeight: 900 }}
            />
            <Area type="monotone" dataKey="equity" stroke="#6366f1" strokeWidth={4} fill="url(#equityGradient)" />
            <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="8 8" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Actual Equity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 border-2 border-dashed border-amber-500 rounded-full" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Projection</span>
          </div>
        </div>
        <Badge variant="outline" className="text-[9px] font-black px-3 py-1 bg-slate-50 text-slate-400 border-slate-200">
            {data.length} NODES SYNCED
        </Badge>
      </div>
    </Card>
  );
}
