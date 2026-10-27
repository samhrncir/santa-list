import { describe, expect, it } from "vitest";
import { faviconFor, hostnameOf, isSafeHttpUrl, normalizeUrl } from "../urls";

describe("normalizeUrl", () => {
  it("returns an empty string for blank input", () => {
    expect(normalizeUrl("")).toBe("");
    expect(normalizeUrl("   ")).toBe("");
  });

  it("adds https:// when the scheme is missing", () => {
    expect(normalizeUrl("amazon.com/dp/B0")).toBe("https://amazon.com/dp/B0");
    expect(normalizeUrl("  www.lego.com ")).toBe("https://www.lego.com/");
  });

  it("keeps http and https links as they are", () => {
    expect(normalizeUrl("http://example.com/a?b=1")).toBe("http://example.com/a?b=1");
    expect(normalizeUrl("HTTPS://Example.com")).toBe("https://example.com/");
  });

  it("rejects anything that is not a web address", () => {
    expect(normalizeUrl("javascript:alert(1)")).toBeNull();
    expect(normalizeUrl("mailto:santa@northpole.example")).toBeNull();
    expect(normalizeUrl("just some words")).toBeNull();
    expect(normalizeUrl("ftp://files.example.com")).toBeNull();
    expect(normalizeUrl("https://user:secret@example.com/")).toBeNull();
  });

  it("still accepts a host with an explicit port", () => {
    expect(normalizeUrl("shop.example.com:8080/toys")).toBe("https://shop.example.com:8080/toys");
    expect(normalizeUrl("localhost:3000")).toBe("https://localhost:3000/");
  });

  it("rejects links that are too long", () => {
    expect(normalizeUrl(`https://example.com/${"a".repeat(3000)}`)).toBeNull();
  });
});

describe("isSafeHttpUrl", () => {
  it("accepts only absolute http(s) urls", () => {
    expect(isSafeHttpUrl("https://example.com")).toBe(true);
    expect(isSafeHttpUrl("http://example.com")).toBe(true);
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("/relative")).toBe(false);
    expect(isSafeHttpUrl(42)).toBe(false);
  });
});

describe("hostnameOf / faviconFor", () => {
  it("strips www. from the hostname", () => {
    expect(hostnameOf("https://www.amazon.com/x")).toBe("amazon.com");
    expect(hostnameOf("not a url")).toBe("not a url");
  });

  it("builds a favicon lookup for the hostname only", () => {
    expect(faviconFor("https://shop.example.com/secret?token=1")).toBe(
      "https://www.google.com/s2/favicons?sz=32&domain=shop.example.com",
    );
    expect(faviconFor("nope")).toBeNull();
  });
});
