export const trustScore = {
  overall: 78,
  website: 85,
  email: 72,
  device: 91,
  network: 68,
  privacy: 74,
  documents: 88,
  voice: 95,
  iot: 62,
  cloud: 79,
  qr: 81,
};

export const dashboardStats = {
  deviceHealth: 91,
  websiteTrust: 85,
  networkTrust: 68,
  privacyTrust: 74,
  emailTrust: 72,
  todayThreats: 3,
};

export const recentScans = [
  { id: 1, type: "Website", target: "checkout-secure.net", score: 23, status: "danger", time: "2 min ago" },
  { id: 2, type: "Email", target: "invoice@paypa1-verify.com", score: 12, status: "danger", time: "15 min ago" },
  { id: 3, type: "QR Code", target: "Event ticket QR", score: 94, status: "success", time: "1 hr ago" },
  { id: 4, type: "APK", target: "flashlight_pro.apk", score: 34, status: "warning", time: "2 hrs ago" },
  { id: 5, type: "Document", target: "contract_v2.pdf", score: 88, status: "success", time: "3 hrs ago" },
];

export const recommendedActions = [
  { id: 1, title: "Revoke suspicious app permissions", priority: "high", icon: "shield" },
  { id: 2, title: "Enable 2FA on email accounts", priority: "medium", icon: "mail" },
  { id: 3, title: "Update IoT device firmware", priority: "high", icon: "wifi" },
  { id: 4, title: "Review network firewall rules", priority: "low", icon: "network" },
];

export const threatTimeline = [
  { id: 1, time: "09:42", title: "Phishing attempt blocked", severity: "high", type: "email" },
  { id: 2, time: "11:15", title: "Suspicious DNS query detected", severity: "medium", type: "network" },
  { id: 3, time: "13:30", title: "Malicious APK quarantined", severity: "critical", type: "apk" },
  { id: 4, time: "14:55", title: "Deepfake voice call flagged", severity: "high", type: "voice" },
  { id: 5, time: "16:20", title: "QR redirect to phishing site", severity: "medium", type: "qr" },
];

export const aiActivity = [
  { agent: "Website Agent", action: "Analyzing checkout-secure.net SSL chain", status: "active" },
  { agent: "Threat Intel", action: "Cross-referencing IOC database", status: "active" },
  { agent: "Email Agent", action: "Scanning inbox for BEC patterns", status: "idle" },
  { agent: "Network Agent", action: "Monitoring DNS traffic anomalies", status: "active" },
  { agent: "Trust Engine", action: "Recalculating composite trust score", status: "active" },
];

export const agents = [
  { id: "website", name: "Website Agent", status: "active", confidence: 94, task: "Analyzing SSL certificate chain", health: 98, latency: 42, icon: "globe" },
  { id: "qr", name: "QR Agent", status: "idle", confidence: 91, task: "Awaiting scan request", health: 100, latency: 28, icon: "qr" },
  { id: "email", name: "Email Agent", status: "active", confidence: 88, task: "Scanning phishing patterns", health: 95, latency: 56, icon: "mail" },
  { id: "apk", name: "APK Agent", status: "thinking", confidence: 76, task: "Decompiling suspicious APK", health: 92, latency: 124, icon: "smartphone" },
  { id: "vision", name: "Vision Agent", status: "idle", confidence: 97, task: "Standby for deepfake analysis", health: 99, latency: 38, icon: "eye" },
  { id: "voice", name: "Voice Agent", status: "active", confidence: 93, task: "Voiceprint authentication", health: 96, latency: 67, icon: "mic" },
  { id: "network", name: "Network Agent", status: "active", confidence: 85, task: "Monitoring DNS anomalies", health: 94, latency: 31, icon: "wifi" },
  { id: "privacy", name: "Privacy Agent", status: "idle", confidence: 90, task: "Data leak monitoring", health: 97, latency: 45, icon: "lock" },
  { id: "threat", name: "Threat Intelligence", status: "active", confidence: 92, task: "IOC correlation engine", health: 98, latency: 52, icon: "alert" },
  { id: "forensics", name: "Forensics Agent", status: "idle", confidence: 89, task: "Evidence chain standby", health: 96, latency: 78, icon: "search" },
  { id: "trust", name: "Trust Engine", status: "active", confidence: 96, task: "Computing trust vectors", health: 99, latency: 22, icon: "shield" },
  { id: "orchestrator", name: "Atlas Orchestrator", status: "active", confidence: 99, task: "Coordinating 11 agents", health: 100, latency: 15, icon: "brain" },
];

export const chatMessages = [
  {
    id: 1,
    role: "user" as const,
    content: "Atlas, analyze this website: checkout-secure.net",
    timestamp: "10:32 AM",
  },
  {
    id: 2,
    role: "assistant" as const,
    content: "I've completed a comprehensive analysis of checkout-secure.net. This domain exhibits multiple red flags consistent with a phishing operation targeting payment credentials.",
    timestamp: "10:32 AM",
    analysis: {
      riskScore: 23,
      confidence: 94,
      explanation: "Domain registered 3 days ago, SSL certificate from free CA, mimics PayPal checkout flow, contains hidden form fields capturing card data.",
      recommendation: "Do NOT enter any payment information. Block this domain immediately and report to your security team.",
      evidence: [
        "Domain age: 3 days (registered via privacy proxy)",
        "SSL: Let's Encrypt, no EV validation",
        "3 redirect hops through CDN to obfuscated endpoint",
        "JavaScript keylogger detected in checkout form",
        "VirusTotal: 12/89 engines flagged as malicious",
      ],
    },
  },
];

export const chatSuggestions = [
  "Atlas, analyze this website",
  "Atlas, explain this malware",
  "Atlas, why is my trust score low?",
  "Atlas, scan my network",
  "Atlas, check this email for phishing",
];

export const threats = [
  { id: 1, title: "Credential Harvesting Campaign", severity: "critical", type: "Phishing", source: "checkout-secure.net", time: "2 min ago", status: "blocked" },
  { id: 2, title: "DNS Tunneling Attempt", severity: "high", type: "Network", source: "192.168.1.45", time: "45 min ago", status: "investigating" },
  { id: 3, title: "Trojan APK Detected", severity: "critical", type: "Malware", source: "flashlight_pro.apk", time: "2 hrs ago", status: "quarantined" },
  { id: 4, title: "BEC Email Pattern", severity: "high", type: "Email", source: "ceo@company-verify.io", time: "4 hrs ago", status: "blocked" },
  { id: 5, title: "IoT Botnet Probe", severity: "medium", type: "IoT", source: "Smart Camera #3", time: "6 hrs ago", status: "mitigated" },
];

export const websiteScanResult = {
  url: "checkout-secure.net",
  trustScore: 23,
  ssl: { valid: true, issuer: "Let's Encrypt", grade: "B", ev: false },
  domainAge: "3 days",
  reputation: "Malicious",
  redirects: 3,
  aiExplanation: "This website is a sophisticated phishing clone designed to harvest payment credentials. The domain was registered recently using a privacy proxy, and the SSL certificate lacks extended validation.",
  checks: [
    { name: "SSL Certificate", status: "warning", detail: "Valid but from free CA, no EV" },
    { name: "Domain Age", status: "danger", detail: "Registered 3 days ago" },
    { name: "Reputation", status: "danger", detail: "12/89 engines flagged malicious" },
    { name: "Redirects", status: "warning", detail: "3 hops through CDN" },
    { name: "JavaScript Analysis", status: "danger", detail: "Keylogger detected" },
    { name: "WHOIS Privacy", status: "warning", detail: "Registrant hidden" },
  ],
};

export const apkScanResult = {
  name: "flashlight_pro.apk",
  trustScore: 34,
  permissions: [
    { name: "CAMERA", risk: "low" },
    { name: "INTERNET", risk: "low" },
    { name: "READ_CONTACTS", risk: "high" },
    { name: "READ_SMS", risk: "critical" },
    { name: "RECORD_AUDIO", risk: "high" },
    { name: "ACCESS_FINE_LOCATION", risk: "medium" },
    { name: "SYSTEM_ALERT_WINDOW", risk: "high" },
  ],
  dangerousApis: ["Runtime.exec()", "DexClassLoader", "SmsManager.sendTextMessage()"],
  trackers: ["Adjust SDK", "Facebook Analytics", "Unknown C2 endpoint"],
};

export const forensicsData = {
  incident: "Operation ShadowPay",
  severity: "Critical",
  duration: "4h 23m",
  affectedSystems: 3,
  latestScan: {
    target: "checkout-secure.net",
    platform: "Website + Email + Endpoint",
    timestamp: "2026-07-05 14:42 UTC",
    trustScore: 23,
    summary: "The latest scan confirmed a credential-harvesting phishing clone with suspicious beaconing and a macro-enabled attachment chain.",
  },
  attackPath: [
    { step: "Initial access", detail: "A finance employee opened a spearphishing invoice attachment that delivered a macro-enabled payload.", source: "Email" },
    { step: "Execution", detail: "Embedded PowerShell executed in memory and established persistence through a scheduled task.", source: "Endpoint" },
    { step: "Privilege escalation", detail: "The payload abused a local service misconfiguration to elevate to SYSTEM privileges.", source: "Host" },
    { step: "Lateral movement", detail: "Atlas detected SMB reconnaissance and remote execution against the file server over the internal network.", source: "Network" },
    { step: "Exfiltration", detail: "Encrypted archives totaling 2.4 GB were transmitted to a command-and-control endpoint.", source: "C2" },
  ],
  mitreTechniques: [
    { id: "T1566.001", name: "Spearphishing Attachment", tactic: "Initial Access" },
    { id: "T1059.001", name: "PowerShell", tactic: "Execution" },
    { id: "T1071.001", name: "Web Protocols", tactic: "Command and Control" },
    { id: "T1041", name: "Exfiltration Over C2", tactic: "Exfiltration" },
    { id: "T1486", name: "Data Encrypted for Impact", tactic: "Impact" },
  ],
  timeline: [
    { time: "09:14", event: "Phishing email delivered", severity: "medium" },
    { time: "09:22", event: "User opened malicious attachment", severity: "high" },
    { time: "09:23", event: "PowerShell payload executed", severity: "critical" },
    { time: "09:45", event: "Lateral movement to file server", severity: "critical" },
    { time: "10:12", event: "C2 beacon established", severity: "high" },
    { time: "11:30", event: "Data exfiltration detected (2.4 GB)", severity: "critical" },
    { time: "13:37", event: "Incident contained by Atlas", severity: "low" },
  ],
  iocs: [
    { type: "IP", value: "185.234.72.19", confidence: 98 },
    { type: "Domain", value: "update-cdn-secure.net", confidence: 95 },
    { type: "Hash", value: "a3f2b8c1d4e5f6789012345678901234", confidence: 99 },
    { type: "Email", value: "it-support@company-verify.io", confidence: 92 },
  ],
  evidence: [
    { title: "Mailbox export", type: "Email", description: "Recovered phishing message and attachment metadata from the finance inbox.", source: "Exchange snapshot" },
    { title: "Memory image", type: "Endpoint", description: "Captured PowerShell process tree and command-line arguments from the affected host.", source: "Volatility" },
    { title: "Network capture", type: "Network", description: "TLS beacon traffic and DNS lookups tied to the suspicious domain were preserved.", source: "PCAP" },
    { title: "File server logs", type: "System", description: "Authentication and SMB access events confirmed lateral movement to the file server.", source: "Windows Event Logs" },
  ],
  rootCause: "Spearphishing email with macro-enabled document bypassed email filter due to compromised sender reputation. User executed embedded PowerShell payload granting initial access.",
  summary: "Atlas correlated the phishing email, macro execution, PowerShell launch, lateral movement, and outbound command-and-control traffic into a single intrusion chain and contained the spread within 4 hours.",
};

export const iotDevices = [
  { id: 1, name: "Smart Thermostat", type: "Climate", ip: "192.168.1.10", trust: 92, firmware: "v3.2.1", status: "online", health: 95 },
  { id: 2, name: "Security Camera", type: "Camera", ip: "192.168.1.15", trust: 45, firmware: "v1.0.3", status: "warning", health: 62 },
  { id: 3, name: "Smart Lock", type: "Access", ip: "192.168.1.20", trust: 88, firmware: "v2.1.0", status: "online", health: 90 },
  { id: 4, name: "Smart Speaker", type: "Audio", ip: "192.168.1.25", trust: 78, firmware: "v4.0.2", status: "online", health: 85 },
  { id: 5, name: "Smart TV", type: "Display", ip: "192.168.1.30", trust: 71, firmware: "v5.1.0", status: "online", health: 80 },
  { id: 6, name: "Router Gateway", type: "Network", ip: "192.168.1.1", trust: 85, firmware: "v8.2.4", status: "online", health: 94 },
];

export const notifications = [
  { id: 1, title: "Critical threat blocked", message: "Phishing site checkout-secure.net quarantined", time: "2m", unread: true },
  { id: 2, title: "Trust score updated", message: "Overall trust decreased by 3 points", time: "15m", unread: true },
  { id: 3, title: "Scan complete", message: "APK analysis finished for flashlight_pro.apk", time: "2h", unread: false },
  { id: 4, title: "Agent alert", message: "Network Agent detected DNS anomaly", time: "4h", unread: false },
];

export const securityInsights = [
  { title: "Phishing surge detected", description: "47% increase in credential harvesting attempts this week", trend: "up" },
  { title: "IoT vulnerability", description: "Security Camera firmware is 2 versions behind", trend: "warning" },
  { title: "Network improvement", description: "DNS filtering blocked 128 threats today", trend: "down" },
];

export const reports = [
  { id: 1, title: "Weekly Security Summary", date: "Jul 1, 2026", type: "Summary", pages: 12 },
  { id: 2, title: "Incident Report - Operation ShadowPay", date: "Jun 28, 2026", type: "Incident", pages: 24 },
  { id: 3, title: "Trust Score Analysis Q2", date: "Jun 15, 2026", type: "Analytics", pages: 18 },
  { id: 4, title: "IoT Security Audit", date: "Jun 1, 2026", type: "Audit", pages: 32 },
];

export const userProfile = {
  name: "Alex Chen",
  email: "alex.chen@atlassecure.io",
  role: "Security Analyst",
  avatar: "AC",
  memberSince: "Jan 2026",
  scansTotal: 1247,
  threatsBlocked: 89,
  trustScore: 78,
};
