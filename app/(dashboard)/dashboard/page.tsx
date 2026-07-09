"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import {
  Shield, Globe, Wifi, Mail, Lock, AlertTriangle, Activity,
  ArrowUpRight, ArrowDownRight, ChevronRight,
} from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrustGauge, MiniGauge } from "@/components/atlas/trust-gauge";
import { ThreatTimeline } from "@/components/atlas/threat-timeline";
import {
  dashboardStats, recentScans as mockRecentScans, recommendedActions,
  threatTimeline, aiActivity, securityInsights,
} from "@/data/mock-data";
import { useTrust } from "@/lib/trust-context";
import { cn, getTrustColor, getSeverityColor, riskLevelToBadgeVariant } from "@/lib/utils";
import Link from "next/link";

const baseTrustTrend = [
  { day: "Mon", score: 72 }, { day: "Tue", score: 74 }, { day: "Wed", score: 71 },
  { day: "Thu", score: 76 }, { day: "Fri", score: 75 }, { day: "Sat", score: 78 },
];

const threatChart = [
  { name: "Phishing", count: 12 }, { name: "Malware", count: 5 },
  { name: "Network", count: 8 }, { name: "IoT", count: 3 }, { name: "Deepfake", count: 2 },
];

export default function DashboardPage() {
  const { trust, websiteTrust, recentScans, lastWebsiteScan } = useTrust();

  const trustTrend = [
    ...baseTrustTrend.slice(0, -1),
    { day: "Today", score: trust.overall },
  ];

  const displayScans = recentScans.length > 0
    ? recentScans.map((s) => ({
        id: s.id,
        type: "Website",
        target: s.target,
        score: s.score,
        status: s.status,
        time: s.time,
      }))
    : mockRecentScans;

  const timelineEvents = lastWebsiteScan
    ? [
        {
          id: 1,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          title: `${lastWebsiteScan.target} was analyzed by Atlas Website Agent`,
          severity: lastWebsiteScan.riskLevel === "critical" || lastWebsiteScan.riskLevel === "danger" ? "high" : lastWebsiteScan.riskLevel === "caution" ? "medium" : "low",
          type: "Website scan",
        },
        ...(threatTimeline.slice(0, 2) as typeof threatTimeline),
      ]
    : threatTimeline;

  const stats = [
    { label: "Device Health", value: trust.breakdown.device ?? dashboardStats.deviceHealth, icon: Shield, color: "text-emerald-400" },
    { label: "Website Trust", value: websiteTrust, icon: Globe, color: "text-cyan-400" },
    { label: "Network Trust", value: trust.breakdown.network ?? dashboardStats.networkTrust, icon: Wifi, color: "text-violet-400" },
    { label: "Privacy Trust", value: trust.breakdown.privacy ?? dashboardStats.privacyTrust, icon: Lock, color: "text-amber-400" },
    { label: "Email Trust", value: trust.breakdown.email ?? dashboardStats.emailTrust, icon: Mail, color: "text-blue-400" },
    { label: "Today's Threats", value: dashboardStats.todayThreats, icon: AlertTriangle, color: "text-red-400", isCount: true },
  ];

  return (
    <div>
      <TopNavbar title="Dashboard" subtitle="Your digital trust overview" />
      <main className="p-6 space-y-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="!p-4 hover:bg-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                  {!stat.isCount && (
                    <span className={cn("text-lg font-bold tabular-nums", getTrustColor(stat.value))}>
                      {stat.value}
                    </span>
                  )}
                  {stat.isCount && (
                    <span className="text-lg font-bold text-red-400 tabular-nums">{stat.value}</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trust Gauge + Trend */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Overall Trust Score</CardTitle>
              <p className="text-xs text-zinc-500 mt-1">{trust.verdict}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant={riskLevelToBadgeVariant(trust.riskLevel)}>
                  {trust.riskLevel}
                </Badge>
                <Badge variant="info">Website {websiteTrust}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <TrustGauge score={trust.overall} size="lg" />
              <p className="text-xs text-zinc-500 mt-3 tabular-nums">
                {trust.confidence}% confidence · Trust Engine
              </p>
              <div className="w-full mt-6 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trustTrend}>
                    <defs>
                      <linearGradient id="trustGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={[Math.max(0, trust.overall - 20), 100]} />
                    <Tooltip
                      contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#06b6d4" fill="url(#trustGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Scans + Actions */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex-row items-center justify-between !mb-0">
                <CardTitle>Recent Scans</CardTitle>
                <Link href="/scan/website" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                  View all <ChevronRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="space-y-2">
                  {displayScans.map((scan, i) => (
                    <motion.div
                      key={scan.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between rounded-xl p-3 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant={scan.status === "success" ? "success" : scan.status === "danger" ? "danger" : "warning"}>
                          {scan.type}
                        </Badge>
                        <span className="text-sm text-zinc-300">{scan.target}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={cn("text-sm font-semibold tabular-nums", getTrustColor(scan.score))}>
                          {scan.score}
                        </span>
                        <span className="text-xs text-zinc-600">{scan.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {recommendedActions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-center gap-3 rounded-xl p-3 border border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all cursor-pointer"
                    >
                      <div className={cn(
                        "h-2 w-2 rounded-full shrink-0",
                        action.priority === "high" ? "bg-red-400" : action.priority === "medium" ? "bg-amber-400" : "bg-blue-400"
                      )} />
                      <span className="text-sm text-zinc-300">{action.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Threat Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ThreatTimeline events={timelineEvents} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Threat Categories</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatChart}>
                  <XAxis dataKey="name" tick={{ fill: "#71717a", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {securityInsights.map((insight) => (
                  <div key={insight.title} className="flex items-start gap-3 rounded-xl p-3 bg-white/[0.02]">
                    {insight.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    ) : insight.trend === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{insight.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  Live AI Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {aiActivity.map((item) => (
                  <div key={item.agent} className="flex items-center gap-3 text-xs">
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0",
                      item.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                    )} />
                    <span className="text-zinc-400 font-medium shrink-0">{item.agent}</span>
                    <span className="text-zinc-600 truncate">{item.action}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
