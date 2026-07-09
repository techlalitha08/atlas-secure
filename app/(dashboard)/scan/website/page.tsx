"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Search,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Calendar,
  Activity,
  Sparkles,
} from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrustGauge } from "@/components/atlas/trust-gauge";
import { ScanProgress } from "@/components/atlas/scan-progress";
import { useTrust } from "@/lib/trust-context";
import type { AgentAnalysis } from "@/lib/agents/types";
import { useScanSteps } from "@/lib/hooks/useScanSteps";
import { cn, getTrustColor, riskLevelToBadgeVariant, riskLevelToLabel } from "@/lib/utils";

const scanSteps = [
  "Resolving DNS records",
  "Analyzing SSL certificate",
  "Checking domain reputation",
  "Scanning for redirects",
  "Running AI behavioral analysis",
  "Computing trust score",
];

function formatDomainAge(days: number): string {
  if (days < 30) return `${days} day${days === 1 ? "" : "s"}`;
  if (days < 365) return `${Math.round(days / 30)} month${Math.round(days / 30) === 1 ? "" : "s"}`;
  const years = Math.round(days / 365);
  return `${years} year${years === 1 ? "" : "s"}`;
}

function getSslStatus(result: AgentAnalysis): string {
  const sslCheck = result.checks.find((c) => c.name === "SSL Certificate");
  const grade = result.metadata.sslGrade;
  const ev = result.metadata.sslEv ? "EV" : "No EV";
  if (sslCheck) return `${sslCheck.detail} · Grade ${grade} · ${ev}`;
  return result.metadata.sslValid ? `Valid · Grade ${grade}` : "Invalid";
}

export default function WebsiteScannerPage() {
  const { recordWebsiteScan, trust } = useTrust();
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<AgentAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentStep, start, finish } = useScanSteps(scanSteps.length, { intervalMs: 500 });

  const startScan = async () => {
    if (!url.trim() || scanning) return;

    setScanning(true);
    setResult(null);
    setError(null);
    start();

    try {
      const response = await fetch("/api/atlas-secure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: url,
          mode: "website",
          systemInstruction:
            "You are Atlas Website Agent. Analyze the URL, return a detailed website trust assessment, and focus on trust, risk, and actionable recommendations.",
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; analysis?: AgentAnalysis; error?: string }
        | null;

      if (!response.ok || !data?.ok || !data.analysis) {
        throw new Error(data?.error ?? "Atlas could not analyze that website right now.");
      }

      const analysis = data.analysis;
      finish();
      await new Promise((r) => setTimeout(r, 400));
      setResult(analysis);
      recordWebsiteScan(analysis);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Atlas could not analyze that website right now.";
      setError(message);
    } finally {
      finish();
      setScanning(false);
    }
  };

  return (
    <div>
      <TopNavbar title="Website Scanner" subtitle="Analyze any URL for trust and security" />
      <main className="p-6 space-y-6 max-w-4xl mx-auto">
        <Card className="gradient-border">
          <CardContent className="!pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  placeholder="Paste URL to analyze... e.g. checkout-secure.net"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-14 pl-12 text-base"
                  onKeyDown={(e) => e.key === "Enter" && startScan()}
                  disabled={scanning}
                />
              </div>
              <Button onClick={startScan} size="lg" className="h-14 px-8" disabled={scanning || !url.trim()}>
                <Search className="h-5 w-5" />
                {scanning ? "Analyzing..." : "Analyze"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="!py-4">
              <p className="text-sm text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        <AnimatePresence mode="wait">
          {scanning && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="!py-10">
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                      <motion.div
                        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl"
                      />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/30">
                        <Globe className="h-10 w-10 text-cyan-400" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-white">Website Agent is analyzing</p>
                    <p className="text-xs text-zinc-500 mt-1 font-mono truncate max-w-xs">
                      {url.replace(/^https?:\/\//i, "")}
                    </p>
                  </div>
                  <ScanProgress steps={scanSteps} currentStep={currentStep} isScanning={scanning} />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {result && !scanning && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl px-4 py-3 border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-cyan-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Overall Trust Score updated</p>
                    <p className="text-xs text-zinc-500">Trust Engine recalculated across all vectors</p>
                  </div>
                </div>
                <p className={cn("text-2xl font-bold tabular-nums shrink-0", getTrustColor(trust.overall))}>
                  {trust.overall}
                </p>
              </motion.div>

              {/* Trust Score + target */}
              <Card className="gradient-border">
                <CardContent className="!py-8">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <TrustGauge score={result.trustScore} size="lg" label="Trust Score" />
                    <div className="flex-1 text-center md:text-left space-y-2">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider">Analyzed URL</p>
                      <p className="text-lg font-mono text-white break-all">{result.target}</p>
                      <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-1">
                        <Badge variant={riskLevelToBadgeVariant(result.riskLevel)}>
                          {riskLevelToLabel(result.riskLevel)}
                        </Badge>
                        <Badge variant="info">{result.confidence}% confidence</Badge>
                        <Badge variant="outline">{result.agentName}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key metrics from agent metadata */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "SSL Status",
                    value: getSslStatus(result),
                    icon: Lock,
                    color: result.metadata.sslValid ? "text-emerald-400" : "text-red-400",
                  },
                  {
                    label: "Domain Age",
                    value: formatDomainAge(Number(result.metadata.domainAgeDays)),
                    icon: Calendar,
                    color: Number(result.metadata.domainAgeDays) < 30 ? "text-red-400" : "text-white",
                  },
                  {
                    label: "Reputation",
                    value: String(result.metadata.reputation),
                    icon: Activity,
                    color:
                      result.metadata.reputation === "Clean"
                        ? "text-emerald-400"
                        : result.metadata.reputation === "Suspicious"
                          ? "text-amber-400"
                          : "text-red-400",
                  },
                  {
                    label: "Risk Level",
                    value: riskLevelToLabel(result.riskLevel),
                    icon: AlertTriangle,
                    color:
                      result.riskLevel === "safe"
                        ? "text-emerald-400"
                        : result.riskLevel === "caution"
                          ? "text-amber-400"
                          : "text-red-400",
                  },
                ].map((metric, i) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card className="!p-4 h-full">
                      <metric.icon className={cn("h-4 w-4 mb-3", metric.color)} />
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{metric.label}</p>
                      <p className={cn("text-sm font-semibold mt-1 leading-snug", metric.color)}>
                        {metric.value}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Recommendation */}
              <Card className="border-emerald-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-300 leading-relaxed">{result.recommendation}</p>
                </CardContent>
              </Card>

              {/* AI Explanation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Sparkles className="h-5 w-5 text-violet-400" />
                    AI Explanation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-zinc-300 leading-relaxed">{result.explanation}</p>
                </CardContent>
              </Card>

              {/* Security checks detail */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="h-5 w-5 text-cyan-400" />
                    Full Security Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.checks.map((check) => (
                    <div
                      key={check.name}
                      className="flex items-center justify-between rounded-xl p-3 bg-white/[0.02]"
                    >
                      <span className="text-sm text-white">{check.name}</span>
                      <span
                        className={cn(
                          "text-xs",
                          check.status === "pass" && "text-emerald-400",
                          check.status === "warning" && "text-amber-400",
                          check.status === "danger" && "text-red-400"
                        )}
                      >
                        {check.detail}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!scanning && !result && (
          <div className="text-center py-16">
            <Globe className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">Enter a URL above to begin trust analysis</p>
            <p className="text-xs text-zinc-600 mt-2">
              Try <span className="text-zinc-400 font-mono">checkout-secure.net</span> or{" "}
              <span className="text-zinc-400 font-mono">github.com</span>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
