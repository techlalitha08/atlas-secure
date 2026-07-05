"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { AlertTriangle, Shield, Ban, Search } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThreatTimeline } from "@/components/atlas/threat-timeline";
import { threats, threatTimeline } from "@/data/mock-data";
import { cn, getSeverityColor } from "@/lib/utils";

const heatmapData = [
  { hour: "00", value: 2 }, { hour: "04", value: 1 }, { hour: "08", value: 5 },
  { hour: "12", value: 8 }, { hour: "16", value: 12 }, { hour: "20", value: 6 },
];

const attackTrend = [
  { day: "Mon", threats: 4 }, { day: "Tue", threats: 7 }, { day: "Wed", threats: 3 },
  { day: "Thu", threats: 9 }, { day: "Fri", threats: 6 }, { day: "Sat", threats: 2 },
  { day: "Sun", threats: 3 },
];

export default function ThreatCenterPage() {
  return (
    <div>
      <TopNavbar title="Threat Center" subtitle="Real-time threat monitoring and incident response" />
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Threats", value: "3", icon: AlertTriangle, color: "text-red-400" },
            { label: "Blocked Today", value: "12", icon: Ban, color: "text-emerald-400" },
            { label: "Investigating", value: "2", icon: Search, color: "text-amber-400" },
            { label: "Protection Score", value: "94%", icon: Shield, color: "text-cyan-400" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="!p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                  <span className="text-xl font-bold text-white tabular-nums">{stat.value}</span>
                </div>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Attack Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attackTrend}>
                    <defs>
                      <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="threats" stroke="#ef4444" fill="url(#threatGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <ThreatTimeline events={threatTimeline} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {heatmapData.map((h) => (
                    <div key={h.hour} className="text-center">
                      <div
                        className="aspect-square rounded-lg mb-1"
                        style={{
                          background: `rgba(239, 68, 68, ${h.value / 12})`,
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      />
                      <span className="text-[10px] text-zinc-600">{h.hour}h</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Incidents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {threats.slice(0, 4).map((threat, i) => (
                  <motion.div
                    key={threat.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-xl p-3 hover:bg-white/[0.06] transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={getSeverityColor(threat.severity)}>{threat.severity}</Badge>
                      <Badge variant="outline">{threat.status}</Badge>
                    </div>
                    <p className="text-sm font-medium text-white">{threat.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">{threat.source} · {threat.time}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {threats.map((threat) => (
                <div key={threat.id} className="flex items-center justify-between rounded-xl p-4 hover:bg-white/5 transition-colors border border-white/5">
                  <div className="flex items-center gap-4">
                    <Badge className={getSeverityColor(threat.severity)}>{threat.severity}</Badge>
                    <div>
                      <p className="text-sm font-medium text-white">{threat.title}</p>
                      <p className="text-xs text-zinc-500">{threat.type} · {threat.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={threat.status === "blocked" ? "success" : threat.status === "quarantined" ? "warning" : "info"}>
                      {threat.status}
                    </Badge>
                    <span className="text-xs text-zinc-600">{threat.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
