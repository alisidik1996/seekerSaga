import Link from "next/link";

export default function MobilePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-4 md:p-6 bg-neutral-950 overflow-x-hidden">
      {/* Locked Mobile Portrait Frame Container (Responsive width up to 430px) */}
      <div className="w-full max-w-[430px] min-h-screen sm:min-h-[850px] sm:max-h-[920px] bg-occult-900 border-x sm:border border-slate-800 sm:rounded-[36px] shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col relative overflow-x-hidden">
        {/* Minimalist Enigmatic Header */}
        <header className="border-b border-yellow-900/30 bg-occult-900/95 backdrop-blur-md sticky top-0 z-40 px-3.5 py-3 flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl filter drop-shadow-[0_0_8px_rgba(230,57,70,0.8)]">👁️</span>
            <div>
              <span className="font-serif tracking-widest text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                SEEKER<span className="text-red-500">SAGA</span>
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50 font-mono flex items-center gap-1.5 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
              AuRa
            </span>
          </div>
        </header>

        {/* Main Mobile Screen Area */}
        <main className="flex-1 flex flex-col p-3 sm:p-4 pb-6 overflow-y-auto overflow-x-hidden w-full">{children}</main>

        {/* Occult Mobile Footer */}
        <footer className="border-t border-slate-900 bg-black text-slate-500 text-[10px] py-3 px-3.5 text-center mt-auto shrink-0">
          <div className="flex items-center justify-center gap-1.5 text-purple-400/80 font-mono">
            <span>🔮</span>
            <span>Portal dikendalikan penuh oleh AuRa Entity.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
