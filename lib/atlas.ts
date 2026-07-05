import { analyzeWebsite, parseWebsiteTarget } from "./websiteAgent";
import { computeTrustScore, trustToRiskScore } from "./trustEngine";
import type { AgentAnalysis, AgentId, AtlasResponse } from "./agents/types";

const URL_PATTERN = /(?:https?:\/\/)?(?:www\.)?[\w.-]+\.\w{2,}(?:\/\S*)?/i;

export interface AtlasQuery {
  message: string;
}

interface MockAnalystResponse {
  message: string;
  trustScore: number;
  confidence: number;
  explanation: string;
  recommendation: string;
  evidence: string[];
}

/** Predefined hackathon responses — senior analyst persona */
const ANALYST_RESPONSES: Record<string, MockAnalystResponse> = {
  malware: {
    message:
      "I've analyzed the malware sample you described. This appears to be a trojan dropper variant commonly distributed through fake utility apps. Here's my assessment:",
    trustScore: 18,
    confidence: 91,
    explanation:
      "The APK uses obfuscated DexClassLoader to load a secondary payload at runtime. It requests SMS, contacts, and overlay permissions — far beyond what a legitimate flashlight app needs. The C2 communication uses DNS tunneling to evade firewall detection, and we've matched the hash against 3 active campaigns on VirusTotal.",
    recommendation:
      "Quarantine the device immediately. Revoke all app permissions, uninstall the APK, run a full device scan, and rotate any credentials entered since installation. Block the C2 domain at your network level.",
    evidence: [
      "Hash matched: Trojan.AndroidOS.Agent.eq (VT score 42/89)",
      "Dangerous APIs: Runtime.exec(), DexClassLoader, SmsManager.sendTextMessage()",
      "C2 endpoint: update-cdn-secure.net (185.234.72.19)",
      "Exfiltrates contacts and SMS within 30 seconds of install",
      "Disguised as com.flashlight.pro — 847 similar samples in the wild",
    ],
  },

  trust_score: {
    message:
      "I've reviewed your Digital Trust profile across all 10 vectors. Your overall trust score is 78 — here's why it dropped and what to do about it:",
    trustScore: 78,
    confidence: 94,
    explanation:
      "Your score decreased 3 points this week. The primary drivers are a malicious website scan (checkout-secure.net, trust: 23), an outdated IoT camera firmware (trust: 45), and a suspicious APK (flashlight_pro.apk, trust: 34). Your strongest vectors are device health (91) and voice authentication (95).",
    recommendation:
      "Priority actions: (1) Update Security Camera firmware to v2.1.0, (2) Uninstall flashlight_pro.apk and revoke its permissions, (3) Enable 2FA on all email accounts, (4) Add checkout-secure.net to your blocklist.",
    evidence: [
      "Website trust: 85 → impacted by phishing scan",
      "Network trust: 68 — DNS anomalies detected yesterday",
      "IoT trust: 62 — camera firmware 2 versions behind",
      "Email trust: 72 — BEC attempt blocked today",
      "3 threats blocked in the last 24 hours",
    ],
  },

  network: {
    message:
      "I've completed a network security sweep of your environment. Here's what my Network Agent found:",
    trustScore: 68,
    confidence: 88,
    explanation:
      "Your network trust score is 68/100. DNS filtering blocked 59 malicious queries today, including connections to known C2 infrastructure. One device (192.168.1.45) attempted DNS tunneling, which has been flagged. VPN encryption is active and firewall rules are 91% optimal.",
    recommendation:
      "Investigate the device at 192.168.1.45 — it may be compromised. Update firewall rules to block outbound DNS on non-standard ports. Consider enabling network segmentation for IoT devices.",
    evidence: [
      "59 DNS threats blocked in the last 24 hours",
      "Suspicious query: malware-c2.evil.io (12 attempts, blocked)",
      "DNS tunneling attempt from 192.168.1.45 — investigating",
      "VPN status: Active (WireGuard, AES-256)",
      "128 threats blocked by DNS filter this week",
    ],
  },

  email_phishing: {
    message:
      "Based on the phishing patterns you're asking about, here's my analysis of common BEC and credential-harvesting tactics we're seeing this week:",
    trustScore: 15,
    confidence: 89,
    explanation:
      "Phishing campaigns are up 47% this week. The most common vectors are typosquatted domains (paypa1-verify.com), urgency-driven subject lines, and spoofed sender addresses that fail SPF/DKIM/DMARC. Paste a specific sender address for a targeted scan.",
    recommendation:
      "Never click links in unsolicited emails. Verify sender identity through a separate channel. Enable DMARC enforcement on your domain. Use the Email Scanner for any suspicious message.",
    evidence: [
      "47% increase in credential harvesting attempts this week",
      "Top impersonated brands: PayPal, Microsoft, DHL",
      "Average time-to-click on phishing links: 4.2 minutes",
      "SPF/DKIM/DMARC failures present in 89% of blocked phishing",
      "BEC attempt blocked today from ceo@company-verify.io",
    ],
  },

  deepfake: {
    message:
      "Deepfake and voice-cloning attacks are a growing threat vector. Here's what you should know and how Atlas protects against them:",
    trustScore: 72,
    confidence: 93,
    explanation:
      "AI-generated voice clones can now replicate a speaker with 87% accuracy using just 30 seconds of audio. We've detected 2 voice-cloning attempts this month targeting executive impersonation. Our Voice Agent analyzes spectral artifacts and blink patterns to detect synthesis.",
    recommendation:
      "Establish a verbal passphrase for sensitive requests over phone. Use the Deepfake Detector and Voice Analyzer before trusting media. Enable callback verification for wire transfers.",
    evidence: [
      "2 deepfake voice calls flagged this month",
      "GAN artifact detection accuracy: 94%",
      "Average clone detection time: 1.2 seconds",
      "Executive impersonation attempts up 340% YoY",
    ],
  },

  qr: {
    message:
      "QR code attacks are increasingly common — attackers replace legitimate codes with malicious redirects. Here's my guidance:",
    trustScore: 81,
    confidence: 90,
    explanation:
      "Malicious QR codes typically redirect to phishing pages or trigger automatic APK downloads. Always preview the destination URL before proceeding. Our QR Agent checks redirect chains, SSL validity, and domain reputation in under 500ms.",
    recommendation:
      "Use the QR Scanner before scanning unknown codes. Never scan codes from unsolicited emails or stickers in public places without verification.",
    evidence: [
      "QR phishing incidents up 587% since 2024",
      "Average redirect chain in malicious QRs: 3 hops",
      "Most common target: fake payment pages",
      "Your last QR scan scored 94/100 (safe)",
    ],
  },

  general: {
    message:
      "I'm Atlas, your AI security analyst. I coordinate 12 specialist agents to help you answer one question: \"Can I trust this?\"",
    trustScore: 78,
    confidence: 85,
    explanation:
      "I can analyze websites, emails, APKs, QR codes, documents, voice recordings, and network traffic. Paste a URL for instant website analysis, or ask me about malware, your trust score, network security, phishing, or deepfakes.",
    recommendation:
      "Try asking: \"Analyze checkout-secure.net\" or \"Why is my trust score low?\" for a detailed assessment with evidence and recommendations.",
    evidence: [
      "12 AI agents online and ready",
      "Trust Engine computing across 10 vectors",
      "3 threats blocked in the last 24 hours",
      "Overall platform trust score: 78/100",
    ],
  },

  website_prompt: {
    message:
      "I can run a full trust analysis on any website — SSL, domain age, reputation, redirects, and behavioral analysis. Just share the URL you'd like me to check.",
    trustScore: 50,
    confidence: 80,
    explanation:
      "Website analysis requires a target URL. I'll route your request to the Website Agent, which checks SSL certificates, WHOIS data, threat intelligence feeds, redirect chains, and JavaScript behavior patterns.",
    recommendation:
      "Paste a full URL or domain — for example: checkout-secure.net or github.com",
    evidence: [
      "Website Agent latency: ~40ms average",
      "Checks 6 security vectors per scan",
      "Cross-references 89 threat intelligence engines",
    ],
  },
};

export type ChatIntent =
  | "website"
  | "malware"
  | "trust_score"
  | "network"
  | "email_phishing"
  | "deepfake"
  | "qr"
  | "website_prompt"
  | "general";

/** Detect intent — website with URL routes to Website Agent; everything else uses mock analyst responses */
export function detectIntent(message: string): ChatIntent {
  const lower = message.toLowerCase();

  const hasUrl = URL_PATTERN.test(message);
  const isWebsiteQuery =
    hasUrl ||
    /\b(website|url|domain|site)\b/.test(lower) ||
    /\banalyze\b.*\b(site|url|domain|website)\b/.test(lower);

  if (isWebsiteQuery) {
    return hasUrl ? "website" : "website_prompt";
  }

  if (/\b(malware|virus|trojan|ransomware|apk|payload)\b/.test(lower)) return "malware";
  if (/\b(trust score|trust score|why is my|score low|score drop)\b/.test(lower)) return "trust_score";
  if (/\b(network|dns|firewall|wifi|vpn|scan my network)\b/.test(lower)) return "network";
  if (/\b(email|phishing|bec|inbox|sender|spam)\b/.test(lower)) return "email_phishing";
  if (/\b(deepfake|voice clone|synthetic|fake video|fake audio)\b/.test(lower)) return "deepfake";
  if (/\b(qr|qrcode|qr code|barcode)\b/.test(lower)) return "qr";

  return "general";
}

function extractWebsiteUrl(message: string): string | null {
  const match = message.match(URL_PATTERN);
  return match ? parseWebsiteTarget(match[0]) : null;
}

function mockToAnalysis(intent: ChatIntent, mock: MockAnalystResponse): AgentAnalysis {
  const trustScore = mock.trustScore;
  return {
    agentId: "general",
    agentName: "Atlas Security Analyst",
    target: intent,
    trustScore,
    confidence: mock.confidence,
    riskLevel: trustScore >= 80 ? "safe" : trustScore >= 60 ? "caution" : trustScore >= 35 ? "danger" : "critical",
    explanation: mock.explanation,
    recommendation: mock.recommendation,
    evidence: mock.evidence,
    checks: [],
    metadata: { intent, responseType: "predefined" },
    latencyMs: 600 + Math.floor(Math.random() * 400),
  };
}

function buildAtlasMessage(analysis: AgentAnalysis, intent?: ChatIntent): string {
  if (analysis.agentId === "website") {
    const verdict =
      analysis.riskLevel === "critical" || analysis.riskLevel === "danger"
        ? "significant threats detected"
        : analysis.riskLevel === "caution"
          ? "mixed signals that warrant caution"
          : "no significant threats";
    return `I've completed a comprehensive analysis of ${analysis.target}. This domain shows ${verdict}. Trust score: ${analysis.trustScore}/100.`;
  }

  if (intent && ANALYST_RESPONSES[intent]) {
    return ANALYST_RESPONSES[intent].message;
  }

  return analysis.explanation;
}

function toAtlasResponse(analysis: AgentAnalysis, intent?: ChatIntent): AtlasResponse {
  const trust = computeTrustScore([analysis]);

  return {
    message: buildAtlasMessage(analysis, intent),
    agentId: analysis.agentId,
    analysis: {
      trustScore: analysis.agentId === "website" ? analysis.trustScore : trust.overall,
      riskScore: trustToRiskScore(analysis.trustScore),
      confidence: analysis.confidence,
      explanation: analysis.explanation,
      recommendation: analysis.recommendation,
      evidence: analysis.evidence,
    },
    trust,
    raw: analysis,
  };
}

async function simulateThinking(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

/**
 * Main Atlas orchestrator for chat.
 * Website URLs → Website Agent. All other queries → predefined analyst responses.
 */
export async function analyze(query: AtlasQuery | string): Promise<AtlasResponse> {
  const message = typeof query === "string" ? query : query.message;
  const intent = detectIntent(message);

  // Route to Website Agent when a URL is present
  if (intent === "website") {
    const url = extractWebsiteUrl(message)!;
    const analysis = await analyzeWebsite(url);
    return toAtlasResponse({ ...analysis, agentId: "website" });
  }

  // Predefined analyst response for everything else
  const mockKey = intent === "website_prompt" ? "website_prompt" : intent;
  const mock = ANALYST_RESPONSES[mockKey] ?? ANALYST_RESPONSES.general;
  await simulateThinking(mockToAnalysis(intent, mock).latencyMs);
  const analysis = mockToAnalysis(intent, mock);

  return toAtlasResponse(analysis, mockKey as ChatIntent);
}

/** @deprecated Use detectIntent — kept for compatibility */
export function detectAgent(message: string): AgentId {
  return detectIntent(message) === "website" ? "website" : "general";
}

export { detectIntent as parseIntent };
