import { describe, expect, it } from "vitest";
import {
  computeTrustScore,
  mergeEvidence,
  riskLevelToVerdict,
  scoreToRiskLevel,
  trustToRiskScore,
} from "../trustEngine";
import type { AgentAnalysis } from "../agents/types";

function makeAnalysis(overrides: Partial<AgentAnalysis> = {}): AgentAnalysis {
  return {
    agentId: "general",
    agentName: "Test Agent",
    target: "test",
    trustScore: 70,
    confidence: 80,
    riskLevel: "caution",
    explanation: "",
    recommendation: "",
    evidence: [],
    checks: [],
    metadata: {},
    latencyMs: 0,
    ...overrides,
  };
}

describe("scoreToRiskLevel", () => {
  it("maps scores to the correct risk level across all boundaries", () => {
    expect(scoreToRiskLevel(100)).toBe("safe");
    expect(scoreToRiskLevel(80)).toBe("safe");
    expect(scoreToRiskLevel(79)).toBe("caution");
    expect(scoreToRiskLevel(60)).toBe("caution");
    expect(scoreToRiskLevel(59)).toBe("danger");
    expect(scoreToRiskLevel(35)).toBe("danger");
    expect(scoreToRiskLevel(34)).toBe("critical");
    expect(scoreToRiskLevel(0)).toBe("critical");
  });
});

describe("riskLevelToVerdict", () => {
  it("returns a distinct verdict string for every risk level", () => {
    const verdicts = [
      riskLevelToVerdict("safe"),
      riskLevelToVerdict("caution"),
      riskLevelToVerdict("danger"),
      riskLevelToVerdict("critical"),
    ];
    expect(new Set(verdicts).size).toBe(4);
    expect(riskLevelToVerdict("safe")).toMatch(/safe/i);
    expect(riskLevelToVerdict("critical")).toMatch(/block/i);
  });
});

describe("trustToRiskScore", () => {
  it("inverts the trust score", () => {
    expect(trustToRiskScore(100)).toBe(0);
    expect(trustToRiskScore(0)).toBe(100);
    expect(trustToRiskScore(70)).toBe(30);
  });

  it("clamps out-of-range inputs to 0..100", () => {
    expect(trustToRiskScore(150)).toBe(0);
    expect(trustToRiskScore(-50)).toBe(100);
  });
});

describe("computeTrustScore", () => {
  it("returns a neutral default when there are no analyses", () => {
    const result = computeTrustScore([]);
    expect(result.overall).toBe(50);
    expect(result.confidence).toBe(0);
    expect(result.riskLevel).toBe("caution");
    expect(result.breakdown.overall).toBe(50);
    expect(result.verdict).toMatch(/insufficient/i);
  });

  it("computes a confidence-weighted average for a single analysis", () => {
    const result = computeTrustScore([
      makeAnalysis({ agentId: "website", trustScore: 90, confidence: 100 }),
    ]);
    expect(result.overall).toBe(90);
    expect(result.confidence).toBe(100);
    expect(result.riskLevel).toBe("safe");
    expect(result.breakdown.website).toBe(90);
  });

  it("weights higher-confidence analyses more heavily", () => {
    const result = computeTrustScore([
      makeAnalysis({ agentId: "website", trustScore: 20, confidence: 100 }),
      makeAnalysis({ agentId: "email", trustScore: 90, confidence: 10 }),
    ]);
    // The high-confidence low score should dominate the weighted mean.
    expect(result.overall).toBeLessThan(55);
    expect(result.confidence).toBe(55);
  });

  it("respects per-agent weights (general is down-weighted)", () => {
    const result = computeTrustScore([
      makeAnalysis({ agentId: "website", trustScore: 100, confidence: 100 }),
      makeAnalysis({ agentId: "general", trustScore: 0, confidence: 100 }),
    ]);
    // website weight 1.0 vs general 0.8 -> mean skewed above 50
    expect(result.overall).toBeGreaterThan(50);
  });

  it("honors an explicit metadata weight", () => {
    const result = computeTrustScore([
      makeAnalysis({ agentId: "website", trustScore: 100, confidence: 100, metadata: { weight: 3 } }),
      makeAnalysis({ agentId: "email", trustScore: 0, confidence: 100, metadata: { weight: 1 } }),
    ]);
    expect(result.overall).toBe(75);
  });

  it("records website and email scores in the breakdown", () => {
    const result = computeTrustScore([
      makeAnalysis({ agentId: "website", trustScore: 40, confidence: 90 }),
      makeAnalysis({ agentId: "email", trustScore: 60, confidence: 90 }),
    ]);
    expect(result.breakdown.website).toBe(40);
    expect(result.breakdown.email).toBe(60);
    expect(result.breakdown.overall).toBe(result.overall);
  });

  it("only tracks preexisting breakdown keys, so other vectors are not recorded", () => {
    const result = computeTrustScore([
      makeAnalysis({ agentId: "general", trustScore: 40, confidence: 90, metadata: { vectorKey: "network" } }),
    ]);
    expect(result.breakdown.network).toBeUndefined();
    expect(result.breakdown.overall).toBe(40);
  });

  it("falls back to a neutral overall when all weights are zero", () => {
    const result = computeTrustScore([
      makeAnalysis({ trustScore: 90, confidence: 0 }),
    ]);
    expect(result.overall).toBe(50);
  });
});

describe("mergeEvidence", () => {
  it("deduplicates evidence while preserving order", () => {
    const merged = mergeEvidence([
      makeAnalysis({ evidence: ["a", "b"] }),
      makeAnalysis({ evidence: ["b", "c"] }),
    ]);
    expect(merged).toEqual(["a", "b", "c"]);
  });

  it("caps the merged list at 8 items", () => {
    const merged = mergeEvidence([
      makeAnalysis({ evidence: ["1", "2", "3", "4", "5"] }),
      makeAnalysis({ evidence: ["6", "7", "8", "9", "10"] }),
    ]);
    expect(merged).toHaveLength(8);
    expect(merged).not.toContain("9");
  });

  it("returns an empty array when there is no evidence", () => {
    expect(mergeEvidence([])).toEqual([]);
  });
});
