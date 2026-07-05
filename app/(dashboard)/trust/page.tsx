"use client";

import { motion } from "framer-motion";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrustGauge, MiniGauge } from "@/components/atlas/trust-gauge";
import { trustScore } from "@/data/mock-data";
import { cn, getTrustColor } from "@/lib/utils";

const breakdown = [
  { key: "website", label: "Website", score: trustScore.website },
  { key: "email", label: "Email", score: trustScore.email },
  { key: "device", label: "Device", score: trustScore.device },
  { key: "network", label: "Network", score: trustScore.network },
  { key: "privacy", label: "Privacy", score: trustScore.privacy },
  { key: "documents", label: "Documents", score: trustScore.documents },
  { key: "voice", label: "Voice", score: trustScore.voice },
  { key: "iot", label: "IoT", score: trustScore.iot },
  { key: "cloud", label: "Cloud", score: trustScore.cloud },
  { key: "qr", label: "QR", score: trustScore.qr },
];

export default function TrustCenterPage() {
  return (
    <div>
      <TopNavbar title="Trust Center" subtitle="Your comprehensive digital trust breakdown" />
      <main className="p-6 space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 flex flex-col items-center justify-center py-8">
            <TrustGauge score={trustScore.overall} size="lg" label="Overall Trust" />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className={cn("text-sm mt-4 font-medium", getTrustColor(trustScore.overall))}
            >
              {trustScore.overall >= 80 ? "Strong Trust" : trustScore.overall >= 60 ? "Moderate Trust" : "Low Trust — Action Required"}
            </motion.p>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Trust Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {breakdown.map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <MiniGauge score={item.score} label={item.label} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {breakdown.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <Card className="!p-5 text-center hover:bg-white/[0.06] transition-all cursor-default">
                <TrustGauge score={item.score} size="sm" showLabel={false} />
                <p className="text-sm font-medium text-white mt-2">{item.label}</p>
                <p className={cn("text-xs tabular-nums", getTrustColor(item.score))}>
                  {item.score >= 80 ? "Trusted" : item.score >= 60 ? "Caution" : "At Risk"}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
