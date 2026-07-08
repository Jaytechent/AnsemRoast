import React, { useState } from "react";
import { motion } from "motion/react";
import { Wallet, ArrowRight, Sparkles, Coins, Flame, Gem, TrendingUp, ShieldAlert, BadgeHelp } from "lucide-react";

interface WalletInputProps {
  onAnalyze: (walletAddress: string) => void;
}

export default function WalletInput({ onAnalyze }: WalletInputProps) {
  const [wallet, setWallet] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.trim()) {
      setError("Enter a wallet address or seed keyword first!");
      return;
    }
    setError("");
    onAnalyze(wallet.trim());
  };

  const handlePresetClick = (preset: string) => {
    setWallet(preset);
    setError("");
    onAnalyze(preset);
  };

  return (
    <div id="wallet-input-container" className="relative z-10 w-full max-w-2xl px-4 mx-auto">
      {/* Background Floating Icons (Lucide based, highly stylized) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-16 -left-12 opacity-20 text-neon-green"
        >
          <Coins className="h-10 w-10 neon-glow-green" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-12 -right-10 opacity-20 text-neon-purple"
        >
          <Flame className="h-12 w-12 neon-glow-purple" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-24 -right-16 opacity-15 text-neon-cyan"
        >
          <Gem className="h-9 w-9 neon-glow-cyan" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, 25, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -bottom-16 -left-16 opacity-15 text-red-500"
        >
          <ShieldAlert className="h-10 w-10" />
        </motion.div>
      </div>

      {/* Main Glassmorphic Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative p-6 sm:p-8 rounded-3xl glass-card neon-border-purple"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Wallet className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              id="solana-wallet-field"
              value={wallet}
              onChange={(e) => {
                setWallet(e.target.value);
                if (e.target.value) setError("");
              }}
              placeholder="Paste Solana wallet or keyword..."
              className="block w-full rounded-2xl bg-black/60 border border-white/10 py-4.5 pl-12 pr-4 font-mono text-sm text-white placeholder-gray-500 focus:border-neon-purple/80 focus:outline-none focus:ring-1 focus:ring-neon-purple/50 transition-all"
            />
            {error && (
              <p className="absolute left-1 -bottom-6 font-mono text-[11px] text-red-500 animate-pulse">
                {error}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="analyze-wallet-btn"
              className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-neon-purple to-neon-green p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="relative flex h-14 w-full items-center justify-center rounded-[15px] bg-black font-display font-bold text-white transition-all group-hover:bg-transparent">
                <span className="flex items-center gap-2 tracking-wide">
                  ANALYZE WALLET
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </button>
          </div>
        </form>

        {/* Presets - Highly accessible, fun, and helpful */}
        <div className="mt-8 border-t border-white/5 pt-6 text-center">
          <span className="block font-mono text-xs text-gray-500 mb-3.5 tracking-wider">
            OR TEST ANSEM CHAD SAMPLES:
          </span>
          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              type="button"
              id="preset-ansem-btn"
              onClick={() => handlePresetClick("ansem")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-neon-green hover:bg-neon-green/10 hover:border-neon-green/30 transition-all cursor-pointer"
            >
              <Flame className="h-3.5 w-3.5 text-neon-green" />
              ansem
            </button>
            <button
              type="button"
              id="preset-blknoiz-btn"
              onClick={() => handlePresetClick("blknoiz06")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-neon-purple hover:bg-neon-purple/10 hover:border-neon-purple/30 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-neon-purple" />
              blknoiz06
            </button>
            <button
              type="button"
              id="preset-whales-btn"
              onClick={() => handlePresetClick("HN7cABmw7Ssc6M699P1G1T1rM5Z9jT9p2q6r5m3n5s2")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan/30 transition-all cursor-pointer"
            >
              <TrendingUp className="h-3.5 w-3.5 text-neon-cyan" />
              Degen Whale
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
