import React from "react";
import { motion } from "motion/react";
import { Flame, Sparkles, MessageSquare, Quote, HelpCircle } from "lucide-react";

interface RoastCardProps {
  roast: string;
  badge: string;
  walletAddress: string;
}

export default function RoastCard({ roast, badge, walletAddress }: RoastCardProps) {
  // Badges lists and colors
  const getBadgeConfig = (bName: string) => {
    const name = bName.toLowerCase();
    if (name.includes("diamond")) {
      return { bg: "bg-neon-cyan/15", text: "text-neon-cyan", border: "border-neon-cyan/30", glow: "neon-glow-cyan" };
    }
    if (name.includes("paper") || name.includes("exit")) {
      return { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30", glow: "" };
    }
    if (name.includes("whale") || name.includes("legend")) {
      return { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30", glow: "" };
    }
    if (name.includes("smart") || name.includes("top")) {
      return { bg: "bg-neon-green/15", text: "text-neon-green", border: "border-neon-green/30", glow: "neon-glow-green" };
    }
    // Default pump addict or rug collector
    return { bg: "bg-neon-purple/15", text: "text-neon-purple", border: "border-neon-purple/30", glow: "neon-glow-purple" };
  };

  const badgeConfig = getBadgeConfig(badge);

  // Divide roast into paragraphs safely
  const paragraphs = roast.split("\n\n").filter(p => p.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl p-6 sm:p-8 glass-card border border-neon-purple/30 shadow-[0_0_40px_rgba(153,69,255,0.15)] overflow-hidden"
    >
      {/* Absolute Decorative Background Lights */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-neon-purple/10 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-neon-green/10 blur-[80px] pointer-events-none" />

      {/* Title block */}
      <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-purple/20 border border-neon-purple/30">
            <Flame className="h-5 w-5 text-neon-purple neon-glow-purple animate-bounce" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white tracking-wide">
              🔥 WALLET ROAST
            </h3>
            <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block mt-0.5">
              Ansem IQ Analyzer v3
            </span>
          </div>
        </div>

        {/* Short address display */}
        <div className="font-mono text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-6)}
        </div>
      </div>

      {/* Quotation Design and Roast Text Body */}
      <div className="relative mb-8 pl-4 border-l-2 border-neon-purple/40">
        <div className="absolute -top-3 -left-1 text-neon-purple/20 select-none pointer-events-none">
          <Quote className="h-10 w-10 transform scale-x-[-1]" />
        </div>
        
        <div className="space-y-4 font-sans text-sm sm:text-base text-gray-200 leading-relaxed tracking-wide">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => <p key={i}>{para}</p>)
          ) : (
            <p>{roast}</p>
          )}
        </div>
      </div>

      {/* Badge container below roast */}
      <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="block font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-semibold">
            DETERMINED TRADER RATING:
          </span>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4.5 py-2 rounded-2xl ${badgeConfig.bg} border ${badgeConfig.border} font-display text-sm font-bold tracking-wide ${badgeConfig.text} ${badgeConfig.glow}`}>
              <Sparkles className="h-4 w-4" />
              {badge}
            </div>
          </div>
        </div>

        {/* Animated Speech Bubble Quote Source */}
        <div className="flex items-center gap-2.5 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5 font-mono text-xs text-gray-400">
          <MessageSquare className="h-3.5 w-3.5 text-neon-green" />
          <span>Roasted by Ansem (AI Model)</span>
        </div>
      </div>
    </motion.div>
  );
}
