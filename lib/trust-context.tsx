"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AgentAnalysis, TrustScoreResult } from "./agents/types";
import {
  applyAgentScan,
  applyWebsiteScan,
  buildDefaultAnalyses,
  formatScanTime,
  loadPersistedTrust,
  persistTrust,
  recalculateTrust,
  scoreToScanStatus,
  type WebsiteScanRecord,
} from "./trust-state";

interface TrustContextValue {
  trust: TrustScoreResult;
  analyses: AgentAnalysis[];
  websiteTrust: number;
  recentScans: WebsiteScanRecord[];
  lastWebsiteScan: AgentAnalysis | null;
  recordWebsiteScan: (analysis: AgentAnalysis) => void;
}

const TrustContext = createContext<TrustContextValue | null>(null);

export function TrustProvider({ children }: { children: React.ReactNode }) {
  const [analyses, setAnalyses] = useState<AgentAnalysis[]>(() => buildDefaultAnalyses());
  const [recentScans, setRecentScans] = useState<WebsiteScanRecord[]>([]);
  const [lastWebsiteScan, setLastWebsiteScan] = useState<AgentAnalysis | null>(null);

  useEffect(() => {
    const saved = loadPersistedTrust();
    if (saved?.websiteAnalysis) {
      setAnalyses(buildDefaultAnalyses(saved.websiteAnalysis));
      setLastWebsiteScan(saved.websiteAnalysis);
    }
    if (saved?.recentScans?.length) {
      setRecentScans(saved.recentScans);
    }
  }, []);

  const trust = useMemo(() => recalculateTrust(analyses), [analyses]);

  const websiteTrust =
    trust.breakdown.website ??
    analyses.find((a) => a.metadata.vectorKey === "website" || a.agentId === "website")
      ?.trustScore ??
    0;

  const recordWebsiteScan = useCallback((analysis: AgentAnalysis) => {
    const websiteAnalysis = {
      ...analysis,
      metadata: { ...analysis.metadata, vectorKey: "website" },
    };

    const newScan: WebsiteScanRecord = {
      id: crypto.randomUUID(),
      target: analysis.target,
      score: analysis.trustScore,
      status: scoreToScanStatus(analysis.trustScore),
      time: formatScanTime(),
    };

    setLastWebsiteScan(websiteAnalysis);
    setAnalyses((prev) => applyAgentScan(prev, analysis));
    setRecentScans((prev) => {
      const next = [newScan, ...prev].slice(0, 8);
      persistTrust({ websiteAnalysis, recentScans: next });
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      trust,
      analyses,
      websiteTrust,
      recentScans,
      lastWebsiteScan,
      recordWebsiteScan,
    }),
    [trust, analyses, websiteTrust, recentScans, lastWebsiteScan, recordWebsiteScan]
  );

  return <TrustContext.Provider value={value}>{children}</TrustContext.Provider>;
}

export function useTrust(): TrustContextValue {
  const ctx = useContext(TrustContext);
  if (!ctx) {
    throw new Error("useTrust must be used within TrustProvider");
  }
  return ctx;
}
