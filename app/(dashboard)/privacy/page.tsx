"use client";

import { motion } from "framer-motion";
import { Lock, Eye, Database, Cookie, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiniGauge, TrustGauge } from "@/components/atlas/trust-gauge";

const privacyChecks = [
  { name: "Data Encryption at Rest", status: "pass", icon: Lock },
  { name: "Third-Party Trackers", status: "warning", icon: Eye, detail: "3 trackers detected" },
  { name: "Cookie Consent", status: "pass", icon: Cookie },
  { name: "Data Retention Policy", status: "pass", icon: Database },
  { name: "GDPR Compliance", status: "pass", icon: Shield },
  { name: "Dark Web Exposure", status: "warning", icon: AlertTriangle, detail: "1 email found in breach" },
];

const dataPermissions = [
  { app: "Chrome Browser", permissions: ["Location", "Camera", "Microphone"], risk: "medium" },
  { app: "Flashlight Pro", permissions: ["Contacts", "SMS", "Location"], risk: "high" },
  { app: "Spotify", permissions: ["Storage"], risk: "low" },
  { app: "WhatsApp", permissions: ["Contacts", "Camera", "Microphone"], risk: "low" },
];

export default function PrivacyCenterPage() {
  return (
    <div>
      <TopNavbar title="Privacy Center" subtitle="Monitor and control your digital privacy" />
      <main className="p-6 space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center py-8">
            <TrustGauge score={74} size="lg" label="Privacy Trust" />
            <Badge variant="warning" className="mt-4">Needs Attention</Badge>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Privacy Breakdown</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <MiniGauge score={91} label="Data Encryption" />
                <MiniGauge score={62} label="Tracker Blocking" />
                <MiniGauge score={88} label="Consent Management" />
                <MiniGauge score={55} label="Breach Protection" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Privacy Checks</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {privacyChecks.map((check, i) => (
                <motion.div
                  key={check.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-xl p-3 bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    <check.icon className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm text-white">{check.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {check.detail && <span className="text-xs text-zinc-500">{check.detail}</span>}
                    {check.status === "pass" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>App Permissions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {dataPermissions.map((app) => (
                <div key={app.app} className="rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{app.app}</span>
                    <Badge variant={app.risk === "high" ? "danger" : app.risk === "medium" ? "warning" : "success"}>
                      {app.risk} risk
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {app.permissions.map((p) => (
                      <Badge key={p} variant="outline">{p}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
