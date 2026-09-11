import Link from "next/link";
import { CHAPTERS } from "@/data/chapters";

export default function HomePage() {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden">
      {/* Dark Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-950/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-amber-950/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Occult Center Sigil Icon */}
      <div className="mb-6 relative group">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-occult-800/80 shadow-[0_0_30px_rgba(212,175,55,0.2)] group-hover:border-red-500 transition-colors duration-500">
          <span className="text-5xl sm:text-6xl animate-pulse filter drop-shadow-[0_0_12px_rgba(230,57,70,0.8)]">
            👁️
          </span>
        </div>
        <div className="absolute -inset-2 border border-dashed border-red-500/30 rounded-full animate-spin [animation-duration:20s] pointer-events-none"></div>
      </div>

      {/* Main Title & Lore Intro */}
      <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl mb-4">
        SEEKER<span className="text-red-500 glow-crimson">SAGA</span>
      </h1>
      
      <p className="font-serif italic text-amber-300/80 text-sm sm:text-base tracking-widest uppercase mb-6">
        The Occult & Cosmic Horror Alternate Reality Nexus
      </p>

      <p className="text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed mb-10">
        Gerbang portal multidimensi menuju misteri paling kelam. Setiap chapter menyimpan 
        <strong className="text-slate-200"> 3 Segel Gaib</strong> yang terkunci oleh sandi terlarang. 
        Gali bukti forensik, pecahkan enigma lintas-media, dan buka <strong className="text-amber-400">Peti Relikui</strong> untuk mengklaim tautan voucher hadiah.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 z-10">
        <Link
          href="/chapters"
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-red-900 to-amber-900 text-slate-100 font-serif font-bold text-sm tracking-wider uppercase border border-amber-500/50 shadow-[0_0_20px_rgba(138,3,3,0.6)] hover:from-red-800 hover:to-amber-800 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>🚪</span> Masuki Portal Semesta
        </Link>
        <Link
          href="/chapter/1-the-drowned-coven"
          className="w-full sm:w-auto px-6 py-3.5 rounded-lg bg-occult-800/90 text-slate-300 font-mono text-xs border border-slate-700 hover:border-amber-400/60 hover:text-slate-100 transition-colors flex items-center justify-center gap-2"
        >
          <span>⚡</span> Quick Play: Chapter I
        </Link>
      </div>

      {/* 3 Chapters Preview Grid */}
      <div className="w-full max-w-5xl text-left">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
          <span className="font-serif text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <span>🕯️</span> Trilogi Antologi Perdana
          </span>
          <span className="font-mono text-xs text-amber-500">3 Chapters Ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHAPTERS.map((ch) => (
            <Link
              key={ch.id}
              href={`/chapter/${ch.slug}`}
              className="group p-5 rounded-xl border border-slate-800 bg-occult-800/50 hover:bg-occult-700/60 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
                  <span>CHAPTER 0{ch.id}</span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform">➔</span>
                </div>
                <h2 className="font-serif text-lg font-bold text-slate-200 group-hover:text-amber-400 transition-colors mb-1">
                  {ch.title.split(": ")[1] || ch.title}
                </h2>
                <div className="text-xs text-red-400/80 font-serif italic mb-3">
                  {ch.latinTitle}
                </div>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {ch.atmosphericDescription}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{ch.seals.length} Segel Misteri</span>
                <span className="text-amber-500/80">Peti Voucher</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
