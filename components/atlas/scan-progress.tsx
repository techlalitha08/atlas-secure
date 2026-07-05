"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanProgressProps {
  steps: string[];
  currentStep: number;
  isScanning: boolean;
  className?: string;
}

export function ScanProgress({ steps, currentStep, isScanning, className }: ScanProgressProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {steps.map((step, i) => {
        const isComplete = i < currentStep;
        const isCurrent = i === currentStep && isScanning;
        const isPending = i > currentStep;

        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-xs",
              isComplete && "bg-emerald-500/20 text-emerald-400",
              isCurrent && "bg-cyan-500/20 text-cyan-400",
              isPending && "bg-white/5 text-zinc-600"
            )}>
              {isComplete ? "✓" : isCurrent ? <Loader2 className="h-3 w-3 animate-spin" /> : i + 1}
            </div>
            <span className={cn(
              "text-sm",
              isComplete && "text-emerald-400",
              isCurrent && "text-white",
              isPending && "text-zinc-600"
            )}>
              {step}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 mb-4">
        <Icon className="h-8 w-8 text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  );
}

export function LoadingState({ message = "Analyzing..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-6">
        <div className="h-16 w-16 rounded-full border-2 border-cyan-500/20" />
        <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" />
      </div>
      <p className="text-sm text-zinc-400 animate-pulse">{message}</p>
    </div>
  );
}
