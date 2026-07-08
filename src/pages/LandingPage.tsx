import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import WalletInput from "../components/WalletInput";
import { Flame, FlameKindling, TrendingUp, Sparkles, MessageSquare, Terminal } from "lucide-react";

interface LandingPageProps {
  onStartAnalysis: (wallet: string) => void;
}

export default function LandingPage({ onStartAnalysis }: LandingPageProps) {
  const navigate = useNavigate();

  const handleAnalyze = (walletAddress: string) => {
    onStartAnalysis(walletAddress);
  };

  return (
    <div id="landing-page" className="relative flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-12 overflow-hidden">
      {/* Floating abstract decorative background particles */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Header */}
      <div className="text-center max-w-4xl px-4 mx-auto space-y-6 z-10 mb-10">
        {/* Hype Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-purple/15 border border-neon-purple/20 font-mono text-xs text-neon-purple tracking-wider uppercase font-semibold"
        >
          <FlameKindling className="h-3.5 w-3.5 animate-pulse text-neon-purple" />
          The Ultimate ANSEM AI Roast Machine
        </motion.div>

        {/* Large Display Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.05]"
        >
          Want to Know How Much your Ansem wallet is <br />
          <span className="bg-gradient-to-r from-neon-green via-neon-cyan to-neon-purple bg-clip-text text-transparent neon-glow-green">
            cooking?
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto font-sans text-sm sm:text-lg text-gray-400 font-medium leading-relaxed"
        >
          Paste any Solana wallet address. We'll crawl its historical transactions, check if it holds ANSEM, calculate conviction metrics, and roast your life choices fr.
        </motion.p>
      </div>

      {/* Wallet Input Block */}
      <div className="w-full max-w-4xl px-4 z-10">
        <WalletInput onAnalyze={handleAnalyze} />
      </div>

      {/* Recent Activity Live Stream (Fills negative space with extremely authentic terminal logs) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-2xl px-4 mx-auto mt-16 z-10 text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/5 px-4.5 py-2.5 rounded-2xl font-mono text-[11px] text-gray-400">
          <Terminal className="h-3.5 w-3.5 text-neon-green animate-pulse" />
          <span>LATEST ROAST: </span>
          <span className="text-white font-semibold">Ansem's wallet got rated</span>
          <span className="text-neon-cyan px-1.5 py-0.5 rounded bg-neon-cyan/10 font-bold">155 IQ</span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 font-medium">Average IQ across Solana: 58</span>
        </div>
      </motion.div>
    </div>
  );
}
