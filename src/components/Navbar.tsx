import React, { useEffect, useState } from "react";
import { Flame, Radio, Coins, ShieldAlert, Cpu } from "lucide-react";

export default function Navbar() {
  const [solPrice, setSolPrice] = useState<number>(83.68);
  const [gasPrice, setGasPrice] = useState<number>(42);

  // Small effect to fluctuate stats slightly like a real dex terminal
  useEffect(() => {
    const interval = setInterval(() => {
      setSolPrice((prev) => +(prev + (Math.random() - 0.5) * 0.15).toFixed(2));
      setGasPrice((prev) => Math.max(15, prev + Math.floor((Math.random() - 0.5) * 4)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="app-navbar" className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-neon-purple to-neon-green p-[1px]">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-black">
              <Flame className="h-5 w-5 text-neon-green neon-glow-green" />
            </div>
            <div className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-neon-cyan opacity-75" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-wider text-white">
              ANSEM WALLET <span className="bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">ROAST</span>
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[9px] text-gray-500">
              <Radio className="h-2 w-2 text-neon-green animate-pulse" />
              <span>LIVE CORE V3.5</span>
            </div>
          </div>
        </div>

        {/* Live Market Stats (Looks extremely premium, like DexScreener/Jupiter) */}
        <div className="hidden md:flex items-center gap-6 font-mono text-xs">
          <div className="flex items-center gap-2 border-r border-white/5 pr-4">
            <Coins className="h-3.5 w-3.5 text-neon-cyan" />
            <span className="text-gray-400">SOL:</span>
            <span className="font-semibold text-neon-cyan">${solPrice}</span>
          </div>
          <div className="flex items-center gap-2 border-r border-white/5 pr-4">
            <Cpu className="h-3.5 w-3.5 text-neon-purple" />
            <span className="text-gray-400">SOL FEE:</span>
            <span className="font-semibold text-neon-purple">{gasPrice} lamports</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-neon-green/10 px-2 py-0.5 text-[10px] font-semibold text-neon-green">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse" />
            NETWORK STABLE
          </div>
        </div>

        {/* Action Button */}
        <div>
          <a
            href="https://x.com/blknoiz06"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center rounded-xl bg-white/5 px-4 py-2 font-display text-xs font-semibold text-white border border-white/10 transition-all hover:border-neon-green/40 hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-green" />
              ANSEM SPACE
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
