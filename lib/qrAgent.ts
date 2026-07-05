import jsQR from "jsqr";
import sharp from "sharp";
import { analyzeWebsite } from "./websiteAgent";
import type { AgentAnalysis } from "./agents/types";

export interface QRAnalysisResult {
  destinationUrl: string;
  trustScore: number;
  riskLevel: AgentAnalysis["riskLevel"];
  explanation: string;
  recommendation: string;
  confidence: number;
  agentId: AgentAnalysis["agentId"];
}

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export async function analyzeQrCodeImage(file: File): Promise<QRAnalysisResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, info } = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  if (!code?.data) {
    throw new Error("No QR code could be decoded from the uploaded image.");
  }

  const destinationUrl = normalizeUrl(code.data);
  const websiteAnalysis = await analyzeWebsite(destinationUrl);

  return {
    destinationUrl,
    trustScore: websiteAnalysis.trustScore,
    riskLevel: websiteAnalysis.riskLevel,
    explanation: `Atlas decoded the QR payload and evaluated the destination site. ${websiteAnalysis.explanation}`,
    recommendation: websiteAnalysis.recommendation,
    confidence: websiteAnalysis.confidence,
    agentId: websiteAnalysis.agentId,
  };
}
