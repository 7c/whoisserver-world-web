import * as punycode from 'punycode/punycode.js';

export function hasUnicodePart(domain: string): boolean {
  try {
    return punycode.toASCII(domain) !== domain;
  } catch {
    return false;
  }
}
