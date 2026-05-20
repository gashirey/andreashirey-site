/** Turn a label into a safe filename for share/download. */
export function socialImageFilename(label: string): string {
  const base = label.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 60);
  return base.includes(".") ? base : `${base || "grey-gables"}.jpg`;
}

export type SaveToPhotosResult =
  | { ok: true; via: "share"; message: string }
  | { ok: true; via: "files"; message: string }
  | { ok: false; message: string };

/**
 * On iPhone: opens the share sheet — user taps Save Image → Photos.
 * Fallback: browser download → Files app (usually Downloads).
 */
export async function saveImageToPhotos(
  downloadUrl: string,
  filename: string,
): Promise<SaveToPhotosResult> {
  const res = await fetch(downloadUrl);
  if (!res.ok) {
    return { ok: false, message: "Could not load image." };
  }

  const blob = await res.blob();
  const type = blob.type || "image/jpeg";
  const file = new File([blob], socialImageFilename(filename), { type });

  if (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    (!navigator.canShare || navigator.canShare({ files: [file] }))
  ) {
    try {
      await navigator.share({ files: [file] });
      return {
        ok: true,
        via: "share",
        message: "Tap Save Image in the sheet to add to Photos.",
      };
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return { ok: false, message: "Cancelled." };
      }
      // fall through to Files download
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = file.name;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);

  return {
    ok: true,
    via: "files",
    message:
      "Saved to the Files app (Downloads folder), not Photos. Use Photos button on iPhone for the share sheet.",
  };
}
