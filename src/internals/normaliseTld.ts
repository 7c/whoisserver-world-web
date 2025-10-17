export function normaliseTld(tld: string | undefined | null): string | null {
  if (!tld) return null;
  const trimmed = tld.toLowerCase().trim();
  const cleaned = trimmed.replace(/[^a-z0-9-]/g, '');
  return cleaned || null;
}
