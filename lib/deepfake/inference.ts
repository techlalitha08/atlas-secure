import { HfInference } from "@huggingface/inference";

const HF_TOKEN = process.env.HF_TOKEN;
const MODEL_ID = process.env.DEEPFAKE_MODEL_ID ?? "aifaishr/deepfake-detection";

const hf = HF_TOKEN ? new HfInference(HF_TOKEN) : null;

export interface DeepfakeInferenceResult {
  fakeProbability: number;
  realProbability: number;
  confidenceScore: number;
  explanation: string;
  recommendation: string;
  modelId: string;
}

function normalizeProbability(value: number | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value * 100)));
}

function inferRecommendation(fakeProbability: number): string {
  if (fakeProbability >= 80) {
    return "Treat this image as highly suspicious. Avoid trusting it for identity verification or sensitive communications.";
  }
  if (fakeProbability >= 50) {
    return "The image shows mixed signals. Review it carefully before relying on it for authentication or evidence.";
  }
  return "The image appears authentic based on the current model output. Continue normal verification practices.";
}

function buildExplanation(fakeProbability: number, realProbability: number): string {
  if (fakeProbability >= 80) {
    return "The model assigned a high likelihood that the image was synthesized or manipulated, with strong evidence from the pretrained detector's output.";
  }
  if (fakeProbability >= 50) {
    return "The model found a meaningful mix of authentic and synthetic cues, so the sample should be treated as uncertain.";
  }
  return "The model assigned a stronger likelihood that the image is authentic, though image provenance and context should still be validated.";
}

export async function runDeepfakeInference(imageBuffer: Buffer): Promise<DeepfakeInferenceResult> {
  if (!hf) {
    throw new Error("HF_TOKEN is not configured. Set it in your environment before running inference.");
  }

  const output = await hf.imageClassification({
    data: imageBuffer.buffer.slice(imageBuffer.byteOffset, imageBuffer.byteOffset + imageBuffer.byteLength) as ArrayBuffer,
    model: MODEL_ID,
  });

  const first = Array.isArray(output) ? output[0] : output;
  if (!first || typeof first.label !== "string" || typeof first.score !== "number") {
    throw new Error("The deepfake model returned no usable classification for this image.");
  }

  const label = first.label.toLowerCase();
  const score = first.score;

  const fakeProbability = label.includes("fake") || label.includes("manip") || label.includes("synth")
    ? normalizeProbability(score)
    : normalizeProbability(Math.max(0, 1 - score));
  const realProbability = 100 - fakeProbability;
  const confidenceScore = Math.max(60, Math.min(99, Math.round((Math.max(fakeProbability, realProbability) / 100) * 100)));

  return {
    fakeProbability,
    realProbability,
    confidenceScore,
    explanation: buildExplanation(fakeProbability, realProbability),
    recommendation: inferRecommendation(fakeProbability),
    modelId: MODEL_ID,
  };
}
