import React from "react";

export const Badge = ({ icon, label }: { icon?: React.ReactNode, label: string }) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-600">
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
  </div>
);
