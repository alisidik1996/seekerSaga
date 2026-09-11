import Link from "next/link";
import { CHAPTERS } from "@/data/chapters";

export default function ChaptersPage() {
  return (
    <div className="flex-1 flex flex-col space-y-4 py-2">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 text-center">
        <div className="inline-block text-[10px] font-mono px-2.5 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40 uppercase tracking-widest mb-1.5">
          The Nexus of Horrors
        </div>
        <h1 className="font-serif text-xl font-extrabold text-slate-100 tracking-tight">
          Pilih Dimensi Penyelidikan
        </h1>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
          Buka 3 segel di setiap dimensi untuk melepaskan kunci peti relikui voucher.
        </p>
      </div>

      {/* Chapters Mobile List */}
      <div className="space-y-3.5">
        {CHAPTERS.map((ch) => (
          <div
            key={ch.id}
            className="rounded-2xl border border-slate-800 bg-occult-800/70 p-4 relative overflow-hidden shadow-lg"
          >
            <div className="flex items-center justify-between text-[10px] font-mono mb-2">
              <span className="px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800">
                Chapter 0{ch.id}
              </span>
              <span className="text-slate-500">{ch.era}</span>
            </div>

            <h2 className="font-serif text-base font-bold text-slate-100 mb-0.5">
              {ch.title.split(": ")[1] || ch.title}
            </h2>
            <div className="text-[11px] text-red-400 font-serif italic mb-2.5">
              "{ch.latinTitle}"
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {ch.atmosphericDescription}
            </p>

            {/* 3 Seals Preview */}
            <div className="bg-occult-900/80 p-3 rounded-xl border border-slate-800/80 mb-3.5">
              <div className="text-[11px] font-serif font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <span>🔐</span> 3 Segel Gaib:
              </div>
              <div className="space-y-1">
                {ch.seals.map((s) => (
                  <div key={s.number} className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-red-950/60 text-red-400 flex items-center justify-center text-[9px] border border-red-800/40">
                      {s.number}
                    </span>
                    <span className="truncate">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href={`/chapter/${ch.slug}`}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-950 to-amber-950 text-slate-100 font-serif font-bold text-xs tracking-wider uppercase border border-amber-500/40 hover:from-red-900 hover:to-amber-900 text-center block transition-all shadow-md"
            >
              Mulai Penyelidikan ➔
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
