import { describe, expect, it } from "vitest";
import { analyze, detectAgent, detectIntent, parseIntent } from "../atlas";

describe("detectIntent", () => {
  it("routes messages that contain a URL to the website agent", () => {
    expect(detectIntent("Please analyze github.com for me")).toBe("website");
    expect(detectIntent("check https://paypa1-verify.com")).toBe("website");
  });

  it("routes website questions without a URL to the website prompt", () => {
    expect(detectIntent("How does your website scanner work?")).toBe("website_prompt");
    expect(detectIntent("tell me about domain reputation")).toBe("website_prompt");
  });

  it("detects malware intent", () => {
    expect(detectIntent("is this apk malware?")).toBe("malware");
    expect(detectIntent("I think I have a trojan")).toBe("malware");
  });

  it("detects trust score intent", () => {
    expect(detectIntent("why is my trust score low?")).toBe("trust_score");
  });

  it("detects network intent", () => {
    expect(detectIntent("scan my network for dns issues")).toBe("network");
    expect(detectIntent("check my firewall and vpn")).toBe("network");
  });

  it("detects email/phishing intent", () => {
    expect(detectIntent("I received a phishing email")).toBe("email_phishing");
    expect(detectIntent("how do I spot a bec attack in my inbox")).toBe("email_phishing");
  });

  it("detects deepfake intent", () => {
    expect(detectIntent("can you detect a deepfake video?")).toBe("deepfake");
  });

  it("detects qr intent", () => {
    expect(detectIntent("scan this qr code sticker")).toBe("qr");
  });

  it("defaults to general for unrelated messages", () => {
    expect(detectIntent("hello, what can you do?")).toBe("general");
  });

  it("is exposed under the parseIntent alias", () => {
    expect(parseIntent).toBe(detectIntent);
  });
});

describe("detectAgent (deprecated)", () => {
  it("returns website only when a URL is present, otherwise general", () => {
    expect(detectAgent("analyze github.com")).toBe("website");
    expect(detectAgent("what is a deepfake")).toBe("general");
  });
});

describe("analyze", () => {
  it("routes a URL query through the website agent", async () => {
    const response = await analyze("Analyze github.com");
    expect(response.agentId).toBe("website");
    expect(response.analysis.trustScore).toBeGreaterThanOrEqual(80);
    expect(response.analysis.riskScore).toBe(100 - response.analysis.trustScore);
    expect(response.trust.overall).toBeGreaterThan(0);
    expect(response.message).toContain("github.com");
  });

  it("accepts an AtlasQuery object", async () => {
    const response = await analyze({ message: "analyze github.com" });
    expect(response.agentId).toBe("website");
  });

  it("returns a predefined analyst response for non-URL queries", async () => {
    const response = await analyze("hello there");
    expect(response.agentId).toBe("general");
    expect(response.message).toBeTruthy();
    expect(response.analysis.evidence.length).toBeGreaterThan(0);
    expect(response.raw.metadata.responseType).toBe("predefined");
  });
});
