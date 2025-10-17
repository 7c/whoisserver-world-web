import * as punycode from 'punycode/punycode.js';
import type { DomainParseResult, TldData } from 'whoisserver-world';

import { hasUnicodePart } from './hasUnicodePart';
import { validHostname } from './validHostname';

export function sanitizedReturn(
  ret: DomainParseResult & { hostname: string; tldData: TldData | false }
): DomainParseResult | null {
  const next = { ...ret };
  if (hasUnicodePart(next.domain)) {
    try {
      next.domain = punycode.toASCII(next.domain);
    } catch {
      return null;
    }
  } else {
    next.domain = next.domain.toLowerCase();
    next.hostname = next.hostname.toLowerCase();
  }

  if (!validHostname(next.domain)) {
    return null;
  }

  if (next.domain.startsWith('xn--')) {
    try {
      punycode.toUnicode(next.domain);
    } catch {
      return null;
    }
  }

  return next;
}
