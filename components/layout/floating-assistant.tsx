"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, X } from "lucide-react";
import { useState } from "react";

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-shadow"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </motion.button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed bottom-24 right-6 z-50 w-80 glass-strong rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-cyan-500/20 to-violet-500/20 px-4 py-3 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Atlas Assistant</h3>
            <p className="text-xs text-zinc-400">Your AI security analyst</p>
          </div>
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-zinc-300">
                I detected 3 new threats today. Your trust score dropped slightly due to a suspicious website scan. Want me to explain?
              </p>
            </div>
          </div>
          <div className="p-3 border-t border-white/5">
            <Link
              href="/chat"
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-2.5 text-sm font-medium text-white hover:brightness-110 transition-all"
              onClick={() => setOpen(false)}
            >
              Open Atlas AI Chat
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
}
