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
    <div className="bg-occult-800/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col shadow-xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3.5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-400">Meja Forensik</span>
          <h2 className="font-serif text-base font-bold text-slate-100 flex items-center gap-1.5">
            <span>📂</span> Berkas Bukti
          </h2>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab("dossier")}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              activeTab === "dossier"
                ? "bg-amber-950/50 border-amber-500/60 text-amber-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            Arsip
          </button>
          <button
            onClick={() => setActiveTab("cipher_tools")}
            className={`px-2.5 py-1 rounded-lg border transition-colors ${
              activeTab === "cipher_tools"
                ? "bg-amber-950/50 border-amber-500/60 text-amber-300 font-bold"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            Sandi
          </button>
        </div>
      </div>

      {activeTab === "dossier" ? (
        <div className="flex flex-col space-y-3">
          {/* Horizontal / Compact selector for evidence */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {evidenceList.map((ev, idx) => (
              <button
                key={ev.id}
                onClick={() => setActiveEvidenceId(ev.id)}
                className={`px-2.5 py-1.5 rounded-lg border text-left text-xs font-mono shrink-0 transition-all ${
                  activeEvidenceId === ev.id
                    ? "bg-amber-950/70 border-amber-500 text-amber-200 font-bold"
                    : "bg-occult-900/80 border-slate-800 text-slate-400"
                }`}
              >
                Bukti #{idx + 1}
              </button>
            ))}
          </div>

          {/* Dossier Viewer */}
          <div className="bg-occult-900 rounded-xl p-3.5 border border-slate-800/80 dossier-bg space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 font-mono text-[9px] border border-red-800/40 font-bold">
                {activeEvidence.classifiedLevel}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{activeEvidence.date}</span>
            </div>

            <h3 className="font-serif text-sm font-bold text-amber-300">
              {activeEvidence.title}
            </h3>

            <div className="text-[11px] leading-relaxed text-slate-300 bg-occult-800/80 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap font-mono break-words">
              {activeEvidence.content}
            </div>

            {activeEvidence.audioHint && (
              <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-800/40 text-[10px] font-mono text-red-300 flex items-start gap-1.5 break-words">
                <span className="shrink-0">📻</span>
                <span><strong>Spektrogram:</strong> {activeEvidence.audioHint}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-occult-900 rounded-xl p-3.5 border border-slate-800/80 space-y-3">
          <div>
            <h3 className="font-serif text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <span>🔐</span> Sandi Caesar / Rotasi Aksara
            </h3>
            <p className="text-[10px] text-slate-400 mb-2">
              Pecahkan teks terenkripsi dengan rotasi geser alfabet.
            </p>

            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-0.5">Teks Masukan:</label>
                <textarea
                  rows={2}
                  value={toolText}
                  onChange={(e) => setToolText(e.target.value)}
                  placeholder="Tempel teks sandi..."
                  className="w-full p-2 rounded-lg bg-occult-800 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-0.5 text-[10px] font-mono text-slate-400">
                  <span>Hasil Dekripsi:</span>
                  <span className="text-amber-400 font-bold">Shift: {caesarShift}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-occult-800 border border-slate-700 text-xs font-mono text-emerald-400 min-h-[50px] whitespace-pre-wrap break-words">
                  {toolText ? applyCaesar(toolText, caesarShift) : "(Hasil dekripsi...)"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="text-[10px] font-mono text-slate-400 shrink-0">Shift:</span>
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
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
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
