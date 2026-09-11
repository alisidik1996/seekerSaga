"use client";

import React, { useState } from "react";

interface OracleChatProps {
  chapterTitle: string;
  loreFragments: string[];
}

interface Message {
  role: "user" | "oracle";
  text: string;
}

export default function OracleChat({ chapterTitle, loreFragments }: OracleChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "oracle",
      text: `Saya adalah Penjaga Nexus (${chapterTitle}). Ajukan pertanyaan terkait dokumen atau petunjuk yang Anda temukan.`
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
      setMessages((prev) => [...prev, { role: "oracle", text: data.reply || "Suara dari kegelapan tidak terdengar jelas..." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "oracle", text: "Gangguan eter mengaburkan transmisi. Coba kembali sesaat lagi." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-occult-800/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col shadow-xl w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">RAG Lore Terminal</span>
          <h2 className="font-serif text-base font-bold text-slate-100 flex items-center gap-1.5">
            <span>🔮</span> Oracle of the Nexus
          </h2>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40 shrink-0">
          Knowledge Base
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mb-3 max-h-[260px] min-h-[180px]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-xl text-xs leading-relaxed break-words ${
              m.role === "user"
                ? "bg-slate-800 border border-slate-700 text-slate-200 ml-4"
                : "bg-occult-900 border border-amber-900/40 text-amber-200/90 mr-4 font-serif"
            }`}
          >
            <div className="text-[9px] font-mono text-slate-500 mb-0.5 font-bold">
              {m.role === "user" ? "THE SEEKER" : "THE ORACLE"}
            </div>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="p-2.5 rounded-xl bg-occult-900 border border-slate-800 text-slate-400 text-xs font-mono animate-pulse">
            Menyelami naskah kuno...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-1.5">
        <input
          type="text"
          placeholder="Tanyakan petunjuk..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-occult-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500 min-w-0"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-3 py-2 rounded-lg bg-amber-950 border border-amber-700 text-amber-300 font-mono text-xs font-bold hover:bg-amber-900 disabled:opacity-50 transition-colors shrink-0"
        >
          Kirim
        </button>
      </form>
    </div>
  );
}
