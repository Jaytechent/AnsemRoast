import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import { Flame, Twitter, Sparkles, Trophy, Percent, HelpCircle, Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import html2canvas from "html2canvas-pro";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // Cut Roast down to a clean short snippet for the square layout
  const roastSnippet = roast.length > 210 ? roast.slice(0, 207) + "..." : roast;

  const shareText = `🔥 Just got roasted by Ansem (@blknoiz06) on Ansem Wallet Roast!\n\n🧠 Wallet IQ: ${walletIQ}\n💎 Diamond Hands: ${diamondHands}%\n💰 Net Profit: ${profit} SOL\n🏆 Badge: ${badge}\n\nRoast: "${roastSnippet.slice(0, 100)}..."\n\nCook your own wallet at:`;

  // Build X (Twitter) intent URL (text + link only - see note in handleShareToX)
  const buildTwitterUrl = () => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`;
  };

  /**
   * Renders the visible #share-image-block card into an actual PNG blob.
   * Uses html2canvas-pro (not plain html2canvas) because Tailwind v4 generates
   * colors using the modern CSS oklch() function, which plain html2canvas 1.4.x
   * cannot parse - it throws immediately on the first Tailwind color it hits,
   * which is why capture was silently failing before.
   */
  const captureCardImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#000000",
      scale: 2, // sharper export
      useCORS: true,
      logging: false,
    });
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), "image/png"));
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /**
   * X's web intent (https://twitter.com/intent/tweet) only ever accepts `text` + a `url`
   * to unfurl - there is NO web-intent parameter that attaches a pre-made image to the
   * tweet. Actually attaching an image programmatically requires the X API v2 media
   * upload endpoint, which needs OAuth user tokens and a backend call - not something a
   * plain "Share" button in the browser can do.
   *
   * The real workaround: render the card to a PNG client-side, then either
   *  1) hand it to the OS share sheet via the Web Share API (navigator.share) - on most
   *     mobile browsers this lets the person pick the X app directly with the image
   *     already attached, or
   *  2) download the PNG and open the tweet composer pre-filled with text, so they can
   *     drag-and-drop / paste the downloaded image into the compose box.
   *
   * The tab to X is opened *synchronously*, right when the click happens, before any
   * `await`. Browsers only allow window.open() to bypass the popup blocker while it's
   * still inside the original click's "user activation" window - once you `await`
   * something first, that activation has expired and the browser silently swallows the
   * window.open() call (no error, nothing happens). That's why the redirect used to stop
   * firing. Opening the tab first and filling in its URL afterwards keeps it reliable,
   * and it means the redirect always happens even if the screenshot itself fails.
   */
  const handleShareToX = async () => {
    const composeWindow = window.open("about:blank", "_blank", "noopener,noreferrer");

    setIsCapturing(true);
    let usedNativeShare = false;

    try {
      const blob = await captureCardImage();

      if (blob) {
        const file = new File([blob], `ansem-roast-${shortWallet}.png`, { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          composeWindow?.close();
          usedNativeShare = true;
          await navigator.share({ files: [file], text: shareText });
        } else {
          triggerDownload(blob, `ansem-roast-${shortWallet}.png`);
          toast.success("Screenshot downloaded! Drop it into the X post that just opened.", {
            duration: 6000,
            style: {
              background: "#0a0a0c",
              color: "#f3f4f6",
              border: "1px solid rgba(20, 241, 149, 0.2)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
            },
          });
        }
      } else {
        toast.error("Couldn't generate a screenshot of the card - opening X without it.");
      }
    } catch (err: any) {
      // User cancelling the native share sheet also lands here - don't show an error toast for that.
      if (err?.name !== "AbortError") {
        console.error("Share failed:", err);
        toast.error("Couldn't generate a screenshot of the card - opening X without it.");
      }
    } finally {
      setIsCapturing(false);
      // Always complete the redirect, regardless of whether the screenshot worked -
      // matches the old guaranteed-redirect behavior of a plain <a href> link.
      if (!usedNativeShare) {
        const twitterUrl = buildTwitterUrl();
        if (composeWindow && !composeWindow.closed) {
          composeWindow.location.href = twitterUrl;
        } else {
          window.open(twitterUrl, "_blank", "noopener,noreferrer");
        }
      }
    }
  };

  const handleDownloadImage = async () => {
    setIsCapturing(true);
    try {
      const blob = await captureCardImage();
      if (!blob) throw new Error("Could not render card image");
      triggerDownload(blob, `ansem-roast-${shortWallet}.png`);
      toast.success("Card image downloaded!", {
        style: {
          background: "#0a0a0c",
          color: "#f3f4f6",
          border: "1px solid rgba(20, 241, 149, 0.2)",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
        },
      });
    } catch (err: any) {
      console.error("Download failed:", err);
      toast.error(`Couldn't generate the share image${err?.message ? `: ${err.message}` : ""}.`);
    } finally {
      setIsCapturing(false);
    }
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
        ref={cardRef}
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
        <button
          type="button"
          id="post-to-x-btn"
          onClick={handleShareToX}
          disabled={isCapturing}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-60 text-white py-3 px-5 rounded-2xl font-display font-bold text-xs transition-all hover:scale-[1.01] cursor-pointer"
        >
          {isCapturing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Twitter className="h-4 w-4 fill-white" />
          )}
          {isCapturing ? "GENERATING..." : "SHARE IMAGE TO X"}
        </button>
        <button
          type="button"
          id="download-share-image-btn"
          onClick={handleDownloadImage}
          disabled={isCapturing}
          className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-60 text-white border border-white/10 py-3 px-5 rounded-2xl font-display font-bold text-xs transition-all cursor-pointer"
        >
          <Download className="h-4 w-4" />
          DOWNLOAD IMAGE
        </button>
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