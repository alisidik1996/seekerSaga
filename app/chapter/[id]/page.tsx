"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CHAPTERS } from "@/data/chapters";
import SealWheel from "./components/SealWheel";
import EvidenceBoard from "./components/EvidenceBoard";
import OracleChat from "./components/OracleChat";
import RelicChest from "./components/RelicChest";

export default function ChapterDetailPage() {
  const params = useParams();
  const slug = params?.id as string;

  const chapter = CHAPTERS.find((c) => c.slug === slug || c.id === slug) || CHAPTERS[0];

  const [unlockedSeals, setUnlockedSeals] = useState<number[]>([]);
  const [activeScreenTab, setActiveScreenTab] = useState<"seals" | "evidence" | "oracle">("seals");

  const handleUnlockSeal = async (sealNumber: number, cipher: string) => {
    try {
      const res = await fetch("/api/seals/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterSlug: chapter.slug,
          sealNumber,
          cipher,
        }),
      });
      const data = await res.json();
      if (data.valid) {
        if (!unlockedSeals.includes(sealNumber)) {
          setUnlockedSeals((prev) => [...prev, sealNumber]);
        }
        return { success: true, message: data.message || "Segel berhasil dibuka!" };
      } else {
        return { success: false, message: data.message || "Sandi tidak cocok dengan prasasti segel." };
      }
    } catch {
      return { success: false, message: "Gangguan komunikasi ke server okultis." };
    }
  };

  const isAllUnlocked = unlockedSeals.length >= 3;

  return (
    <div className="flex-1 flex flex-col space-y-3.5 py-1">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <Link href="/chapters" className="text-[11px] font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors">
          <span>⬅️</span> Chapters
        </Link>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
            {chapter.era}
          </span>
          <span className="text-slate-400 truncate max-w-[120px]">{chapter.location}</span>
        </div>
      </div>

      {/* Chapter Title Mini Dossier */}
      <div className="bg-occult-800/80 border border-slate-800 rounded-xl p-3.5 dossier-bg shadow-md">
        <div className="inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/40 uppercase tracking-widest mb-1">
          Dossier Aktif
        </div>
        <h1 className="font-serif text-base font-bold text-slate-100">
          {chapter.title}
        </h1>
        <div className="text-[11px] text-red-400 font-serif italic mt-0.5">
          "{chapter.latinTitle}"
        </div>
        <p className="text-slate-400 text-xs mt-1.5 leading-relaxed line-clamp-2">
          {chapter.atmosphericDescription}
        </p>
      </div>

      {/* Mobile Screen Tab Switcher */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
        <button
          onClick={() => setActiveScreenTab("seals")}
          className={`py-2 rounded-lg text-center transition-all ${
            activeScreenTab === "seals"
              ? "bg-amber-950/70 border border-amber-500/60 text-amber-300 font-bold shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🔒 Segel ({unlockedSeals.length}/3)
        </button>
        <button
          onClick={() => setActiveScreenTab("evidence")}
          className={`py-2 rounded-lg text-center transition-all ${
            activeScreenTab === "evidence"
              ? "bg-amber-950/70 border border-amber-500/60 text-amber-300 font-bold shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          📂 Bukti ({chapter.evidence.length})
        </button>
        <button
          onClick={() => setActiveScreenTab("oracle")}
          className={`py-2 rounded-lg text-center transition-all ${
            activeScreenTab === "oracle"
              ? "bg-amber-950/70 border border-amber-500/60 text-amber-300 font-bold shadow"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          🔮 Oracle
        </button>
      </div>

      {/* Mobile Tab Content View */}
      <div className="flex-1 flex flex-col space-y-3">
        {activeScreenTab === "seals" && (
          <div className="space-y-3.5">
            <SealWheel
              seals={chapter.seals}
              unlockedSeals={unlockedSeals}
              onUnlockSeal={handleUnlockSeal}
              isAllUnlocked={isAllUnlocked}
            />

            <RelicChest
              chestName={chapter.relicChestName}
              chestDescription={chapter.relicChestDescription}
              isUnlocked={isAllUnlocked}
              chapterSlug={chapter.slug}
              promoCode={chapter.voucherPromoCode}
            />
          </div>
        )}

        {activeScreenTab === "evidence" && (
          <EvidenceBoard evidenceList={chapter.evidence} />
        )}

        {activeScreenTab === "oracle" && (
          <OracleChat chapterTitle={chapter.title} loreFragments={chapter.loreFragments} />
        )}
      </div>
    </div>
  );
}
