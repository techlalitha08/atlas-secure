import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RiskLevel } from "./agents/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Maps a risk level to the matching {@link Badge} variant. */
export function riskLevelToBadgeVariant(level: RiskLevel): "success" | "warning" | "danger" {
  if (level === "safe") return "success";
  if (level === "caution") return "warning";
  return "danger";
}

/** Human-readable label for a risk level. */
export function riskLevelToLabel(level: RiskLevel): string {
  switch (level) {
    case "safe":
      return "Low Risk";
    case "caution":
      return "Moderate Risk";
    case "danger":
      return "High Risk";
    case "critical":
      return "Critical Risk";
  }
}

/** Tailwind text color class for a risk level. */
export function riskLevelToTextColor(level: RiskLevel): string {
  if (level === "safe") return "text-emerald-400";
  if (level === "caution") return "text-amber-400";
  return "text-red-400";
}

export function getTrustColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function getTrustGradient(score: number): string {
  if (score >= 80) return "from-emerald-500 to-cyan-500";
  if (score >= 60) return "from-amber-500 to-yellow-500";
  if (score >= 40) return "from-orange-500 to-red-400";
  return "from-red-500 to-rose-600";
}

export function getTrustBg(score: number): string {
  if (score >= 80) return "bg-emerald-500/20 border-emerald-500/30";
  if (score >= 60) return "bg-amber-500/20 border-amber-500/30";
  if (score >= 40) return "bg-orange-500/20 border-orange-500/30";
  return "bg-red-500/20 border-red-500/30";
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "high":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "medium":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "low":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
}
