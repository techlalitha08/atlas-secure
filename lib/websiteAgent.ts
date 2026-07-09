import type { AgentAnalysis, CheckStatus, SecurityCheck } from "./agents/types";
import { scoreToRiskLevel } from "./trustEngine";
import { hashSeed } from "./hash";

const SUSPICIOUS_PATTERNS = [
  /paypa[il1]/i,
  /secure-verify/i,
  /checkout-secure/i,
  /account-update/i,
  /login-verify/i,
  /free-iphone/i,
  /crypto-airdrop/i,
];

const TRUSTED_DOMAINS = [
  "github.com",
  "google.com",
  "microsoft.com",
  "apple.com",
  "stackoverflow.com",
  "wikipedia.org",
  "atlassecure.io",
];

function normalizeUrl(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .split("/")[0]
    .split("?")[0]
    .toLowerCase();
}

function isSuspicious(domain: string): boolean {
  return SUSPICIOUS_PATTERNS.some((p) => p.test(domain));
}

function isTrusted(domain: string): boolean {
  return TRUSTED_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`));
}

function buildChecks(domain: string, trustScore: number): SecurityCheck[] {
  const suspicious = isSuspicious(domain);
  const trusted = isTrusted(domain);
  const seed = hashSeed(domain);

  const sslStatus: CheckStatus = trusted ? "pass" : suspicious ? "warning" : "pass";
  const ageStatus: CheckStatus = suspicious ? "danger" : trusted ? "pass" : "warning";
  const repStatus: CheckStatus =
    trustScore >= 80 ? "pass" : trustScore >= 50 ? "warning" : "danger";

  return [
    {
      name: "SSL Certificate",
      status: sslStatus,
      detail: trusted
        ? "Valid EV certificate"
        : suspicious
          ? "Valid but from free CA, no EV"
          : "Valid — standard CA",
    },
    {
      name: "Domain Age",
      status: ageStatus,
      detail: suspicious
        ? "Registered 3 days ago"
        : trusted
          ? `Registered ${5 + (seed % 10)} years ago`
          : `Registered ${30 + (seed % 300)} days ago`,
    },
    {
      name: "Reputation",
      status: repStatus,
      detail:
        trustScore >= 80
          ? "Clean across threat intelligence feeds"
          : trustScore >= 50
            ? `${2 + (seed % 4)}/89 engines flagged suspicious`
            : `${10 + (seed % 8)}/89 engines flagged malicious`,
    },
    {
      name: "Redirects",
      status: suspicious ? "warning" : "pass",
      detail: suspicious ? `${2 + (seed % 3)} hops through CDN` : "Direct connection",
    },
    {
      name: "JavaScript Analysis",
      status: suspicious ? "danger" : trusted ? "pass" : "warning",
      detail: suspicious
        ? "Keylogger detected in form handler"
        : trusted
          ? "No malicious scripts detected"
          : "Third-party scripts present — review recommended",
    },
    {
      name: "WHOIS Privacy",
      status: suspicious ? "warning" : "pass",
      detail: suspicious ? "Registrant hidden via privacy proxy" : "Registrant publicly listed",
    },
  ];
}

function buildAnalysis(domain: string): AgentAnalysis {
  const suspicious = isSuspicious(domain);
  const trusted = isTrusted(domain);
  const seed = hashSeed(domain);

  let trustScore: number;
  let confidence: number;
  let explanation: string;
  let recommendation: string;
  let evidence: string[];

  if (suspicious) {
    trustScore = 15 + (seed % 20);
    confidence = 90 + (seed % 8);
    explanation = `${domain} exhibits multiple red flags consistent with a phishing operation. The domain was registered recently, uses a free SSL certificate without extended validation, and contains behavior patterns matching known credential-harvesting campaigns.`;
    recommendation =
      "Do NOT enter any credentials or payment information. Block this domain immediately and report it to your security team.";
    evidence = [
      `Domain age: 3 days (registered via privacy proxy)`,
      "SSL: Let's Encrypt, no EV validation",
      `${2 + (seed % 3)} redirect hops through CDN to obfuscated endpoint`,
      "JavaScript keylogger detected in checkout form",
      `VirusTotal: ${10 + (seed % 8)}/89 engines flagged as malicious`,
    ];
  } else if (trusted) {
    trustScore = 88 + (seed % 10);
    confidence = 95 + (seed % 5);
    explanation = `${domain} is a well-established domain with a strong security posture. SSL certificate is valid, domain age is substantial, and no malicious activity has been detected across threat intelligence feeds.`;
    recommendation = "This website appears safe based on current analysis. Always verify the exact URL before entering sensitive information.";
    evidence = [
      "Valid SSL certificate with trusted CA",
      "Clean reputation across 89 threat engines",
      "No suspicious redirects detected",
      "Domain age confirms long-standing presence",
      "No malicious JavaScript detected",
    ];
  } else {
    trustScore = 45 + (seed % 30);
    confidence = 75 + (seed % 15);
    explanation = `${domain} shows mixed signals. While not definitively malicious, several indicators warrant caution including moderate domain age and limited reputation data across threat feeds.`;
    recommendation =
      "Proceed with caution. Avoid entering sensitive data until you can independently verify the site's legitimacy.";
    evidence = [
      `Domain registered ${30 + (seed % 300)} days ago`,
      `${2 + (seed % 4)}/89 engines flagged as suspicious`,
      "Third-party tracking scripts detected",
      "No extended validation SSL certificate",
    ];
  }

  const checks = buildChecks(domain, trustScore);
  const riskLevel = scoreToRiskLevel(trustScore);

  return {
    agentId: "website",
    agentName: "Website Agent",
    target: domain,
    trustScore,
    confidence,
    riskLevel,
    explanation,
    recommendation,
    evidence,
    checks,
    metadata: {
      sslValid: true,
      sslGrade: trusted ? "A" : suspicious ? "B" : "B+",
      sslEv: trusted,
      domainAgeDays: suspicious ? 3 : trusted ? 2000 + (seed % 1000) : 30 + (seed % 300),
      redirectCount: suspicious ? 2 + (seed % 3) : 0,
      reputation: trustScore >= 80 ? "Clean" : trustScore >= 50 ? "Suspicious" : "Malicious",
    },
    latencyMs: 35 + (seed % 40),
  };
}

/** Simulates async website analysis with realistic latency */
export async function analyzeWebsite(input: string): Promise<AgentAnalysis> {
  const domain = normalizeUrl(input);
  const analysis = buildAnalysis(domain);

  await new Promise((r) => setTimeout(r, analysis.latencyMs + 200));

  return analysis;
}

export { normalizeUrl as parseWebsiteTarget };
