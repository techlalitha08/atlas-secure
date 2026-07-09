"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Search, AlertTriangle, User } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrustGauge } from "@/components/atlas/trust-gauge";
import { ScanProgress } from "@/components/atlas/scan-progress";
import { analyzeEmail } from "@/lib/emailAgent";
import type { AgentAnalysis } from "@/lib/agents/types";
import { useScanSteps } from "@/lib/hooks/useScanSteps";
import { cn, riskLevelToBadgeVariant } from "@/lib/utils";

const scanSteps = [
  "Parsing email headers",
  "Analyzing sender reputation",
  "Checking SPF/DKIM/DMARC",
  "Scanning links and attachments",
  "Detecting BEC patterns",
  "AI phishing analysis",
];

export default function EmailScannerPage() {
  const [email, setEmail] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<AgentAnalysis | null>(null);
  const { currentStep, start, finish } = useScanSteps(scanSteps.length, { intervalMs: 500 });

  const startScan = async () => {
    if (!email.trim()) return;
    setScanning(true);
    setResult(null);
    start();

    try {
      const analysis = await analyzeEmail(email);
      setResult(analysis);
    } finally {
      finish();
      setScanning(false);
    }
  };

  return (
    <div>
      <TopNavbar title="Email Scanner" subtitle="Detect phishing, BEC, and malicious emails" />
      <main className="p-6 space-y-6 max-w-4xl mx-auto">
        <Card className="gradient-border">
          <CardContent className="!pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <Input
                  placeholder="Paste sender email or forward headers..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-12 text-base"
                  onKeyDown={(e) => e.key === "Enter" && startScan()}
                />
              </div>
              <Button onClick={startScan} size="lg" className="h-14 px-8" disabled={scanning}>
                <Search className="h-5 w-5" />
                {scanning ? "Scanning..." : "Analyze"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {scanning && (
            <motion.div key="scanning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader><CardTitle>Analyzing Email</CardTitle></CardHeader>
                <CardContent><ScanProgress steps={scanSteps} currentStep={currentStep} isScanning={scanning} /></CardContent>
              </Card>
            </motion.div>
          )}

          {result && !scanning && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 flex flex-col items-center py-6">
                  <TrustGauge score={result.trustScore} size="lg" label="Trust Score" />
                  <Badge variant={riskLevelToBadgeVariant(result.riskLevel)} className="mt-4">
                    {result.riskLevel === "safe" ? "Legitimate" : result.riskLevel === "caution" ? "Suspicious" : "Phishing Detected"}
                  </Badge>
                </Card>
                <Card className="md:col-span-2">
                  <CardHeader><CardTitle>Email Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <User className="h-4 w-4 text-zinc-500" />
                      <span className="text-zinc-400">From:</span>
                      <span className={cn(result.trustScore < 50 ? "text-red-400" : "text-white")}>{result.target}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-zinc-500" />
                      <span className="text-zinc-400">Subject:</span>
                      <span className="text-white">{String(result.metadata.subject)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {result.checks.map((h) => (
                        <div key={h.name} className="glass rounded-xl p-3">
                          <p className="text-xs text-zinc-500">{h.name}</p>
                          <p className={cn("text-sm font-medium mt-1", h.status === "danger" ? "text-red-400" : h.status === "warning" ? "text-amber-400" : "text-emerald-400")}>
                            {h.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.evidence.map((ind) => (
                      <div key={ind} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="text-cyan-400 mt-0.5">•</span>{ind}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-400 mt-4 leading-relaxed border-t border-white/5 pt-4">{result.explanation}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!scanning && !result && (
          <div className="text-center py-16">
            <Mail className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">Paste a sender address or email headers to analyze</p>
          </div>
        )}
      </main>
    </div>
  );
}
