import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Loader2, Cpu, Terminal } from "lucide-react";

const MESSAGES = [
  "Checking wallet balance & historical fumbles...",
  "Finding hidden dev rug coins in your back pocket...",
  "Looking for ANSEM token holdings in memory...",
  "Calculating conviction coefficients & paper hand levels...",
  "Consulting Ansem in active 24/7 X Spaces...",
  "Synthesizing high-grade meme intelligence...",
  "Generating hilarious personalized roast fr..."
];

const TERMINAL_LINES = [
  "INIT_RPC: Connecting to Solana mainnet-beta...",
  "FETCH_TOKEN_ACCOUNTS: Extracting token holdings...",
  "SCAN_METADATA: Checking pump.fun program logs...",
  "CALC_STATS: Evaluating trade velocity...",
  "ANSEM_COEFFICIENT: Syncing with blknoiz06 database...",
  "AI_MODEL: Instantiating gemini-3.5-flash context...",
  "ROAST_BUFFER: Formulating aggressive sarcasm..."
];

export default function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [terminalIndex, setTerminalIndex] = useState(0);

  useEffect(() => {
    // Cycle messages
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1600);

    // Cycle terminal lines
    const termInterval = setInterval(() => {
      setTerminalIndex((prev) => Math.min(prev + 1, TERMINAL_LINES.length));
    }, 900);

    return () => {
      clearInterval(msgInterval);
      clearInterval(termInterval);
    };
  }, []);

  return (
    <div id="loading-screen" className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-4 overflow-hidden grid-bg">
      {/* Background Neon Glows */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-neon-purple/20 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-neon-green/15 blur-[120px]" />

      <div className="relative flex flex-col items-center max-w-lg w-full text-center">
        {/* Spinner Visual */}
        <div className="relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="h-28 w-28 rounded-full border-t-2 border-b-2 border-neon-green neon-border-green flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="h-20 w-20 rounded-full border-r-2 border-l-2 border-neon-purple neon-border-purple flex items-center justify-center"
            >
              <Flame className="h-8 w-8 text-neon-cyan neon-glow-cyan animate-pulse" />
            </motion.div>
          </motion.div>
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green opacity-30 blur-md -z-10 animate-pulse" />
        </div>

        {/* Dynamic Funny Messages */}
        <div className="h-14 mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-display text-lg sm:text-xl font-semibold tracking-wide text-white"
            >
              {MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Mock Premium Solana Terminal (looks awesome!) */}
        <div className="w-full rounded-2xl border border-white/5 bg-black/60 p-4.5 font-mono text-left text-xs text-gray-400 glass-card">
          <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-3">
            <Terminal className="h-3.5 w-3.5 text-neon-cyan" />
            <span className="text-[10px] uppercase tracking-widest font-semibold text-neon-cyan">
              Ansem Scanner Terminal
            </span>
          </div>
          <div className="space-y-1.5 h-36 overflow-hidden">
            {TERMINAL_LINES.slice(0, terminalIndex + 1).map((line, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2"
              >
                <span className="text-neon-purple select-none">&gt;</span>
                <span className={idx === terminalIndex ? "text-white font-medium" : "text-gray-500"}>
                  {line}
                </span>
              </motion.div>
            ))}
            {terminalIndex < TERMINAL_LINES.length && (
              <div className="flex items-center gap-1 text-neon-green animate-pulse">
                <span>&gt;</span>
                <span className="h-3.5 w-2 bg-neon-green inline-block" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
