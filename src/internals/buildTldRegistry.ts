import type { TldData } from 'whoisserver-world';

type TldModule = { default: TldData };

export function buildTldRegistry(
  globResult: Record<string, TldModule>,
  aggregated: Record<string, TldData>
) {
  const tldMap = new Map<string, TldData>();

  for (const module of Object.values(globResult)) {
    const record = module.default;
    if (record?.tld) {
      tldMap.set(record.tld.toLowerCase(), record);
    }
  }

  for (const [key, value] of Object.entries(aggregated)) {
    const normalised = key.toLowerCase();
    if (!tldMap.has(normalised)) {
      tldMap.set(normalised, value);
    }
  }

  const tldObject: Record<string, TldData> = {};
  for (const [key, value] of tldMap) {
    tldObject[key] = value;
  }

  return {
    tldMap,
    tldObject: Object.freeze(tldObject)
  } as const;
}
