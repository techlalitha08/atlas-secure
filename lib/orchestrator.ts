import { analyzeWebsite } from "./websiteAgent";
import { analyzeQrCodeImage } from "./qrAgent";
import { analyzeMalwareFile, toMalwareAgentAnalysis } from "./malwareAgent";
import { runDeepfakeInference } from "./deepfake/inference";
import { scoreToRiskLevel } from "./trustEngine";
import type { AgentAnalysis } from "./agents/types";

export interface AtlasOrchestrationRequest {
  prompt: string;
  file?: File | null;
  mode?: "website" | "chat" | "malware" | "deepfake" | "qr";
}

function looksLikeWebsiteRequest(input: string): boolean {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return false;
  if (/^https?:\/\//i.test(normalized)) return true;
  if (/\b(?:www\.)?[a-z0-9-]+\.(?:com|net|org|io|dev|co|ai|app|info|biz|edu|gov|mil)\b/i.test(normalized)) {
    return true;
  }
  return /\b(website|url|domain|site|scan)\b/i.test(normalized);
}

function looksLikeQrRequest(input: string): boolean {
  return /\b(qr|barcode)\b/i.test(input);
}

function looksLikeDeepfakeRequest(input: string): boolean {
  return /\b(deepfake|face|image|fake|synthetic)\b/i.test(input);
}

function looksLikeMalwareRequest(input: string): boolean {
  return /\b(malware|virus|infected|sample|file analysis|hash)\b/i.test(input);
}

export async function orchestrateAtlasRequest(request: AtlasOrchestrationRequest): Promise<{
  analysis: AgentAnalysis;
  message: string;
  agentId: AgentAnalysis["agentId"];
}> {
  const prompt = request.prompt?.trim() ?? "";
  const mode = request.mode ?? "chat";

  if (mode === "website" || looksLikeWebsiteRequest(prompt)) {
    const analysis = await analyzeWebsite(prompt);
    return {
      analysis,
      message: analysis.explanation,
      agentId: analysis.agentId,
    };
  }

  if (request.file) {
    if (looksLikeMalwareRequest(prompt) || request.mode === "malware") {
      const malwareResult = await analyzeMalwareFile(request.file);
      const analysis = toMalwareAgentAnalysis(request.file.name, malwareResult);
      return {
        analysis,
        message: analysis.explanation,
        agentId: analysis.agentId,
      };
    }

    if (looksLikeQrRequest(prompt) || request.mode === "qr") {
      const qrResult = await analyzeQrCodeImage(request.file);
      const analysis: AgentAnalysis = {
        agentId: "qr",
        agentName: "QR Security Agent",
        target: request.file.name,
        trustScore: qrResult.trustScore,
        confidence: qrResult.confidence,
        riskLevel: scoreToRiskLevel(qrResult.trustScore),
        explanation: qrResult.explanation,
        recommendation: qrResult.recommendation,
        evidence: [`Destination: ${qrResult.destinationUrl}`],
        checks: [],
        metadata: { vectorKey: "qr", source: "qr" },
        latencyMs: 0,
      };
      return {
        analysis,
        message: analysis.explanation,
        agentId: analysis.agentId,
      };
    }

    if (looksLikeDeepfakeRequest(prompt) || request.mode === "deepfake") {
      const buffer = Buffer.from(await request.file.arrayBuffer());
      const deepfake = await runDeepfakeInference(buffer);
      const analysis: AgentAnalysis = {
        agentId: "deepfake",
        agentName: "Deepfake Detection Agent",
        target: request.file.name,
        trustScore: 100 - deepfake.fakeProbability,
        confidence: deepfake.confidenceScore,
        riskLevel: scoreToRiskLevel(100 - deepfake.fakeProbability),
        explanation: deepfake.explanation,
        recommendation: deepfake.recommendation,
        evidence: [`Model: ${deepfake.modelId}`],
        checks: [],
        metadata: { vectorKey: "deepfake", source: "huggingface" },
        latencyMs: 0,
      };
      return {
        analysis,
        message: analysis.explanation,
        agentId: analysis.agentId,
      };
    }
  }

  const analysis: AgentAnalysis = {
    agentId: "general",
    agentName: "Atlas Orchestrator",
    target: prompt || "general",
    trustScore: 70,
    confidence: 78,
    riskLevel: "caution",
    explanation: "Atlas routed this request to the most relevant specialist agent and synthesized the response.",
    recommendation: "Use the dedicated agent page for deeper analysis when available.",
    evidence: ["Atlas delegated to the appropriate specialist agent."],
    checks: [],
    metadata: { vectorKey: "general", routed: true },
    latencyMs: 0,
  };

  return {
    analysis,
    message: analysis.explanation,
    agentId: analysis.agentId,
  };
}
