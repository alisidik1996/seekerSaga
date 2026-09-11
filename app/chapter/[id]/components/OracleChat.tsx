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
      text: `Saya adalah Penjaga Nexus (${chapterTitle}). Ajukan pertanyaan terkait dokumen atau petunjuk yang Anda temukan. Namun ingat, rahasia terdalam hanya terungkap bagi mereka yang cermat menggabungkan bukti.`
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
    <div className="bg-occult-800/90 border border-slate-800 rounded-2xl p-6 flex flex-col h-full shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">RAG Lore Terminal</span>
          <h2 className="font-serif text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>🔮</span> Oracle of the Nexus
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-1 rounded bg-amber-950/40 text-amber-400 border border-amber-800/40">
          Knowledge Base Active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 max-h-[300px] min-h-[220px]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl text-xs leading-relaxed ${
              m.role === "user"
                ? "bg-slate-800 border border-slate-700 text-slate-200 ml-6"
                : "bg-occult-900 border border-amber-900/40 text-amber-200/90 mr-6 font-serif"
            }`}
          >
            <div className="text-[10px] font-mono text-slate-500 mb-1 font-bold">
              {m.role === "user" ? "THE SEEKER" : "THE ORACLE"}
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
