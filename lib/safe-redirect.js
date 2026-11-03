/** Accepte seulement une destination interne, y compris après normalisation URL. */
export function safeRedirectPath(value, fallback = '/profile') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\x00-\x20\x7f]/.test(value)) return fallback;
  try {
    const base = 'https://devboard.invalid';
    const url = new URL(value, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return fallback; }
}
