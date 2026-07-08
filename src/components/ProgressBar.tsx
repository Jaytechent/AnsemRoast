import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface ProgressBarProps {
  label: string;
  value: number; // 0 to 100 or specific max
  max?: number;
  color?: "green" | "purple" | "cyan" | "red";
  suffix?: string;
}

export default function ProgressBar({ label, value, max = 100, color = "purple", suffix = "" }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const barColorClass = {
    green: "bg-gradient-to-r from-neon-green to-neon-cyan shadow-[0_0_12px_rgba(20,241,149,0.5)]",
    purple: "bg-gradient-to-r from-neon-purple to-[#c084fc] shadow-[0_0_12px_rgba(153,69,255,0.5)]",
    cyan: "bg-gradient-to-r from-neon-cyan to-blue-400 shadow-[0_0_12px_rgba(0,255,204,0.5)]",
    red: "bg-gradient-to-r from-red-500 to-orange-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]",
  }[color];

  const textClass = {
    green: "text-neon-green",
    purple: "text-neon-purple",
    cyan: "text-neon-cyan",
    red: "text-red-400",
  }[color];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-gray-400 uppercase tracking-wider font-semibold">{label}</span>
        <span className={`${textClass} font-bold`}>
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden border border-white/5 p-[1px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`h-full rounded-full ${barColorClass}`}
        />
      </div>
    </div>
  );
}
