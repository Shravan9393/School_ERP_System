import React from "react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  danger: "bg-red-500/20 text-red-300 border border-red-500/30",
  info: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  neutral: "bg-white/10 text-[#DAD7CD] border border-white/20",
  primary: "bg-[#588157]/30 text-[#A3B18A] border border-[#588157]/40",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-blue-400",
  neutral: "bg-[#A3B18A]",
  primary: "bg-[#A3B18A]",
};

export function Badge({ children, variant = "neutral", size = "md", dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-xs"
      } ${variantClasses[variant]}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
