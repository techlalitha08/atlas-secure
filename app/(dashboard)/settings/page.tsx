"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings, Bell, Key, Lock, Shield, Palette, Save,
} from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api", label: "API Keys", icon: Key },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <TopNavbar title="Settings" subtitle="Configure your Atlas Secure platform" />
      <main className="p-6 max-w-4xl mx-auto">
        <div className="flex gap-6">
          <div className="w-48 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                  activeTab === tab.id
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-6">
            {activeTab === "general" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs text-zinc-400 mb-2 block">Theme</label>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm text-white">
                          <Palette className="h-4 w-4 text-cyan-400" />
                          Dark Mode
                          <Badge variant="info">Active</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1.5 block">Language</label>
                      <Input defaultValue="English (US)" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1.5 block">Timezone</label>
                      <Input defaultValue="UTC+5:30 (IST)" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Critical threat alerts", desc: "Immediate notification for critical threats", enabled: true },
                      { label: "Trust score changes", desc: "When your trust score changes significantly", enabled: true },
                      { label: "Scan completions", desc: "When a scan finishes analysis", enabled: false },
                      { label: "Weekly summary", desc: "Weekly security summary email", enabled: true },
                      { label: "Agent status updates", desc: "AI agent health and status changes", enabled: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-xl p-4 border border-white/5">
                        <div>
                          <p className="text-sm text-white">{item.label}</p>
                          <p className="text-xs text-zinc-500">{item.desc}</p>
                        </div>
                        <button className={cn(
                          "relative h-6 w-11 rounded-full transition-colors",
                          item.enabled ? "bg-cyan-500" : "bg-zinc-700"
                        )}>
                          <span className={cn(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                            item.enabled ? "left-[22px]" : "left-0.5"
                          )} />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "api" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage API access for integrations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">Production Key</span>
                        <Badge variant="success">Active</Badge>
                      </div>
                      <code className="text-xs font-mono text-zinc-400">atlas_sk_live_••••••••••••4f2a</code>
                    </div>
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">Development Key</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <code className="text-xs font-mono text-zinc-400">atlas_sk_test_••••••••••••8b1c</code>
                    </div>
                    <Button variant="secondary" size="sm">Generate New Key</Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "privacy" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Share anonymized threat data", desc: "Help improve Atlas threat intelligence", enabled: true },
                      { label: "Store scan history", desc: "Keep history of all scans for 90 days", enabled: true },
                      { label: "Analytics collection", desc: "Allow usage analytics for product improvement", enabled: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-xl p-4 border border-white/5">
                        <div>
                          <p className="text-sm text-white">{item.label}</p>
                          <p className="text-xs text-zinc-500">{item.desc}</p>
                        </div>
                        <button className={cn(
                          "relative h-6 w-11 rounded-full transition-colors",
                          item.enabled ? "bg-cyan-500" : "bg-zinc-700"
                        )}>
                          <span className={cn(
                            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                            item.enabled ? "left-[22px]" : "left-0.5"
                          )} />
                        </button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs text-zinc-400 mb-1.5 block">Current Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1.5 block">New Password</label>
                      <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <Badge variant="success">2FA Enabled</Badge>
                      <Badge variant="info">Passkey Configured</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
                {saved ? "Saved!" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
