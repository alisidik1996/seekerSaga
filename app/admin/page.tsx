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
    <div className="flex-1 flex flex-col space-y-4 py-2">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
        <div>
          <div className="inline-block text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-800/40 uppercase tracking-widest mb-1">
            AuRa Gatekeeper
          </div>
          <h1 className="font-serif text-lg font-extrabold text-slate-100 tracking-tight">
            Admin Control Panel
          </h1>
        </div>
        <Link
          href="/chapters"
          className="text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors"
        >
          Lihat Web ➔
        </Link>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-xl text-xs font-mono border ${
            statusMsg.error
              ? "bg-red-950/80 border-red-800 text-red-300"
              : "bg-emerald-950/80 border-emerald-800 text-emerald-300"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Auth Screen */}
      {!isAuthenticated ? (
        <div className="p-5 rounded-2xl bg-occult-900 border border-slate-800 shadow-xl space-y-4">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-700 flex items-center justify-center text-2xl mx-auto shadow-[0_0_15px_rgba(168,85,247,0.4)]">
              🎛️
            </div>
            <h2 className="font-serif text-base font-bold text-slate-100">
              Otoritas Pengendali Dimensi
            </h2>
            <p className="text-xs text-slate-400">
              Masukkan Kunci Otoritas (Master PIN) untuk mengakses panel kendali chapter & gift URL.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 pt-2">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                Kunci Otoritas (PIN / Key)
              </label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="seeker_master_2026"
                className="w-full bg-occult-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-100 font-serif font-bold text-xs uppercase tracking-wider border border-purple-600/50 hover:from-purple-800 hover:to-indigo-800 transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? "Memverifikasi..." : "Akses Panel Kendali ➔"}
            </button>
          </form>
        </div>
      ) : (
        /* Chapter Control List */
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Daftar Bab Terdaftar ({chapters.length})</span>
            <button
              onClick={() => fetchChapters(pin)}
              className="text-[10px] text-amber-400 hover:underline"
            >
              🔄 Refresh Data
            </button>
          </div>

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
                className="rounded-2xl border border-slate-800 bg-occult-900/90 p-4 space-y-3.5 shadow-lg relative"
              >
                {/* Chapter Title Badge */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase">
                      Chapter 0{ch.id} • {ch.era}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-slate-100">
                      {ch.title}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                      formData.is_locked
                        ? "bg-red-950 text-red-400 border-red-800"
                        : "bg-emerald-950 text-emerald-400 border-emerald-800"
                    }`}
                  >
                    {formData.is_locked ? "🔒 Terkunci" : "🔓 Terbuka"}
                  </span>
                </div>

                {/* Form Controls */}
                <div className="space-y-3 text-xs font-mono">
                  {/* Lock Toggle */}
                  <div className="flex items-center justify-between bg-occult-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-300 font-serif">Kunci Status Chapter:</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleFieldChange(ch.slug, "is_locked", !formData.is_locked)
                      }
                      className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold border transition-colors ${
                        formData.is_locked
                          ? "bg-red-900/70 text-red-200 border-red-500"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {formData.is_locked ? "🔒 TERKUNCI" : "🔓 TERBUKA"}
                    </button>
                  </div>

                  {/* Countdown Unlock Picker */}
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">
                      ⏳ Waktu Pembukaan Otomatis (Countdown Release):
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.unlock_at}
                      onChange={(e) =>
                        handleFieldChange(ch.slug, "unlock_at", e.target.value)
                      }
                      className="w-full bg-occult-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                    />
                    {formData.unlock_at && (
                      <div className="mt-2">
                        <CountdownTimer targetDate={new Date(formData.unlock_at).toISOString()} />
                      </div>
                    )}
                  </div>

                  {/* Custom Gift URL */}
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1 flex items-center justify-between">
                      <span>🎁 Custom Gift / Voucher URL:</span>
                      <span className="text-[9px] text-slate-500 lowercase">(opsional / replace token)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.custom_gift_url}
                      onChange={(e) =>
                        handleFieldChange(ch.slug, "custom_gift_url", e.target.value)
                      }
                      placeholder="https://example.com/voucher/claim?code=SECRET123"
                      className="w-full bg-occult-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Custom Promo Code */}
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 mb-1">
                      🏷️ Custom Promo Code:
                    </label>
                    <input
                      type="text"
                      value={formData.custom_promo_code}
                      onChange={(e) =>
                        handleFieldChange(ch.slug, "custom_promo_code", e.target.value)
                      }
                      placeholder={ch.default_promo_code}
                      className="w-full bg-occult-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => handleSaveChapter(ch.slug)}
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-red-800 text-slate-100 font-serif font-bold text-xs uppercase tracking-wider border border-amber-500/50 hover:from-amber-600 hover:to-red-700 transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    💾 Simpan Konfigurasi Chapter 0{ch.id}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
