import React, { useRef } from "react";
import { motion } from "motion/react";
import { Flame, Twitter, Sparkles, Trophy, Percent, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";

interface ShareCardProps {
  wallet: string;
  walletIQ: number;
  ansemStatus: string;
  profit: number;
  diamondHands: number;
  badge: string;
  roast: string;
}

export default function ShareCard({
  wallet,
  walletIQ,
  ansemStatus,
  profit,
  diamondHands,
  badge,
  roast,
}: ShareCardProps) {
  const shortWallet = wallet.slice(0, 6) + "..." + wallet.slice(-4);
  
  // Cut Roast down to a clean short snippet for the square layout
  const roastSnippet = roast.length > 210 ? roast.slice(0, 207) + "..." : roast;

  // Build X (Twitter) intent URL
  const buildTwitterUrl = () => {
    const text = `🔥 Just got roasted by Ansem (@blknoiz06) on Ansem Wallet Roast!\n\n🧠 Wallet IQ: ${walletIQ}\n💎 Diamond Hands: ${diamondHands}%\n💰 Net Profit: ${profit} SOL\n🏆 Badge: ${badge}\n\nRoast: "${roastSnippet.slice(0, 100)}..."\n\nCook your own wallet at:`;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`;
  };

  const handleCopyCard = () => {
    const textToCopy = `🧠 Wallet IQ: ${walletIQ}\n💎 Diamond Hands: ${diamondHands}%\n💰 Net Profit: ${profit} SOL\n🏆 Badge: ${badge}\n🔥 Ansem Roast: "${roastSnippet}"`;
    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied share card stats to clipboard! Ready to post on X.", {
      style: {
        background: "#0a0a0c",
        color: "#f3f4f6",
        border: "1px solid rgba(20, 241, 149, 0.2)",
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h3 className="font-display text-base font-bold text-white tracking-wide">
          📸 SOCIAL SHARE CARD
        </h3>
        <p className="font-sans text-xs text-gray-500 mt-1">
          Share your Solana rating card directly with the community on X (Twitter).
        </p>
      </div>

      {/* Actual Social Image Card Container */}
      <div 
        id="share-image-block"
        className="mx-auto w-full max-w-[420px] aspect-square rounded-3xl p-6 bg-black border border-white/10 flex flex-col justify-between relative overflow-hidden shadow-[0_0_50px_rgba(20,241,149,0.05)] select-none"
      >
        {/* Cool Solana/Ansem Graphic watermarks */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-gradient-to-tr from-neon-purple/10 to-neon-green/5 blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full border border-white/5 opacity-40" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full border border-white/5 opacity-40" />

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-neon-purple to-neon-green p-[1px]">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-black">
                <Flame className="h-3.5 w-3.5 text-neon-green" />
              </div>
            </div>
            <span className="font-display text-[10px] font-bold tracking-wider text-white">
              ANSEM ROAST
            </span>
          </div>
          <div className="font-mono text-[9px] text-gray-500 font-bold bg-white/5 px-2 py-1 rounded-md border border-white/5">
            SOLANA ADDR: {shortWallet}
          </div>
        </div>

        {/* Central Grid and Badge */}
        <div className="my-3 space-y-4">
          <div className="flex justify-center">
            <div className="text-center">
              <span className="block font-mono text-[9px] text-gray-500 uppercase tracking-widest font-semibold">
                OFFICIAL RATING
              </span>
              <span className="inline-block mt-1 px-4 py-1.5 rounded-xl bg-neon-purple/10 border border-neon-purple/30 font-display text-base font-black text-neon-purple uppercase tracking-wide neon-glow-purple">
                🏆 {badge}
              </span>
            </div>
          </div>

          {/* Key share stats in clean grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
              <span className="block font-mono text-[8px] text-gray-500 uppercase tracking-wider">
                Wallet IQ
              </span>
              <span className="block font-display text-lg font-bold text-white mt-0.5">
                {walletIQ}
              </span>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
              <span className="block font-mono text-[8px] text-gray-500 uppercase tracking-wider">
                ANSEM Status
              </span>
              <span className={`block font-display text-xs font-bold mt-1 uppercase ${ansemStatus === "HOLDER" ? "text-neon-green" : "text-red-400"}`}>
                {ansemStatus === "HOLDER" ? "✅ Holder" : "❌ No Ansem"}
              </span>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
              <span className="block font-mono text-[8px] text-gray-500 uppercase tracking-wider">
                Net Profit
              </span>
              <span className={`block font-display text-base font-bold mt-0.5 ${profit >= 0 ? "text-neon-green" : "text-red-400"}`}>
                {profit >= 0 ? `+${profit}` : profit} SOL
              </span>
            </div>
            <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
              <span className="block font-mono text-[8px] text-gray-500 uppercase tracking-wider">
                Diamond Hands
              </span>
              <span className="block font-display text-base font-bold text-neon-cyan mt-0.5">
                {diamondHands}%
              </span>
            </div>
          </div>
        </div>

        {/* Tiny Roast Snippet */}
        <div className="bg-white/5 p-3 rounded-xl border border-white/5 relative">
          <span className="block font-mono text-[7px] text-gray-500 uppercase tracking-wider mb-1">
            ANSEM SUMMARY:
          </span>
          <p className="font-sans text-[11px] text-gray-300 italic line-clamp-2 leading-relaxed">
            "{roastSnippet}"
          </p>
        </div>

        {/* Footer info inside share card */}
        <div className="border-t border-white/5 pt-3.5 flex items-center justify-between text-[8px] font-mono text-gray-500">
          <span>SCAN DATE: 2026-07-07</span>
          <span className="text-neon-green font-semibold">ANSEM-ROAST.FUN</span>
        </div>
      </div>

      {/* Share Actions buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={buildTwitterUrl()}
          target="_blank"
          rel="noopener noreferrer"
          id="post-to-x-btn"
          className="flex-1 flex items-center justify-center gap-2 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white py-3 px-5 rounded-2xl font-display font-bold text-xs transition-all hover:scale-[1.01]"
        >
          <Twitter className="h-4 w-4 fill-white" />
          POST TO X (TWITTER)
        </a>
        <button
          type="button"
          id="copy-share-card-btn"
          onClick={handleCopyCard}
          className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 px-5 rounded-2xl font-display font-bold text-xs transition-all cursor-pointer"
        >
          COPY CARD DATA
        </button>
      </div>
    </div>
  );
}
