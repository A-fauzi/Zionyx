import { cn } from "@/lib/utils";
import { LucideIcon, Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface StatBoxProps {
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
  icon: LucideIcon;
  infoTitle: string;
  infoDescription: string;
}

export const StatBox = ({ 
  label, value, sub, color, bg, icon: Icon, infoTitle, infoDescription 
}: StatBoxProps) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full relative group">
    <div className="flex justify-between items-start mb-2">
      <div className={cn("p-1.5 rounded-lg", bg)}>
        <Icon size={14} className={color} />
      </div>
      
      <div className="flex items-center gap-1.5">
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", bg, color)}>
          {sub}
        </span>

        <Popover>
          <PopoverTrigger asChild>
            <button className="text-slate-300 hover:text-slate-400 transition-colors focus:outline-none">
              <Info size={14} />
            </button>
          </PopoverTrigger>
          <PopoverContent 
            // UBAH: side ke "bottom" agar tidak menabrak header
            side="bottom" 
            align="end" 
            sideOffset={8}
            // TAMBAH: z-index sangat tinggi untuk menembus header fixed
            className="w-[240px] p-0 overflow-hidden border-slate-200 rounded-xl shadow-xl z-[100]"
          >
            {/* Header */}
            <div className="px-3 py-2 border-b border-slate-50 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                {infoTitle}
              </p>
            </div>
            
            {/* Body */}
            <div className="p-3">
              <p className="text-[11px] leading-relaxed text-slate-600 antialiased font-medium">
                {infoDescription}
              </p>
            </div>
            
            {/* Footer */}
            <div className="px-3 py-1.5 bg-slate-50/30 border-t border-slate-50">
              <p className="text-[9px] text-slate-400 italic">Trading Metrics Guide</p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>

    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-xl md:text-2xl font-black text-slate-800 leading-tight">{value}</p>
    </div>
  </div>
);
