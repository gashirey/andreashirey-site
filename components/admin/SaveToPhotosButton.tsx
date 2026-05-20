"use client";

import { useState } from "react";
import { saveImageToPhotos } from "@/lib/social/save-to-photos";

type SaveToPhotosButtonProps = {
  downloadUrl: string;
  filename: string;
  className?: string;
  variant?: "dark" | "light";
  onResult?: (result: {
    ok: boolean;
    message: string;
  }) => void;
};

export function SaveToPhotosButton({
  downloadUrl,
  filename,
  className = "",
  variant = "dark",
  onResult,
}: SaveToPhotosButtonProps) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      const result = await saveImageToPhotos(downloadUrl, filename);
      onResult?.({ ok: result.ok, message: result.message });
    } finally {
      setBusy(false);
    }
  }

  const styles =
    variant === "light"
      ? "btn border-cream bg-cream text-bark"
      : "btn border-bark bg-bark text-cream";

  return (
    <button
      type="button"
      disabled={busy}
      className={`${styles} py-2 text-center text-xs disabled:opacity-60 ${className}`}
      onClick={() => void handleClick()}
    >
      {busy ? "…" : "Photos"}
    </button>
  );
}
