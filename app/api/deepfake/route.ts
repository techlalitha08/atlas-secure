import { NextRequest, NextResponse } from "next/server";
import { runDeepfakeInference } from "@/lib/deepfake/inference";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
  isUploadValidationError,
  validateUploadedFile,
} from "@/lib/upload-validation";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const validation = validateUploadedFile(formData.get("file"), "image file", {
      maxBytes: MAX_IMAGE_UPLOAD_BYTES,
      allowedTypes: ALLOWED_IMAGE_TYPES,
    });

    if (isUploadValidationError(validation)) {
      return NextResponse.json({ error: validation.message }, { status: validation.status });
    }

    const file = validation.file;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await runDeepfakeInference(buffer);

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Deepfake inference error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Deepfake inference failed.",
      },
      { status: 500 }
    );
  }
}
