import { describe, expect, it } from "vitest";
import { orchestrateAtlasRequest } from "../orchestrator";

describe("orchestrateAtlasRequest", () => {
  it("routes a URL prompt to the website agent", async () => {
    const result = await orchestrateAtlasRequest({ prompt: "please scan github.com" });
    expect(result.agentId).toBe("website");
    expect(result.analysis.agentId).toBe("website");
    expect(result.message).toBe(result.analysis.explanation);
  });

  it("routes an explicit website mode regardless of prompt wording", async () => {
    const result = await orchestrateAtlasRequest({ prompt: "hello", mode: "website" });
    expect(result.agentId).toBe("website");
  });

  it("recognises website keywords without a full URL", async () => {
    const result = await orchestrateAtlasRequest({ prompt: "scan this site" });
    expect(result.agentId).toBe("website");
  });

  it("falls back to the general orchestrator for plain chat", async () => {
    const result = await orchestrateAtlasRequest({ prompt: "what is the weather" });
    expect(result.agentId).toBe("general");
    expect(result.analysis.agentName).toBe("Atlas Orchestrator");
    expect(result.analysis.metadata.routed).toBe(true);
  });

  it("handles an empty prompt as a general request", async () => {
    const result = await orchestrateAtlasRequest({ prompt: "" });
    expect(result.agentId).toBe("general");
    expect(result.analysis.target).toBe("general");
  });

  it("defaults mode to chat when none is provided", async () => {
    const result = await orchestrateAtlasRequest({ prompt: "just a question", file: null });
    expect(result.agentId).toBe("general");
  });
});
