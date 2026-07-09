import type { AgentAnalysis, CheckStatus, SecurityCheck } from "./agents/types";
import { scoreToRiskLevel } from "./trustEngine";
import { hashSeed } from "./hash";

const PHISHING_SENDER_PATTERNS = [
  /paypa[il1]/i,
  /verify/i,
  /secure-update/i,
  /account-alert/i,
  /company-verify/i,
  /it-support@/i,
  /ceo@.*verify/i,
];

const PHISHING_SUBJECT_KEYWORDS = [
  "urgent",
  "verify your account",
  "suspended",
  "action required",
  "invoice",
  "wire transfer",
  "confidential",
];

const TRUSTED_SENDER_PATTERNS = [
  /@google\.com$/i,
  /@microsoft\.com$/i,
  /@github\.com$/i,
  /@atlassecure\.io$/i,
];

function extractEmail(input: string): string {
  const match = input.match(/[\w.+-]+@[\w.-]+\.\w+/);
  return match ? match[0].toLowerCase() : input.trim().toLowerCase();
}

function extractSubject(input: string): string {
  const subjectMatch = input.match(/subject:\s*(.+)/i);
  if (subjectMatch) return subjectMatch[1].trim();
  for (const kw of PHISHING_SUBJECT_KEYWORDS) {
    if (input.toLowerCase().includes(kw)) return kw;
  }
  return "Unknown subject";
}

function isPhishingSender(email: string): boolean {
  return PHISHING_SENDER_PATTERNS.some((p) => p.test(email));
}

function isTrustedSender(email: string): boolean {
  return TRUSTED_SENDER_PATTERNS.some((p) => p.test(email));
}

function buildAuthChecks(phishing: boolean, trusted: boolean): SecurityCheck[] {
  if (trusted) {
    return [
      { name: "SPF", status: "pass", detail: "Pass — authorized sender" },
      { name: "DKIM", status: "pass", detail: "Valid signature" },
      { name: "DMARC", status: "pass", detail: "Pass — policy enforced" },
      { name: "Return-Path", status: "pass", detail: "Aligned with From header" },
    ];
  }
  if (phishing) {
    return [
      { name: "SPF", status: "danger", detail: "Fail — sender not authorized" },
      { name: "DKIM", status: "danger", detail: "Not signed" },
      { name: "DMARC", status: "danger", detail: "Fail — no alignment" },
      { name: "Return-Path", status: "warning", detail: "Mismatch with From header" },
    ];
  }
  return [
    { name: "SPF", status: "warning", detail: "Soft fail" },
    { name: "DKIM", status: "pass", detail: "Valid signature" },
    { name: "DMARC", status: "warning", detail: "None policy" },
    { name: "Return-Path", status: "pass", detail: "Aligned" },
  ];
}

function buildAnalysis(input: string): AgentAnalysis {
  const sender = extractEmail(input);
  const subject = extractSubject(input);
  const phishing = isPhishingSender(sender) || PHISHING_SUBJECT_KEYWORDS.some((k) => input.toLowerCase().includes(k));
  const trusted = isTrustedSender(sender);
  const seed = hashSeed(sender + subject);

  let trustScore: number;
  let confidence: number;
  let explanation: string;
  let recommendation: string;
  let evidence: string[];

  if (phishing) {
    trustScore = 8 + (seed % 15);
    confidence = 88 + (seed % 10);
    explanation = `This email from ${sender} is a classic phishing attempt. The sender domain uses impersonation tactics, fails all email authentication checks (SPF, DKIM, DMARC), and contains language patterns consistent with credential harvesting or business email compromise (BEC).`;
    recommendation =
      "Do NOT click any links or open attachments. Mark as phishing, block the sender, and report to your IT security team immediately.";
    evidence = [
      `Typosquatting or impersonation domain detected in ${sender}`,
      "SPF, DKIM, and DMARC all failed",
      `Urgency language detected: "${subject}"`,
      "Suspicious link to credential harvester in body",
      "Sender IP from known bulletproof hosting provider",
    ];
  } else if (trusted) {
    trustScore = 90 + (seed % 8);
    confidence = 94 + (seed % 6);
    explanation = `Email from ${sender} passes all authentication checks and originates from a verified, trusted domain with established sender reputation.`;
    recommendation = "This email appears legitimate. As always, verify unexpected requests through a separate communication channel.";
    evidence = [
      "SPF, DKIM, and DMARC all pass",
      "Sender domain has established reputation",
      "No phishing language patterns detected",
      "No suspicious links or attachments",
      "Return-Path aligned with From header",
    ];
  } else {
    trustScore = 50 + (seed % 25);
    confidence = 72 + (seed % 18);
    explanation = `Email from ${sender} shows mixed authentication results. While not definitively malicious, some indicators suggest caution is warranted before taking any action.`;
    recommendation =
      "Verify the sender through an alternative channel before clicking links or providing information. Check the full email headers if unsure.";
    evidence = [
      "Partial email authentication failures",
      "Sender domain has limited reputation history",
      "No known threat intelligence matches",
      "Standard marketing/notification language detected",
    ];
  }

  const checks = buildAuthChecks(phishing, trusted);
  const riskLevel = scoreToRiskLevel(trustScore);

  return {
    agentId: "email",
    agentName: "Email Agent",
    target: sender,
    trustScore,
    confidence,
    riskLevel,
    explanation,
    recommendation,
    evidence,
    checks,
    metadata: {
      subject,
      spfPass: trusted,
      dkimPass: !phishing,
      dmarcPass: trusted,
      phishingDetected: phishing,
    },
    latencyMs: 45 + (seed % 50),
  };
}

/** Simulates async email analysis with realistic latency */
export async function analyzeEmail(input: string): Promise<AgentAnalysis> {
  const analysis = buildAnalysis(input);
  await new Promise((r) => setTimeout(r, analysis.latencyMs + 150));
  return analysis;
}

export { extractEmail as parseEmailTarget };
