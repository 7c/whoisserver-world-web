export function validHostname(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  const validHostnameChars = /^[a-zA-Z0-9-.]{1,253}\.?$/;
  if (!validHostnameChars.test(value)) {
    return false;
  }

  let candidate = value.endsWith('.') ? value.slice(0, -1) : value;
  if (candidate.length > 253) {
    return false;
  }

  const labels = candidate.split('.');
  const labelPattern = /^([a-zA-Z0-9-]+)$/;

  return labels.every((label) =>
    labelPattern.test(label) &&
    label.length < 64 &&
    !label.startsWith('-') &&
    !label.endsWith('-')
  );
}
