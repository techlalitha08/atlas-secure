"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Upload, Play, Pause } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScanProgress } from "@/components/atlas/scan-progress";
import { useScanSteps } from "@/lib/hooks/useScanSteps";
import { cn } from "@/lib/utils";

const scanSteps = [
  "Loading audio file",
  "Extracting voice features",
  "Analyzing spectral patterns",
  "Checking voiceprint authenticity",
  "Detecting synthesis artifacts",
  "Generating timeline",
];

const timelineData = [
  { start: 0, end: 12, authentic: true },
  { start: 12, end: 18, authentic: false },
  { start: 18, end: 35, authentic: true },
  { start: 35, end: 42, authentic: false },
  { start: 42, end: 60, authentic: true },
];

export default function VoiceAnalysisPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(false);
  const [playing, setPlaying] = useState(false);
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

  return (
    <div>
      <TopNavbar title="Voice Analysis" subtitle="Detect voice cloning and AI-generated speech" />
      <main className="p-6 space-y-6 max-w-4xl mx-auto">
        <Card className="gradient-border">
          <CardContent className="!py-12 text-center">
            <Mic className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
            <p className="text-white font-medium mb-1">Upload audio file</p>
            <p className="text-xs text-zinc-500 mb-6">Supports MP3, WAV, M4A, OGG</p>
            <Button onClick={startScan} disabled={scanning}>
              <Upload className="h-4 w-4" />
              {scanning ? "Analyzing..." : "Upload & Analyze"}
            </Button>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {scanning && (
            <motion.div key="scanning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card>
                <CardHeader><CardTitle>Voice Analysis</CardTitle></CardHeader>
                <CardContent><ScanProgress steps={scanSteps} currentStep={currentStep} isScanning={scanning} /></CardContent>
              </Card>
            </motion.div>
          )}

          {result && !scanning && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="flex flex-col items-center py-6">
                  <p className="text-5xl font-bold text-amber-400 tabular-nums">72%</p>
                  <p className="text-xs text-zinc-500 mt-1">Authenticity Score</p>
                  <Badge variant="warning" className="mt-4">Partially Synthesized</Badge>
                </Card>
                <Card className="md:col-span-2">
                  <CardHeader><CardTitle>Authenticity Timeline</CardTitle></CardHeader>
                  <CardContent>
                    <div className="relative h-12 rounded-xl bg-white/5 overflow-hidden mb-2">
                      {timelineData.map((seg, i) => (
                        <div
                          key={i}
                          className={cn("absolute top-1 bottom-1 rounded-md", seg.authentic ? "bg-emerald-500/40" : "bg-red-500/40")}
                          style={{ left: `${(seg.start / 60) * 100}%`, width: `${((seg.end - seg.start) / 60) * 100}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-600">
                      <span>0:00</span><span>0:30</span><span>1:00</span>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <Button variant="secondary" size="icon" onClick={() => setPlaying(!playing)}>
                        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div className="flex-1 flex items-end gap-0.5 h-8">
                        {Array.from({ length: 40 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-cyan-500/40 rounded-sm"
                            style={{ height: `${20 + Math.sin(i * 0.5) * 15 + Math.random() * 10}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader><CardTitle>Analysis Details</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Voice Clone Detection", value: "Segments at 0:12-0:18 and 0:35-0:42", status: "warning" },
                    { label: "Speaker Verification", value: "Matches known voiceprint (87%)", status: "info" },
                    { label: "Synthesis Artifacts", value: "Detected in 2 segments", status: "danger" },
                    { label: "Background Noise", value: "Consistent — not spliced", status: "success" },
                  ].map((item) => (
                    <div key={item.label} className="glass rounded-xl p-4">
                      <p className="text-xs text-zinc-500">{item.label}</p>
                      <p className="text-sm text-white mt-1">{item.value}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
