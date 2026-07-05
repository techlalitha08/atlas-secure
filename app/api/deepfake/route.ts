import { NextRequest, NextResponse } from "next/server";
import { runDeepfakeInference } from "@/lib/deepfake/inference";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Please upload an image file." }, { status: 400 });
    }

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
