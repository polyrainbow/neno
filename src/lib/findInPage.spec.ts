import { describe, it, expect } from "vitest";
import {
  getVisibleOrdinal,
  getVisibleTotal,
  isOnPhantom,
  isStuckStep,
} from "./findInPage";
import { FindResult } from "./electron/bridgeTypes";

const result = (matches: number, activeMatchOrdinal: number): FindResult => ({
  requestId: 1,
  matches,
  activeMatchOrdinal,
});

describe("findInPage match arithmetic", () => {
  describe("getVisibleTotal", () => {
    it("should hide the find bar's own match", () => {
      // Three on the page, plus the term sitting in the input.
      expect(getVisibleTotal(result(4, 1))).toBe(3);
    });

    it("should report nothing when only the phantom matched", () => {
      expect(getVisibleTotal(result(1, 1))).toBe(0);
    });

    it("should not go negative when there is no match at all", () => {
      expect(getVisibleTotal(result(0, 0))).toBe(0);
    });
  });

  describe("getVisibleOrdinal", () => {
    it("should pass real positions through", () => {
      expect(getVisibleOrdinal(result(4, 2))).toBe(2);
    });

    it("should never exceed the visible total", () => {
      // Sitting on the phantom, which is not a position we show.
      expect(getVisibleOrdinal(result(4, 4))).toBe(3);
    });
  });

  describe("isOnPhantom", () => {
    it("should detect the last match being the bar's own input", () => {
      expect(isOnPhantom(result(4, 4))).toBe(true);
    });

    it("should ignore real matches", () => {
      expect(isOnPhantom(result(4, 3))).toBe(false);
    });

    it("should not skip when the phantom is all there is", () => {
      // Skipping here would have nowhere to go.
      expect(isOnPhantom(result(1, 1))).toBe(false);
    });
  });

  describe("isStuckStep", () => {
    it("should detect a step that did not move", () => {
      expect(isStuckStep(result(4, 1), 1, false)).toBe(true);
    });

    it("should accept a step that moved", () => {
      expect(isStuckStep(result(4, 2), 1, false)).toBe(false);
    });

    it("should not apply to a new session, which starts at the top", () => {
      expect(isStuckStep(result(4, 1), 1, true)).toBe(false);
    });

    it("should not retry with a single real match, which cannot move", () => {
      expect(isStuckStep(result(2, 1), 1, false)).toBe(false);
    });
  });
});
