"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Camera, AlertTriangle, CheckCircle2 } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrustGauge } from "@/components/atlas/trust-gauge";
import { useTrust } from "@/lib/trust-context";
import type { AgentAnalysis } from "@/lib/agents/types";
import { cn, getTrustColor } from "@/lib/utils";

interface QRResult {
  destinationUrl: string;
  trustScore: number;
  riskLevel: AgentAnalysis["riskLevel"];
  explanation: string;
  recommendation: string;
  confidence: number;
  agentId: AgentAnalysis["agentId"];
}

export default function QRScannerPage() {
  const { recordWebsiteScan, trust } = useTrust();
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<QRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (file?: File | null) => {
    if (!file) return;

    setScanning(true);
    setScanned(false);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/qr", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => null)) as { ok?: boolean; result?: QRResult; error?: string } | null;

      if (!response.ok || !data?.ok || !data.result) {
        throw new Error(data?.error ?? "QR analysis failed.");
      }

      const analysis = data.result;
      const agentAnalysis: AgentAnalysis = {
        agentId: analysis.agentId,
        agentName: "QR Security Agent",
        target: analysis.destinationUrl,
        trustScore: analysis.trustScore,
        confidence: analysis.confidence,
        riskLevel: analysis.riskLevel,
        explanation: analysis.explanation,
        recommendation: analysis.recommendation,
        evidence: [analysis.destinationUrl, analysis.explanation],
        checks: [],
        metadata: { vectorKey: "website", source: "qr" },
        latencyMs: 120,
      };

      setResult(analysis);
      setScanned(true);
      recordWebsiteScan(agentAnalysis);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze QR code.";
      setError(message);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div>
      <TopNavbar title="QR Scanner" subtitle="Verify QR codes before you scan" />
      <main className="p-6 space-y-6 max-w-3xl mx-auto">
        <Card className="overflow-hidden">
          <CardContent className="!p-0">
            <div className="relative aspect-video bg-black/50 flex items-center justify-center">
              <div className="absolute inset-0 grid-bg opacity-30" />
              {!scanned && (
                <>
                  <div className="relative w-48 h-48 border-2 border-cyan-500/50 rounded-2xl">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />
                    {scanning && (
                      <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line" />
                    )}
                  </div>
                  <Camera className="absolute top-4 right-4 h-5 w-5 text-zinc-500" />
                </>
              )}
              {scanned && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                  <QrCode className="h-16 w-16 text-cyan-400 mx-auto mb-4" />
                  <p className="text-white font-medium">QR Code Detected</p>
                  <p className="text-xs text-zinc-500 mt-1">https://event-tickets.example.com/verify/abc123</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          {!scanned ? (
            <>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleScan(e.target.files?.[0])} />
              <Button onClick={() => fileInputRef.current?.click()} size="lg" disabled={scanning}>
                <Camera className="h-5 w-5" />
                {scanning ? "Scanning..." : "Upload QR Code"}
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => { setScanned(false); setResult(null); setError(null); setScanning(false); }}>
              Scan Another
            </Button>
          )}
        </div>

        {error && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="!py-4">
              <p className="text-sm text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {scanned && result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="flex flex-col items-center py-6">
                <TrustGauge score={result.trustScore} size="md" label="Trust Score" />
                <Badge variant={result.riskLevel === "safe" ? "success" : result.riskLevel === "caution" ? "warning" : "danger"} className="mt-4">
                  {result.riskLevel === "safe" ? "Safe to visit" : result.riskLevel === "caution" ? "Review before visiting" : "High risk"}
                </Badge>
                <p className="text-xs text-zinc-500 mt-3">Overall trust updated: {trust.overall}</p>
              </Card>
              <Card>
                <CardHeader><CardTitle>Analysis</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Destination</span>
                    <span className={cn("font-mono text-xs", getTrustColor(result.trustScore))}>{result.destinationUrl}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Risk Level</span>
                    <span className={cn("font-medium", result.riskLevel === "safe" ? "text-emerald-400" : result.riskLevel === "caution" ? "text-amber-400" : "text-red-400")}>{result.riskLevel}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Confidence</span>
                    <span className="text-cyan-400">{result.confidence}%</span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-white">
                      <AlertTriangle className="h-4 w-4 text-cyan-400" />
                      AI Explanation
                    </div>
                    <p className="text-sm text-zinc-400">{result.explanation}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      Recommendation
                    </div>
                    <p className="mt-2 text-sm text-zinc-300">{result.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
