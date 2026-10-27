import { describe, expect, it } from "vitest";
import { toRoman } from "../roman";

describe("toRoman", () => {
  it("converts the usual suspects", () => {
    expect(toRoman(1)).toBe("I");
    expect(toRoman(4)).toBe("IV");
    expect(toRoman(9)).toBe("IX");
    expect(toRoman(14)).toBe("XIV");
    expect(toRoman(40)).toBe("XL");
    expect(toRoman(1999)).toBe("MCMXCIX");
    expect(toRoman(3999)).toBe("MMMCMXCIX");
  });

  it("falls back to digits outside the classical range", () => {
    expect(toRoman(0)).toBe("0");
    expect(toRoman(4000)).toBe("4000");
    expect(toRoman(2.5)).toBe("2.5");
  });
});
