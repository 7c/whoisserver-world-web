import type { DomainParseResult, TldData } from 'whoisserver-world';

import dataset from './data/whoisservers.json';
import { buildTldRegistry } from './internals/buildTldRegistry';
import { normaliseTld } from './internals/normaliseTld';
import { sanitizedReturn } from './internals/sanitizedReturn';

const tldModules = import.meta.glob<{ default: TldData }>('./data/tlds/*.json', { eager: true });

const { tldMap, tldObject } = buildTldRegistry(
  tldModules,
  dataset as Record<string, TldData>
);

export function tlds(): Record<string, TldData> {
  return tldObject;
}

export function tldDetails(tld: string): TldData | false {
  const key = normaliseTld(tld);
  if (!key) return false;
  return tldMap.get(key) ?? false;
}


export class Domainname {
  public data : DomainParseResult
  constructor(hostname:string) {
    const res=parseDomain(hostname)
    if (res===null) {
      throw new Error(`Invalid domain name: ${hostname}`)
    }
    this.data=res
  }

  static isValid(hostname:string) : boolean {
    return parseDomain(hostname)!==null
  }

  get hostname() : string {
    return this.data.hostname
  }

  get domain() : string {
    return this.data.domain
  }

  get tld() : string {
    return this.data.tld
  }

}

export function parseDomain(hostname: string): DomainParseResult | null {
  if (typeof hostname !== 'string') return null;
  const original = hostname.trim();
  const parts = original.split('.');
  if (parts.length < 2) return null;

  const last1 = parts[parts.length - 1].toLowerCase();
  const last2 = `${parts[parts.length - 2]}.${last1}`.toLowerCase();
  const tldData = tldObject[last1];
  if (!tldData) {
    return null;
  }

  const result: DomainParseResult = {
    hostname: original,
    tldData,
    domain: '',
    tld: tldData.tld
  };

  const sampleDomains = (tldData as { sampleDomains?: Record<string, unknown> }).sampleDomains ?? false;
  if (sampleDomains && typeof sampleDomains === 'object') {
    result.domain = last2;

    if (parts.length > 3) {
      const last3 = `${parts[parts.length - 3]}.${last2}`.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(sampleDomains, last3)) {
        result.domain = `${parts[parts.length - 4]}.${parts[parts.length - 3]}.${last2}`;
        return sanitizedReturn(result);
      }
    }

    if (parts.length > 2 && Object.prototype.hasOwnProperty.call(sampleDomains, last2)) {
      result.domain = `${parts[parts.length - 3]}.${last2}`;
      return sanitizedReturn(result);
    }

    if (Object.prototype.hasOwnProperty.call(sampleDomains, result.domain)) {
      return null;
    }
  } else {
    result.domain = last2;
  }

  return sanitizedReturn(result);
}

export type { DomainParseResult, TldData };
