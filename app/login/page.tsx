"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 800);
  };

  return (
    <div className="mesh-bg grid-bg min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to Atlas Secure</h1>
          <p className="text-sm text-zinc-500">Sign in to your Digital Trust Platform</p>
        </div>

        <div className="glass-strong rounded-2xl p-8 gradient-border">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  type="email"
                  placeholder="alex.chen@atlassecure.io"
                  defaultValue="alex.chen@atlassecure.io"
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-zinc-400">
                <input type="checkbox" defaultChecked className="rounded border-white/20" />
                Remember me
              </label>
              <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300">
                Forgot password?
              </button>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Authenticating..." : "Sign In"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-zinc-500">
              Demo mode — click Sign In to enter the dashboard
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
