"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Shield, Sparkles, AlertTriangle, CheckCircle2, FileSearch, Bot } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Button } from "@/components/ui/button";
import { chatSuggestions } from "@/data/mock-data";
import type { AgentId } from "@/lib/agents/types";
import { cn, getTrustColor } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  agentId?: AgentId;
  analysis?: {
    trustScore: number;
    riskScore: number;
    confidence: number;
    explanation: string;
    recommendation: string;
    evidence: string[];
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const saved = window.sessionStorage.getItem("atlas-chat-messages");
      return saved ? (JSON.parse(saved) as Message[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const nextId = useCallback(() => {
    idRef.current += 1;
    return idRef.current;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("atlas-chat-messages", JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || isTyping) return;

    const userMsg: Message = {
      id: nextId(),
      role: "user",
      content: trimmedText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/atlas-secure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmedText,
          systemInstruction:
            "You are Atlas, a senior cybersecurity analyst. Respond clearly, concisely, and helpfully. Focus on security guidance and evidence-based answers.",
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; text?: string; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "Atlas could not generate a response right now.");
      }

      const assistantMsg: Message = {
        id: nextId(),
        role: "assistant",
        content: data.text?.trim() || "Atlas responded without any text.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        agentId: "general",
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      const fallbackMessage = error instanceof Error ? error.message : "Atlas could not respond right now.";
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: `I couldn't reach Atlas right now. ${fallbackMessage}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          agentId: "general",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const agentLabel = (agentId?: AgentId) =>
    agentId === "website" ? "Website Agent" : "Atlas Analyst";

  return (
    <div className="flex flex-col h-screen">
      <TopNavbar title="Atlas AI" subtitle="Your senior cybersecurity analyst" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-20">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 mx-auto mb-4">
                  <Shield className="h-8 w-8 text-cyan-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Ask Atlas anything</h2>
                <p className="text-sm text-zinc-500 mb-2">Your AI-powered cybersecurity analyst</p>
                <p className="text-xs text-zinc-600 mb-8">
                  Website URLs are analyzed by the Website Agent · Other questions use expert mock responses
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {chatSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="glass rounded-full px-4 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className={cn("max-w-[80%]", msg.role === "user" ? "order-first" : "")}>
                    {msg.role === "assistant" && msg.agentId && (
                      <div className="flex items-center gap-1.5 mb-1.5 px-1">
                        <Bot className="h-3 w-3 text-zinc-500" />
                        <span className="text-[10px] text-zinc-500">{agentLabel(msg.agentId)}</span>
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/20 text-white"
                          : "glass text-zinc-300"
                      )}
                    >
                      {msg.content}
                    </div>

                    {msg.analysis && (
                      <div className="mt-3 glass rounded-2xl p-4 space-y-4">
                        <div className="flex items-center gap-6">
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Trust Score</span>
                            <p className={cn("text-2xl font-bold tabular-nums", getTrustColor(msg.analysis.trustScore))}>
                              {msg.analysis.trustScore}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Risk Score</span>
                            <p className={cn("text-2xl font-bold tabular-nums", getTrustColor(100 - msg.analysis.riskScore))}>
                              {msg.analysis.riskScore}
                            </p>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Confidence</span>
                            <p className="text-2xl font-bold text-cyan-400 tabular-nums">{msg.analysis.confidence}%</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                            <span className="text-xs font-semibold text-white">Explanation</span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{msg.analysis.explanation}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-xs font-semibold text-white">Recommendation</span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">{msg.analysis.recommendation}</p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <FileSearch className="h-3.5 w-3.5 text-violet-400" />
                            <span className="text-xs font-semibold text-white">Evidence</span>
                          </div>
                          <div className="space-y-1">
                            {msg.analysis.evidence.map((e) => (
                              <div key={e} className="flex items-start gap-2 text-xs text-zinc-500">
                                <span className="text-cyan-500 mt-0.5">•</span>
                                {e}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] text-zinc-600 mt-1 inline-block px-1">{msg.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="glass rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-2 w-2 rounded-full bg-cyan-400"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-zinc-500">Atlas is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-white/5 p-4 bg-[#050508]/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto">
            {messages.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {chatSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    disabled={isTyping}
                    className="shrink-0 glass rounded-full px-3 py-1 text-[10px] text-zinc-500 hover:text-white transition-colors disabled:opacity-40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder="Ask Atlas about any security concern..."
                disabled={isTyping}
                className="flex-1 h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-50"
              />
              <Button
                onClick={() => sendMessage(input)}
                size="icon"
                className="h-12 w-12 shrink-0"
                disabled={isTyping || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
