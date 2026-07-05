"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield, Globe, QrCode, Mail, Smartphone, Mic, FileText, Wifi,
  ArrowRight, Sparkles, CheckCircle2, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const trustQuestions = [
  { icon: Globe, question: "Can I trust this website?" },
  { icon: QrCode, question: "Can I trust this QR?" },
  { icon: Smartphone, question: "Can I trust this APK?" },
  { icon: Mail, question: "Can I trust this email?" },
  { icon: Mic, question: "Can I trust this voice?" },
  { icon: FileText, question: "Can I trust this document?" },
  { icon: Wifi, question: "Can I trust this WiFi?" },
];

const features = [
  { title: "Multi-Agent AI", desc: "12 specialized AI agents analyze every digital interaction in real-time." },
  { title: "Trust Scoring", desc: "Unified trust score across websites, emails, devices, networks, and more." },
  { title: "Threat Intelligence", desc: "Proactive threat detection with MITRE ATT&CK mapping and forensics." },
  { title: "Instant Analysis", desc: "Sub-second analysis powered by Atlas Orchestrator coordinating all agents." },
];

export default function LandingPage() {
  return (
    <div className="mesh-bg grid-bg min-h-screen overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050508]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">ATLAS SECURE</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get Started <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs text-cyan-400 mb-8">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Digital Trust Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Can I trust this?</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 mb-4 font-light">
              Predict. Verify. Protect.
            </p>
            <p className="text-base text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Atlas Secure is not an antivirus. Not another chatbot. It&apos;s an AI-powered
              Digital Trust Platform that helps you make safer digital decisions — powered by
              multiple specialized AI agents working in harmony.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg">
                  Launch Dashboard <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="secondary" size="lg">
                  Talk to Atlas AI
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Trust Gauge Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="glass-strong rounded-3xl p-8 max-w-3xl mx-auto gradient-border">
              <div className="grid grid-cols-3 gap-6 items-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-emerald-400 tabular-nums">78</div>
                  <div className="text-xs text-zinc-500 mt-1">Trust Score</div>
                </div>
                <div className="col-span-2 space-y-3 text-left">
                  {[
                    { label: "Website Trust", score: 85, color: "bg-emerald-500" },
                    { label: "Network Trust", score: 68, color: "bg-amber-500" },
                    { label: "Email Trust", score: 72, color: "bg-cyan-500" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400">{item.label}</span>
                        <span className="text-zinc-300 tabular-nums">{item.score}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-3xl blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Trust Questions */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">Everything revolves around</h2>
          <p className="text-center text-zinc-500 mb-12 text-lg">Digital Trust</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {trustQuestions.map((item, i) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 group cursor-default"
              >
                <item.icon className="h-8 w-8 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-white">{item.question}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-8 hover:bg-white/[0.06] transition-all"
              >
                <Zap className="h-6 w-6 text-violet-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Not Section */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          {[
            "Atlas Secure is NOT an antivirus.",
            "Atlas Secure is NOT another chatbot.",
            "Atlas Secure IS an AI-powered Digital Trust Platform.",
          ].map((text, i) => (
            <motion.p
              key={text}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`text-lg ${i === 2 ? "gradient-text font-bold text-xl" : "text-zinc-500"}`}
            >
              {i < 2 && <CheckCircle2 className="inline h-5 w-5 mr-2 text-zinc-600" />}
              {text}
            </motion.p>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-2xl text-center glass-strong rounded-3xl p-12 gradient-border">
          <h2 className="text-3xl font-bold mb-4">Start making safer decisions</h2>
          <p className="text-zinc-400 mb-8">Join the future of digital trust. Powered by AI. Built for humans.</p>
          <Link href="/login">
            <Button size="lg">Get Started Free <ArrowRight className="h-5 w-5" /></Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-semibold">ATLAS SECURE</span>
          </div>
          <p className="text-xs text-zinc-600">Predict. Verify. Protect. &copy; 2026 Atlas Secure</p>
        </div>
      </footer>
    </div>
  );
}
