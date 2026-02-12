import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatBoxProps {
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
  icon: LucideIcon;
}

export const StatBox = ({ label, value, sub, color, bg, icon: Icon }: StatBoxProps) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
    <div className="flex justify-between items-start mb-2">
      <div className={cn("p-1.5 rounded-lg", bg)}>
        <Icon size={14} className={color} />
      </div>
      <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", bg, color)}>{sub}</span>
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-xl md:text-2xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);
