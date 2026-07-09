import { NextRequest, NextResponse } from "next/server";
import { analyzeQrCodeImage } from "@/lib/qrAgent";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
  isUploadValidationError,
  validateUploadedFile,
} from "@/lib/upload-validation";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const validation = validateUploadedFile(
      formData.get("file"),
      "image containing a QR code",
      {
        maxBytes: MAX_IMAGE_UPLOAD_BYTES,
        allowedTypes: ALLOWED_IMAGE_TYPES,
      }
    );

    if (isUploadValidationError(validation)) {
      return NextResponse.json({ error: validation.message }, { status: validation.status });
    }

    const result = await analyzeQrCodeImage(validation.file);
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
