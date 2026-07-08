import React from "react";
import { motion } from "motion/react";
import { Award, Shield, Zap, Flame, Gem, Skull, AlertOctagon, RefreshCw } from "lucide-react";

interface BadgeCardProps {
  currentBadge: string;
}

const BADGE_LIST = [
  { name: "Diamond Hands", desc: "Holds through thick and thin. Pure cycle conviction, fr.", icon: Gem, color: "text-neon-cyan", border: "border-neon-cyan/20", bg: "bg-neon-cyan/5" },
  { name: "Paper Hands", desc: "Jeets at 5% profit or panic-sells at the first dip.", icon: RefreshCw, color: "text-red-400", border: "border-red-500/20", bg: "bg-red-500/5" },
  { name: "Whale", desc: "Throwing massive SOL size around like absolute candy.", icon: Shield, color: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
  { name: "Smart Money", desc: "Top-tier high-IQ sniper. Buys bottom, sells top.", icon: Award, color: "text-neon-green", border: "border-neon-green/20", bg: "bg-neon-green/5" },
  { name: "Rug Collector", desc: "If there's a fresh dev rug on pump.fun, you will buy it.", icon: Skull, color: "text-rose-500", border: "border-rose-500/20", bg: "bg-rose-500/5" },
  { name: "Top Buyer", desc: "Certified top signal. Green candles make you FOMO hard.", icon: Zap, color: "text-yellow-400", border: "border-yellow-400/20", bg: "bg-yellow-400/5" },
  { name: "Exit Liquidity", desc: "Smooth brain portfolio. Always buying what whales sell.", icon: AlertOctagon, color: "text-orange-400", border: "border-orange-500/20", bg: "bg-orange-500/5" },
  { name: "Pump.fun Addict", desc: "24/7 degen slot machine clicking. Cannot stop fr.", icon: Flame, color: "text-neon-purple", border: "border-neon-purple/20", bg: "bg-neon-purple/5" }
];

export default function BadgeCard({ currentBadge }: BadgeCardProps) {
  return (
    <div className="rounded-3xl p-6 sm:p-8 glass-card border border-white/5 space-y-6">
      <div>
        <h3 className="font-display text-base font-bold text-white tracking-wide">
          🏆 TRADER BADGE INDEX
        </h3>
        <p className="font-sans text-xs text-gray-500 mt-1">
          Explore all possible Solana rating classifications inside the Ansem ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        {BADGE_LIST.map((b, idx) => {
          const isCurrent = b.name.toLowerCase() === currentBadge.toLowerCase();
          const IconComp = b.icon;

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isCurrent 
                  ? `${b.border.replace('20', '50')} ${b.bg.replace('5', '15')} ring-1 ring-white/10` 
                  : "border-white/5 bg-black/40 opacity-55 hover:opacity-95"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${isCurrent ? b.bg : "bg-white/5"}`}>
                  <IconComp className={`h-4.5 w-4.5 ${isCurrent ? b.color : "text-gray-400"}`} />
                </div>
                {isCurrent && (
                  <span className="font-mono text-[9px] font-bold tracking-wider text-neon-green bg-neon-green/10 px-2 py-0.5 rounded-full uppercase">
                    Your Badge
                  </span>
                )}
              </div>
              <div className="mt-2">
                <h4 className={`font-display text-xs font-bold ${isCurrent ? "text-white" : "text-gray-400"}`}>
                  {b.name}
                </h4>
                <p className="font-sans text-[11px] text-gray-500 leading-normal mt-1">
                  {b.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
