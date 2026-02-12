import { cn } from "@/lib/utils";
import React from "react";

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm p-5 md:p-6", className)}>
    {children}
  </div>
);
