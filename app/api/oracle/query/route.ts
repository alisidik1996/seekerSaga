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
        reply: `The Oracle tersenyum samar: "Penjaga Nexus dilarang membocorkan kata sandi secara langsung. Periksa dokumen, dengarkan rekaman audio, atau pecahkan cipher pada meja arsip forensik."`
      });
    }

    if (q.includes("siapa") || q.includes("oracle")) {
      return NextResponse.json({
        reply: `"Saya adalah gema dari dimensi yang telah runtuh di dalam ${chapterTitle}. Saya bertugas memandu The Seeker yang berani membuka 3 segel peti misteri."`
      });
    }

    if (q.includes("peti") || q.includes("hadiah") || q.includes("voucher")) {
      return NextResponse.json({
        reply: `"Peti relikui terikat oleh 3 segel gaib. Setelah ketiga sandi dimasukkan dengan benar pada roda segel, kunci peti akan hancur dan URL klaim voucher hadiah akan terungkap."`
      });
    }

    // Default Atmospheric Contextual Echo
    const sampleLore = loreFragments && loreFragments.length > 0 ? loreFragments[Math.floor(Math.random() * loreFragments.length)] : "Kegelapan mendengarkan setiap langkahmu.";
    return NextResponse.json({
      reply: `The Oracle berbisik: "Pertanyaanmu beresonansi dengan arsip kuno: '${sampleLore}' Gali bukti-bukti di meja forensik untuk menghubungkan simpul misteri ini."`
    });
  } catch (err: any) {
    return NextResponse.json({ reply: "Transmisi suara terganggu: " + err.message }, { status: 500 });
  }
}
