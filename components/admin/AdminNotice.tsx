"use client";

import { useEffect } from "react";

type AdminNoticeProps = {
  type: "success" | "error";
  message: string;
  onDismiss?: () => void;
  autoHideMs?: number;
};

export function AdminNotice({
  type,
  message,
  onDismiss,
  autoHideMs = 10000,
}: AdminNoticeProps) {
  useEffect(() => {
    if (type !== "success" || !autoHideMs || !onDismiss) return;
    const id = window.setTimeout(onDismiss, autoHideMs);
    return () => window.clearTimeout(id);
  }, [type, message, autoHideMs, onDismiss]);

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-4 border px-4 py-3 text-sm ${
        type === "success"
          ? "border-sage/40 bg-sage-light text-bark"
          : "border-parchment bg-white text-bark"
      }`}
    >
      <p className="leading-relaxed">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-xs text-stone underline hover:text-bark"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
