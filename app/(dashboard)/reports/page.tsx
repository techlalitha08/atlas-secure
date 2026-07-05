"use client";

import { motion } from "framer-motion";
import { FileBarChart, Download, Eye, Calendar, FileText } from "lucide-react";
import { TopNavbar } from "@/components/layout/top-navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reports } from "@/data/mock-data";

const typeColors: Record<string, "info" | "danger" | "success" | "warning" | "outline"> = {
  Summary: "info",
  Incident: "danger",
  Analytics: "success",
  Audit: "warning",
};

export default function ReportsPage() {
  return (
    <div>
      <TopNavbar title="Reports" subtitle="Security reports and analytics" />
      <main className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Reports", value: reports.length.toString() },
            { label: "This Month", value: "2" },
            { label: "Incidents", value: "1" },
            { label: "Last Generated", value: "Jul 1" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="!p-4">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>All Reports</CardTitle>
            <Button size="sm">
              <FileBarChart className="h-4 w-4" />
              Generate Report
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-xl p-4 border border-white/5 hover:bg-white/[0.03] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 group-hover:bg-cyan-500/10 transition-colors">
                    <FileText className="h-5 w-5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{report.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{report.date}
                      </span>
                      <span className="text-xs text-zinc-600">{report.pages} pages</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={typeColors[report.type] || "outline"}>{report.type}</Badge>
                  <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
