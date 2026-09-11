import crypto from "crypto";

export function hashCipher(cipher: string): string {
  return crypto.createHash("sha256").update(cipher.trim().toUpperCase()).digest("hex");
}

export function generateVoucherClaimUrl(chapterSlug: string, promoCode: string): string {
  const secretKey = process.env.VOUCHER_SECRET_KEY || "SeekerSaga_Occult_Secret_2026";
  const timestamp = Date.now();
  const token = crypto
    .createHash("sha256")
    .update(`${chapterSlug}-${promoCode}-${timestamp}-${secretKey}`)
    .digest("hex")
    .substring(0, 32);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seekersaga.vercel.app";
  return `${baseUrl}/claim-voucher?chapter=${chapterSlug}&code=${promoCode}&token=${token}&ts=${timestamp}`;
}
