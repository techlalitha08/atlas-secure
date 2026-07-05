import { NextRequest, NextResponse } from "next/server";
import { analyzeQrCodeImage } from "@/lib/qrAgent";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Please upload an image containing a QR code." }, { status: 400 });
    }

    const result = await analyzeQrCodeImage(file as File);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("QR analysis failed", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "QR analysis failed.",
      },
      { status: 500 }
    );
  }
}
