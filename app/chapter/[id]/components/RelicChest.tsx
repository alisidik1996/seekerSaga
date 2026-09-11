"use client";

import React, { useState } from "react";

interface RelicChestProps {
  chestName: string;
  chestDescription: string;
  isUnlocked: boolean;
  chapterSlug: string;
  promoCode: string;
}

export default function RelicChest({
  chestName,
  chestDescription,
  isUnlocked,
  chapterSlug,
  promoCode,
}: RelicChestProps) {
  const [claimUrl, setClaimUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleClaim = async () => {
    if (!isUnlocked) return;
    setLoading(true);
    try {
      const res = await fetch("/api/voucher/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterSlug, promoCode }),
      });
      const data = await res.json();
      if (data.url) {
        setClaimUrl(data.url);
      }
    } catch {
      alert("Gagal membuka Cosmic Cube. Coba beberapa saat lagi.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (claimUrl) {
      navigator.clipboard.writeText(claimUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`rounded-2xl p-4 border transition-all duration-500 shadow-xl relative overflow-hidden w-full ${
        isUnlocked
          ? "bg-gradient-to-b from-amber-950/60 to-occult-900 border-amber-500 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          : "bg-occult-800/60 border-slate-800 opacity-80"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
            {isUnlocked ? "✨ SEGEL TERBUKA PENUH" : "🔒 TERKUNCI 3 SEGEL"}
          </span>
          <h2 className="font-serif text-base font-bold text-slate-100 truncate">
            {chestName || "Cosmic Cube"}
          </h2>
        </div>
        <span className="text-xl shrink-0">{isUnlocked ? "🔓" : "🔐"}</span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-4 font-serif break-words">
        {chestDescription}
      </p>

      {isUnlocked ? (
        <div>
          {!claimUrl ? (
            <button
              onClick={handleClaim}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 text-slate-900 font-serif font-black text-xs tracking-wider uppercase border border-amber-300 shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
            >
              <span>✨</span> {loading ? "Membuka Kunci..." : "BUKA COSMIC CUBE"}
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-occult-900 border border-amber-500 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                <span>🎉 COSMIC CUBE TERBUKA!</span>
                <span className="text-slate-400 text-[10px]">Kode: {promoCode}</span>
              </div>

              <p className="text-[11px] text-slate-300">
                Hadiah Cosmic Cube Anda telah diaktifkan:
              </p>

              <div className="p-2.5 rounded-lg bg-occult-800 border border-slate-700 font-mono text-[11px] text-amber-300 break-all select-all">
                {claimUrl}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-2 rounded-lg bg-amber-950 border border-amber-600 text-amber-300 font-mono text-xs font-bold hover:bg-amber-900 transition-colors"
                >
                  {copied ? "✅ Disalin!" : "📋 Salin URL"}
                </button>
                <a
                  href={claimUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-red-950 border border-red-700 text-red-300 font-mono text-xs font-bold hover:bg-red-900 transition-colors flex items-center gap-1 shrink-0"
                >
                  Buka ➔
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-500 text-[11px] font-mono text-center flex items-center justify-center gap-1.5">
          <span>⚠️</span> Buka seluruh 3 segel di atas untuk membuka Cosmic Cube ini.
        </div>
      )}
    </div>
  );
}
