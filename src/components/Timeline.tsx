import React from "react";
import { motion } from "motion/react";
import * as Lucide from "lucide-react";

export interface TimelineNode {
  title: string;
  description: string;
  type: string; // "buy" | "hold" | "sell" | "profit" | "loss" | "neutral"
  date: string;
  icon: string;
}

interface TimelineProps {
  items: TimelineNode[];
}

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative pl-6 sm:pl-8 space-y-8 py-4">
      {/* Vertical Connecting Line */}
      <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-neon-purple via-neon-cyan to-neon-green opacity-40" />

      {items.map((item, idx) => {
        // Resolve Icon
        const IconComponent = (Lucide as any)[item.icon] || Lucide.Activity;

        // Custom theme properties per type
        const typeConfig = {
          buy: { bg: "bg-neon-cyan/10", border: "border-neon-cyan/30", text: "text-neon-cyan", glow: "neon-glow-cyan" },
          hold: { bg: "bg-neon-purple/10", border: "border-neon-purple/30", text: "text-neon-purple", glow: "neon-glow-purple" },
          profit: { bg: "bg-neon-green/10", border: "border-neon-green/30", text: "text-neon-green", glow: "neon-glow-green" },
          loss: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", glow: "" },
          neutral: { bg: "bg-white/5", border: "border-white/10", text: "text-gray-300", glow: "" },
        }[item.type] || { bg: "bg-white/5", border: "border-white/10", text: "text-gray-300", glow: "" };

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-card border border-white/5 glass-card-hover"
          >
            {/* Timeline Ring / Node */}
            <div className="absolute -left-[31px] sm:-left-[33px] flex h-6 w-6 items-center justify-center rounded-full bg-black border-2 border-white/10 z-10">
              <div className={`h-2.5 w-2.5 rounded-full ${typeConfig.bg.replace('/10', '')}`} />
            </div>

            {/* Left Content Column */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase ${typeConfig.bg} ${typeConfig.text} border ${typeConfig.border}`}>
                  {item.type}
                </span>
                <span className="font-mono text-[10px] text-gray-500">{item.date}</span>
              </div>
              <h4 className="font-display text-base font-bold text-white tracking-wide">
                {item.title}
              </h4>
              <p className="font-sans text-xs text-gray-400 leading-relaxed max-w-xl">
                {item.description}
              </p>
            </div>

            {/* Floating indicator icon */}
            <div className={`hidden sm:flex p-3 rounded-xl ${typeConfig.bg} border ${typeConfig.border}`}>
              <IconComponent className={`h-5 w-5 ${typeConfig.text} ${typeConfig.glow}`} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
