"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { Wifi, Shield, Globe, Lock, AlertTriangle, Activity } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiniGauge } from "@/components/atlas/trust-gauge";
import { cn } from "@/lib/utils";

const networkTraffic = [
  { time: "00:00", inbound: 120, outbound: 80 },
  { time: "04:00", inbound: 45, outbound: 30 },
  { time: "08:00", inbound: 340, outbound: 210 },
  { time: "12:00", inbound: 520, outbound: 380 },
  { time: "16:00", inbound: 480, outbound: 350 },
  { time: "20:00", inbound: 290, outbound: 180 },
];

const connections = [
  { ip: "192.168.1.1", name: "Router Gateway", status: "secure", traffic: "2.4 GB" },
  { ip: "8.8.8.8", name: "Google DNS", status: "secure", traffic: "128 MB" },
  { ip: "185.234.72.19", name: "Unknown Host", status: "blocked", traffic: "0 B" },
  { ip: "1.1.1.1", name: "Cloudflare DNS", status: "secure", traffic: "64 MB" },
  { ip: "142.250.80.46", name: "Google Services", status: "secure", traffic: "890 MB" },
];

const dnsQueries = [
  { domain: "update-cdn-secure.net", count: 47, status: "blocked" },
  { domain: "google.com", count: 234, status: "allowed" },
  { domain: "github.com", count: 89, status: "allowed" },
  { domain: "malware-c2.evil.io", count: 12, status: "blocked" },
];

export default function NetworkSecurityPage() {
  return (
    <div>
      <TopNavbar title="Network Security" subtitle="Monitor and protect your network traffic" />
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Network Trust", value: 68, icon: Shield },
            { label: "Active Connections", value: "24", icon: Activity, isText: true },
            { label: "Threats Blocked", value: "59", icon: AlertTriangle, isText: true },
            { label: "VPN Status", value: "Active", icon: Lock, isText: true },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="!p-4">
                <stat.icon className="h-5 w-5 text-cyan-400 mb-2" />
                <p className="text-xl font-bold text-white">{stat.isText ? stat.value : stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Network Traffic</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={networkTraffic}>
                  <defs>
                    <linearGradient id="inGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="inbound" stroke="#06b6d4" fill="url(#inGrad)" strokeWidth={2} name="Inbound" />
                  <Area type="monotone" dataKey="outbound" stroke="#8b5cf6" fill="url(#outGrad)" strokeWidth={2} name="Outbound" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Trust Metrics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <MiniGauge score={68} label="Overall Network" />
              <MiniGauge score={85} label="DNS Security" />
              <MiniGauge score={72} label="Firewall Rules" />
              <MiniGauge score={91} label="VPN Encryption" />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Active Connections</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {connections.map((conn) => (
                <div key={conn.ip} className="flex items-center justify-between rounded-xl p-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Wifi className={cn("h-4 w-4", conn.status === "secure" ? "text-emerald-400" : "text-red-400")} />
                    <div>
                      <p className="text-sm text-white">{conn.name}</p>
                      <p className="text-xs text-zinc-500 font-mono">{conn.ip}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={conn.status === "secure" ? "success" : "danger"}>{conn.status}</Badge>
                    <p className="text-xs text-zinc-600 mt-1">{conn.traffic}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>DNS Query Log</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {dnsQueries.map((q) => (
                <div key={q.domain} className="flex items-center justify-between rounded-xl p-3 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm text-zinc-300 font-mono">{q.domain}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500 tabular-nums">{q.count} queries</span>
                    <Badge variant={q.status === "allowed" ? "success" : "danger"}>{q.status}</Badge>
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
