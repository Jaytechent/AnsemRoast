export interface TimelineItem {
  title: string;
  description: string;
  type: string; // "buy" | "hold" | "sell" | "profit" | "loss" | "neutral"
  date: string;
  icon: string;
}

export interface WalletStats {
  wallet: string;
  walletIQ: number;
  conviction: number;
  diamondHands: number;
  paperHands: number;
  degenerateScore: number;
  profit: number;
  missedProfit: number;
  firstBuy: string;
  averageHold: string;
  trades: number;
  ansemStatus: "HOLDER" | "NO ANSEM FOUND" | string;
  badge: string;
  roast: string;
  timeline: TimelineItem[];
}
