import { describe, expect, it } from "vitest";
import { letterDate, ordinal, shortDate } from "../dates";

describe("ordinal", () => {
  it("handles the teens and the rest", () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 31, 101, 111].map(ordinal)).toEqual([
      "1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "23rd", "31st", "101st", "111th",
    ]);
  });
});

describe("letterDate / shortDate", () => {
  it("writes the date the old-fashioned way", () => {
    const date = new Date(2026, 11, 24);
    expect(letterDate(date)).toBe("the 24th day of December, 2026");
    expect(shortDate(date)).toBe("24 December 2026");
  });
});
