"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { notifications } from "@/data/mock-data";
import { motion, AnimatePresence } from "framer-motion";

interface TopNavbarProps {
  title?: string;
  subtitle?: string;
}

export function TopNavbar({ title, subtitle }: TopNavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#050508]/60 backdrop-blur-xl px-6">
      <div>
        {title && <h1 className="text-lg font-semibold text-white">{title}</h1>}
        {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition-all"
        >
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-4 flex items-center gap-0.5 rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-500">
            <Command className="h-3 w-3" />K
          </kbd>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-12 w-80 glass-strong rounded-2xl p-2 shadow-2xl"
              >
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                </div>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "rounded-xl p-3 hover:bg-white/5 transition-colors cursor-pointer",
                      n.unread && "bg-cyan-500/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <span className="text-[10px] text-zinc-500 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => router.push("/profile")}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 text-sm font-bold text-white"
        >
          AC
        </button>
      </div>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              className="w-full max-w-lg glass-strong rounded-2xl p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Input placeholder="Search scans, threats, agents..." autoFocus className="h-12" />
              <div className="mt-3 space-y-1">
                {["Dashboard", "Website Scanner", "Trust Center", "Atlas AI"].map((item) => (
                  <button
                    key={item}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
