import Link from "next/link";
import { CHAPTERS } from "@/data/chapters";
import MobileFrame from "./components/MobileFrame";

export default function HomePage() {
  return (
    <MobileFrame>
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-2">
        {/* Occult Center Sigil Icon */}
        <div className="relative group my-2">
          <div className="w-20 h-20 rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-occult-800/80 shadow-[0_0_25px_rgba(212,175,55,0.25)]">
            <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(230,57,70,0.8)]">
              👁️
            </span>
          </div>
          <div className="absolute -inset-1.5 border border-dashed border-red-500/30 rounded-full animate-spin [animation-duration:20s] pointer-events-none"></div>
        </div>

        {/* Main Title & Lore Intro */}
        <div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-slate-100">
            SEEKER<span className="text-red-500 glow-crimson">SAGA</span>
          </h1>
          <p className="font-serif italic text-amber-300/80 text-[11px] tracking-widest uppercase mt-1">
            Occult & Cosmic Horror Portal
          </p>
        </div>

        <p className="text-slate-400 text-xs leading-relaxed px-2">
          Gerbang penyelidikan ARG okultisme. Gali berkas forensik, pecahkan enigma lintas-media, buka <strong className="text-slate-200">3 Segel Gaib</strong>, dan klaim hadiah voucher di dalam <strong className="text-amber-400">Peti Relikui Kuno</strong>.
        </p>

        {/* Mobile CTA Buttons */}
        <div className="w-full space-y-2.5 pt-1">
          <Link
            href="/chapters"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-900 to-amber-900 text-slate-100 font-serif font-bold text-xs tracking-wider uppercase border border-amber-500/50 shadow-[0_0_20px_rgba(138,3,3,0.6)] hover:from-red-800 hover:to-amber-800 transition-all flex items-center justify-center gap-2"
          >
            <span>🚪</span> Masuki Antologi Misteri
          </Link>
          <Link
            href="/chapter/1-the-drowned-coven"
            className="w-full py-2.5 rounded-xl bg-occult-800 text-slate-300 font-mono text-[11px] border border-slate-700 hover:border-amber-400/60 hover:text-slate-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>⚡</span> Quick Play: Chapter I
          </Link>
        </div>

        {/* 3 Chapters Mobile Cards */}
        <div className="w-full text-left pt-3 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-serif text-[11px] uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <span>🕯️</span> 3 Chapter Antologi
            </span>
            <span className="font-mono text-[10px] text-amber-500">Ready to Breach</span>
          </div>

          {CHAPTERS.map((ch) => (
            <Link
              key={ch.id}
              href={`/chapter/${ch.slug}`}
              className="block p-3 rounded-xl border border-slate-800 bg-occult-800/60 hover:bg-occult-700/60 hover:border-amber-500/50 transition-all"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1">
                <span>CHAPTER 0{ch.id}</span>
                <span className="text-amber-400">➔</span>
              </div>
              <div className="font-serif text-sm font-bold text-slate-200 mb-0.5">
                {ch.title.split(": ")[1] || ch.title}
              </div>
              <div className="text-[10px] text-red-400/80 font-serif italic mb-1.5">
                {ch.latinTitle}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {ch.atmosphericDescription}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </MobileFrame>
  );
}
