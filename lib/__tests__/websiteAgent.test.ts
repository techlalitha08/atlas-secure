import { describe, expect, it } from "vitest";
import { analyzeWebsite, parseWebsiteTarget } from "../websiteAgent";

describe("parseWebsiteTarget (normalizeUrl)", () => {
  it("strips protocol, www, path and query, and lowercases", () => {
    expect(parseWebsiteTarget("HTTPS://www.Example.com/path?x=1")).toBe("example.com");
  });

  it("handles a bare domain unchanged", () => {
    expect(parseWebsiteTarget("github.com")).toBe("github.com");
  });

  it("trims surrounding whitespace", () => {
    expect(parseWebsiteTarget("  google.com  ")).toBe("google.com");
  });

  it("keeps subdomains", () => {
    expect(parseWebsiteTarget("http://docs.github.com/x")).toBe("docs.github.com");
  });
});

describe("analyzeWebsite", () => {
  it("flags suspicious phishing-style domains as high risk", async () => {
    const result = await analyzeWebsite("paypa1-verify.com");
    expect(result.agentId).toBe("website");
    expect(result.target).toBe("paypa1-verify.com");
    expect(result.trustScore).toBeLessThan(35);
    expect(result.riskLevel).toBe("critical");
    expect(result.metadata.reputation).toBe("Malicious");
    expect(result.recommendation).toMatch(/do not/i);
  });

  it("treats known trusted domains as safe", async () => {
    const result = await analyzeWebsite("https://github.com");
    expect(result.trustScore).toBeGreaterThanOrEqual(80);
    expect(result.riskLevel).toBe("safe");
    expect(result.metadata.sslEv).toBe(true);
    expect(result.metadata.reputation).toBe("Clean");
  });

  it("treats trusted subdomains as safe", async () => {
    const result = await analyzeWebsite("api.google.com");
    expect(result.trustScore).toBeGreaterThanOrEqual(80);
  });

  it("returns a mixed-signal verdict for unknown domains", async () => {
    const result = await analyzeWebsite("some-random-blog.com");
    expect(result.trustScore).toBeGreaterThanOrEqual(45);
    expect(result.trustScore).toBeLessThan(75);
    expect(result.metadata.sslEv).toBe(false);
  });

  it("always emits six security checks", async () => {
    const result = await analyzeWebsite("example.com");
    expect(result.checks).toHaveLength(6);
    expect(result.checks.map((c) => c.name)).toContain("SSL Certificate");
  });

  it("is deterministic for the same input", async () => {
    const [a, b] = await Promise.all([
      analyzeWebsite("consistency-test.com"),
      analyzeWebsite("consistency-test.com"),
    ]);
    expect(a.trustScore).toBe(b.trustScore);
    expect(a.confidence).toBe(b.confidence);
  });
});
