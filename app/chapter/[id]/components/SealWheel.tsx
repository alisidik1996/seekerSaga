"use client";

import React, { useState } from "react";
import { Seal } from "@/data/chapters";

interface SealWheelProps {
  seals: Seal[];
  unlockedSeals: number[];
  onUnlockSeal: (sealNumber: number, cipher: string) => Promise<{ success: boolean; message: string }>;
  isAllUnlocked: boolean;
}

export default function SealWheel({ seals, unlockedSeals, onUnlockSeal, isAllUnlocked }: SealWheelProps) {
  const [activeSealNumber, setActiveSealNumber] = useState<number>(1);
  const [inputCipher, setInputCipher] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const activeSeal = seals.find((s) => s.number === activeSealNumber) || seals[0];
  const isCurrentUnlocked = unlockedSeals.includes(activeSealNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCipher.trim() || isCurrentUnlocked) return;

    setLoading(true);
    setStatusMessage(null);

    const res = await onUnlockSeal(activeSealNumber, inputCipher.trim());
    setLoading(false);

    if (res.success) {
      setStatusMessage({ text: res.message, isError: false });
      setInputCipher("");
      const nextUnopened = seals.find((s) => s.number !== activeSealNumber && !unlockedSeals.includes(s.number));
      if (nextUnopened) {
        setTimeout(() => setActiveSealNumber(nextUnopened.number), 800);
      }
    } else {
      setStatusMessage({ text: res.message, isError: true });
    }
  };

  return (
    <div className="bg-occult-800/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500">Mekanisme Okultis</span>
          <h2 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>🛡️</span> Tiga Segel Gaib Peti
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-slate-400">Status Segel:</span>
          <div className="font-mono text-sm font-bold text-amber-400">
            {unlockedSeals.length} / 3 Terbuka
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {seals.map((seal) => {
          const isUnlocked = unlockedSeals.includes(seal.number);
          const isActive = activeSealNumber === seal.number;

          return (
            <button
              key={seal.number}
              onClick={() => {
                setActiveSealNumber(seal.number);
                setStatusMessage(null);
                setInputCipher("");
              }}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? "border-amber-500 bg-amber-950/30 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                  : isUnlocked
                  ? "border-emerald-800/60 bg-emerald-950/20 text-emerald-300"
                  : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span>SEGEL 0{seal.number}</span>
                <span>{isUnlocked ? "🔓" : "🔒"}</span>
              </div>
              <div className="font-serif text-xs font-bold truncate">
                {seal.name.split(" (")[0]}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-occult-900/90 rounded-xl p-5 border border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-serif font-bold text-slate-200 flex items-center gap-2">
            <span>{isCurrentUnlocked ? "✅" : "🔑"}</span> {activeSeal.name}
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {activeSeal.sourceType.replace("_", " ").toUpperCase()}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-4 italic bg-occult-800/60 p-3 rounded-lg border border-slate-800">
          "{activeSeal.hint}"
        </p>

        <div className="text-[11px] text-amber-300/80 font-mono mb-4 flex items-center gap-1.5">
          <span>💡 Petunjuk Sumber:</span>
          <span>{activeSeal.sourceHint}</span>
        </div>

        {isCurrentUnlocked ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/40 text-emerald-300 text-xs font-mono flex items-center gap-3">
            <span className="text-xl">🔓</span>
            <div>
              <div className="font-bold uppercase tracking-wider">Segel Telah Berhasil Dibuka!</div>
              <div className="text-[11px] text-emerald-400/80 mt-0.5">Sandi terverifikasi: <code className="bg-emerald-900/60 px-1.5 py-0.5 rounded">{activeSeal.cipher}</code></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">
                Masukkan Kata Sandi Segel (Cipher Key):
              </label>
              <input
                type="text"
                placeholder="Contoh: PALUNG_ABADI"
                value={inputCipher}
                onChange={(e) => setInputCipher(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-occult-800 border border-slate-700 text-slate-100 font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-amber-500 transition-colors"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !inputCipher.trim()}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-red-900 to-amber-900 text-slate-100 font-serif font-bold text-xs uppercase tracking-wider border border-amber-500/40 hover:from-red-800 hover:to-amber-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Memeriksa Sandi..." : "🔓 Lakukan Pembacaan Segel"}
            </button>
          </form>
        )}

        {statusMessage && (
          <div
            className={`mt-3 p-3 rounded-lg text-xs font-mono ${
              statusMessage.isError
                ? "bg-red-950/50 border border-red-800 text-red-300"
                : "bg-emerald-950/50 border border-emerald-800 text-emerald-300"
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>
    </div>
  );
}
