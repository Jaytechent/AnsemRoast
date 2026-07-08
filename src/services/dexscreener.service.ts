import axios from "axios";

export interface TokenMarketData {
  priceUsd: number;
  liquidityUsd: number;
  volume24h: number;
  fdv: number;
  marketCap: number;
  priceChange24h: number;
}

export class DexScreenerService {
  private static BASE_URL = "https://api.dexscreener.com/latest/dex/tokens";

  /**
   * Fetches token price and market data from DexScreener
   */
  public static async getTokenData(tokenAddress: string): Promise<TokenMarketData | null> {
    try {
      const response = await axios.get(`${this.BASE_URL}/${tokenAddress}`, {
        timeout: 5000,
      });

      const pairs = response.data?.pairs;
      if (!pairs || pairs.length === 0) {
        return null;
      }

      // Sort by liquidity to get the primary trading pair (usually Raydium or Orca)
      const primaryPair = pairs.sort((a: any, b: any) => {
        const liqA = a.liquidity?.usd || 0;
        const liqB = b.liquidity?.usd || 0;
        return liqB - liqA;
      })[0];

      return {
        priceUsd: parseFloat(primaryPair.priceUsd || "0"),
        liquidityUsd: primaryPair.liquidity?.usd || 0,
        volume24h: primaryPair.volume?.h24 || 0,
        fdv: primaryPair.fdv || 0,
        marketCap: primaryPair.marketCap || primaryPair.fdv || 0,
        priceChange24h: primaryPair.priceChange?.h24 || 0,
      };
    } catch (error: any) {
      console.error(`⚠️ DexScreener fetch failed for token ${tokenAddress}:`, error.message);
      return null;
    }
  }
}
