"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import CountdownTimer from "../components/CountdownTimer";

interface ChapterAdminData {
  id: number;
  slug: string;
  title: string;
  latinTitle: string;
  era: string;
  location: string;
  is_locked: boolean;
  unlock_at: string | null;
  custom_gift_url: string | null;
  custom_promo_code: string | null;
  default_promo_code: string;
  relicChestName: string;
}

export default function AdminControlPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chapters, setChapters] = useState<ChapterAdminData[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Form states per chapter slug
  const [forms, setForms] = useState<Record<string, {
    is_locked: boolean;
    unlock_at: string;
    custom_gift_url: string;
    custom_promo_code: string;
  }>>({});

  const fetchChapters = async (key: string) => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/chapters");
      const data = await res.json();
      if (data.chapters) {
        setChapters(data.chapters);
        const formInit: Record<string, any> = {};
        data.chapters.forEach((c: ChapterAdminData) => {
          formInit[c.slug] = {
            is_locked: c.is_locked,
            unlock_at: c.unlock_at ? c.unlock_at.slice(0, 16) : "",
            custom_gift_url: c.custom_gift_url || "",
            custom_promo_code: c.custom_promo_code || c.default_promo_code || "",
          };
        });
        setForms(formInit);
        setIsAuthenticated(true);
      } else {
        setStatusMsg({ text: "Gagal memuat data chapter.", error: true });
      }
    } catch (e) {
      setStatusMsg({ text: "Terjadi kesalahan jaringan.", error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === "seeker_master_2026" || pin.trim().length > 0) {
      fetchChapters(pin);
    } else {
      setStatusMsg({ text: "Kunci Otoritas (PIN) tidak boleh kosong.", error: true });
    }
  };

  const handleFieldChange = (slug: string, field: string, value: any) => {
    setForms((prev) => ({
      ...prev,
      [slug]: {
        ...prev[slug],
        [field]: value,
      },
    }));
  };

  const handleSaveChapter = async (slug: string) => {
    const chapterData = forms[slug];
    if (!chapterData) return;

    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin,
          chapterSlug: slug,
          is_locked: chapterData.is_locked,
          unlock_at: chapterData.unlock_at ? new Date(chapterData.unlock_at).toISOString() : null,
          custom_gift_url: chapterData.custom_gift_url.trim() || null,
          custom_promo_code: chapterData.custom_promo_code.trim() || null,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setStatusMsg({ text: `✅ Berhasil menyimpan konfigurasi chapter: ${slug}` });
        fetchChapters(pin);
      } else {
        setStatusMsg({ text: `❌ ${result.error || "Gagal menyimpan konfigurasi."}`, error: true });
      }
    } catch (e) {
      setStatusMsg({ text: "Gagal terhubung ke endpoint admin.", error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-200 flex flex-col font-sans">
      {/* Admin Top Navigation Header */}
      <header className="border-b border-purple-900/30 bg-occult-900/95 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl filter drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">🎛️</span>
            <div>
              <span className="font-serif tracking-widest text-base font-bold text-slate-100 group-hover:text-purple-400 transition-colors">
                SEEKER<span className="text-purple-400">SAGA</span> ADMIN
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60">
                AuRa Control Nexus
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-4 text-xs font-mono">
          <Link
            href="/chapters"
            target="_blank"
            className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
          >
            <span>👁️</span> Buka Web Pemain ➔
          </Link>
          <div className="h-4 w-px bg-slate-800"></div>
          <span className="text-[11px] px-2.5 py-1 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 flex items-center gap-2 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
            AuRa Active
          </span>
        </nav>
      </header>

      {/* Main Admin Workspace Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Status Notification */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl text-sm font-mono border flex items-center justify-between shadow-lg ${
              statusMsg.error
                ? "bg-red-950/80 border-red-800 text-red-200"
                : "bg-emerald-950/80 border-emerald-800 text-emerald-200"
            }`}
          >
            <span>{statusMsg.text}</span>
            <button
              onClick={() => setStatusMsg(null)}
              className="text-xs opacity-70 hover:opacity-100 underline"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Authentication Wall */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-occult-900 border border-slate-800 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-purple-950/80 border border-purple-600 flex items-center justify-center text-3xl mx-auto shadow-[0_0_25px_rgba(168,85,247,0.5)]">
                🔐
              </div>
              <h2 className="font-serif text-xl font-bold text-slate-100">
                Otoritas Pengendali Dimensi
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Masukkan Master PIN Otoritas AuRa untuk mengakses konsol manajemen chapter, countdown release, dan gift voucher link.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Kunci Otoritas (Master PIN)
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="seeker_master_2026"
                  className="w-full bg-occult-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-amber-300 font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-800 text-purple-100 font-serif font-bold text-sm uppercase tracking-wider border border-purple-500/50 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? "Memverifikasi Otoritas..." : "Akses Panel Kendali Admin ➔"}
              </button>
            </form>
          </div>
        ) : (
          /* Full Desktop / Wide Layout for Chapters Management */
          <div className="space-y-6">
            {/* Dashboard Sub-header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h1 className="font-serif text-2xl font-black text-slate-100 flex items-center gap-2.5">
                  <span>🏛️</span> Manajemen Dimensi & Voucher Hadiah
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Atur kuncian chapter, tanggal rilis otomatis dengan countdown timer, dan tautan custom gift voucher.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchChapters(pin)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-400 hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                  <span>🔄</span> Muat Ulang Data
                </button>
              </div>
            </div>

            {/* Chapters Grid View (Responsive: 1 col on mobile, 2 col on md, 3 col on xl) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {chapters.map((ch) => {
                const formData = forms[ch.slug] || {
                  is_locked: ch.is_locked,
                  unlock_at: "",
                  custom_gift_url: "",
                  custom_promo_code: "",
                };

                return (
                  <div
                    key={ch.slug}
                    className="rounded-3xl border border-slate-800 bg-occult-900/90 p-5 space-y-4 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div className="space-y-4">
                      {/* Chapter Card Header */}
                      <div className="flex items-start justify-between border-b border-slate-800 pb-3 gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-bold">
                              CHAPTER 0{ch.id}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">{ch.era}</span>
                          </div>
                          <h3 className="font-serif text-base font-bold text-slate-100 leading-snug">
                            {ch.title}
                          </h3>
                          <div className="text-xs text-red-400 font-serif italic mt-0.5">
                            "{ch.latinTitle}"
                          </div>
                        </div>

                        <span
                          className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border ${
                            formData.is_locked
                              ? "bg-red-950/80 text-red-400 border-red-800"
                              : "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                          }`}
                        >
                          {formData.is_locked ? "🔒 Terkunci" : "🔓 Terbuka"}
                        </span>
                      </div>

                      {/* Controls Area */}
                      <div className="space-y-3.5 text-xs font-mono">
                        {/* Lock / Unlock Toggle */}
                        <div className="flex items-center justify-between bg-occult-950 p-3 rounded-2xl border border-slate-800">
                          <div>
                            <span className="text-slate-200 font-bold block">Status Akses</span>
                            <span className="text-[10px] text-slate-500">
                              {formData.is_locked ? "Pemain terhalang tabir gaib" : "Dapat dimainkan bebas"}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleFieldChange(ch.slug, "is_locked", !formData.is_locked)
                            }
                            className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                              formData.is_locked
                                ? "bg-red-900/80 text-red-200 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                                : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
                            }`}
                          >
                            {formData.is_locked ? "🔒 TERKUNCI" : "🔓 TERBUKA"}
                          </button>
                        </div>

                        {/* Automatic Countdown Unlock Date */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] uppercase text-slate-400 font-bold flex items-center justify-between">
                            <span>⏳ Countdown Release Date:</span>
                            <span className="text-[10px] text-slate-500 lowercase">(buka otomatis)</span>
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.unlock_at}
                            onChange={(e) =>
                              handleFieldChange(ch.slug, "unlock_at", e.target.value)
                            }
                            className="w-full bg-occult-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:border-purple-500 focus:outline-none"
                          />
                          {formData.unlock_at && (
                            <div className="mt-2">
                              <CountdownTimer targetDate={new Date(formData.unlock_at).toISOString()} />
                            </div>
                          )}
                        </div>

                        {/* Custom Gift URL */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] uppercase text-slate-400 font-bold flex items-center justify-between">
                            <span>🎁 Custom Gift / Voucher URL:</span>
                            <span className="text-[10px] text-slate-500 lowercase">(menimpa token SHA)</span>
                          </label>
                          <input
                            type="url"
                            value={formData.custom_gift_url}
                            onChange={(e) =>
                              handleFieldChange(ch.slug, "custom_gift_url", e.target.value)
                            }
                            placeholder="https://example.com/voucher/claim?code=SECRET"
                            className="w-full bg-occult-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        {/* Custom Promo Code */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] uppercase text-slate-400 font-bold">
                            🏷️ Custom Promo Code:
                          </label>
                          <input
                            type="text"
                            value={formData.custom_promo_code}
                            onChange={(e) =>
                              handleFieldChange(ch.slug, "custom_promo_code", e.target.value)
                            }
                            placeholder={ch.default_promo_code}
                            className="w-full bg-occult-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Save Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleSaveChapter(ch.slug)}
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-700 via-red-800 to-amber-700 text-slate-100 font-serif font-bold text-xs uppercase tracking-wider border border-amber-500/50 hover:from-amber-600 hover:to-red-700 transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        💾 Simpan Pengaturan Bab 0{ch.id}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-slate-900 bg-black/90 text-slate-500 text-xs py-4 px-6 text-center mt-auto font-mono">
        SeekerSaga Master Admin System • Orchestrated by AuRa Autonomous Entity
      </footer>
    </div>
  );
}
