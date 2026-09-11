import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeekerSaga — The Occult Nexus & Cosmic Horror Portal",
  description: "Antologi petualangan interaktif horor okultisme dan cosmic horror. Buka 3 segel misteri untuk mengklaim peti relikui voucher.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-occult-900 text-slate-200 min-h-screen flex flex-col relative selection:bg-occult-crimson selection:text-white">
        <div className="fixed inset-0 scanlines z-50 pointer-events-none opacity-40"></div>
        
        {/* Occult Navigation Header */}
        <header className="border-b border-yellow-900/30 bg-occult-900/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(230,57,70,0.8)] group-hover:rotate-12 transition-transform duration-300">👁️</span>
              <div>
                <span className="font-serif tracking-widest text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                  SEEKER<span className="text-red-500">SAGA</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase text-slate-500 ml-2 border-l border-slate-700 pl-2">
                  The Occult Portal
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-6 text-sm">
              <Link href="/chapters" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 font-medium">
                <span>📜</span> Antologi Chapter
              </Link>
              <div className="h-4 w-px bg-slate-800"></div>
              <span className="text-xs px-2.5 py-1 rounded bg-red-950/60 text-red-400 border border-red-800/40 font-mono flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                TINAG Protocol Active
              </span>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* Occult Footer */}
        <footer className="border-t border-slate-900 bg-occult-abyss text-slate-500 text-xs py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-amber-500/80">⚔️</span>
              <span>SeekerSaga © 2026. This Is Not A Game (TINAG). Segala misteri yang terungkap adalah tanggung jawab The Seeker.</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="text-slate-600">Vercel Blob + Neon PostgreSQL</span>
              <span className="text-slate-700">•</span>
              <span className="text-red-400/80">3 Seals ➔ Relic Chest Voucher</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
