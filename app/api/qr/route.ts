import { NextRequest, NextResponse } from "next/server";
import { analyzeQrCodeImage } from "@/lib/qrAgent";
import { getUploadedFile, jsonError } from "@/lib/api/http";

export async function POST(request: NextRequest) {
  try {
    const file = await getUploadedFile(request);
    if (!file) {
      return NextResponse.json({ error: "Please upload an image containing a QR code." }, { status: 400 });
    }

    const result = await analyzeQrCodeImage(file);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return jsonError(error, "QR analysis failed.");
  }
}
