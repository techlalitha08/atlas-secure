"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, scanItems, securityItems, bottomItems } from "@/lib/navigation";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link href={href}>
        <motion.div
          whileHover={{ x: 2 }}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
            isActive
              ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/10 text-white border border-cyan-500/20"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-cyan-400")} />
          {!collapsed && <span className="truncate">{label}</span>}
        </motion.div>
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/5 bg-[#050508]/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 shrink-0">
          <Shield className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold tracking-tight text-white">ATLAS SECURE</h1>
            <p className="text-[10px] text-zinc-500 tracking-wider">DIGITAL TRUST</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        <div className="space-y-1">
          {!collapsed && <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">Overview</p>}
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        <div className="space-y-1">
          {!collapsed && <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">Scanners</p>}
          {scanItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>

        <div className="space-y-1">
          {!collapsed && <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 mb-2">Security</p>}
          {securityItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
      </nav>

      <div className="border-t border-white/5 p-3 space-y-1">
        {bottomItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
