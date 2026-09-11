import Link from "next/link";
import { CHAPTERS } from "@/data/chapters";

export default function ChaptersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left border-b border-slate-800 pb-8">
        <div className="inline-block text-xs font-mono px-3 py-1 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40 uppercase tracking-widest mb-3">
          The Nexus of Horrors
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Pilih Dimensi & Skenario Penyelidikan
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-3xl">
          Setiap chapter membawa Anda ke dalam peristiwa okultisme yang terisolasi. Buka ketiga segel menggunakan sandi yang tersembunyi di dalam berkas bukti dan portal eksternal.
        </p>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {CHAPTERS.map((ch) => (
          <div
            key={ch.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-occult-800/70 p-6 relative overflow-hidden group hover:border-amber-500/60 transition-all duration-300 shadow-xl"
          >
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-950/20 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-950/30 transition-colors"></div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="px-2.5 py-1 rounded bg-slate-900 text-amber-400 border border-slate-800">
                  Chapter {ch.id}
                </span>
                <span className="text-slate-500">{ch.era}</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors mb-1">
                {ch.title.split(": ")[1] || ch.title}
              </h2>
              <div className="text-xs text-red-400 font-serif italic mb-4">
                "{ch.latinTitle}" — {ch.subtitle}
              </div>

              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {ch.atmosphericDescription}
              </p>

              {/* 3 Seals Preview */}
              <div className="bg-occult-900/80 p-4 rounded-xl border border-slate-800/80 mb-6">
                <div className="text-xs font-serif font-bold text-slate-300 mb-2.5 flex items-center gap-2">
                  <span>🔐</span> 3 Segel Gaib yang Terkunci:
                </div>
                <div className="space-y-1.5">
                  {ch.seals.map((s) => (
                    <div key={s.number} className="text-xs font-mono text-slate-400 flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-red-950/60 text-red-400 flex items-center justify-center text-[10px] border border-red-800/40">
                        {s.number}
                      </span>
                      <span>{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <div className="text-xs text-slate-400 mb-3 flex items-center justify-between">
                <span>Hadiah Relikui:</span>
                <span className="text-amber-400 font-mono font-medium">Voucher Klaim URL</span>
              </div>
              <Link
                href={`/chapter/${ch.slug}`}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-950 to-amber-950 text-slate-100 font-serif font-bold text-xs tracking-wider uppercase border border-amber-500/40 hover:from-red-900 hover:to-amber-900 text-center block transition-all shadow-lg"
              >
                Mulai Penyelidikan ➔
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
