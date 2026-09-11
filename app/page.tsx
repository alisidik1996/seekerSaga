"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CHAPTERS } from "@/data/chapters";
import MobileFrame from "./components/MobileFrame";
import CountdownTimer from "./components/CountdownTimer";

export default function HomePage() {
  const [configs, setConfigs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/chapters/status");
      const data = await res.json();
      if (data.configs) {
        setConfigs(data.configs);
      }
    } catch (e) {
      console.error("Failed to fetch chapter status", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const isChapterLocked = (ch: typeof CHAPTERS[0]) => {
    const cfg = configs[ch.slug];
    if (!cfg) return false;
    if (cfg.is_locked) {
      if (cfg.unlock_at) {
        return new Date(cfg.unlock_at).getTime() > new Date().getTime();
      }
      return true;
    }
    return false;
  };

  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-4">
        {/* Occult Center Sigil Icon */}
        <div className="relative group my-3">
          <div className="w-20 h-20 rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-occult-800/80 shadow-[0_0_25px_rgba(212,175,55,0.25)]">
            <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(230,57,70,0.8)]">
              👁️
            </span>
          </div>
          <div className="absolute -inset-1.5 border border-dashed border-red-500/30 rounded-full animate-spin [animation-duration:20s] pointer-events-none"></div>
        </div>

        {/* Minimal Enigmatic Title */}
        <div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-100">
            SEEKER<span className="text-red-500 glow-crimson">SAGA</span>
          </h1>
        </div>

        {/* Mysterious Direct Chapter Portals */}
        <div className="w-full text-left pt-2 space-y-3">
          {CHAPTERS.map((ch) => {
            const cfg = configs[ch.slug];
            const locked = isChapterLocked(ch);
            const hasCountdown = cfg?.unlock_at && new Date(cfg.unlock_at).getTime() > new Date().getTime();

            const title = cfg?.custom_title || ch.title;
            const latinTitle = cfg?.custom_latin_title || ch.latinTitle;
            const description = cfg?.custom_description || ch.atmosphericDescription;

            return (
              <div
                key={ch.id}
                className={`rounded-2xl border p-4 transition-all shadow-lg relative overflow-hidden ${
                  locked
                    ? "border-red-950/80 bg-occult-950/80"
                    : "border-slate-800 bg-occult-800/60 hover:border-amber-500/50 hover:bg-occult-700/50"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className={`px-2 py-0.5 rounded border ${
                    locked
                      ? "bg-red-950/60 text-red-400 border-red-800/50"
                      : "bg-slate-900 text-amber-400 border-slate-800"
                  }`}>
                    Chapter 0{ch.id}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="font-serif text-base font-bold text-slate-100">
                    {title.includes(": ") ? title.split(": ")[1] : title}
                  </h2>
                  {locked && (
                    <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-mono bg-red-950 text-red-400 border border-red-800/60 flex items-center gap-1 uppercase font-bold">
                      <span>🔒</span> Terkunci
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-red-400/80 font-serif italic mb-2">
                  "{latinTitle}"
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {description}
                </p>

                {locked && hasCountdown ? (
                  <div className="bg-occult-900/90 p-2.5 rounded-xl border border-red-900/40 mb-3 space-y-1">
                    <CountdownTimer
                      targetDate={cfg.unlock_at}
                      onExpire={() => fetchStatus()}
                    />
                  </div>
                ) : null}

                <Link
                  href={`/chapter/${ch.slug}`}
                  className={`w-full py-2.5 rounded-xl font-serif font-bold text-xs tracking-wider uppercase border text-center block transition-all shadow-md ${
                    locked
                      ? "bg-red-950/40 text-red-300/80 border-red-900/40 hover:bg-red-950/60"
                      : "bg-gradient-to-r from-red-950 to-amber-950 text-slate-100 border-amber-500/40 hover:from-red-900 hover:to-amber-900"
                  }`}
                >
                  {locked ? "Lihat Status Kunci ➔" : "Masuki Dimensi ➔"}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </MobileFrame>
  );
}
