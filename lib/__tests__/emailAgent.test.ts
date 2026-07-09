import { describe, expect, it } from "vitest";
import { analyzeEmail, parseEmailTarget } from "../emailAgent";

describe("parseEmailTarget (extractEmail)", () => {
  it("extracts and lowercases an email address embedded in text", () => {
    expect(parseEmailTarget("Contact me at John.Doe@Example.com please")).toBe(
      "john.doe@example.com"
    );
  });

  it("supports plus-addressing and dashes", () => {
    expect(parseEmailTarget("user+tag@sub-domain.co")).toBe("user+tag@sub-domain.co");
  });

  it("falls back to the trimmed lowercased input when no email is present", () => {
    expect(parseEmailTarget("  No Email Here ")).toBe("no email here");
  });
});

describe("analyzeEmail", () => {
  it("classifies impersonation senders as phishing", async () => {
    const result = await analyzeEmail("From: verify@paypal-security.com");
    expect(result.agentId).toBe("email");
    expect(result.trustScore).toBeLessThan(35);
    expect(result.metadata.phishingDetected).toBe(true);
    expect(result.checks.find((c) => c.name === "SPF")?.status).toBe("danger");
  });

  it("flags phishing based on urgency keywords in the subject", async () => {
    const result = await analyzeEmail("hello@shop.example.com subject: URGENT action required");
    expect(result.metadata.phishingDetected).toBe(true);
    expect(result.metadata.subject).toBe("URGENT action required");
  });

  it("treats verified sender domains as trusted", async () => {
    const result = await analyzeEmail("notifications@google.com");
    expect(result.trustScore).toBeGreaterThanOrEqual(80);
    expect(result.riskLevel).toBe("safe");
    expect(result.metadata.spfPass).toBe(true);
    expect(result.metadata.dmarcPass).toBe(true);
  });

  it("returns a cautious verdict for unknown senders", async () => {
    const result = await analyzeEmail("newsletter@some-startup.io");
    expect(result.metadata.phishingDetected).toBe(false);
    expect(result.trustScore).toBeGreaterThanOrEqual(50);
    expect(result.trustScore).toBeLessThan(75);
  });

  it("always returns the four authentication checks", async () => {
    const result = await analyzeEmail("someone@example.com");
    expect(result.checks.map((c) => c.name)).toEqual(["SPF", "DKIM", "DMARC", "Return-Path"]);
  });

  it("is deterministic for identical input", async () => {
    const [a, b] = await Promise.all([
      analyzeEmail("repeat@example.com"),
      analyzeEmail("repeat@example.com"),
    ]);
    expect(a.trustScore).toBe(b.trustScore);
  });
});
