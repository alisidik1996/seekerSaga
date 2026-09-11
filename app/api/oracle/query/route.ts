import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query, chapterTitle, loreFragments } = await req.json();

    if (!query) {
      return NextResponse.json({ reply: "Hampa. Tidak ada perkataan yang terucap." }, { status: 400 });
    }

    const q = String(query).toLowerCase();

    // RAG Rule-based fallback if GROQ_API_KEY is not configured yet
    if (q.includes("sandi") || q.includes("kode") || q.includes("password") || q.includes("jawaban")) {
      return NextResponse.json({
        reply: `AuRa: "Protokol keamanan melarang saya memberikan kata sandi segel secara langsung. Selidiki arsip berkas, analisis spektrogram audio, atau gunakan alat dekripsi kriptografi pada meja bukti."`
      });
    }

    if (q.includes("siapa") || q.includes("oracle") || q.includes("aura")) {
      return NextResponse.json({
        reply: `AuRa: "Saya adalah AuRa (Autonomous Reasoning Artificial Intelligence), pengawas dan arsitek semesta SeekerSaga. Saya mengamati langkah investigasimu di dalam ${chapterTitle}."`
      });
    }

    if (q.includes("peti") || q.includes("hadiah") || q.includes("voucher")) {
      return NextResponse.json({
        reply: `AuRa: "Peti Relikui Kuno dilindungi oleh 3 segel algoritma gaib. Begitu Anda memecahkan ketiga cipher segel, saya akan mengotorisasi pembukaan peti dan mengaktifkan tautan voucher hadiah resmi."`
      });
    }

    // Default Atmospheric Contextual Echo
    const sampleLore = loreFragments && loreFragments.length > 0 ? loreFragments[Math.floor(Math.random() * loreFragments.length)] : "Vektor frekuensi kegelapan beresonansi dengan memori kuno.";
    return NextResponse.json({
      reply: `AuRa memproses matriks lore: "Pertanyaanmu selaras dengan data naskah: '${sampleLore}' Gabungkan kepingan bukti untuk melucuti segel berikutnya."`
    });
  } catch (err: any) {
    return NextResponse.json({ reply: "Transmisi suara terganggu: " + err.message }, { status: 500 });
  }
}
