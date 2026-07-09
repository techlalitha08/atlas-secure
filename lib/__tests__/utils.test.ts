import { describe, expect, it } from "vitest";
import { cn, getSeverityColor, getTrustBg, getTrustColor, getTrustGradient } from "../utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("merges conflicting tailwind classes, keeping the last", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("getTrustColor", () => {
  it.each([
    [90, "text-emerald-400"],
    [80, "text-emerald-400"],
    [70, "text-amber-400"],
    [60, "text-amber-400"],
    [50, "text-orange-400"],
    [40, "text-orange-400"],
    [10, "text-red-400"],
  ])("maps score %i to %s", (score, expected) => {
    expect(getTrustColor(score)).toBe(expected);
  });
});

describe("getTrustGradient", () => {
  it("returns tier-appropriate gradients", () => {
    expect(getTrustGradient(85)).toContain("emerald");
    expect(getTrustGradient(65)).toContain("amber");
    expect(getTrustGradient(45)).toContain("orange");
    expect(getTrustGradient(20)).toContain("red");
  });
});

describe("getTrustBg", () => {
  it("returns tier-appropriate backgrounds", () => {
    expect(getTrustBg(85)).toContain("emerald");
    expect(getTrustBg(65)).toContain("amber");
    expect(getTrustBg(45)).toContain("orange");
    expect(getTrustBg(20)).toContain("red");
  });
});

describe("getSeverityColor", () => {
  it("is case-insensitive", () => {
    expect(getSeverityColor("CRITICAL")).toBe(getSeverityColor("critical"));
  });

  it.each(["critical", "high", "medium", "low"])("returns a mapping for %s", (severity) => {
    expect(getSeverityColor(severity)).toMatch(/bg-.*text-.*border-/);
  });

  it("falls back to a neutral color for unknown severities", () => {
    expect(getSeverityColor("nonsense")).toContain("zinc");
  });
});
