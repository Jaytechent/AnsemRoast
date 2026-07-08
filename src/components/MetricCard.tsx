import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import * as Lucide from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subText?: string;
  iconName: string;
  variant?: "green" | "purple" | "cyan" | "red" | "default";
}

export default function MetricCard({ title, value, subText, iconName, variant = "default" }: MetricCardProps) {
  // Dynamically resolve icon from Lucide
  const IconComponent = (Lucide as any)[iconName] || Lucide.HelpCircle;

  // Counter animation for integers
  const [displayValue, setDisplayValue] = useState<string | number>("");

  useEffect(() => {
    if (typeof value === "number") {
      let start = 0;
      const end = value;
      if (start === end) {
        setDisplayValue(end);
        return;
      }
      const duration = 1200; // ms
      const stepTime = Math.abs(Math.floor(duration / end));
      const timer = setInterval(() => {
        start += Math.ceil(end / 40);
        if (start >= end) {
          clearInterval(timer);
          setDisplayValue(end);
        } else {
          setDisplayValue(start);
        }
      }, Math.max(stepTime, 20));
      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const borderClass = {
    green: "neon-border-green",
    purple: "neon-border-purple",
    cyan: "neon-border-cyan",
    red: "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
    default: "border-white/5",
  }[variant];

  const glowClass = {
    green: "text-neon-green neon-glow-green",
    purple: "text-neon-purple neon-glow-purple",
    cyan: "text-neon-cyan neon-glow-cyan",
    red: "text-red-400",
    default: "text-gray-400",
  }[variant];

  const iconBgClass = {
    green: "bg-neon-green/10",
    purple: "bg-neon-purple/10",
    cyan: "bg-neon-cyan/10",
    red: "bg-red-500/10",
    default: "bg-white/5",
  }[variant];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative p-5 rounded-2xl glass-card ${borderClass} transition-all duration-300 overflow-hidden flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="block font-mono text-xs text-gray-500 uppercase tracking-wider font-medium">
            {title}
          </span>
          <span className="block font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1.5">
            {typeof value === "number" ? displayValue : value}
          </span>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBgClass}`}>
          <IconComponent className={`h-5 w-5 ${glowClass}`} />
        </div>
      </div>

      {subText && (
        <div className="border-t border-white/5 pt-3">
          <span className="font-mono text-[11px] text-gray-400 block truncate">
            {subText}
          </span>
        </div>
      )}
    </motion.div>
  );
}
