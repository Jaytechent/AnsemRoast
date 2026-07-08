import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, RefreshCw, AlertCircle, HelpCircle, Terminal, Share2, Award, Flame, Zap } from "lucide-react";

import MetricCard from "../components/MetricCard";
import ProgressBar from "../components/ProgressBar";
import Timeline from "../components/Timeline";
import RoastCard from "../components/RoastCard";
import BadgeCard from "../components/BadgeCard";
import ShareCard from "../components/ShareCard";
import LoadingScreen from "../components/LoadingScreen";
import { WalletStats } from "../types";

export default function ResultsPage() {
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<WalletStats | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!walletAddress) {
        setError("Invalid wallet address in route.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // POST to backend API
        const response = await axios.post("/api/analyze", {
          wallet: walletAddress,
        });

        if (response.data) {
          setStats(response.data);
        } else {
          throw new Error("No data received from analyzer backend.");
        }
      } catch (err: any) {
        console.error("Analysis API failed:", err);
        const errorMsg = err.response?.data?.error || err.message || "Failed to scan wallet address.";
        setError(errorMsg);
        toast.error(`Error: ${errorMsg}`);
      } finally {
        // Leave loading active for a tiny bit so the user can enjoy the loading message loop!
        setTimeout(() => {
          setLoading(false);
        }, 1800);
      }
    };

    fetchAnalysis();
  }, [walletAddress]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !stats) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 max-w-xl mx-auto text-center space-y-6">
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-black text-white tracking-wide">
            SCAN FAILED FR
          </h2>
          <p className="font-mono text-xs text-gray-500">
            ERROR_LOG: {error || "Empty response from server API"}
          </p>
        </div>
        <p className="font-sans text-sm text-gray-400">
          Ansem's server probably rejected your wallet because of insufficient bid power, or there's a connection timeout. Double-check your address and try again.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 font-display text-xs font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          GO BACK HOME
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10"
    >
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            id="back-home-btn"
            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-gray-500 uppercase font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-green" />
              Scan Complete
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight mt-1 truncate max-w-xs sm:max-w-md">
              Portfolio Diagnosis: <span className="text-neon-cyan">{stats.wallet.slice(0, 12)}...</span>
            </h2>
          </div>
        </div>

        {/* Action Button: Rescan */}
        <button
          onClick={() => navigate("/")}
          id="rescan-wallet-btn"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-neon-purple/20 to-neon-green/20 border border-neon-purple/30 font-display text-xs font-bold text-white hover:bg-gradient-to-r hover:from-neon-purple/30 hover:to-neon-green/30 transition-all cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5 text-neon-green animate-spin" />
          SCAN NEW WALLET
        </button>
      </div>

      {/* Main Grid Layout - Bento Box Style */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Roast, Share, Badge (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Roast Card Component */}
          <RoastCard roast={stats.roast} badge={stats.badge} walletAddress={stats.wallet} />

          {/* Share Card Component */}
          <ShareCard
            wallet={stats.wallet}
            walletIQ={stats.walletIQ}
            ansemStatus={stats.ansemStatus}
            profit={stats.profit}
            diamondHands={stats.diamondHands}
            badge={stats.badge}
            roast={stats.roast}
          />

          {/* Badge Showcase Component */}
          <BadgeCard currentBadge={stats.badge} />

        </div>

        {/* Right Column: Metric Grid, Progress Bars, Timeline (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Progress Bars (IQ, conviction, degenerate scores) */}
          <div className="p-6 rounded-3xl bg-black border border-white/5 space-y-5 glass-card">
            <h3 className="font-display text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <Zap className="h-4 w-4 text-neon-purple" />
              Solana Persona Stats
            </h3>
            <div className="space-y-4 pt-1">
              <ProgressBar label="Wallet IQ" value={stats.walletIQ} max={150} color="cyan" suffix="/150" />
              <ProgressBar label="Conviction Level" value={stats.conviction} color="green" suffix="%" />
              <ProgressBar label="Degenerate Score" value={stats.degenerateScore} color="purple" suffix="%" />
            </div>
          </div>

          {/* Metrics Bento Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* ANSEM Holding status */}
            <div className={`col-span-2 p-5 rounded-2xl border ${stats.ansemStatus === "HOLDER" ? "border-neon-green/20 bg-neon-green/5" : "border-red-500/10 bg-red-500/5"} flex items-center justify-between`}>
              <div className="space-y-1">
                <span className="block font-mono text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                  ANSEM Holder Check
                </span>
                <span className={`block font-display text-sm font-black tracking-wide ${stats.ansemStatus === "HOLDER" ? "text-neon-green" : "text-red-400"}`}>
                  {stats.ansemStatus === "HOLDER" ? "✅ HOLDER DETECTED" : "❌ NO ANSEM FOUND"}
                </span>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${stats.ansemStatus === "HOLDER" ? "bg-neon-green/10 text-neon-green" : "bg-red-500/10 text-red-400"}`}>
                {stats.ansemStatus === "HOLDER" ? "100" : "0"}
              </div>
            </div>

            <MetricCard
              title="Total Trades"
              value={stats.trades}
              iconName="Activity"
              variant="default"
              subText="All cycle transactions scanned"
            />

            <MetricCard
              title="Avg Hold Time"
              value={stats.averageHold}
              iconName="Clock"
              variant="purple"
              subText="Paper vs Diamond scale"
            />

            <MetricCard
              title="First Buy Date"
              value={stats.firstBuy}
              iconName="Calendar"
              variant="cyan"
              subText="Solana journey inception"
            />

            <MetricCard
              title="Diamond Hands"
              value={`${stats.diamondHands}%`}
              iconName="Gem"
              variant="green"
              subText="Holding index multiplier"
            />

            <MetricCard
              title="Net Profit"
              value={`${stats.profit >= 0 ? "+" : ""}${stats.profit} SOL`}
              iconName="DollarSign"
              variant={stats.profit >= 0 ? "green" : "red"}
              subText="Realized blockchain capital"
            />

            <MetricCard
              title="Missed Profit"
              value={`~${stats.missedProfit} SOL`}
              iconName="Frown"
              variant="red"
              subText="Gains fumbled by jeetting"
            />

          </div>

          {/* Timeline Node */}
          <div className="space-y-4">
            <div className="pl-1">
              <h3 className="font-display text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
                <Terminal className="h-4 w-4 text-neon-green" />
                Degen Timeline Log
              </h3>
              <p className="font-sans text-xs text-gray-500 mt-1">
                A deterministic mapping of your historical transaction highlights.
              </p>
            </div>
            <Timeline items={stats.timeline} />
          </div>

        </div>

      </div>
    </motion.div>
  );
}
