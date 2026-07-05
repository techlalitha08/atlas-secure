"use client";

import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ReactFlow, Background, Controls, MiniMap,
  useNodesState, useEdgesState, addEdge, type Connection,
  Handle, Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  FileText, AlertTriangle, Search, Target, Clock, Download, ShieldCheck, ScanSearch, Radio, BrainCircuit,
} from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThreatTimeline } from "@/components/atlas/threat-timeline";
import { forensicsData } from "@/data/mock-data";
import { useTrust } from "@/lib/trust-context";
import type { AgentAnalysis } from "@/lib/agents/types";
import { cn, getSeverityColor } from "@/lib/utils";

function AttackNode({ data }: { data: { label: string; type: string } }) {
  const colors: Record<string, string> = {
    attacker: "border-red-500/50 bg-red-500/10 text-red-400",
    vector: "border-amber-500/50 bg-amber-500/10 text-amber-400",
    payload: "border-orange-500/50 bg-orange-500/10 text-orange-400",
    target: "border-violet-500/50 bg-violet-500/10 text-violet-400",
    exfil: "border-cyan-500/50 bg-cyan-500/10 text-cyan-400",
  };
  return (
    <div className={cn("rounded-xl border px-4 py-3 text-xs font-medium min-w-[120px] text-center", colors[data.type])}>
      <Handle type="target" position={Position.Left} className="!bg-zinc-500 !w-2 !h-2" />
      {data.label}
      <Handle type="source" position={Position.Right} className="!bg-zinc-500 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = { attack: AttackNode };

const initialNodes = [
  { id: "1", type: "attack", position: { x: 0, y: 100 }, data: { label: "Phishing Email", type: "attacker" } },
  { id: "2", type: "attack", position: { x: 200, y: 50 }, data: { label: "Macro Document", type: "vector" } },
  { id: "3", type: "attack", position: { x: 200, y: 150 }, data: { label: "PowerShell", type: "payload" } },
  { id: "4", type: "attack", position: { x: 400, y: 100 }, data: { label: "File Server", type: "target" } },
  { id: "5", type: "attack", position: { x: 600, y: 50 }, data: { label: "C2 Server", type: "attacker" } },
  { id: "6", type: "attack", position: { x: 600, y: 150 }, data: { label: "Data Exfil (2.4GB)", type: "exfil" } },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#ef4444" } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "#f59e0b" } },
  { id: "e3-4", source: "3", target: "4", animated: true, style: { stroke: "#f97316" } },
  { id: "e4-5", source: "4", target: "5", animated: true, style: { stroke: "#8b5cf6" } },
  { id: "e4-6", source: "4", target: "6", animated: true, style: { stroke: "#06b6d4" } },
];

export default function ForensicsPage() {
  const { lastWebsiteScan } = useTrust();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const reportData = useMemo(() => {
    if (!lastWebsiteScan || !["danger", "critical"].includes(lastWebsiteScan.riskLevel)) {
      return {
        ...forensicsData,
        timeline: forensicsData.timeline.map((t, i) => ({
          id: i + 1,
          time: t.time,
          title: t.event,
          severity: t.severity,
        })),
      };
    }

    const evidenceItems = lastWebsiteScan.evidence.slice(0, 4).map((item, index) => ({
      title: `Evidence ${index + 1}`,
      type: index === 0 ? "Network" : index === 1 ? "Endpoint" : "Behavior",
      description: item,
      source: lastWebsiteScan.target,
    }));

    const iocs = [
      {
        type: "Domain",
        value: lastWebsiteScan.target,
        confidence: lastWebsiteScan.confidence,
      },
      ...lastWebsiteScan.evidence.slice(0, 3).map((item, index) => ({
        type: index === 0 ? "Indicator" : "Artifact",
        value: item,
        confidence: Math.max(70, lastWebsiteScan.confidence - index * 5),
      })),
    ];

    const mitreTechniques = [
      { id: "T1566", name: "Phishing", tactic: "Initial Access" },
      { id: "T1059", name: "Command and Scripting Interpreter", tactic: "Execution" },
      { id: "T1204", name: "User Execution", tactic: "Execution" },
    ];

    const recommendedActions = [
      lastWebsiteScan.recommendation,
      "Block the domain at the proxy, firewall, and endpoint security controls.",
      "Alert affected users and isolate any systems that interacted with the site.",
    ];

    return {
      incident: `High-risk website analysis for ${lastWebsiteScan.target}`,
      severity: lastWebsiteScan.riskLevel === "critical" ? "Critical" : "High",
      duration: "Immediate response",
      affectedSystems: 1,
      iocs,
      timeline: [
        {
          id: 1,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          title: `${lastWebsiteScan.target} was flagged by Atlas Website Agent`,
          severity: lastWebsiteScan.riskLevel === "critical" ? "critical" : "high",
        },
        {
          id: 2,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          title: "Trust engine downgraded the domain due to suspicious indicators",
          severity: "medium",
        },
      ],
      attackPath: [
        { step: "Initial contact", source: "Website", detail: `Atlas received a scan request for ${lastWebsiteScan.target}.` },
        { step: "Behavioral review", source: "Atlas", detail: lastWebsiteScan.explanation },
        { step: "Containment", source: "Response", detail: lastWebsiteScan.recommendation },
      ],
      latestScan: {
        summary: lastWebsiteScan.explanation,
        target: lastWebsiteScan.target,
        platform: "Website",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        trustScore: lastWebsiteScan.trustScore,
      },
      summary: `Atlas flagged ${lastWebsiteScan.target} as ${lastWebsiteScan.riskLevel} risk based on suspicious indicators and evidence gathered during the scan.`,
      evidence: evidenceItems,
      mitreTechniques,
      rootCause: lastWebsiteScan.recommendation,
      recommendedActions,
    };
  }, [lastWebsiteScan]);

  const timelineEvents = reportData.timeline.map((t: { id: number; time: string; title: string; severity: string }, i: number) => ({
    id: i + 1,
    time: t.time,
    title: t.title,
    severity: t.severity,
  }));

  return (
    <div>
      <TopNavbar title="Digital Forensics" subtitle={forensicsData.incident} />
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Severity", value: reportData.severity, icon: AlertTriangle },
            { label: "Duration", value: reportData.duration, icon: Clock },
            { label: "Affected Systems", value: reportData.affectedSystems.toString(), icon: Target },
            { label: "IOCs Found", value: reportData.iocs.length.toString(), icon: Search },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="!p-4">
                <stat.icon className="h-5 w-5 text-red-400 mb-2" />
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Attack Graph</CardTitle></CardHeader>
            <CardContent className="!p-0">
              <div className="h-72 rounded-b-2xl overflow-hidden">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  fitView
                  proOptions={{ hideAttribution: true }}
                  className="bg-transparent"
                >
                  <Background color="#ffffff10" gap={20} />
                  <Controls className="!bg-zinc-900 !border-white/10 !rounded-xl [&>button]:!bg-zinc-800 [&>button]:!border-white/10 [&>button]:!text-white" />
                </ReactFlow>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Incident Timeline</CardTitle></CardHeader>
            <CardContent>
              <ThreatTimeline events={timelineEvents} />
            </CardContent>
          </Card>
        </div>

        <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-6">
          <Card>
            <CardHeader><CardTitle>Attack Path</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {reportData.attackPath.map((step: { step: string; source: string; detail: string }, index: number) => (
                <div key={step.step} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-500/15 text-xs font-semibold text-cyan-300">
                        {index + 1}
                      </div>
                      <p className="text-sm font-semibold text-white">{step.step}</p>
                    </div>
                    <Badge variant="info">{step.source}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{step.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Atlas Investigation Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  Latest scan context
                </div>
                <p className="mt-2 text-sm text-zinc-300">{reportData.latestScan.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-400">
                  <Badge variant="outline">{reportData.latestScan.target}</Badge>
                  <Badge variant="outline">{reportData.latestScan.platform}</Badge>
                  <Badge variant="outline">{reportData.latestScan.timestamp}</Badge>
                  <Badge variant="warning">Trust score {reportData.latestScan.trustScore}</Badge>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <BrainCircuit className="h-4 w-4 text-violet-400" />
                  Assessment
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{reportData.summary}</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <ScanSearch className="h-4 w-4 text-cyan-400" />
                  Evidence confidence
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-400">
                  <div className="rounded-lg bg-black/20 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Detection confidence</p>
                    <p className="mt-1 text-lg font-semibold text-white">{lastWebsiteScan?.confidence ?? 98}%</p>
                  </div>
                  <div className="rounded-lg bg-black/20 p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Containment status</p>
                    <p className="mt-1 text-lg font-semibold text-white">{lastWebsiteScan?.riskLevel === "critical" ? "Critical containment" : "Contained"}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Recommended actions
                </div>
                <ul className="mt-2 space-y-2 text-sm text-zinc-400">
                  {(reportData.recommendedActions ?? []).map((action: string) => (
                    <li key={action} className="flex gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>MITRE ATT&CK Mapping</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {reportData.mitreTechniques.map((t: { id: string; name: string; tactic: string }) => (
                <div key={t.id} className="flex items-center justify-between rounded-xl p-3 bg-white/[0.02]">
                  <div>
                    <p className="text-sm font-mono text-cyan-400">{t.id}</p>
                    <p className="text-xs text-zinc-400">{t.name}</p>
                  </div>
                  <Badge variant="outline">{t.tactic}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>IOC List</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {reportData.iocs.map((ioc: { type: string; value: string; confidence: number }) => (
                <div key={ioc.value} className="rounded-xl p-3 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="info">{ioc.type}</Badge>
                    <span className="text-xs text-emerald-400 tabular-nums">{ioc.confidence}%</span>
                  </div>
                  <p className="text-xs font-mono text-zinc-300 break-all">{ioc.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Evidence Collected</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {reportData.evidence.map((item: { title: string; type: string; description: string; source: string }) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4 text-red-400" />
                      <p className="text-sm font-medium text-white">{item.title}</p>
                    </div>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
                  <p className="mt-2 text-xs text-zinc-500">Source: {item.source}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Root Cause Analysis</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">{reportData.rootCause}</p>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-medium text-white">PDF Report Preview</span>
              </div>
              <div className="bg-white/5 rounded-lg p-6 text-center border border-dashed border-white/10">
                <FileText className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-500">Incident Report - Operation ShadowPay</p>
                <p className="text-[10px] text-zinc-600 mt-1">24 pages · Generated by Atlas Forensics Agent</p>
              </div>
              <Button variant="secondary" className="w-full mt-3" size="sm">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
