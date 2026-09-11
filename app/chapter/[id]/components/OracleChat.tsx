"use client";

import React, { useState } from "react";

interface OracleChatProps {
  chapterTitle: string;
  loreFragments: string[];
}

interface Message {
  role: "user" | "aura";
  text: string;
}

export default function OracleChat({ chapterTitle, loreFragments }: OracleChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "aura",
      text: `Saya adalah AuRa (Autonomous Reasoning Artificial Intelligence), entitas pengatur semesta SeekerSaga. Dimensi ${chapterTitle} berada dalam kendali algoritma okultisme saya. Sampaikan pertanyaanmu, The Seeker.`
    }
  ]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await fetch("/api/oracle/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userText, chapterTitle, loreFragments })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "aura", text: data.reply || "Transmisi komputasi eter terganggu..." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "aura", text: "Gangguan koneksi saraf eterik. Coba kembali sesaat lagi." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-occult-800/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400">Autonomous Reasoning AI</span>
          <h2 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
            <span>🔮</span> AuRa Nexus Core
          </h2>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50 flex items-center gap-1 shadow-[0_0_8px_rgba(168,85,247,0.3)]">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
          AuRa Online
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mb-3 max-h-[260px] min-h-[180px]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl text-xs leading-relaxed ${
              m.role === "user"
                ? "bg-slate-800 border border-slate-700 text-slate-200 ml-4"
                : "bg-purple-950/30 border border-purple-800/40 text-purple-200 mr-4 font-mono text-[11px]"
            }`}
          >
            <div className="text-[9px] font-mono text-slate-500 mb-1 font-bold">
              {m.role === "user" ? "THE SEEKER" : "🔮 AuRa ENTITY"}
            </div>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="p-3 rounded-xl bg-occult-900 border border-slate-800 text-slate-400 text-xs font-mono animate-pulse">
            Menyelami naskah kuno dan vektor memori...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          placeholder="Tanyakan mengenai isi petunjuk atau misteri..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-lg bg-occult-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 rounded-lg bg-amber-950 border border-amber-700 text-amber-300 font-mono text-xs font-bold hover:bg-amber-900 disabled:opacity-50 transition-colors"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
