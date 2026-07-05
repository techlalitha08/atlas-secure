export type AgentId = "website" | "email" | "general" | "malware" | "deepfake" | "qr";

export type RiskLevel = "safe" | "caution" | "danger" | "critical";

export type CheckStatus = "pass" | "warning" | "danger";

export interface SecurityCheck {
  name: string;
  status: CheckStatus;
  detail: string;
}

export interface AgentAnalysis {
  agentId: AgentId;
  agentName: string;
  target: string;
  /** 0–100 — higher means more trustworthy */
  trustScore: number;
  confidence: number;
  riskLevel: RiskLevel;
  explanation: string;
  recommendation: string;
  evidence: string[];
  checks: SecurityCheck[];
  metadata: Record<string, string | number | boolean>;
  latencyMs: number;
}

export interface TrustBreakdown {
  [key: string]: number | undefined;
  website?: number;
  email?: number;
  device?: number;
  network?: number;
  privacy?: number;
  overall: number;
}

export interface TrustScoreResult {
  overall: number;
  breakdown: TrustBreakdown;
  confidence: number;
  riskLevel: RiskLevel;
  verdict: string;
}

export interface AtlasResponse {
  message: string;
  agentId: AgentId;
  analysis: {
    trustScore: number;
    riskScore: number;
    confidence: number;
    explanation: string;
    recommendation: string;
    evidence: string[];
  };
  trust: TrustScoreResult;
  raw: AgentAnalysis;
}
