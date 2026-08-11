const SAFE_SCHEMES = new Set([
  "http",
  "https",
  "mailto",
  "tel",
  "ftp",
]);

const SCHEME = /^([a-z][a-z0-9+.-]*):/i;

const isControlCharacter = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return code < 0x20 || code === 0x7f;
};

/*
  Markdown documents are arbitrary user content, so link targets must not be
  handed to the DOM unchecked. Only URLs with a known-harmless scheme and
  scheme-less (relative) URLs are allowed; everything else (javascript:,
  data:, vbscript:, …) returns null and is rendered as plain text instead.
*/
const sanitizeUrl = (url: string): string | null => {
  // Control characters can be used to obfuscate a scheme, e.g.
  // "java\nscript:alert(1)", so they are removed before the check and do not
  // make it into the returned URL either.
  const normalized = Array.from(url)
    .filter((char) => !isControlCharacter(char))
    .join("")
    .trim();

  if (normalized.length === 0) {
    return null;
  }

  const schemeMatch = normalized.match(SCHEME);

  if (!schemeMatch) {
    return normalized;
  }

  return SAFE_SCHEMES.has(schemeMatch[1].toLowerCase())
    ? normalized
    : null;
};

export default sanitizeUrl;
