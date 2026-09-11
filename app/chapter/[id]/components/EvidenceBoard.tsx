"use client";

import React, { useState } from "react";
import { EvidenceItem } from "@/data/chapters";

interface EvidenceBoardProps {
  evidenceList: EvidenceItem[];
}

export default function EvidenceBoard({ evidenceList }: EvidenceBoardProps) {
  const [activeEvidenceId, setActiveEvidenceId] = useState<string>(evidenceList[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"dossier" | "cipher_tools">("dossier");

  const [toolText, setToolText] = useState<string>("");
  const [caesarShift, setCaesarShift] = useState<number>(3);

  const activeEvidence = evidenceList.find((e) => e.id === activeEvidenceId) || evidenceList[0];

  const applyCaesar = (str: string, shift: number) => {
    return str
      .split("")
      .map((c) => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
        }
        if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
        }
        return c;
      })
      .join("");
  };

  return (
    <div className="bg-occult-800/90 border border-slate-800 rounded-2xl p-6 flex flex-col h-full shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-red-400">Meja Forensik & Arsip</span>
          <h2 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>📂</span> Berkas Bukti Penyelidikan
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setActiveTab("dossier")}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              activeTab === "dossier"
                ? "bg-amber-950/50 border-amber-500/60 text-amber-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Arsip Dokumen
          </button>
          <button
            onClick={() => setActiveTab("cipher_tools")}
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              activeTab === "cipher_tools"
                ? "bg-amber-950/50 border-amber-500/60 text-amber-300"
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            Alat Kriptografi
          </button>
        </div>
      </div>

      {activeTab === "dossier" ? (
        <div className="flex flex-col space-y-4 flex-1">
          {/* Horizontal Scroll Evidence Pills for Mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
            {evidenceList.map((ev, idx) => (
              <button
                key={ev.id}
                onClick={() => setActiveEvidenceId(ev.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl border text-left transition-all ${
                  activeEvidenceId === ev.id
                    ? "bg-occult-700 border-amber-500/80 text-slate-100 shadow"
                    : "bg-occult-900 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="text-[9px] font-mono text-slate-500 flex items-center gap-1.5">
                  <span>BUKTI 0{idx + 1}</span>
                  <span className="text-red-400 font-bold">{ev.classifiedLevel}</span>
                </div>
                <div className="text-xs font-serif font-bold truncate max-w-[120px] text-slate-200 mt-0.5">
                  {ev.title}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-occult-900 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between dossier-bg space-y-3">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 font-mono text-[9px] border border-red-800/40 font-bold">
                    {activeEvidence.classifiedLevel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{activeEvidence.date}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">ID: {activeEvidence.id}</span>
              </div>

              <h3 className="font-serif text-sm font-bold text-amber-300 mb-2">
                {activeEvidence.title}
              </h3>

              <div className="text-xs leading-relaxed text-slate-300 bg-occult-800/80 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap font-mono text-[11px] max-h-[220px] overflow-y-auto">
                {activeEvidence.content}
              </div>

              {activeEvidence.audioHint && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-red-950/30 border border-red-800/40 text-[11px] font-mono text-red-300 flex items-center gap-1.5">
                  <span>📻</span>
                  <span><strong>Spektrogram:</strong> {activeEvidence.audioHint}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-500">
              <span>Arsip Bukti Forensik</span>
              <span>SeekerSaga Bureau</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-occult-900 rounded-xl p-6 border border-slate-800/80 space-y-6 flex-1">
          <div>
            <h3 className="font-serif text-base font-bold text-amber-400 mb-2 flex items-center gap-2">
              <span>🔐</span> Sandi Caesar / Rotasi Aksara
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Gunakan perkakas ini untuk memecahkan kode teks terenkripsi yang ditemukan di dalam dokumen.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Teks Input / Sandi:</label>
                <textarea
                  rows={3}
                  value={toolText}
                  onChange={(e) => setToolText(e.target.value)}
                  placeholder="Ketik atau tempel teks sandi di sini..."
                  className="w-full p-3 rounded-lg bg-occult-800 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono text-slate-400">Hasil Dekripsi:</label>
                  <span className="text-xs font-mono text-amber-400">Shift: {caesarShift}</span>
                </div>
                <div className="p-3 rounded-lg bg-occult-800 border border-slate-700 text-xs font-mono text-emerald-400 min-h-[76px] whitespace-pre-wrap">
                  {toolText ? applyCaesar(toolText, caesarShift) : "(Hasil dekripsi akan muncul di sini...)"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">Rotasi Geser (Shift):</span>
              <input
                type="range"
                min="-25"
                max="25"
                value={caesarShift}
                onChange={(e) => setCaesarShift(Number(e.target.value))}
                className="flex-1 accent-amber-500 cursor-pointer"
              />
              <button
                onClick={() => setCaesarShift(0)}
                className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
