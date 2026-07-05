"use client";

import { motion } from "framer-motion";
import {
  ReactFlow, Background, Controls,
  useNodesState, useEdgesState,
  Handle, Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Home, Wifi, Camera, Lock, Thermometer, Tv, Speaker, AlertTriangle } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MiniGauge } from "@/components/atlas/trust-gauge";
import { iotDevices } from "@/data/mock-data";
import { cn, getTrustColor } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Climate: Thermometer, Camera, Access: Lock, Audio: Speaker, Display: Tv, Network: Wifi,
};

function DeviceNode({ data }: { data: { label: string; type: string; trust: number; status: string } }) {
  const Icon = iconMap[data.type] || Home;
  return (
    <div className={cn(
      "rounded-xl border px-4 py-3 text-center min-w-[140px] glass",
      data.status === "warning" ? "border-amber-500/30" : "border-white/10"
    )}>
      <Handle type="target" position={Position.Top} className="!bg-zinc-500 !w-2 !h-2" />
      <Icon className="h-5 w-5 mx-auto mb-1 text-cyan-400" />
      <p className="text-xs font-medium text-white">{data.label}</p>
      <p className={cn("text-[10px] tabular-nums mt-0.5", getTrustColor(data.trust))}>Trust: {data.trust}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-500 !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = { device: DeviceNode };

const initialNodes = [
  { id: "router", type: "device", position: { x: 250, y: 0 }, data: { label: "Router Gateway", type: "Network", trust: 85, status: "online" } },
  { id: "thermo", type: "device", position: { x: 0, y: 150 }, data: { label: "Smart Thermostat", type: "Climate", trust: 92, status: "online" } },
  { id: "camera", type: "device", position: { x: 170, y: 150 }, data: { label: "Security Camera", type: "Camera", trust: 45, status: "warning" } },
  { id: "lock", type: "device", position: { x: 340, y: 150 }, data: { label: "Smart Lock", type: "Access", trust: 88, status: "online" } },
  { id: "speaker", type: "device", position: { x: 85, y: 280 }, data: { label: "Smart Speaker", type: "Audio", trust: 78, status: "online" } },
  { id: "tv", type: "device", position: { x: 255, y: 280 }, data: { label: "Smart TV", type: "Display", trust: 71, status: "online" } },
];

const initialEdges = [
  { id: "e-r-t", source: "router", target: "thermo", style: { stroke: "#06b6d4", opacity: 0.5 } },
  { id: "e-r-c", source: "router", target: "camera", style: { stroke: "#ef4444", opacity: 0.5 } },
  { id: "e-r-l", source: "router", target: "lock", style: { stroke: "#06b6d4", opacity: 0.5 } },
  { id: "e-r-s", source: "router", target: "speaker", style: { stroke: "#06b6d4", opacity: 0.5 } },
  { id: "e-r-v", source: "router", target: "tv", style: { stroke: "#06b6d4", opacity: 0.5 } },
];

export default function IoTDashboardPage() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const avgTrust = Math.round(iotDevices.reduce((s, d) => s + d.trust, 0) / iotDevices.length);

  return (
    <div>
      <TopNavbar title="IoT Dashboard" subtitle="Smart home network topology and device health" />
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Connected Devices", value: iotDevices.length.toString() },
            { label: "Avg Trust Score", value: avgTrust.toString() },
            { label: "Devices at Risk", value: "1" },
            { label: "Firmware Updates", value: "2 pending" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="!p-4">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>Network Topology</CardTitle></CardHeader>
            <CardContent className="!p-0">
              <div className="h-80 rounded-b-2xl overflow-hidden">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  nodeTypes={nodeTypes}
                  fitView
                  proOptions={{ hideAttribution: true }}
                  className="bg-transparent"
                >
                  <Background color="#ffffff08" gap={24} />
                  <Controls className="!bg-zinc-900 !border-white/10 !rounded-xl [&>button]:!bg-zinc-800 [&>button]:!border-white/10 [&>button]:!text-white" />
                </ReactFlow>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Device Health</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {iotDevices.map((device) => (
                <div key={device.id} className="rounded-xl p-3 border border-white/5 hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{device.name}</span>
                    <Badge variant={device.status === "warning" ? "warning" : "success"}>{device.status}</Badge>
                  </div>
                  <MiniGauge score={device.trust} label="Trust" />
                  <div className="flex justify-between mt-2 text-[10px] text-zinc-500">
                    <span>FW: {device.firmware}</span>
                    <span className="font-mono">{device.ip}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {iotDevices.filter((d) => d.status === "warning").map((device) => (
          <Card key={device.id} className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="!py-4 flex items-center gap-4">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">{device.name} requires attention</p>
                <p className="text-xs text-zinc-400">Firmware {device.firmware} is outdated. Trust score: {device.trust}. Update recommended.</p>
              </div>
              <Badge variant="warning" className="ml-auto shrink-0">Update Available</Badge>
            </CardContent>
          </Card>
        ))}
      </main>
    </div>
  );
}
