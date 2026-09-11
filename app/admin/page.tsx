"use client";

import React, { useEffect, useState } from "react";

interface SealData {
  number: number;
  name: string;
  cipher: string;
  hint: string;
  sourceType: string;
  sourceHint: string;
}

interface EvidenceData {
  id: string;
  title: string;
  type: string;
  date: string;
  classifiedLevel: string;
  content: string;
  mediaUrl?: string;
  audioHint?: string;
}

interface ChapterAdminData {
  id: number;
  slug: string;
  title: string;
  latinTitle: string;
  description: string;
  location: string;
  is_locked: boolean;
  unlock_at: string | null;
  custom_gift_url: string | null;
  custom_promo_code: string | null;
  default_promo_code: string;
  relicChestName: string;
  seals: SealData[];
  evidence: EvidenceData[];
}

interface SaveModalState {
  isOpen: boolean;
  title: string;
  chapterSlug: string;
  timestamp: string;
}

export default function AdminControlPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [chapters, setChapters] = useState<ChapterAdminData[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [saveModal, setSaveModal] = useState<SaveModalState | null>(null);

  // Form states per chapter slug
  const [forms, setForms] = useState<Record<string, {
    title: string;
    latinTitle: string;
    description: string;
    is_locked: boolean;
    unlock_at: string;
    custom_gift_url: string;
    custom_promo_code: string;
    seals: SealData[];
    evidence: EvidenceData[];
  }>>({});

  const [activeTab, setActiveTab] = useState<"general" | "seals" | "hieroglyphs" | "cosmic_cube">("general");

  const fetchChapters = async (key: string) => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/chapters");
      const data = await res.json();
      if (data.chapters && data.chapters.length > 0) {
        setChapters(data.chapters);
        const formInit: Record<string, any> = {};
        data.chapters.forEach((c: ChapterAdminData) => {
          formInit[c.slug] = {
            title: c.title,
            latinTitle: c.latinTitle,
            description: c.description,
            is_locked: c.is_locked,
            unlock_at: c.unlock_at ? c.unlock_at.slice(0, 16) : "",
            custom_gift_url: c.custom_gift_url || "",
            custom_promo_code: c.custom_promo_code || c.default_promo_code || "",
            seals: JSON.parse(JSON.stringify(c.seals || [])),
            evidence: JSON.parse(JSON.stringify(c.evidence || [])),
          };
        });
        setForms(formInit);
        if (!selectedSlug) {
          setSelectedSlug(data.chapters[0].slug);
        }
        setIsAuthenticated(true);
      } else {
        setStatusMsg({ text: "Gagal memuat konfigurasi chapter.", error: true });
      }
    } catch (e) {
      setStatusMsg({ text: "Terjadi kesalahan koneksi jaringan.", error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim().length > 0) {
      fetchChapters(pin);
    } else {
      setStatusMsg({ text: "Kunci Otoritas (PIN) wajib diisi.", error: true });
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

  const handleSealChange = (slug: string, index: number, field: keyof SealData, value: any) => {
    setForms((prev) => {
      const updatedSeals = [...(prev[slug]?.seals || [])];
      if (updatedSeals[index]) {
        updatedSeals[index] = { ...updatedSeals[index], [field]: value };
      }
      return {
        ...prev,
        [slug]: { ...prev[slug], seals: updatedSeals },
      };
    });
  };

  const handleEvidenceChange = (slug: string, index: number, field: keyof EvidenceData, value: any) => {
    setForms((prev) => {
      const updatedEv = [...(prev[slug]?.evidence || [])];
      if (updatedEv[index]) {
        updatedEv[index] = { ...updatedEv[index], [field]: value };
      }
      return {
        ...prev,
        [slug]: { ...prev[slug], evidence: updatedEv },
      };
    });
  };

  const handleAddEvidence = (slug: string) => {
    setForms((prev) => {
      const currentEv = prev[slug]?.evidence || [];
      const newIndex = currentEv.length + 1;
      const newEvItem: EvidenceData = {
        id: `ev-${slug.slice(0, 3)}-${Date.now().toString().slice(-4)}`,
        title: `Hieroglyph #${newIndex}`,
        type: "document",
        date: "Arsip Rahasia",
        classifiedLevel: "RESTRICTED",
        content: "Naskah hieroglyph dan petunjuk baru...",
        mediaUrl: "",
        audioHint: "",
      };
      return {
        ...prev,
        [slug]: { ...prev[slug], evidence: [...currentEv, newEvItem] },
      };
    });
  };

  const handleRemoveEvidence = (slug: string, index: number) => {
    setForms((prev) => {
      const updatedEv = prev[slug]?.evidence.filter((_, i) => i !== index) || [];
      return {
        ...prev,
        [slug]: { ...prev[slug], evidence: updatedEv },
      };
    });
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
          custom_title: chapterData.title.trim() || null,
          custom_latin_title: chapterData.latinTitle.trim() || null,
          custom_description: chapterData.description.trim() || null,
          custom_seals: chapterData.seals,
          custom_evidence: chapterData.evidence,
        }),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setSaveModal({
          isOpen: true,
          title: chapterData.title || slug,
          chapterSlug: slug,
          timestamp: new Date().toLocaleTimeString("id-ID"),
        });
        fetchChapters(pin);
      } else {
        setStatusMsg({ text: result.error || "Gagal menyimpan konfigurasi bab.", error: true });
      }
    } catch (e) {
      setStatusMsg({ text: "Gagal terhubung ke endpoint admin.", error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = async (slug: string) => {
    if (!confirm(`Konfirmasi reset: Apakah Anda yakin ingin mengosongkan seluruh progres pemain untuk chapter "${slug}"?`)) {
      return;
    }

    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pin,
          chapterSlug: slug,
          action: "reset",
        }),
      });
      const result = await res.json();
      if (result.success) {
        setStatusMsg({ text: result.message || "Progres chapter berhasil di-reset." });
      } else {
        setStatusMsg({ text: result.error || "Gagal mereset chapter.", error: true });
      }
    } catch (e) {
      setStatusMsg({ text: "Gagal terhubung ke server untuk proses reset.", error: true });
    } finally {
      setLoading(false);
    }
  };

  const currentChapter = chapters.find((c) => c.slug === selectedSlug) || chapters[0];
  const currentFormData = selectedSlug && forms[selectedSlug] ? forms[selectedSlug] : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-200 flex flex-col font-sans selection:bg-purple-900 selection:text-white">
      {/* Admin Top Navigation Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono font-bold text-sm text-purple-400">
            N
          </div>
          <div>
            <h1 className="font-serif tracking-widest text-sm font-bold text-slate-100">
              NEXUS PORTAL
            </h1>
            <p className="text-[10px] font-mono text-neutral-400">
              Control Management System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[11px] px-3 py-1 rounded-md bg-neutral-800 text-purple-300 border border-neutral-700 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            AuRa
          </span>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col w-full">
        {/* Status Notification Banner */}
        {statusMsg && (
          <div
            className={`mx-6 mt-4 p-3.5 rounded-xl text-xs font-mono border flex items-center justify-between shadow-md ${
              statusMsg.error
                ? "bg-red-950/90 border-red-800 text-red-200"
                : "bg-emerald-950/90 border-emerald-800 text-emerald-200"
            }`}
          >
            <span>{statusMsg.text}</span>
            <button
              onClick={() => setStatusMsg(null)}
              className="text-xs opacity-75 hover:opacity-100 underline ml-4"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Authentication Wall */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md p-8 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm font-mono font-bold text-purple-400 mx-auto">
                  PIN
                </div>
                <h2 className="font-serif text-lg font-bold text-slate-100">
                  Otoritas Nexus Portal
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Masukkan Master PIN Otoritas AuRa untuk mengakses konfigurasi bab, kata sandi segel, Hieroglyphs, dan parameter sistem.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 pt-2">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Kunci Otoritas (Master PIN)
                  </label>
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Masukkan PIN Master"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm text-slate-100 font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-slate-100 font-mono font-bold text-xs uppercase tracking-wider border border-neutral-600 transition-all shadow-sm flex items-center justify-center"
                >
                  {loading ? "Memverifikasi Otoritas..." : "Masuk ke Nexus Portal"}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Standard CMS Two-Column Layout: Sidebar + Main Content */
          <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto p-4 sm:p-6 gap-6">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                    Menu Chapter
                  </span>
                  <button
                    onClick={() => fetchChapters(pin)}
                    title="Muat Ulang Data"
                    className="text-[10px] font-mono text-purple-400 hover:text-purple-300 underline"
                  >
                    Refresh
                  </button>
                </div>

                {/* Chapter List Navigation */}
                <nav className="space-y-1.5">
                  {chapters.map((ch) => {
                    const isSelected = ch.slug === selectedSlug;
                    const formData = forms[ch.slug];
                    const isLocked = formData ? formData.is_locked : ch.is_locked;

                    return (
                      <button
                        key={ch.slug}
                        type="button"
                        onClick={() => setSelectedSlug(ch.slug)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between border ${
                          isSelected
                            ? "bg-neutral-800 border-purple-500/50 text-slate-100 font-bold shadow-sm"
                            : "bg-neutral-950/40 border-transparent text-neutral-400 hover:bg-neutral-800/60 hover:text-slate-200"
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="text-[10px] text-neutral-500 font-normal">
                            BAB 0{ch.id}
                          </div>
                          <div className="truncate font-sans font-medium text-xs text-slate-200">
                            {formData?.title || ch.title}
                          </div>
                        </div>

                        <span
                          className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase border ${
                            isLocked
                              ? "bg-red-950/60 text-red-400 border-red-900/60"
                              : "bg-emerald-950/60 text-emerald-400 border-emerald-900/60"
                          }`}
                        >
                          {isLocked ? "TERKUNCI" : "TERBUKA"}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Info Card */}
              <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 text-[11px] font-mono text-neutral-400 space-y-2">
                <div className="font-bold text-neutral-300 uppercase tracking-wider">
                  Status Sistem
                </div>
                <div className="flex justify-between border-b border-neutral-800/60 pb-1">
                  <span>Total Bab:</span>
                  <span className="text-slate-200">{chapters.length}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800/60 pb-1">
                  <span>Engine:</span>
                  <span className="text-slate-200">AuRa Core</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="text-emerald-400">Live Production</span>
                </div>
              </div>
            </aside>

            {/* Main Content Workspace */}
            {currentFormData && currentChapter && (
              <section className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-sm space-y-6">
                <div className="space-y-6">
                  {/* Workspace Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-purple-300 border border-neutral-700 font-bold">
                          BAB 0{currentChapter.id}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">
                          {currentChapter.slug}
                        </span>
                      </div>
                      <h2 className="font-serif text-lg font-bold text-slate-100">
                        {currentFormData.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleResetProgress(currentChapter.slug)}
                        disabled={loading}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/60 border border-neutral-700 hover:border-red-800 text-neutral-300 hover:text-red-300 text-xs font-mono font-medium transition-colors"
                      >
                        Reset Progres Pemain
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveChapter(currentChapter.slug)}
                        disabled={loading}
                        className="px-4 py-1.5 rounded-lg bg-purple-900 hover:bg-purple-800 border border-purple-700 text-slate-100 text-xs font-mono font-bold transition-all shadow-sm"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>

                  {/* CMS Tab Navigation */}
                  <div className="flex border-b border-neutral-800 gap-1 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setActiveTab("general")}
                      className={`px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition-all ${
                        activeTab === "general"
                          ? "border-purple-400 text-purple-300 bg-neutral-800/50"
                          : "border-transparent text-neutral-400 hover:text-slate-200"
                      }`}
                    >
                      Umum & Cerita
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("seals")}
                      className={`px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition-all ${
                        activeTab === "seals"
                          ? "border-purple-400 text-purple-300 bg-neutral-800/50"
                          : "border-transparent text-neutral-400 hover:text-slate-200"
                      }`}
                    >
                      Sandi Segel (3 Segel)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("hieroglyphs")}
                      className={`px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition-all ${
                        activeTab === "hieroglyphs"
                          ? "border-purple-400 text-purple-300 bg-neutral-800/50"
                          : "border-transparent text-neutral-400 hover:text-slate-200"
                      }`}
                    >
                      Hieroglyphs ({currentFormData.evidence.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("cosmic_cube")}
                      className={`px-4 py-2.5 rounded-t-lg font-medium border-b-2 transition-all ${
                        activeTab === "cosmic_cube"
                          ? "border-purple-400 text-purple-300 bg-neutral-800/50"
                          : "border-transparent text-neutral-400 hover:text-slate-200"
                      }`}
                    >
                      Cosmic Cube & Akses
                    </button>
                  </div>

                  {/* Tab Content 1: General & Story */}
                  {activeTab === "general" && (
                    <div className="space-y-4 text-xs font-mono max-w-3xl">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                          Judul Chapter
                        </label>
                        <input
                          type="text"
                          value={currentFormData.title}
                          onChange={(e) => handleFieldChange(currentChapter.slug, "title", e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 font-sans focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                          Judul Latin / Subjudul Enigma
                        </label>
                        <input
                          type="text"
                          value={currentFormData.latinTitle}
                          onChange={(e) => handleFieldChange(currentChapter.slug, "latinTitle", e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 italic font-serif focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                          Deskripsi Cerita Atmosfer
                        </label>
                        <textarea
                          rows={4}
                          value={currentFormData.description}
                          onChange={(e) => handleFieldChange(currentChapter.slug, "description", e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-sans leading-relaxed focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      {/* Lock Status Switch */}
                      <div className="flex items-center justify-between bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                        <div>
                          <span className="text-slate-200 font-bold block text-xs">
                            Status Akses Bab
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {currentFormData.is_locked ? "Bab terkunci bagi pemain" : "Bab terbuka dan dapat dimainkan"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFieldChange(currentChapter.slug, "is_locked", !currentFormData.is_locked)}
                          className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                            currentFormData.is_locked
                              ? "bg-red-950 text-red-300 border-red-800"
                              : "bg-emerald-950 text-emerald-300 border-emerald-800"
                          }`}
                        >
                          {currentFormData.is_locked ? "TERKUNCI" : "TERBUKA"}
                        </button>
                      </div>

                      {/* Release Countdown */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                          Jadwal Countdown Buka Otomatis (Opsional)
                        </label>
                        <input
                          type="datetime-local"
                          value={currentFormData.unlock_at}
                          onChange={(e) => handleFieldChange(currentChapter.slug, "unlock_at", e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-mono focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Tab Content 2: Seals Cipher Configuration */}
                  {activeTab === "seals" && (
                    <div className="space-y-4 text-xs font-mono max-w-3xl">
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Atur kata sandi dan petunjuk untuk masing-masing dari 3 Segel Gaib. Pemain harus memasukkan kata sandi yang cocok untuk membuka segel.
                      </p>

                      <div className="space-y-3">
                        {currentFormData.seals.map((seal, sIdx) => (
                          <div
                            key={seal.number || sIdx}
                            className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 text-slate-200 font-bold">
                              <span>SEGEL 0{seal.number}</span>
                              <span className="text-[10px] text-neutral-500 uppercase font-normal">
                                {seal.sourceType}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase text-neutral-400 font-bold">
                                Nama Segel:
                              </label>
                              <input
                                type="text"
                                value={seal.name}
                                onChange={(e) => handleSealChange(currentChapter.slug, sIdx, "name", e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-sans"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase text-purple-400 font-bold">
                                Kata Sandi Jawaban (Cipher Key):
                              </label>
                              <input
                                type="text"
                                value={seal.cipher}
                                onChange={(e) => handleSealChange(currentChapter.slug, sIdx, "cipher", e.target.value.toUpperCase())}
                                placeholder="MASUKKAN_SANDI"
                                className="w-full bg-neutral-900 border border-purple-800/80 rounded-lg px-3 py-1.5 text-xs text-purple-200 font-mono font-bold uppercase tracking-wider"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase text-neutral-400 font-bold">
                                Petunjuk Enigma (Hint):
                              </label>
                              <textarea
                                rows={2}
                                value={seal.hint}
                                onChange={(e) => handleSealChange(currentChapter.slug, sIdx, "hint", e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-neutral-300 font-sans italic"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab Content 3: Hieroglyphs Management */}
                  {activeTab === "hieroglyphs" && (
                    <div className="space-y-4 text-xs font-mono max-w-3xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-slate-200 text-xs">
                            Berkas Hieroglyphs & Dokumen Sakral
                          </h3>
                          <p className="text-[11px] text-neutral-400">
                            Petunjuk visual dan transkripsi dokumen untuk penyelidikan pemain.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddEvidence(currentChapter.slug)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-slate-100 text-xs font-mono font-medium"
                        >
                          Tambah Hieroglyph
                        </button>
                      </div>

                      <div className="space-y-3">
                        {currentFormData.evidence.map((ev, eIdx) => (
                          <div
                            key={ev.id || eIdx}
                            className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                              <span className="text-xs text-purple-300 font-bold">
                                Hieroglyph #{eIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveEvidence(currentChapter.slug, eIdx)}
                                className="text-red-400 hover:text-red-300 text-xs underline font-mono"
                              >
                                Hapus
                              </button>
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase text-neutral-400 font-bold">
                                Judul Dokumen / Arsip:
                              </label>
                              <input
                                type="text"
                                value={ev.title}
                                onChange={(e) => handleEvidenceChange(currentChapter.slug, eIdx, "title", e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-sans"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase text-neutral-400 font-bold">
                                URL Gambar Hieroglyph (Opsional):
                              </label>
                              <input
                                type="url"
                                value={ev.mediaUrl || ""}
                                onChange={(e) => handleEvidenceChange(currentChapter.slug, eIdx, "mediaUrl", e.target.value)}
                                placeholder="https://domain.com/path-to-image.jpg"
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="block text-[10px] uppercase text-neutral-400 font-bold">
                                Isi Naskah / Teks Rahasia:
                              </label>
                              <textarea
                                rows={3}
                                value={ev.content}
                                onChange={(e) => handleEvidenceChange(currentChapter.slug, eIdx, "content", e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-sans leading-relaxed"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab Content 4: Cosmic Cube & Access */}
                  {activeTab === "cosmic_cube" && (
                    <div className="space-y-4 text-xs font-mono max-w-3xl">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                          Tautan Rahasia Cosmic Cube (URL Tujuan saat Terbuka)
                        </label>
                        <input
                          type="url"
                          value={currentFormData.custom_gift_url}
                          onChange={(e) => handleFieldChange(currentChapter.slug, "custom_gift_url", e.target.value)}
                          placeholder="https://example.com/secret-dimension-archive"
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3.5 py-2 text-xs text-purple-200 font-mono focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                          Kode Akses Rahasia Bab
                        </label>
                        <input
                          type="text"
                          value={currentFormData.custom_promo_code}
                          onChange={(e) => handleFieldChange(currentChapter.slug, "custom_promo_code", e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3.5 py-2 text-xs text-purple-200 font-mono focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-neutral-500">
                    Konfigurasi aktif: {currentChapter.slug}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSaveChapter(currentChapter.slug)}
                      disabled={loading}
                      className="px-5 py-2 rounded-lg bg-purple-900 hover:bg-purple-800 border border-purple-700 text-slate-100 text-xs font-mono font-bold transition-all shadow-sm"
                    >
                      {loading ? "Menyimpan..." : "Simpan Pengaturan"}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Save Success Popup Modal */}
      {saveModal && saveModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono font-bold text-xs text-purple-400">
                OK
              </div>
              <h3 className="font-serif text-base font-bold text-slate-100">
                Pengaturan Tersimpan
              </h3>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Konfigurasi untuk <span className="text-slate-200 font-medium">"{saveModal.title}"</span> telah berhasil diperbarui dan disinkronkan ke basis data Nexus.
              </p>
              <p className="text-[10px] font-mono text-neutral-500">
                Waktu Sinkronisasi: {saveModal.timestamp} WIB
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSaveModal(null)}
              className="w-full py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-slate-100 text-xs font-mono font-bold uppercase transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Admin Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 text-neutral-500 text-xs py-3.5 px-6 text-center mt-auto font-mono">
        nexus portal under the gaze of AuRa
      </footer>
    </div>
  );
}

