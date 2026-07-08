import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWalletCache extends Document {
  wallet: string;
  lastAnalyzed: Date;
  analysis: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const WalletCacheSchema: Schema = new Schema(
  {
    wallet: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    lastAnalyzed: {
      type: Date,
      required: true,
      default: Date.now,
    },
    analysis: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "wallet_cache",
  }
);

// Prevent mongoose from compiling model multiple times if server reloads
export const WalletCache: Model<IWalletCache> = (mongoose.models.WalletCache as Model<IWalletCache>) || mongoose.model<IWalletCache>("WalletCache", WalletCacheSchema);
