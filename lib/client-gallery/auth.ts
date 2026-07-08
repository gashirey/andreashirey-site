import { createHmac } from "node:crypto";
import { cookies } from "next/headers";

function gallerySessionSecret(): string | undefined {
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

export function hashGalleryPassword(
  galleryId: string,
  password: string,
): string | null {
  const secret = gallerySessionSecret();
  if (!secret) return null;
  const normalized = password.trim();
  if (!normalized) return null;
  return createHmac("sha256", secret)
    .update(`client-gallery-password:${galleryId}:${normalized}`)
    .digest("hex");
}

export function verifyGalleryPassword(
  galleryId: string,
  password: string,
  storedHash: string | null,
): boolean {
  if (!storedHash) return true;
  const computed = hashGalleryPassword(galleryId, password);
  if (!computed || computed.length !== storedHash.length) return false;

  let mismatch = 0;
  for (let i = 0; i < storedHash.length; i++) {
    mismatch |= storedHash.charCodeAt(i) ^ computed.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createGalleryUnlockToken(
  shareToken: string,
): Promise<string> {
  const secret = gallerySessionSecret();
  if (!secret) return "";
  return hmacHex(secret, `client-gallery-unlock:${shareToken}`);
}

export async function verifyGalleryUnlockToken(
  shareToken: string,
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const expected = await createGalleryUnlockToken(shareToken);
  if (!expected || token.length !== expected.length) return false;

  let mismatch = 0;
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export const CLIENT_GALLERY_COOKIE = "ggf_cg";

export function clientGalleryCookiePath(shareToken: string): string {
  return `/view/${shareToken}`;
}

export async function isClientGalleryUnlocked(
  shareToken: string,
): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(CLIENT_GALLERY_COOKIE)?.value;
  if (!value) return false;

  const [token, signature] = value.split(".");
  if (!token || !signature || token !== shareToken) return false;
  return verifyGalleryUnlockToken(shareToken, signature);
}

export function buildGalleryUnlockCookieValue(
  shareToken: string,
  signature: string,
): string {
  return `${shareToken}.${signature}`;
}
