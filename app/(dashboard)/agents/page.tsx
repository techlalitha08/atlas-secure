"use client";

import { motion } from "framer-motion";
import { Activity, Cpu, Zap } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentCard } from "@/components/atlas/agent-card";
import { agents } from "@/data/mock-data";

export default function AgentsPage() {
  const activeCount = agents.filter((a) => a.status === "active").length;
  const avgConfidence = Math.round(agents.reduce((s, a) => s + a.confidence, 0) / agents.length);
  const avgLatency = Math.round(agents.reduce((s, a) => s + a.latency, 0) / agents.length);

  return (
    <div>
      <TopNavbar title="AI Agents" subtitle="12 specialized agents protecting your digital trust" />
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Active Agents", value: `${activeCount}/${agents.length}`, icon: Activity, color: "text-emerald-400" },
            { label: "Avg Confidence", value: `${avgConfidence}%`, icon: Cpu, color: "text-cyan-400" },
            { label: "Avg Latency", value: `${avgLatency}ms`, icon: Zap, color: "text-violet-400" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="!p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white tabular-nums">{stat.value}</p>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Agent Fleet</CardTitle>
              <p className="text-xs text-zinc-500 mt-1">Coordinated by Atlas Orchestrator</p>
            </div>
            <Badge variant="success" className="animate-pulse">All systems operational</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {agents.map((agent, i) => (
                <AgentCard key={agent.id} agent={agent} index={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
