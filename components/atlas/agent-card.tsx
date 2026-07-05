"use client";

import { motion } from "framer-motion";
import {
  Globe, QrCode, Mail, Smartphone, Eye, Mic, Wifi, Lock,
  AlertTriangle, Search, Shield, Brain, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, React.ElementType> = {
  globe: Globe, qr: QrCode, mail: Mail, smartphone: Smartphone,
  eye: Eye, mic: Mic, wifi: Wifi, lock: Lock,
  alert: AlertTriangle, search: Search, shield: Shield, brain: Brain,
};

interface Agent {
  id: string;
  name: string;
  status: string;
  confidence: number;
  task: string;
  health: number;
  latency: number;
  icon: string;
}

export function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const Icon = iconMap[agent.icon] || Activity;
  const isThinking = agent.status === "thinking";
  const isActive = agent.status === "active";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass rounded-2xl p-5 hover:bg-white/[0.06] transition-all duration-300 group relative overflow-hidden"
    >
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 pointer-events-none" />
      )}
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              isActive ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-zinc-400"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">{agent.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isActive && "bg-emerald-400 animate-pulse",
                  isThinking && "bg-amber-400 animate-pulse-glow",
                  agent.status === "idle" && "bg-zinc-500"
                )} />
                <span className="text-xs text-zinc-500 capitalize">{agent.status}</span>
              </div>
            </div>
          </div>
          <Badge variant={agent.confidence >= 90 ? "success" : "info"}>
            {agent.confidence}%
          </Badge>
        </div>

        <p className="text-xs text-zinc-400 mb-4 line-clamp-1">{agent.task}</p>

        {isThinking && (
          <div className="flex gap-1 mb-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1 w-6 rounded-full bg-amber-400/60"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Health</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${agent.health}%` }}
                />
              </div>
              <span className="text-xs text-zinc-400 tabular-nums">{agent.health}%</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Latency</span>
            <p className="text-xs text-zinc-300 mt-1 tabular-nums">{agent.latency}ms</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
