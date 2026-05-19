export {
  formatFullName,
  normalizeEmail,
  normalizePhoneE164,
} from "@/lib/subscribe/validate";

export function normalizeTag(tag: string): string | null {
  const value = tag.trim().toLowerCase().replace(/-/g, "_");
  if (!/^[a-z][a-z0-9_]*$/.test(value)) return null;
  return value;
}

export function normalizeTags(tags: string[] | undefined): string[] {
  if (!tags?.length) return [];
  const seen = new Set<string>();
  for (const tag of tags) {
    const normalized = normalizeTag(tag);
    if (normalized) seen.add(normalized);
  }
  return [...seen];
}

export function splitName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const trimmed = fullName.trim();
  const space = trimmed.indexOf(" ");
  if (space === -1) {
    return { firstName: trimmed, lastName: "" };
  }
  return {
    firstName: trimmed.slice(0, space).trim(),
    lastName: trimmed.slice(space + 1).trim(),
  };
}

export function mergeText(
  existing: string | null | undefined,
  incoming: string | null | undefined,
): string | null {
  const next = incoming?.trim();
  if (next) return next;
  const prev = existing?.trim();
  return prev || null;
}
