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
      alert("Gagal mengklaim URL voucher. Coba beberapa saat lagi.");
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
      className={`rounded-2xl p-6 border transition-all duration-500 shadow-2xl relative overflow-hidden ${
        isUnlocked
          ? "bg-gradient-to-b from-amber-950/60 to-occult-900 border-amber-500 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          : "bg-occult-800/60 border-slate-800 opacity-80"
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            {isUnlocked ? "✨ SEGEL TELAH TERBUKA PENUH" : "🔒 TERKUNCI OLEH 3 SEGEL"}
          </span>
          <h2 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>📦</span> {chestName}
          </h2>
        </div>
        <span className="text-2xl animate-bounce">{isUnlocked ? "🔓" : "🔐"}</span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-6 font-serif">
        {chestDescription}
      </p>

      {isUnlocked ? (
        <div>
          {!claimUrl ? (
            <button
              onClick={handleClaim}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 text-slate-900 font-serif font-black text-sm tracking-widest uppercase border border-amber-300 shadow-[0_0_25px_rgba(212,175,55,0.8)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 animate-pulse"
            >
              <span>🎁</span> {loading ? "Membuka Kunci Peti..." : "BUKA PETI & KLAIM URL VOUCHER"}
            </button>
          ) : (
            <div className="p-5 rounded-xl bg-occult-900 border border-amber-500 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                <span>🎉 HADIAH TERUNGKAP!</span>
                <span className="text-slate-400">Kode: {promoCode}</span>
              </div>

              <p className="text-xs text-slate-300">
                Selamat The Seeker! Tautan resmi klaim voucher Anda telah digenerate:
              </p>

              <div className="p-3 rounded-lg bg-occult-800 border border-slate-700 font-mono text-xs text-amber-300 break-all select-all">
                {claimUrl}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 py-2 rounded-lg bg-amber-950 border border-amber-600 text-amber-300 font-mono text-xs font-bold hover:bg-amber-900 transition-colors"
                >
                  {copied ? "✅ Tautan Disalin!" : "📋 Salin Tautan Voucher"}
                </button>
                <a
                  href={claimUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-red-950 border border-red-700 text-red-300 font-mono text-xs font-bold hover:bg-red-900 transition-colors flex items-center gap-1"
                >
                  Buka ➔
                </a>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-500 text-xs font-mono text-center flex items-center justify-center gap-2">
          <span>⚠️</span> Buka seluruh 3 segel gaib di atas untuk melepaskan kunci peti relikui ini.
        </div>
      )}
    </div>
  );
}
