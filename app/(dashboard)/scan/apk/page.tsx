"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Upload, AlertTriangle, Shield } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrustGauge } from "@/components/atlas/trust-gauge";
import { ScanProgress } from "@/components/atlas/scan-progress";
import { apkScanResult } from "@/data/mock-data";
import { useScanSteps } from "@/lib/hooks/useScanSteps";
import { cn } from "@/lib/utils";

const scanSteps = [
  "Extracting APK metadata",
  "Analyzing permissions",
  "Decompiling bytecode",
  "Detecting dangerous APIs",
  "Scanning for trackers",
  "Computing risk score",
];

export default function APKScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<typeof apkScanResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const { currentStep, start } = useScanSteps(scanSteps.length, {
    intervalMs: 600,
    completeDelayMs: 500,
    onComplete: () => {
      setScanning(false);
      setResult(apkScanResult);
    },
  });

  const startScan = useCallback(() => {
    setScanning(true);
    setResult(null);
    start();
  }, [start]);

  return (
    <div>
      <TopNavbar title="APK Scanner" subtitle="Analyze Android apps for malware and privacy risks" />
      <main className="p-6 space-y-6 max-w-4xl mx-auto">
        <Card
          className={cn("gradient-border transition-all", dragOver && "border-cyan-500/50 bg-cyan-500/5")}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); startScan(); }}
        >
          <CardContent className="!py-12 text-center">
            <Upload className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Drop APK file here</p>
            <p className="text-xs text-zinc-500 mb-6">or click to browse</p>
            <Button onClick={startScan} disabled={scanning}>
              <Smartphone className="h-4 w-4" />
              {scanning ? "Analyzing..." : "Upload & Analyze"}
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {scanning && (
            <motion.div key="scanning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader><CardTitle>Analyzing APK</CardTitle></CardHeader>
                <CardContent><ScanProgress steps={scanSteps} currentStep={currentStep} isScanning={scanning} /></CardContent>
              </Card>
            </motion.div>
          )}

          {result && !scanning && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 flex flex-col items-center py-6">
                  <TrustGauge score={result.trustScore} size="lg" label="Trust Score" />
                  <Badge variant="danger" className="mt-4">High Risk</Badge>
                  <p className="text-xs text-zinc-500 mt-2">{result.name}</p>
                </Card>
                <Card className="md:col-span-2">
                  <CardHeader><CardTitle>Permissions</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.permissions.map((p) => (
                        <Badge
                          key={p.name}
                          variant={p.risk === "critical" ? "danger" : p.risk === "high" ? "warning" : p.risk === "medium" ? "info" : "outline"}
                        >
                          {p.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      Dangerous APIs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.dangerousApis.map((api) => (
                      <div key={api} className="glass rounded-lg px-3 py-2 text-sm font-mono text-red-400">{api}</div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-amber-400" />
                      Trackers Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.trackers.map((t) => (
                      <div key={t} className="flex items-center gap-2 text-sm text-zinc-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />{t}
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
