"use client";

import React, { useState } from "react";
import { EvidenceItem } from "@/data/chapters";

interface EvidenceBoardProps {
  evidenceList: EvidenceItem[];
}

export default function EvidenceBoard({ evidenceList }: EvidenceBoardProps) {
  const [activeEvidenceId, setActiveEvidenceId] = useState<string>(evidenceList[0]?.id || "");

  React.useEffect(() => {
    if (evidenceList.length > 0 && !evidenceList.some((e) => e.id === activeEvidenceId)) {
      setActiveEvidenceId(evidenceList[0].id);
    }
  }, [evidenceList, activeEvidenceId]);

  const activeEvidence = evidenceList.find((e) => e.id === activeEvidenceId) || evidenceList[0];

  return (
    <div className="bg-occult-800/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col shadow-xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3.5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Arsip Prasasti Kuno</span>
          <h2 className="font-serif text-base font-bold text-slate-100 flex items-center gap-1.5">
            Hieroglyphs
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
          {evidenceList.length} Berkas
        </span>
      </div>

      <div className="flex flex-col space-y-3">
        {/* Horizontal selector for Hieroglyphs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {evidenceList.map((ev, idx) => (
            <button
              key={ev.id || idx}
              onClick={() => setActiveEvidenceId(ev.id)}
              className={`px-2.5 py-1.5 rounded-lg border text-left text-xs font-mono shrink-0 transition-all ${
                activeEvidenceId === ev.id
                  ? "bg-amber-950/70 border-amber-500 text-amber-200 font-bold shadow"
                  : "bg-occult-900/80 border-slate-800 text-slate-400"
              }`}
            >
              Hieroglyph #{idx + 1}
            </button>
          ))}
        </div>

        {/* Dossier Content Viewer */}
        {activeEvidence ? (
          <div className="bg-occult-900 rounded-xl p-3.5 border border-slate-800/80 dossier-bg space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-400 font-mono text-[9px] border border-red-800/40 font-bold">
                {activeEvidence.classifiedLevel || "RESTRICTED"}
              </span>
              <span className="text-[10px] font-mono text-slate-400">{activeEvidence.date}</span>
            </div>

            <h3 className="font-serif text-sm font-bold text-amber-300">
              {activeEvidence.title}
            </h3>

            {/* Hieroglyph Image Support */}
            {activeEvidence.mediaUrl && (
              <div className="my-2 rounded-xl overflow-hidden border border-slate-700 bg-black/60 max-h-52 flex items-center justify-center">
                <img
                  src={activeEvidence.mediaUrl}
                  alt={activeEvidence.title}
                  className="w-full h-auto max-h-52 object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

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
        ) : (
          <div className="p-4 text-center text-xs text-slate-500 font-mono">
            Belum ada Hieroglyphs yang ditambahkan.
          </div>
        )}
      </div>
    </div>
  );
}
