import { describe, it, expect } from "vitest";
import { tokenizeCode } from "./tokenizeCode.js";

describe("tokenizeCode", () => {
  it("tokenizes a simple JavaScript expression", () => {
    const spans = tokenizeCode("const x = 1", "javascript");
    const types = spans.map((s) => s.type);
    expect(types).toContain("keyword");
    expect(types).toContain("number");
    expect(types).toContain("operator");
  });

  it("returns an empty array for unknown languages", () => {
    expect(tokenizeCode("hello", "klingon")).toEqual([]);
  });

  it("treats 'run' as JavaScript", () => {
    const js = tokenizeCode("const x = 1", "javascript");
    const run = tokenizeCode("const x = 1", "run");
    expect(run).toEqual(js);
  });

  it("treats 'mod' as JavaScript", () => {
    const js = tokenizeCode("const x = 1", "javascript");
    const mod = tokenizeCode("const x = 1", "mod");
    expect(mod).toEqual(js);
  });

  it("emits non-overlapping spans covering each token", () => {
    const code = "const s = \"hi\"";
    const spans = tokenizeCode(code, "javascript");
    for (let i = 1; i < spans.length; i++) {
      expect(spans[i].start).toBeGreaterThanOrEqual(spans[i - 1].end);
    }
    for (const span of spans) {
      expect(span.start).toBeGreaterThanOrEqual(0);
      expect(span.end).toBeLessThanOrEqual(code.length);
      expect(span.end).toBeGreaterThan(span.start);
    }
  });

  it("attributes nested-token characters to the most-specific type", () => {
    const spans = tokenizeCode("\"hello\"", "javascript");
    const stringSpans = spans.filter((s) => s.type === "string");
    expect(stringSpans.length).toBeGreaterThan(0);
    expect(stringSpans[0].end - stringSpans[0].start).toBeGreaterThan(0);
  });

  it("tokenizes JSON", () => {
    const spans = tokenizeCode("{\"k\": 1}", "json");
    const types = spans.map((s) => s.type);
    expect(types).toContain("property");
    expect(types).toContain("number");
  });

  it("does not emit spans for unstyled whitespace", () => {
    const spans = tokenizeCode("   ", "javascript");
    expect(spans).toEqual([]);
  });
});
