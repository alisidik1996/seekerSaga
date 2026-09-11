import { NextResponse } from "next/server";
import { CHAPTERS } from "@/data/chapters";

export async function POST(req: Request) {
  try {
    const { chapterSlug, sealNumber, cipher } = await req.json();

    if (!chapterSlug || !sealNumber || !cipher) {
      return NextResponse.json({ valid: false, message: "Parameter sandi tidak lengkap." }, { status: 400 });
    }

    const chapter = CHAPTERS.find((c) => c.slug === chapterSlug || c.id === chapterSlug);
    if (!chapter) {
      return NextResponse.json({ valid: false, message: "Chapter tidak ditemukan." }, { status: 404 });
    }

    const seal = chapter.seals.find((s) => s.number === Number(sealNumber));
    if (!seal) {
      return NextResponse.json({ valid: false, message: "Segel tidak ditemukan." }, { status: 404 });
    }

    const cleanInput = String(cipher).trim().toUpperCase().replace(/\s+/g, "_");
    const cleanTarget = seal.cipher.trim().toUpperCase().replace(/\s+/g, "_");

    if (cleanInput === cleanTarget || cleanInput.replace(/_/g, "") === cleanTarget.replace(/_/g, "")) {
      return NextResponse.json({
        valid: true,
        message: `Sandi benar! ${seal.name} berhasil dilucuti.`,
        sealNumber: seal.number,
      });
    }

    return NextResponse.json({
      valid: false,
      message: `Sandi "${cipher}" salah. Entitas kegelapan menolak kunci ini.`,
    });
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: err.message }, { status: 500 });
  }
}
