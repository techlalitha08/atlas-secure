import { trustScore as mockTrust } from "@/data/mock-data";
import { computeTrustScore, scoreToRiskLevel } from "./trustEngine";
import type { AgentAnalysis, RiskLevel, TrustScoreResult } from "./agents/types";

export interface WebsiteScanRecord {
  id: string;
  target: string;
  score: number;
  status: "success" | "warning" | "danger";
  time: string;
}

const STORAGE_KEY = "atlas-trust-state";

export function createVectorAnalysis(
  vectorKey: string,
  agentName: string,
  score: number,
  confidence = 85
): AgentAnalysis {
  const riskLevel: RiskLevel = scoreToRiskLevel(score);
  return {
    agentId:
      vectorKey === "website" ? "website" : vectorKey === "email" ? "email" : "general",
    agentName,
    target: vectorKey,
    trustScore: score,
    confidence,
    riskLevel,
    explanation: "",
    recommendation: "",
    evidence: [],
    checks: [],
    metadata: { vectorKey },
    latencyMs: 0,
  };
}

export function buildDefaultAnalyses(websiteAnalysis?: AgentAnalysis): AgentAnalysis[] {
  const website =
    websiteAnalysis ??
    createVectorAnalysis("website", "Website Agent", mockTrust.website, 90);

  return [
    { ...website, metadata: { ...website.metadata, vectorKey: "website" } },
    createVectorAnalysis("email", "Email Agent", mockTrust.email, 88),
    createVectorAnalysis("device", "Device Health", mockTrust.device, 95),
    createVectorAnalysis("network", "Network Agent", mockTrust.network, 85),
    createVectorAnalysis("privacy", "Privacy Agent", mockTrust.privacy, 90),
  ];
}

export function applyAgentScan(analyses: AgentAnalysis[], scan: AgentAnalysis): AgentAnalysis[] {
  const vectorKey = scan.metadata.vectorKey as string | undefined;
  if (!vectorKey) {
    return analyses;
  }

  const withoutVector = analyses.filter((analysis) => {
    const currentVector = analysis.metadata.vectorKey as string | undefined;
    return currentVector !== vectorKey && analysis.agentId !== scan.agentId;
  });

  return [scan, ...withoutVector];
}

export function recalculateTrust(analyses: AgentAnalysis[]): TrustScoreResult {
  return computeTrustScore(analyses);
}

export function scoreToScanStatus(score: number): WebsiteScanRecord["status"] {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "danger";
}

export function formatScanTime(date = new Date()): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export interface PersistedTrustState {
  websiteAnalysis: AgentAnalysis | null;
  recentScans: WebsiteScanRecord[];
}

export function loadPersistedTrust(): PersistedTrustState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedTrustState) : null;
  } catch {
    return null;
  }
}

export function persistTrust(state: PersistedTrustState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

export function applyWebsiteScan(
  analyses: AgentAnalysis[],
  scan: AgentAnalysis
): AgentAnalysis[] {
  const updated = { ...scan, metadata: { ...scan.metadata, vectorKey: "website" } };
  const withoutWebsite = analyses.filter(
    (a) => a.metadata.vectorKey !== "website" && a.agentId !== "website"
  );
  return [updated, ...withoutWebsite];
}
