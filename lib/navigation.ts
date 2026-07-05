import {
  LayoutDashboard, MessageSquare, Bot, Shield, AlertTriangle,
  Globe, QrCode, Mail, Smartphone, Eye, Mic, FileText, Wifi,
  Lock, Search, Home, FileBarChart, Settings, User,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "main" },
  { label: "Atlas AI", href: "/chat", icon: MessageSquare, section: "main" },
  { label: "AI Agents", href: "/agents", icon: Bot, section: "main" },
  { label: "Trust Center", href: "/trust", icon: Shield, section: "main" },
  { label: "Threat Center", href: "/threats", icon: AlertTriangle, section: "main" },
];

export const scanItems = [
  { label: "Website Scanner", href: "/scan/website", icon: Globe },
  { label: "QR Scanner", href: "/scan/qr", icon: QrCode },
  { label: "Email Scanner", href: "/scan/email", icon: Mail },
  { label: "APK Scanner", href: "/scan/apk", icon: Smartphone },
  { label: "Deepfake Detection", href: "/scan/deepfake", icon: Eye },
  { label: "Voice Analysis", href: "/scan/voice", icon: Mic },
  { label: "Document Verification", href: "/scan/document", icon: FileText },
];

export const securityItems = [
  { label: "Network Security", href: "/network", icon: Wifi },
  { label: "Privacy Center", href: "/privacy", icon: Lock },
  { label: "Digital Forensics", href: "/forensics", icon: Search },
  { label: "IoT Dashboard", href: "/iot", icon: Home },
  { label: "Reports", href: "/reports", icon: FileBarChart },
];

export const bottomItems = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Profile", href: "/profile", icon: User },
];

export const keyboardShortcuts = [
  { key: "⌘ K", action: "Search" },
  { key: "⌘ D", action: "Dashboard" },
  { key: "⌘ /", action: "Atlas AI" },
  { key: "⌘ T", action: "Trust Center" },
];
