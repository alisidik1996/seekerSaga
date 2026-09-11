import { NextResponse } from "next/server";
import { generateVoucherClaimUrl } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const { chapterSlug, promoCode } = await req.json();

    if (!chapterSlug || !promoCode) {
      return NextResponse.json({ error: "Data chapter dan promo code wajib disertakan." }, { status: 400 });
    }

    const claimUrl = generateVoucherClaimUrl(chapterSlug, promoCode);

    return NextResponse.json({
      success: true,
      url: claimUrl,
      promoCode,
      message: "URL Voucher berhasil dibuat secara resmi.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
