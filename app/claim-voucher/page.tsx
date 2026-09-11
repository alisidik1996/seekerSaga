"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MobileFrame from "@/app/components/MobileFrame";

function ClaimVoucherContent() {
  const searchParams = useSearchParams();
  const chapter = searchParams?.get("chapter") || "SeekerSaga Chapter";
  const code = searchParams?.get("code") || "SEEKER-COSMIC-KEY-2026";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
  };

  return (
    <div className="flex-1 flex flex-col justify-center text-center py-3">
      <div className="bg-occult-800/90 border border-amber-500/60 rounded-2xl p-5 dossier-bg shadow-[0_0_30px_rgba(212,175,55,0.2)] relative overflow-hidden">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-950/60 border border-amber-400 flex items-center justify-center text-2xl mb-3 shadow-md">
          👁️
        </div>

        <div className="inline-block text-[10px] font-mono px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700/60 uppercase tracking-widest mb-1.5">
          Rahasia Terverifikasi
        </div>

        <h1 className="font-serif text-lg font-bold text-slate-100 mb-1">
          Penyelidikan Terpecahkan
        </h1>
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">
          Anda telah berhasil menembus rahasia terdalam <strong className="text-amber-400">{chapter}</strong> dan membuka Cosmic Cube.
        </p>

        <div className="p-3 rounded-xl bg-occult-900 border border-slate-700 mb-4">
          <span className="text-[10px] font-mono text-slate-500 block mb-0.5">KUNCI DIMENSI RAHASIA:</span>
          <span className="text-base font-mono font-bold text-amber-400 tracking-wider select-all">{code}</span>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Nama Penyelidik:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className="w-full px-3 py-2 rounded-lg bg-occult-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Alamat Kontak / Email:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3 py-2 rounded-lg bg-occult-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 text-slate-900 font-serif font-black text-xs tracking-wider uppercase border border-amber-300 shadow-md hover:scale-[1.01] transition-all"
            >
              Abadikan Penyelidikan Saya ➔
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500 text-emerald-300 text-xs font-mono space-y-2">
            <div className="font-bold">✨ ARSIP TELAH DICATAT</div>
            <p className="text-slate-300 text-[11px]">
              Pencapaian Penyelidik <strong className="text-emerald-400">{name}</strong> telah terabadikan di dalam arsip rahasia Nexus.
            </p>
            <div className="pt-2">
              <Link href="/" className="inline-block px-3.5 py-1.5 rounded-lg bg-emerald-900 text-emerald-200 border border-emerald-600 font-bold hover:bg-emerald-800 transition-colors text-[11px]">
                Kembali ke Portal ➔
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClaimVoucherPage() {
  return (
    <MobileFrame>
      <Suspense fallback={<div className="p-6 text-center font-mono text-slate-400 text-xs">Memuat arsip...</div>}>
        <ClaimVoucherContent />
      </Suspense>
    </MobileFrame>
  );
}
