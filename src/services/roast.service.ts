import axios from "axios";
import { GoogleGenAI } from "@google/genai";

export class RoastService {
  /**
   * Generates a high-quality roast in Ansem's voice using OpenRouter (with a free model),
   * falling back to Gemini or a humorous local template generator.
   */
  public static async generateRoast(stats: {
    wallet: string;
    walletIQ: number;
    diamondHands: number;
    conviction: number;
    degenerateScore: number;
    holdsAnsem: boolean;
    daysHolding: number;
    badge: string;
    balance: number;
  }): Promise<string> {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const shortAddress = stats.wallet.slice(0, 6) + "..." + stats.wallet.slice(-4);

    const statsSummary = `
- Wallet: ${shortAddress}
- Wallet IQ: ${stats.walletIQ} (out of 100)
- Diamond Hands Score: ${stats.diamondHands}/100
- Conviction Rating: ${stats.conviction}/100
- Degenerate Score: ${stats.degenerateScore}/100
- Holds ANSEM: ${stats.holdsAnsem ? "Yes" : "No"} (${stats.balance} ANSEM)
- Days Holding ANSEM: ${stats.daysHolding} days
- Trader Badge: "${stats.badge}"
`;

    // 1. Try OpenRouter if key is available
    if (openRouterKey && openRouterKey !== "YOUR_KEY" && openRouterKey !== "") {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "meta-llama/llama-3-8b-instruct:free",
            messages: [
              {
                role: "system",
                content: "You are Ansem (@blknoiz06), the famous high-energy Solana crypto Twitter spaces host and influencer. You speak in lower case, use heavy crypto twitter slang, call users 'bro' or 'chad', and roast portfolios with brutal but safe, humorous enthusiasm. Never use slurs or offensive insults. Keep it incredibly short, punchy, and maximum 80 words.",
              },
              {
                role: "user",
                content: `Roast my Solana wallet with these stats: ${statsSummary}. Speak directly to me like you're on a 4 AM X Spaces call.`,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${openRouterKey}`,
              "Content-Type": "application/json",
            },
            timeout: 8000,
          }
        );

        const roastText = response.data?.choices?.[0]?.message?.content;
        if (roastText) {
          return roastText.trim();
        }
      } catch (orError: any) {
        console.error("⚠️ OpenRouter API failed, falling back to Gemini:", orError.message);
      }
    }

    // 2. Fallback to Gemini API
    const geminiKey = process.env.GEMINI_API_KEY;
    const isPlaceholder = !geminiKey || geminiKey === "MY_GEMINI_API_KEY" || geminiKey.trim() === "";
    if (!isPlaceholder) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const prompt = `You are Ansem (@blknoiz06), the legendary high-energy Solana crypto Twitter influencer. 
Roast this Solana wallet based on these stats: ${statsSummary}. 

Rules:
1. Write like a real tweet or 4 AM spaces rant.
2. Use lower case and crypto slang like "cook", "jeeting", "midcurve", "spaces", "fumbled", "absolute dev rug", "on god", "pump.fun", "exit liquidity".
3. Address the user directly as "bro" or "chad".
4. Never be truly offensive or mean.
5. Keep it extremely punchy and strictly under 80 words maximum.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });

        if (response.text) {
          return response.text.trim();
        }
      } catch (geminiError: any) {
        if (geminiError.message?.includes("API key not valid") || geminiError.status === "INVALID_ARGUMENT") {
          console.log("ℹ️ Gemini API key is currently invalid or expired. Using high-quality local roast templates instead.");
        } else {
          console.error("⚠️ Gemini API fallback failed:", geminiError.message);
        }
      }
    }

    // 3. Fallback to high-quality deterministic local template if no keys are provided
    return this.generateLocalRoast(stats);
  }

  /**
   * Humorous high-quality deterministic roast generator for immediate offline-friendly preview
   */
  private static generateLocalRoast(stats: any): string {
    const short = stats.wallet.slice(0, 6) + "..." + stats.wallet.slice(-4);
    
    if (stats.badge === "Diamond Hands") {
      return `bro ${short} is literally holding a masterclass in conviction. ${stats.daysHolding} days holding is wild. wallet iq is ${stats.walletIQ} because you don't care about the short term noise. absolute gigachad behavior. send it higher, on god.`;
    }
    if (stats.badge === "Pump.fun Addict") {
      return `bro ${short} please close pump.fun and go touch some grass fr. degenerate score is ${stats.degenerateScore}% which means you buy every single dev rug on the feed. you average 30 seconds of hold time. ansem is disappointed in you, chad.`;
    }
    if (stats.badge === "Paper Hands") {
      return `oh look another professional fumbled bag at ${short}. diamond hands score is ${stats.diamondHands}%... you sold early and fumbled generational wealth. you jeeted out on the first candle. you're midcurve fr.`;
    }
    if (stats.badge === "Exit Liquidity") {
      return `bro ${short} has a wallet iq of ${stats.walletIQ}... that's room temperature. you are literally exit liquidity for the raydium bots. stop buying green candles and calling it a strategy.`;
    }
    if (stats.badge === "Whale") {
      return `${short} is out here moving size like a proper whale, chad. ${stats.balance.toLocaleString()} ansem sitting pretty. respectfully, slow down before you become your own liquidity event.`;
    }
    if (stats.badge === "Smart Money") {
      return `bro ${short} has a wallet iq of ${stats.walletIQ}, actual smart money behavior. conviction rating ${stats.conviction}%. you're the guy everyone copy trades and never tells you thanks.`;
    }
    if (stats.badge === "Rug Collector") {
      return `${short} degenerate score is ${stats.degenerateScore}% and wallet iq is ${stats.walletIQ}... bro your bags are basically a pump.fun museum of failed migrations. curator behavior fr.`;
    }
    if (stats.badge === "Top Buyer") {
      return `bro ${short} just aped in ${stats.daysHolding} days ago and is already calling it conviction. fast hands, chad. ask ansem how many of these top buys actually top-tick the chart.`;
    }
    
    return `wallet ${short} is midcurve. not holding enough ansem, degenerate score is ${stats.degenerateScore}%. you're trading like you have 4 spaces tabs open at 4 AM while eating dry ramen. pull it together bro.`;
  }
}