const EMAIL_RE =
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

/** Normalize to lowercase email or return null if invalid */
export function normalizeEmail(input: string): string | null {
  const email = input.trim().toLowerCase();
  if (!email || email.length > 254) return null;
  if (!EMAIL_RE.test(email)) return null;
  return email;
}

/** US-focused: accept 10-digit or +1 formats; return E.164 or null */
export function normalizePhoneE164(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const digits = trimmed.replace(/\D/g, "");

  if (trimmed.startsWith("+")) {
    const e164 = `+${digits}`;
    if (!/^\+[1-9]\d{7,14}$/.test(e164)) return null;
    return e164;
  }

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  return null;
}

export function formatPhoneDisplay(e164: string): string {
  if (e164.startsWith("+1") && e164.length === 12) {
    const d = e164.slice(2);
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  return e164;
}
