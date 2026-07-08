import { randomBytes } from "node:crypto";

/** URL-safe opaque token for client gallery share links. */
export function createShareToken(): string {
  return randomBytes(24).toString("base64url");
}

export function clientGalleryPath(token: string): string {
  return `/view/${token}`;
}
