import type { AgentAnalysis, RiskLevel, TrustBreakdown, TrustScoreResult } from "./agents/types";

const AGENT_WEIGHTS: Record<string, number> = {
  website: 1.0,
  email: 1.0,
  general: 0.8,
};

function clamp(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "safe";
  if (score >= 60) return "caution";
  if (score >= 35) return "danger";
  return "critical";
}

export function riskLevelToVerdict(level: RiskLevel): string {
  switch (level) {
    case "safe":
      return "Trusted — safe to proceed";
    case "caution":
      return "Exercise caution — review findings before acting";
    case "danger":
      return "High risk — avoid interaction until verified";
    case "critical":
      return "Critical threat — block immediately";
  }
}

export function trustToRiskScore(trustScore: number): number {
  return clamp(100 - trustScore);
}

/**
 * Combines one or more agent analyses into a unified trust score.
 * Uses confidence-weighted averaging so high-certainty agents carry more weight.
 */
export function computeTrustScore(analyses: AgentAnalysis[]): TrustScoreResult {
  if (analyses.length === 0) {
    return {
      overall: 50,
      breakdown: { overall: 50 },
      confidence: 0,
      riskLevel: "caution",
      verdict: "Insufficient data — manual review recommended",
    };
  }

  let weightedSum = 0;
  let weightTotal = 0;
  let confidenceSum = 0;

  const breakdown: TrustBreakdown = { overall: 0 };

  for (const analysis of analyses) {
    const agentWeight = AGENT_WEIGHTS[analysis.agentId] ?? 1;
    const vectorWeight =
      typeof analysis.metadata.weight === "number" ? analysis.metadata.weight : 1;
    const weight = (analysis.confidence / 100) * agentWeight * vectorWeight;
    weightedSum += analysis.trustScore * weight;
    weightTotal += weight;
    confidenceSum += analysis.confidence;

    const vectorKey = analysis.metadata.vectorKey as string | undefined;
    if (vectorKey && vectorKey in breakdown) {
      const breakdownWithIndex = breakdown as Record<string, number | undefined>;
      breakdownWithIndex[vectorKey] = analysis.trustScore;
    } else if (analysis.agentId === "website") {
      breakdown.website = analysis.trustScore;
    } else if (analysis.agentId === "email") {
      breakdown.email = analysis.trustScore;
    }
  }

  const overall = clamp(weightTotal > 0 ? weightedSum / weightTotal : 50);
  const confidence = clamp(confidenceSum / analyses.length);
  const riskLevel = scoreToRiskLevel(overall);

  breakdown.overall = overall;

  return {
    overall,
    breakdown,
    confidence,
    riskLevel,
    verdict: riskLevelToVerdict(riskLevel),
  };
}

/** Merge evidence from multiple agents, deduplicated, capped at 8 items */
export function mergeEvidence(analyses: AgentAnalysis[]): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];

  for (const analysis of analyses) {
    for (const item of analysis.evidence) {
      if (!seen.has(item)) {
        seen.add(item);
        merged.push(item);
      }
    }
  }

  return merged.slice(0, 8);
}
