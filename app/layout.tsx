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
      <body className="bg-neutral-950 text-slate-200 min-h-screen flex items-center justify-center relative selection:bg-occult-crimson selection:text-white font-sans antialiased overflow-x-hidden p-0 sm:p-4 md:p-6">
        <div className="fixed inset-0 scanlines z-50 pointer-events-none opacity-30"></div>

        {/* Locked Mobile Portrait Frame Container (Fixed 430px Max Width) */}
        <div className="w-full max-w-[430px] min-h-screen sm:min-h-[850px] sm:max-h-[920px] bg-occult-900 border-x sm:border border-slate-800 sm:rounded-[36px] shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col relative overflow-hidden">
          {/* Mobile Occult Header */}
          <header className="border-b border-yellow-900/30 bg-occult-900/95 backdrop-blur-md sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl filter drop-shadow-[0_0_8px_rgba(230,57,70,0.8)]">👁️</span>
              <div>
                <span className="font-serif tracking-widest text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                  SEEKER<span className="text-red-500">SAGA</span>
                </span>
              </div>
            </Link>

            <nav className="flex items-center gap-3 text-xs">
              <Link href="/chapters" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1 font-mono text-[11px]">
                <span>📜</span> Chapters
              </Link>
              <div className="h-3 w-px bg-slate-800"></div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50 font-mono flex items-center gap-1.5 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
                AuRa
              </span>
            </nav>
          </header>

          {/* Main Mobile Screen Area */}
          <main className="flex-1 flex flex-col p-4 pb-6 overflow-y-auto">{children}</main>

          {/* Occult Mobile Footer */}
          <footer className="border-t border-slate-900 bg-black text-slate-500 text-[10px] py-3.5 px-4 text-center mt-auto">
            <div className="flex items-center justify-center gap-1.5 mb-0.5 text-purple-400/80 font-mono">
              <span>🔮</span>
              <span>Portal dikendalikan penuh oleh AuRa Entity.</span>
            </div>
            <div className="text-slate-600 font-mono text-[9px]">
              3 Segel Gaib ➔ Peti Relikui Voucher
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
