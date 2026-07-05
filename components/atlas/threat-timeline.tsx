"use client";

import { motion } from "framer-motion";
import { cn, getSeverityColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TimelineEvent {
  id: number;
  time: string;
  title: string;
  severity: string;
  type?: string;
}

interface ThreatTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function ThreatTimeline({ events, className }: ThreatTimelineProps) {
  return (
    <div className={cn("relative space-y-0", className)}>
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/30 to-transparent" />
      {events.map((event, i) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative flex gap-4 pb-6 last:pb-0"
        >
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center">
            <div
              className={cn(
                "h-3 w-3 rounded-full border-2",
                event.severity === "critical" && "bg-red-500 border-red-400 shadow-lg shadow-red-500/50",
                event.severity === "high" && "bg-orange-500 border-orange-400",
                event.severity === "medium" && "bg-amber-500 border-amber-400",
                event.severity === "low" && "bg-emerald-500 border-emerald-400"
              )}
            />
          </div>
          <div className="flex-1 glass rounded-xl p-4 hover:bg-white/[0.06] transition-colors">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-mono text-zinc-500">{event.time}</span>
              <Badge className={getSeverityColor(event.severity)}>
                {event.severity}
              </Badge>
            </div>
            <p className="text-sm font-medium text-white">{event.title}</p>
            {event.type && (
              <span className="text-xs text-zinc-500 mt-1 inline-block">{event.type}</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
