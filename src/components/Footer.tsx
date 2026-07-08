import React from "react";
import { Flame, ShieldAlert, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer id="app-footer" className="border-t border-white/5 bg-black/80 py-8 mt-16 font-mono">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 text-center">
        {/* Brand info */}
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-neon-green" />
          <span className="font-display font-bold text-white tracking-wide">
            ANSEM WALLET ROAST
          </span>
          <span className="text-[10px] text-gray-600">© 2026</span>
        </div>

        {/* Disclaimer / Warning - makes it look real and funny */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 max-w-md leading-relaxed md:text-left">
          <ShieldAlert className="h-3.5 w-3.5 text-neon-purple flex-shrink-0" />
          <span>
            DISCLAIMER: This application is a high-conviction, AI-powered parody roast. No real SOL tokens are fumbled or lost during this scan. Do not trade based on AI spaces.
          </span>
        </div>

        {/* Made with love */}
        <div className="flex items-center gap-1">
          <span>Made for the Chads with</span>
          <Heart className="h-3 w-3 text-neon-purple fill-neon-purple" />
          <span>on Solana</span>
        </div>
      </div>
    </footer>
  );
}
