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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 flex flex-col space-y-8">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link href="/chapters" className="text-xs font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors">
          <span>⬅️</span> Kembali ke Daftar Antologi
        </Link>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-400 border border-slate-700">
            {chapter.era}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{chapter.location}</span>
        </div>
      </div>

      {/* Chapter Title Header */}
      <div className="bg-occult-800/80 border border-slate-800 rounded-2xl p-6 sm:p-8 dossier-bg shadow-xl">
        <div className="inline-block text-[11px] font-mono px-3 py-1 rounded bg-red-950/60 text-red-400 border border-red-800/40 uppercase tracking-widest mb-3">
          Dossier Penyelidikan Aktif
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          {chapter.title}
        </h1>
        <div className="text-sm text-red-400 font-serif italic mt-1">
          "{chapter.latinTitle}" — {chapter.subtitle}
        </div>
        <p className="text-slate-400 text-sm mt-3 max-w-4xl leading-relaxed">
          {chapter.atmosphericDescription}
        </p>
      </div>

      {/* Main Grid: Evidence Board & Seal Wheel + Relic Chest */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Evidence Board (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-8">
          <EvidenceBoard evidenceList={chapter.evidence} />
          <OracleChat chapterTitle={chapter.title} loreFragments={chapter.loreFragments} />
        </div>

        {/* Right Column: 3 Seals Wheel & Relic Chest (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
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
      </div>
    </div>
  );
}
