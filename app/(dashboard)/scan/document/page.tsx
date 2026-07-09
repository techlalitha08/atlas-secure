"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrustGauge } from "@/components/atlas/trust-gauge";
import { ScanProgress } from "@/components/atlas/scan-progress";
import { useScanSteps } from "@/lib/hooks/useScanSteps";

const scanSteps = [
  "Parsing document structure",
  "Verifying digital signatures",
  "Checking metadata integrity",
  "Analyzing embedded objects",
  "Cross-referencing document hash",
  "AI tamper detection",
];

export default function DocumentVerificationPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(false);
  const { currentStep, start } = useScanSteps(scanSteps.length, {
    intervalMs: 600,
    completeDelayMs: 500,
    onComplete: () => {
      setScanning(false);
      setResult(true);
    },
  });

  const startScan = () => {
    setScanning(true);
    setResult(false);
    start();
  };

  const checks = [
    { name: "Digital Signature", status: "pass", detail: "Valid — signed by Acme Corp CA" },
    { name: "Document Hash", status: "pass", detail: "SHA-256 matches registry" },
    { name: "Metadata Integrity", status: "pass", detail: "No unauthorized modifications" },
    { name: "Embedded Objects", status: "warning", detail: "1 macro detected (disabled)" },
    { name: "Tamper Detection", status: "pass", detail: "No visual tampering detected" },
    { name: "Source Verification", status: "pass", detail: "Origin verified via blockchain anchor" },
  ];

  const statusIcon = (status: string) => {
    if (status === "pass") return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    if (status === "warning") return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    return <XCircle className="h-4 w-4 text-red-400" />;
  };

  return (
    <div>
      <TopNavbar title="Document Verification" subtitle="Verify authenticity and integrity of documents" />
      <main className="p-6 space-y-6 max-w-4xl mx-auto">
        <Card className="gradient-border">
          <CardContent className="!py-12 text-center">
            <FileText className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Upload document</p>
            <p className="text-xs text-zinc-500 mb-6">Supports PDF, DOCX, XLSX, PPTX</p>
            <Button onClick={startScan} disabled={scanning}>
              <Upload className="h-4 w-4" />
              {scanning ? "Verifying..." : "Upload & Verify"}
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {scanning && (
            <motion.div key="scanning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader><CardTitle>Document Verification</CardTitle></CardHeader>
                <CardContent><ScanProgress steps={scanSteps} currentStep={currentStep} isScanning={scanning} /></CardContent>
              </Card>
            </motion.div>
          )}

          {result && !scanning && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 flex flex-col items-center py-6">
                  <TrustGauge score={88} size="lg" label="Trust Score" />
                  <Badge variant="success" className="mt-4">Verified Authentic</Badge>
                  <p className="text-xs text-zinc-500 mt-2">contract_v2.pdf</p>
                </Card>
                <Card className="md:col-span-2">
                  <CardHeader><CardTitle>Verification Checks</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {checks.map((check) => (
                      <div key={check.name} className="flex items-center justify-between rounded-xl p-3 bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                          {statusIcon(check.status)}
                          <span className="text-sm text-white">{check.name}</span>
                        </div>
                        <span className="text-xs text-zinc-500">{check.detail}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
