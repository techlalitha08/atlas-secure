import { NextRequest, NextResponse } from "next/server";
import { runDeepfakeInference } from "@/lib/deepfake/inference";
import { getUploadedFile, jsonError } from "@/lib/api/http";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const file = await getUploadedFile(request);
    if (!file) {
      return NextResponse.json({ error: "Please upload an image file." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await runDeepfakeInference(buffer);

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return jsonError(error, "Deepfake inference failed.");
  }
}
