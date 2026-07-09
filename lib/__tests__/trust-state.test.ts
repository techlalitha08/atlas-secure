import { describe, expect, it } from "vitest";
import {
  applyAgentScan,
  applyWebsiteScan,
  buildDefaultAnalyses,
  createVectorAnalysis,
  formatScanTime,
  loadPersistedTrust,
  persistTrust,
  recalculateTrust,
  scoreToScanStatus,
} from "../trust-state";
import type { AgentAnalysis } from "../agents/types";

describe("createVectorAnalysis", () => {
  it("maps known vector keys to their agent id", () => {
    expect(createVectorAnalysis("website", "Website Agent", 90).agentId).toBe("website");
    expect(createVectorAnalysis("email", "Email Agent", 90).agentId).toBe("email");
    expect(createVectorAnalysis("network", "Network Agent", 90).agentId).toBe("general");
  });

  it("derives the risk level from the score and stores the vector key", () => {
    const analysis = createVectorAnalysis("network", "Network Agent", 30);
    expect(analysis.riskLevel).toBe("critical");
    expect(analysis.metadata.vectorKey).toBe("network");
    expect(analysis.confidence).toBe(85);
  });

  it("accepts a custom confidence", () => {
    expect(createVectorAnalysis("device", "Device", 80, 99).confidence).toBe(99);
  });
});

describe("buildDefaultAnalyses", () => {
  it("returns the five default vectors with vector keys", () => {
    const analyses = buildDefaultAnalyses();
    expect(analyses).toHaveLength(5);
    expect(analyses.map((a) => a.metadata.vectorKey)).toEqual([
      "website",
      "email",
      "device",
      "network",
      "privacy",
    ]);
  });

  it("uses a provided website analysis for the website vector", () => {
    const custom = createVectorAnalysis("website", "Custom", 12);
    const analyses = buildDefaultAnalyses(custom);
    expect(analyses[0].trustScore).toBe(12);
    expect(analyses[0].metadata.vectorKey).toBe("website");
  });
});

describe("applyAgentScan", () => {
  const base = buildDefaultAnalyses();

  it("replaces the matching vector and puts the scan first", () => {
    const scan = createVectorAnalysis("website", "Website Agent", 20);
    const updated = applyAgentScan(base, scan);
    expect(updated[0]).toBe(scan);
    expect(updated.filter((a) => a.metadata.vectorKey === "website")).toHaveLength(1);
    expect(updated).toHaveLength(base.length);
  });

  it("also drops entries that share the scan's agent id (general vectors collapse)", () => {
    // "network" maps to the shared "general" agent id, so all general-backed
    // default vectors (device, network, privacy) are replaced by the single scan.
    const scan = createVectorAnalysis("network", "Network Agent", 20);
    const updated = applyAgentScan(base, scan);
    expect(updated[0]).toBe(scan);
    expect(updated.map((a) => a.metadata.vectorKey)).toEqual(["network", "website", "email"]);
  });

  it("returns the analyses unchanged when the scan has no vector key", () => {
    const scan: AgentAnalysis = { ...createVectorAnalysis("network", "n", 20), metadata: {} };
    expect(applyAgentScan(base, scan)).toBe(base);
  });
});

describe("applyWebsiteScan", () => {
  it("forces the website vector key and dedupes existing website entries", () => {
    const base = buildDefaultAnalyses();
    const scan = createVectorAnalysis("website", "Website Agent", 40);
    const updated = applyWebsiteScan(base, scan);
    expect(updated[0].metadata.vectorKey).toBe("website");
    expect(updated.filter((a) => a.metadata.vectorKey === "website")).toHaveLength(1);
  });
});

describe("recalculateTrust", () => {
  it("delegates to computeTrustScore and returns an overall score", () => {
    const result = recalculateTrust(buildDefaultAnalyses());
    expect(result.overall).toBeGreaterThan(0);
    expect(result.overall).toBeLessThanOrEqual(100);
    expect(result.breakdown.overall).toBe(result.overall);
  });
});

describe("scoreToScanStatus", () => {
  it("maps scores to status buckets", () => {
    expect(scoreToScanStatus(90)).toBe("success");
    expect(scoreToScanStatus(80)).toBe("success");
    expect(scoreToScanStatus(65)).toBe("warning");
    expect(scoreToScanStatus(50)).toBe("warning");
    expect(scoreToScanStatus(30)).toBe("danger");
  });
});

describe("formatScanTime", () => {
  it("formats a date as an hour:minute string", () => {
    const formatted = formatScanTime(new Date("2024-01-01T13:45:00"));
    expect(formatted).toMatch(/\d{1,2}:\d{2}/);
  });

  it("uses the current time by default", () => {
    expect(typeof formatScanTime()).toBe("string");
  });
});

describe("persistence in a non-browser environment", () => {
  it("loadPersistedTrust returns null when window is undefined", () => {
    expect(loadPersistedTrust()).toBeNull();
  });

  it("persistTrust is a no-op that does not throw", () => {
    expect(() => persistTrust({ websiteAnalysis: null, recentScans: [] })).not.toThrow();
  });
});
