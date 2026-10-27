import { describe, expect, it } from "vitest";
import { newLetterId, newWishId, randomId } from "../ids";

describe("randomId", () => {
  it("produces ids of the requested length from the base-62 alphabet", () => {
    for (const length of [1, 12, 22, 64]) {
      const id = randomId(length);
      expect(id).toHaveLength(length);
      expect(id).toMatch(/^[A-Za-z0-9]+$/);
    }
  });

  it("does not repeat", () => {
    const ids = new Set(Array.from({ length: 2000 }, () => newLetterId()));
    expect(ids.size).toBe(2000);
  });

  it("uses every symbol in the alphabet", () => {
    const seen = new Set(Array.from({ length: 300 }, () => randomId(32)).join(""));
    expect(seen.size).toBe(62);
  });

  it("has sensible default sizes", () => {
    expect(newLetterId()).toHaveLength(22);
    expect(newWishId()).toHaveLength(12);
  });
});
