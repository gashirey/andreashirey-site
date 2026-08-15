/** Parse a pasted gallery URL or share token into the path token. */
export function parseGalleryAccessInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const fromPath = tokenFromViewPath(url.pathname);
    if (fromPath) return fromPath;
  } catch {
    // not an absolute URL
  }

  const fromRelative = tokenFromViewPath(trimmed);
  if (fromRelative) return fromRelative;

  if (/^[A-Za-z0-9_-]{16,}$/.test(trimmed)) return trimmed;

  return null;
}

function tokenFromViewPath(pathname: string): string | null {
  const match = pathname.match(/\/view\/([^/?#\s]+)/);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}
