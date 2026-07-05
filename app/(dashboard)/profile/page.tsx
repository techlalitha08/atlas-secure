"use client";

import { motion } from "framer-motion";
import { Shield, Mail, Calendar, Scan, Ban, Award } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrustGauge, MiniGauge } from "@/components/atlas/trust-gauge";
import { userProfile, trustScore } from "@/data/mock-data";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div>
      <TopNavbar title="Profile" subtitle="Your account and security overview" />
      <main className="p-6 space-y-6 max-w-4xl mx-auto">
        <Card className="gradient-border">
          <CardContent className="!pt-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-3xl font-bold text-white">
                {userProfile.avatar}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
                <p className="text-sm text-zinc-400 mt-1">{userProfile.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-3 justify-center md:justify-start">
                  <Badge variant="info">{userProfile.role}</Badge>
                  <Badge variant="outline">Member since {userProfile.memberSince}</Badge>
                </div>
              </div>
              <Link href="/settings">
                <Button variant="secondary">Edit Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Scans", value: userProfile.scansTotal.toLocaleString(), icon: Scan },
            { label: "Threats Blocked", value: userProfile.threatsBlocked.toString(), icon: Ban },
            { label: "Trust Score", value: userProfile.trustScore.toString(), icon: Shield },
            { label: "Security Level", value: "Expert", icon: Award },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="!p-4 text-center">
                <stat.icon className="h-5 w-5 text-cyan-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white tabular-nums">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="flex flex-col items-center py-8">
            <TrustGauge score={userProfile.trustScore} size="md" label="Your Trust Score" />
          </Card>

          <Card>
            <CardHeader><CardTitle>Trust Vectors</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <MiniGauge score={trustScore.website} label="Website" />
              <MiniGauge score={trustScore.email} label="Email" />
              <MiniGauge score={trustScore.network} label="Network" />
              <MiniGauge score={trustScore.privacy} label="Privacy" />
              <MiniGauge score={trustScore.device} label="Device" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { action: "Scanned checkout-secure.net", time: "2 min ago", type: "scan" },
              { action: "Blocked phishing email", time: "15 min ago", type: "threat" },
              { action: "Updated network firewall rules", time: "1 hr ago", type: "config" },
              { action: "Generated weekly security report", time: "2 hrs ago", type: "report" },
              { action: "Quarantined flashlight_pro.apk", time: "3 hrs ago", type: "threat" },
            ].map((activity) => (
              <div key={activity.action} className="flex items-center justify-between rounded-xl p-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="text-sm text-zinc-300">{activity.action}</span>
                </div>
                <span className="text-xs text-zinc-600">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
