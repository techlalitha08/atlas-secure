import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
        variant === "default" && "bg-white/5 text-zinc-300 border-white/10",
        variant === "success" && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        variant === "warning" && "bg-amber-500/20 text-amber-400 border-amber-500/30",
        variant === "danger" && "bg-red-500/20 text-red-400 border-red-500/30",
        variant === "info" && "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
        variant === "outline" && "bg-transparent text-zinc-400 border-white/20",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
