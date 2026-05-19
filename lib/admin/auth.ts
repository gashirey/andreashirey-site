import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ggf_admin";

const SESSION_MESSAGE = "grey-gables-admin-v1";

function sessionSecret(): string | undefined {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD;
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message),
  );
  return [...new Uint8Array(signature)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export async function createAdminSessionToken(): Promise<string> {
  const secret = sessionSecret();
  if (!secret) return "";
  return hmacHex(secret, SESSION_MESSAGE);
}

export async function verifyAdminSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const expected = await createAdminSessionToken();
  if (!expected || token.length !== expected.length) return false;

  let mismatch = 0;
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;
  return password.trim() === expected;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
