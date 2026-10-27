const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// Reject bytes >= 248 so every symbol is equally likely (256 % 62 = 8 leftovers).
const LIMIT = 256 - (256 % ALPHABET.length);

/** Cryptographically random id drawn uniformly from [A-Za-z0-9]. */
export function randomId(length = 22): string {
  let out = "";
  const bytes = new Uint8Array(length * 2);
  while (out.length < length) {
    crypto.getRandomValues(bytes);
    for (let i = 0; i < bytes.length && out.length < length; i++) {
      const b = bytes[i];
      if (b < LIMIT) out += ALPHABET[b % ALPHABET.length];
    }
  }
  return out;
}

/** 22 symbols of base-62 is ~131 bits: unguessable, which is what makes the share link private. */
export const newLetterId = () => randomId(22);
export const newWishId = () => randomId(12);
