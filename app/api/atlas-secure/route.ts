import { NextRequest, NextResponse } from "next/server";
import { orchestrateAtlasRequest } from "@/lib/orchestrator";
import type { AgentAnalysis } from "@/lib/agents/types";

type AtlasSecureRequestBody = {
  prompt?: string;
  message?: string;
  model?: string;
  systemInstruction?: string;
  mode?: "website" | "chat" | "malware" | "deepfake" | "qr";
};

function toAtlasResponse(analysis: AgentAnalysis) {
  return {
    ok: true,
    message: analysis.explanation,
    agentId: analysis.agentId,
    analysis,
    text: analysis.explanation,
    responseType: analysis.agentId as "website" | "general" | "malware" | "deepfake" | "qr",
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Atlas Secure API route is ready.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as AtlasSecureRequestBody;
    const prompt = body.prompt ?? body.message;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "A prompt or message field is required." },
        { status: 400 }
      );
    }

    const requestFile = body.mode === "malware" || body.mode === "deepfake" || body.mode === "qr"
      ? null
      : null;

    const orchestration = await orchestrateAtlasRequest({
      prompt,
      file: requestFile,
      mode: body.mode,
    });

    return NextResponse.json(toAtlasResponse(orchestration.analysis));
  } catch (error) {
    console.error("Atlas Secure API route error:", error);
    return NextResponse.json(
      {
        error: "Unexpected server error while contacting Atlas.",
      },
      { status: 500 }
    );
  }
}
