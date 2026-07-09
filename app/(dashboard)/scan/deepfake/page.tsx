"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Upload, AlertTriangle, CheckCircle2 } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScanProgress } from "@/components/atlas/scan-progress";
import { useScanSteps } from "@/lib/hooks/useScanSteps";

const scanSteps = [
  "Loading media file",
  "Detecting faces",
  "Analyzing facial landmarks",
  "Checking for manipulation artifacts",
  "Running deepfake neural network",
  "Generating heatmap",
];

export default function DeepfakePage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{
    fakeProbability: number;
    realProbability: number;
    confidenceScore: number;
    explanation: string;
    recommendation: string;
    modelId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentStep, start, finish } = useScanSteps(scanSteps.length, { intervalMs: 700 });

  const startScan = async (file?: File | null) => {
    if (!file) return;

    setScanning(true);
    setResult(null);
    setError(null);
    setSelectedFileName(file.name);
    start();

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/deepfake", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string; fakeProbability?: number; realProbability?: number; confidenceScore?: number; explanation?: string; recommendation?: string; modelId?: string }
        | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "Inference failed.");
      }

      setResult({
        fakeProbability: data.fakeProbability ?? 0,
        realProbability: data.realProbability ?? 0,
        confidenceScore: data.confidenceScore ?? 0,
        explanation: data.explanation ?? "",
        recommendation: data.recommendation ?? "",
        modelId: data.modelId ?? "unknown",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Inference failed.";
      setError(message);
    } finally {
      finish();
      setScanning(false);
    }
  };

  return (
    <div>
      <TopNavbar title="Deepfake Detection" subtitle="Detect AI-generated faces in images and video" />
      <main className="p-6 space-y-6 max-w-4xl mx-auto">
        <Card className="gradient-border">
          <CardContent className="!py-12 text-center">
            <Upload className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Upload image</p>
            <p className="text-xs text-zinc-500 mb-6">Supports JPG and PNG images. The backend runs real inference with a pretrained Hugging Face model.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => startScan(e.target.files?.[0])}
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={scanning}>
              <Eye className="h-4 w-4" />
              {scanning ? "Analyzing..." : "Upload & Detect"}
            </Button>
            {selectedFileName && <p className="text-xs text-zinc-500 mt-3">Selected file: {selectedFileName}</p>}
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
            <motion.div key="scanning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader><CardTitle>Deepfake Analysis</CardTitle></CardHeader>
                <CardContent><ScanProgress steps={scanSteps} currentStep={currentStep} isScanning={scanning} /></CardContent>
              </Card>
            </motion.div>
          )}

          {result && !scanning && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                  <CardHeader><CardTitle>Model Output</CardTitle></CardHeader>
                  <CardContent className="!p-0">
                    <div className="relative aspect-square bg-zinc-900 flex items-center justify-center">
                      <div className="absolute inset-8 rounded-full border-2 border-cyan-500/30" />
                      <div className="absolute inset-16 rounded-full bg-cyan-500/10 animate-pulse" />
                      <div className="absolute inset-24 rounded-full bg-cyan-500/20" />
                      <Eye className="h-16 w-16 text-zinc-700" />
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px]">
                        <span className="text-emerald-400">Real</span>
                        <span className="text-red-400">Fake</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="!pt-6 text-center">
                      <Badge variant={result.fakeProbability >= 60 ? "danger" : "success"} className="mb-4">
                        {result.fakeProbability >= 60 ? "Deepfake Likely" : "Appears Authentic"}
                      </Badge>
                      <p className="text-5xl font-bold text-cyan-400 tabular-nums">{result.fakeProbability}%</p>
                      <p className="text-xs text-zinc-500 mt-1">Fake Probability</p>
                      <div className="mt-4 flex justify-center gap-4 text-sm text-zinc-400">
                        <span>Real: {result.realProbability}%</span>
                        <span>Confidence: {result.confidenceScore}%</span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-cyan-400" />
                        AI Explanation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-zinc-400">
                      <p>{result.explanation}</p>
                      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="flex items-center gap-2 text-emerald-300 mb-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Recommendation
                        </div>
                        <p>{result.recommendation}</p>
                      </div>
                      <p className="text-[11px] text-zinc-500">Model: {result.modelId}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
