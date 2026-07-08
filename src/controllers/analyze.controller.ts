import { Request, Response } from "express";
import NodeCache from "node-cache";
import { WalletCache } from "../models/WalletCache";
import { HeliusService, SplTokenBalance, ParsedTransaction } from "../services/helius.service";
import { DexScreenerService } from "../services/dexscreener.service";
import { RoastService } from "../services/roast.service";

// In-memory fallback cache (30 minutes expiry)
const localCache = new NodeCache({ stdTTL: 1800, checkperiod: 120 });

// Ansem Token Contract Address
const ANSEM_MINT = "9cRCn9rGT8V2imeM2BaKs13yhMEais3ruM3rPvTGpump";

// Fallback SOL/USD price used only to express USD position value in SOL terms for the share card
// (there is no dedicated SOL price feed wired up yet).
const SOL_PRICE_USD_FALLBACK = 150;

/**
 * Small deterministic hash (mirrors HeliusService's simulation hash) used to derive
 * stable, non-random "profit" style figures for wallets with no real cost-basis history.
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/**
 * Builds the frontend-facing fields (WalletStats shape) that were previously
 * missing from the API response: ansemStatus, profit, missedProfit, averageHold, trades.
 * Without these the UI silently fell back to "falsy" defaults (e.g. ansemStatus ===
 * undefined !== "HOLDER"), which is what made the Social Share Card / Holder Check /
 * Badge Index look "disconnected" from the actual scan result.
 */
function buildDisplayFields(params: {
  wallet: string;
  holdsAnsem: boolean;
  currentValue: number;
  daysHolding: number;
  paperHands: number;
  degenerateScore: number;
  walletIQ: number;
  txCount: number;
}) {
  const { wallet, holdsAnsem, currentValue, daysHolding, paperHands, degenerateScore, walletIQ, txCount } = params;
  const seed = hashCode(wallet);

  const ansemStatus: "HOLDER" | "NO ANSEM FOUND" = holdsAnsem ? "HOLDER" : "NO ANSEM FOUND";

  // Net profit estimate (SOL). Holders: current position value converted to SOL.
  // Non-holders: small simulated loss scaled by how erratic their trading is.
  const profit = holdsAnsem
    ? parseFloat((currentValue / SOL_PRICE_USD_FALLBACK).toFixed(2))
    : parseFloat((-((degenerateScore / 100) * 2.5 + (seed % 150) / 100)).toFixed(2));

  // Missed profit estimate (SOL). Bigger if they jeeted (paperHands) or have low wallet IQ.
  const missedProfit = parseFloat(
    (
      (paperHands / 100) * Math.max(currentValue / SOL_PRICE_USD_FALLBACK, 1.5) +
      ((100 - walletIQ) / 100) * 2 +
      (seed % 100) / 100
    ).toFixed(2)
  );

  const averageHold = daysHolding > 0 ? `${daysHolding}d` : "N/A";
  const trades = txCount;

  return { ansemStatus, profit, missedProfit, averageHold, trades };
}

// Easter Egg static responses for testing
const EASTER_EGGS: Record<string, any> = {
  ansem: {
    wallet: "ansem",
    holdsAnsem: true,
    balance: 550000,
    currentValue: 12500,
    walletIQ: 155,
    diamondHands: 92,
    paperHands: 8,
    conviction: 99,
    degenerateScore: 98,
    badge: "The Legend",
    firstBuyDate: "2020-03-12",
    firstBuy: "2020-03-12",
    daysHolding: 2309,
    ansemStatus: "HOLDER",
    profit: 83.33,
    missedProfit: 4.2,
    averageHold: "2309d",
    trades: 4271,
    timeline: [
      { step: "Wallet Created", date: "2019-11-01", status: "Spawned early SOL degen key" },
      { step: "First ANSEM Buy", date: "2020-03-12", status: "Bought the dip at penny levels" },
      { step: "Current Status", date: "2026-07-07", status: "Unshakable spaces king" }
    ],
    roast: "Wait, you're literally roasting Ansem? Bro, you're the one who called SOL at $8, fumbled WIF at $0.001 but somehow made it up by hosting 24/7 X Spaces while everyone else is sleeping. Your wallet is literally Solana royalty, but why is there 45,000 USDC sitting in a random pump.fun dev rug coin? Absolute king of the degens.",
    generatedAt: new Date().toISOString()
  },
  blknoiz06: {
    wallet: "blknoiz06",
    holdsAnsem: true,
    balance: 850000,
    currentValue: 19500,
    walletIQ: 160,
    diamondHands: 95,
    paperHands: 5,
    conviction: 100,
    degenerateScore: 99,
    badge: "The Host",
    firstBuyDate: "2019-11-18",
    firstBuy: "2019-11-18",
    daysHolding: 2423,
    ansemStatus: "HOLDER",
    profit: 130.0,
    missedProfit: 2.1,
    averageHold: "2423d",
    trades: 6890,
    timeline: [
      { step: "Wallet Created", date: "2019-11-01", status: "Inception of blknoiz" },
      { step: "First ANSEM Buy", date: "2019-11-18", status: "Bid early, hold high" },
      { step: "Current Status", date: "2026-07-07", status: "Absolute degen sovereign" }
    ],
    roast: "Ansem's main account detected. Look Chad, we all know you cook. You've printed millions on Bonk, WIF, and POPCAT. But please explain why you still have 12 pages of failed pump.fun dev migrations on your secondary accounts? Go get some sleep, drink some water, and turn off the microphone.",
    generatedAt: new Date().toISOString()
  }
};

export class AnalyzeController {
  /**
   * Main analyze handler for Solana Wallets
   */
  public static async analyzeWallet(req: Request, res: Response) {
    try {
      const { wallet } = req.body;

      if (!wallet || typeof wallet !== "string") {
        return res.status(400).json({ error: "Solana wallet address is required" });
      }

      const cleanWallet = wallet.trim().toLowerCase();

      // Check Easter Eggs
      if (EASTER_EGGS[cleanWallet]) {
        return res.status(200).json(EASTER_EGGS[cleanWallet]);
      }

      // STEP 1: Validate wallet address (Solana standard base58 check)
      const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      // Allow lowercase words like "ansem" for testing mock fallbacks, but enforce base58 for actual hex strings
      const isTestWord = ["ansem", "blknoiz06"].includes(cleanWallet);
      if (!isTestWord && !solanaRegex.test(wallet.trim())) {
        return res.status(400).json({ error: "Invalid Solana wallet address format." });
      }

      // Check Caching (MongoDB or local in-memory fallback)
      const cachedResponse = await AnalyzeController.getCachedAnalysis(cleanWallet);
      if (cachedResponse) {
        console.log(`🚀 Returning cached analysis for wallet: ${cleanWallet}`);
        return res.status(200).json(cachedResponse);
      }

      console.log(`🔍 Fresh analysis started for wallet: ${cleanWallet}`);

      // STEP 2: Fetch wallet SPL balances using Helius
      const balances: SplTokenBalance[] = await HeliusService.getSplBalances(wallet);

      // STEP 3: Find ANSEM token
      let ansemToken = balances.find((b) => b.mint && b.mint.toLowerCase() === ANSEM_MINT.toLowerCase());
      
      // Double check with a targeted RPC call if not found in bulk list or has 0 balance
      if (!ansemToken || ansemToken.uiAmount === 0) {
        console.log(`ℹ️ ANSEM token not found in bulk list of ${balances.length} tokens. Running a targeted RPC query for verification...`);
        const targetAnsem = await HeliusService.getTargetedTokenBalance(wallet, ANSEM_MINT);
        if (targetAnsem && targetAnsem.uiAmount > 0) {
          console.log(`✅ Targeted RPC query successfully found ANSEM balance: ${targetAnsem.uiAmount}`);
          ansemToken = targetAnsem;
          // Add to balances list if not there
          if (!balances.some((b) => b.mint && b.mint.toLowerCase() === ANSEM_MINT.toLowerCase())) {
            balances.push(targetAnsem);
          }
        }
      }

      const holdsAnsem = !!ansemToken && (ansemToken.uiAmount > 0 || ansemToken.amount > 0);
      const balance = holdsAnsem ? ansemToken!.uiAmount : 0;

      // STEP 4: Fetch recent transactions (Limit 100) and pass holdsAnsem to align fallbacks
      const recentTxs: ParsedTransaction[] = await HeliusService.getRecentTransactions(wallet, 100, holdsAnsem);

      // STEP 5: Detect first interaction with ANSEM
      let firstBuyDate = "Never";
      let daysHolding = 0;
      let hasSoldAnsem = false;

      // Scan parsed transactions for transfers or swaps involving the ANSEM mint
      const ansemTxs = recentTxs.filter((tx) => {
        // Check if description contains "ANSEM" or if any transfers use the ANSEM mint
        const descMatch = tx.description?.toLowerCase().includes("ansem");
        const transferMatch = tx.tokenTransfers?.some((t: any) => t.mint && t.mint.toLowerCase() === ANSEM_MINT.toLowerCase());
        return descMatch || transferMatch;
      });

      if (ansemTxs.length > 0) {
        // Chronological sort to find the oldest interaction
        const sortedAnsemTxs = [...ansemTxs].sort((a, b) => a.timestamp - b.timestamp);
        const firstTx = sortedAnsemTxs[0];
        const dateObj = new Date(firstTx.timestamp * 1000);
        firstBuyDate = dateObj.toISOString().split("T")[0];

        const msDiff = Date.now() - dateObj.getTime();
        daysHolding = Math.max(0, Math.floor(msDiff / (1000 * 60 * 60 * 24)));

        // Detect if wallet executed sells of ANSEM
        hasSoldAnsem = ansemTxs.some((tx) => {
          const desc = tx.description?.toLowerCase() || "";
          return desc.includes("sell") || desc.includes("sent") || desc.includes("swapped ansem");
        });
      } else if (holdsAnsem) {
        // Fallback if transaction history is clean but they hold ANSEM (e.g. simulation or airdrop)
        firstBuyDate = "2026-06-01";
        daysHolding = 36;
      }

      // STEP 6: Fetch current ANSEM price from DexScreener
      let ansemPrice = 0.0227; // Realistic fallback price if API fails
      const marketData = await DexScreenerService.getTokenData(ANSEM_MINT);
      if (marketData) {
        ansemPrice = marketData.priceUsd;
      }
      const currentValue = parseFloat((balance * ansemPrice).toFixed(2));

      // STEP 7: Calculate metrics
      
      // A. Wallet IQ
      let walletIQ = 50;
      if (holdsAnsem) walletIQ += 10;
      if (daysHolding > 30) walletIQ += 10;
      if (balances.length < 15) walletIQ += 10;
      if (currentValue > 100) walletIQ += 5;
      
      // Check sells count (swaps out or transfers out)
      const sellsCount = recentTxs.filter((tx) => tx.description?.toLowerCase().includes("sold") || tx.description?.toLowerCase().includes("swap")).length;
      if (sellsCount < 5) walletIQ += 5;

      // Over 100 transactions in the last 30 days
      const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
      const recentTxsCount = recentTxs.filter((tx) => tx.timestamp >= thirtyDaysAgo).length;
      if (recentTxsCount > 100) walletIQ -= 10;

      // Clamp score between 0 and 100
      walletIQ = Math.min(100, Math.max(0, walletIQ));

      // B. Diamond Hands index
      let diamondHands = 20;
      if (daysHolding > 30) diamondHands = 100;
      else if (daysHolding > 14) diamondHands = 80;
      else if (daysHolding > 7) diamondHands = 60;
      else if (daysHolding > 3) diamondHands = 40;

      // C. Degenerate Score
      // Formula: transactionsLast30Days / 2 (max 100)
      const degenerateScore = Math.min(100, Math.round(recentTxsCount / 2));

      // D. Paper Hands index
      const paperHands = hasSoldAnsem ? 100 : 0;

      // E. Conviction Level
      const conviction = holdsAnsem ? 100 : 30;

      // F. Badge Choice Rules
      //
      // NOTE: walletIQ is a sum of fixed bonuses (see Step 7A) and, with the current
      // formula, only ranges from ~40 to ~90 in practice - it never actually reaches
      // the old ">90" / "<20" thresholds below. That made "Diamond Hands" and
      // "Exit Liquidity" impossible to earn, and left half of the 8 badges shown in
      // the Trader Badge Index (Whale, Rug Collector, Top Buyer) completely unused,
      // so most scans fell through to "Meme Enjoyer" - a badge that wasn't even in
      // the index, so nothing ever highlighted. Thresholds below are rescaled to the
      // real 40-90 range and every badge in BadgeCard's BADGE_LIST is now reachable.
      let badge = "Meme Enjoyer";
      if (diamondHands >= 80 && walletIQ >= 75) {
        badge = "Diamond Hands";
      } else if (currentValue >= 1000) {
        badge = "Whale";
      } else if (walletIQ >= 70) {
        badge = "Smart Money";
      } else if (paperHands > 90) {
        badge = "Paper Hands";
      } else if (degenerateScore > 70) {
        badge = "Pump.fun Addict";
      } else if (degenerateScore > 45 && walletIQ < 55) {
        badge = "Rug Collector";
      } else if (holdsAnsem && daysHolding <= 5) {
        badge = "Top Buyer";
      } else if (walletIQ < 50) {
        badge = "Exit Liquidity";
      }

      // STEP 8: Generate Roast text
      const roast = await RoastService.generateRoast({
        wallet,
        walletIQ,
        diamondHands,
        conviction,
        degenerateScore,
        holdsAnsem,
        daysHolding,
        badge,
        balance,
      });

      // STEP 9: Create Timeline Items
      const createdDateStr = recentTxs.length > 0 
        ? new Date(recentTxs[recentTxs.length - 1].timestamp * 1000).toISOString().split("T")[0]
        : "2025-01-01";

      const timeline = [
        {
          step: "Wallet Created",
          title: "Wallet Created",
          date: createdDateStr,
          status: "Spawned on the Solana blockchain. Ready to trade.",
          description: "Spawned on the Solana blockchain. Ready to trade.",
          type: "neutral",
          icon: "Sparkles"
        },
        {
          step: "First ANSEM Buy",
          title: "First ANSEM Buy",
          date: firstBuyDate,
          status: holdsAnsem 
            ? `Acquired initial stack of ${balance.toLocaleString()} ANSEM.` 
            : "No transaction records for the ANSEM token detected.",
          description: holdsAnsem 
            ? `Acquired initial stack of ${balance.toLocaleString()} ANSEM.` 
            : "No transaction records for the ANSEM token detected.",
          type: holdsAnsem ? "buy" : "neutral",
          icon: holdsAnsem ? "TrendingUp" : "ShieldAlert"
        },
        {
          step: "Current Status",
          title: "Current Status",
          date: new Date().toISOString().split("T")[0],
          status: holdsAnsem 
            ? `Holding strong with a value of $${currentValue.toLocaleString()} USD.` 
            : "Watching from the sidelines while others send it.",
          description: holdsAnsem 
            ? `Holding strong with a value of $${currentValue.toLocaleString()} USD.` 
            : "Watching from the sidelines while others send it.",
          type: holdsAnsem ? "profit" : "loss",
          icon: holdsAnsem ? "Flame" : "Frown"
        }
      ];

      // STEP 10: Compute display-only fields the frontend (WalletStats) expects but
      // the API was never actually populating: ansemStatus, profit, missedProfit,
      // averageHold, trades. This is what caused the Social Share Card, the "ANSEM
      // Holder Check" panel, etc. to look disconnected from the real scan result -
      // they were reading stats.ansemStatus / stats.profit / etc, which were always
      // `undefined` even when holdsAnsem was true under the hood.
      const displayFields = buildDisplayFields({
        wallet,
        holdsAnsem,
        currentValue,
        daysHolding,
        paperHands,
        degenerateScore,
        walletIQ,
        txCount: recentTxs.length,
      });

      // Final Response Block
      const analysisResult = {
        wallet,
        holdsAnsem,
        balance: parseFloat(balance.toFixed(2)),
        currentValue,
        walletIQ,
        diamondHands,
        paperHands,
        conviction,
        degenerateScore,
        badge,
        firstBuyDate,
        firstBuy: firstBuyDate,
        daysHolding,
        timeline,
        roast,
        ansemStatus: displayFields.ansemStatus,
        profit: displayFields.profit,
        missedProfit: displayFields.missedProfit,
        averageHold: displayFields.averageHold,
        trades: displayFields.trades,
        generatedAt: new Date().toISOString(),
      };

      // Save to cache (MongoDB Atlas and local fallback)
      await AnalyzeController.setCachedAnalysis(cleanWallet, analysisResult);

      return res.status(200).json(analysisResult);
    } catch (err: any) {
      console.error("Master analyzer endpoint failed:", err);
      return res.status(500).json({ error: "Internal server error occurred while analyzing wallet." });
    }
  }

  /**
   * Helper to retrieve cached analysis (checks DB then falls back to memory)
   */
  private static async getCachedAnalysis(wallet: string): Promise<any | null> {
    const cleanWallet = wallet.toLowerCase();

    // 1. Try Mongo
    try {
      const dbCached = await WalletCache.findOne({ wallet: cleanWallet });
      if (dbCached) {
        const diffMs = Date.now() - new Date(dbCached.lastAnalyzed).getTime();
        const thirtyMins = 30 * 60 * 1000;
        if (diffMs < thirtyMins) {
          return dbCached.analysis;
        }
      }
    } catch (dbError) {
      // Graceful fallback to node-cache if MongoDB is slow or disconnected
      console.log("ℹ️ MongoDB Cache check bypassed or failed, checking in-memory cache.");
    }

    // 2. Try In-Memory Cache
    return localCache.get(cleanWallet) || null;
  }

  /**
   * Helper to save analysis result to cache
   */
  private static async setCachedAnalysis(wallet: string, analysis: any): Promise<void> {
    const cleanWallet = wallet.toLowerCase();

    // 1. Save to In-Memory Cache
    localCache.set(cleanWallet, analysis);

    // 2. Try saving to MongoDB
    try {
      await WalletCache.findOneAndUpdate(
        { wallet: cleanWallet },
        {
          wallet: cleanWallet,
          lastAnalyzed: new Date(),
          analysis: analysis,
        },
        { upsert: true, returnDocument: "after" }
      );
    } catch (dbError) {
      console.log("ℹ️ MongoDB Cache write bypassed or failed (Normal if MongoDB is not connected yet). Saved to in-memory fallback.");
    }
  }
}