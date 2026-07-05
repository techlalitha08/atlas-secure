"use client";

import { motion } from "framer-motion";
import { cn, getTrustColor, getTrustGradient } from "@/lib/utils";

interface TrustGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  label?: string;
  showLabel?: boolean;
  className?: string;
}

export function TrustGauge({
  score,
  size = "md",
  label = "Trust Score",
  showLabel = true,
  className,
}: TrustGaugeProps) {
  const sizes = {
    sm: { width: 120, stroke: 8, text: "text-2xl" },
    md: { width: 180, stroke: 10, text: "text-4xl" },
    lg: { width: 240, stroke: 12, text: "text-5xl" },
  };

  const { width, stroke, text } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="relative" style={{ width, height: width }}>
        <svg width={width} height={width} className="-rotate-90">
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="url(#trustGradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("font-bold tabular-nums", text, getTrustColor(score))}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.span>
          {showLabel && (
            <span className="text-xs text-zinc-500 mt-0.5">{label}</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface MiniGaugeProps {
  score: number;
  label: string;
  className?: string;
}

export function MiniGauge({ score, label, className }: MiniGaugeProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className={cn("text-sm font-semibold tabular-nums", getTrustColor(score))}>
          {score}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", getTrustGradient(score))}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
