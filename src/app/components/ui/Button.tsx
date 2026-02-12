import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = ({ children, onClick, icon, fullWidth, className, ...props }: ButtonProps) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center justify-center gap-2 bg-slate-900 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-200",
      fullWidth && "w-full py-3",
      className
    )}
    {...props}
  >
    {icon} {children}
  </button>
);
