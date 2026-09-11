import { NextResponse } from "next/server";
import { getChapterConfigs } from "@/lib/db";

export async function GET() {
  try {
    const configs = await getChapterConfigs();
    return NextResponse.json({
      success: true,
      configs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
