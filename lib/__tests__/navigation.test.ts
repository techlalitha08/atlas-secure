import { describe, expect, it } from "vitest";
import {
  bottomItems,
  keyboardShortcuts,
  navItems,
  scanItems,
  securityItems,
} from "../navigation";

const allNavGroups = [navItems, scanItems, securityItems, bottomItems];

describe("navigation items", () => {
  it("every nav item has a label, an href starting with '/', and an icon", () => {
    for (const group of allNavGroups) {
      expect(group.length).toBeGreaterThan(0);
      for (const item of group) {
        expect(item.label).toBeTruthy();
        expect(item.href.startsWith("/")).toBe(true);
        expect(item.icon).toBeTruthy();
      }
    }
  });

  it("has no duplicate hrefs across all groups", () => {
    const hrefs = allNavGroups.flat().map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("tags main nav items with the 'main' section", () => {
    expect(navItems.every((i) => i.section === "main")).toBe(true);
  });

  it("exposes the expected scanner routes", () => {
    const hrefs = scanItems.map((i) => i.href);
    expect(hrefs).toContain("/scan/website");
    expect(hrefs).toContain("/scan/qr");
    expect(hrefs).toContain("/scan/deepfake");
  });
});

describe("keyboardShortcuts", () => {
  it("pairs a key with an action for each shortcut", () => {
    expect(keyboardShortcuts.length).toBeGreaterThan(0);
    for (const shortcut of keyboardShortcuts) {
      expect(shortcut.key).toBeTruthy();
      expect(shortcut.action).toBeTruthy();
    }
  });
});
