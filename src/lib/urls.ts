import { LIMITS } from "./types";

/**
 * Turns whatever someone typed into a usable http(s) URL.
 * Returns "" for blank input and null when the input can't be made into a link.
 */
export function normalizeUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return "";
  const scheme = /^([a-z][a-z0-9+.-]*):(.*)$/i.exec(raw);
  let withScheme: string;
  if (!scheme) {
    withScheme = `https://${raw.replace(/^\/+/, "")}`;
  } else if (/^https?$/i.test(scheme[1])) {
    withScheme = raw;
  } else if (/^\d+(?:[/?#]|$)/.test(scheme[2])) {
    withScheme = `https://${raw}`; // "shop.example.com:8080/toys"
  } else {
    return null; // mailto:, javascript:, ftp: and friends
  }
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
  if (url.href.length > LIMITS.url) return null;
  return url.href;
}

/** True only for absolute http(s) URLs, so links in the letter can never run script. */
export function isSafeHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > LIMITS.url) return false;
  try {
    const url = new URL(value);
    if (url.username || url.password) return false;
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function faviconFor(url: string): string | null {
  try {
    const { hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?sz=32&domain=${encodeURIComponent(hostname)}`;
  } catch {
    return null;
  }
}
