import { motion } from "motion/react";
import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
  glow?: boolean;
}

export function GlassCard({
  children,
  className = "",
  hover = false,
  onClick,
  padding = "md",
  glow = false,
}: GlassCardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.005 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={`
        backdrop-blur-xl
        bg-white/[0.07]
        border border-white/[0.13]
        rounded-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.35)]
        ${glow ? "shadow-[0_0_40px_rgba(88,129,87,0.15),0_8px_32px_rgba(0,0,0,0.35)]" : ""}
        ${paddingClasses[padding]}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
      }}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "green",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
  color?: "green" | "sage" | "cream" | "red";
}) {
  const colorMap = {
    green: "from-[#588157]/30 to-[#3A5A40]/10",
    sage: "from-[#A3B18A]/30 to-[#588157]/10",
    cream: "from-[#DAD7CD]/20 to-[#A3B18A]/10",
    red: "from-red-500/20 to-red-900/10",
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`
        relative overflow-hidden rounded-2xl p-5
        backdrop-blur-xl border border-white/[0.13]
        bg-gradient-to-br ${colorMap[color]}
        shadow-[0_8px_32px_rgba(0,0,0,0.25)]
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#A3B18A] text-sm mb-1">{label}</p>
          <p className="text-white text-2xl font-semibold">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.up ? "text-emerald-400" : "text-red-400"}`}>
              {trend.up ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/[0.1] flex items-center justify-center text-[#A3B18A]">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
