import { NextResponse } from "next/server";
import { generateVoucherClaimUrl } from "@/lib/crypto";
import { getChapterConfigs } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { chapterSlug, promoCode } = await req.json();

    if (!chapterSlug || !promoCode) {
      return NextResponse.json({ error: "Data chapter dan promo code wajib disertakan." }, { status: 400 });
    }

    // Check if there is a custom gift URL set in chapter configs
    const configs = await getChapterConfigs();
    const chapterCfg = configs[chapterSlug];

    let claimUrl = generateVoucherClaimUrl(chapterSlug, promoCode);
    if (chapterCfg?.custom_gift_url && chapterCfg.custom_gift_url.trim().length > 0) {
      claimUrl = chapterCfg.custom_gift_url.trim();
    }

    const resolvedPromoCode = chapterCfg?.custom_promo_code || promoCode;

    return NextResponse.json({
      success: true,
      url: claimUrl,
      promoCode: resolvedPromoCode,
      message: "URL Voucher berhasil dibuat secara resmi.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
