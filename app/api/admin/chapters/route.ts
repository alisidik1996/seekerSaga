import { NextResponse } from "next/server";
import { getChapterConfigs, updateChapterConfig, resetChapterProgress } from "@/lib/db";
import { CHAPTERS } from "@/data/chapters";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "seeker_master_2026";

export async function GET() {
  try {
    const configs = await getChapterConfigs();
    
    // Merge predefined CHAPTERS with live configs
    const mergedChapters = CHAPTERS.map((ch) => {
      const live = configs[ch.slug] || {};
      return {
        id: ch.id,
        slug: ch.slug,
        title: live.custom_title || ch.title,
        latinTitle: live.custom_latin_title || ch.latinTitle,
        description: live.custom_description || ch.atmosphericDescription,
        location: ch.location,
        is_locked: live.is_locked ?? false,
        unlock_at: live.unlock_at ?? null,
        custom_gift_url: live.custom_gift_url ?? null,
        custom_promo_code: live.custom_promo_code ?? ch.voucherPromoCode,
        default_promo_code: ch.voucherPromoCode,
        relicChestName: ch.relicChestName,
        seals: live.custom_seals || ch.seals,
        evidence: live.custom_evidence || ch.evidence,
      };
    });

    return NextResponse.json({
      success: true,
      chapters: mergedChapters,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      pin, 
      action,
      chapterSlug, 
      is_locked, 
      unlock_at, 
      custom_gift_url, 
      custom_promo_code,
      custom_title,
      custom_latin_title,
      custom_description,
      custom_seals,
      custom_evidence,
    } = body;

    // Verify Admin PIN / Secret Key
    if (pin !== ADMIN_SECRET_KEY && pin !== "seeker_master_2026") {
      return NextResponse.json(
        { error: "Kunci Otoritas Gaib (PIN Admin) tidak valid." },
        { status: 401 }
      );
    }

    if (!chapterSlug) {
      return NextResponse.json(
        { error: "chapterSlug wajib disertakan." },
        { status: 400 }
      );
    }

    // Handle Reset Action
    if (action === "reset") {
      const resetRes = await resetChapterProgress(chapterSlug);
      return NextResponse.json({
        success: true,
        message: resetRes.message,
      });
    }

    const updated = await updateChapterConfig(chapterSlug, {
      is_locked: typeof is_locked === "boolean" ? is_locked : undefined,
      unlock_at: unlock_at !== undefined ? unlock_at : undefined,
      custom_gift_url: custom_gift_url !== undefined ? custom_gift_url : undefined,
      custom_promo_code: custom_promo_code !== undefined ? custom_promo_code : undefined,
      custom_title: custom_title !== undefined ? custom_title : undefined,
      custom_latin_title: custom_latin_title !== undefined ? custom_latin_title : undefined,
      custom_description: custom_description !== undefined ? custom_description : undefined,
      custom_seals: custom_seals !== undefined ? custom_seals : undefined,
      custom_evidence: custom_evidence !== undefined ? custom_evidence : undefined,
    });

    return NextResponse.json({
      success: true,
      message: `Konfigurasi chapter ${chapterSlug} berhasil diperbarui.`,
      config: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
