import { describe, expect, it } from "vitest";
import { computeScore } from "@/lib/scoring";

describe("computeScore", () => {
  it("maps boundaries correctly", () => {
    expect(computeScore(1.1)).toBe(5);
    expect(computeScore(1.11)).toBe(4);
    expect(computeScore(1.3)).toBe(4);
    expect(computeScore(1.45)).toBe(3);
    expect(computeScore(1.9)).toBe(2);
    expect(computeScore(2.01)).toBe(1);
  });
});
