"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ClaimVoucherContent() {
  const searchParams = useSearchParams();
  const chapter = searchParams?.get("chapter") || "SeekerSaga Chapter";
  const code = searchParams?.get("code") || "SEEKER-REWARD-2026";
  const token = searchParams?.get("token") || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 flex-1 flex flex-col justify-center text-center">
      <div className="bg-occult-800/90 border border-amber-500/60 rounded-3xl p-8 sm:p-12 dossier-bg shadow-[0_0_50px_rgba(212,175,55,0.25)] relative overflow-hidden">
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-950/60 border border-amber-400 flex items-center justify-center text-4xl mb-6 animate-bounce shadow-lg">
          ??
        </div>

        <div className="inline-block text-xs font-mono px-3 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-700/60 uppercase tracking-widest mb-3">
          Klaim Hadiah Resmi Terverifikasi
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 mb-2">
          Selamat, The True Seeker!
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto mb-6">
          Anda telah berhasil memecahkan seluruh 3 segel misteri pada dimensi <strong className="text-amber-400">{chapter}</strong> dan membuka Peti Relikui Kuno.
        </p>

        <div className="p-4 rounded-xl bg-occult-900 border border-slate-700 mb-8 max-w-md mx-auto">
          <span className="text-xs font-mono text-slate-500 block mb-1">KODE VOUCHER HADIAH:</span>
          <span className="text-xl font-mono font-bold text-amber-400 tracking-wider select-all">{code}</span>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Nama Penyelidik:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full px-4 py-2.5 rounded-lg bg-occult-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Alamat Email Pengiriman:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-2.5 rounded-lg bg-occult-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 text-slate-900 font-serif font-black text-xs tracking-wider uppercase border border-amber-300 shadow-lg hover:scale-[1.02] transition-all"
            >
              Kirim Voucher ke Email Saya ?
            </button>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-emerald-950/50 border border-emerald-500 text-emerald-300 text-xs font-mono space-y-2 max-w-md mx-auto">
            <div className="text-base font-bold">?? KLAIM BERHASIL DICATAT!</div>
            <p className="text-slate-300">
              Voucher atas nama <strong className="text-emerald-400">{name}</strong> telah didaftarkan. Konfirmasi pengaktifan hadiah telah dikirim ke <strong className="text-emerald-400">{email}</strong>.
            </p>
            <div className="pt-4">
              <Link href="/chapters" className="inline-block px-4 py-2 rounded-lg bg-emerald-900 text-emerald-200 border border-emerald-600 font-bold hover:bg-emerald-800 transition-colors">
                Pilih Chapter Berikutnya ?
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
    <Suspense fallback={<div className="p-12 text-center font-mono text-slate-400 text-xs">Memuat portal klaim hadiah...</div>}>
      <ClaimVoucherContent />
    </Suspense>
  );
}
