"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { SOCIAL_CAPTION_TEMPLATES } from "@/lib/social/captions";
import type { MediaShoot } from "@/lib/media/types";

type SocialImageItem = {
  id: string;
  kind: "media" | "product";
  imageUrl: string;
  label: string;
  createdAt: string;
};

type SourceFilter = "all" | "library" | "products";

function isRemoteSrc(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function SocialMediaWorkbench() {
  const [shoots, setShoots] = useState<MediaShoot[]>([]);
  const [shootId, setShootId] = useState<string>("");
  const [source, setSource] = useState<SourceFilter>("all");
  const [images, setImages] = useState<SocialImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadShoots = useCallback(async () => {
    const res = await fetch("/api/admin/media/shoots");
    const data = await res.json();
    if (!res.ok) return;
    const list = (data.shoots ?? []) as MediaShoot[];
    setShoots(list);
    setShootId((prev) => prev || list[0]?.id || "");
  }, []);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({ source });
    if (source !== "products" && shootId) {
      params.set("shoot_id", shootId);
    }

    const res = await fetch(`/api/admin/social/images?${params}`);
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not load images.");
      setImages([]);
      return;
    }

    setImages((data.images ?? []) as SocialImageItem[]);
  }, [source, shootId]);

  useEffect(() => {
    void loadShoots();
  }, [loadShoots]);

  useEffect(() => {
    void loadImages();
  }, [loadImages]);

  function downloadUrl(item: SocialImageItem): string {
    return `/api/admin/social/download?kind=${item.kind === "media" ? "media" : "product"}&id=${item.id}`;
  }

  async function handleCopyCaption(text: string) {
    const ok = await copyText(text);
    setNotice(
      ok
        ? { type: "success", message: "Caption copied — paste in Instagram." }
        : { type: "error", message: "Could not copy. Select and copy manually." },
    );
  }

  async function handleCopyLink(url: string) {
    const ok = await copyText(url);
    setNotice(
      ok
        ? { type: "success", message: "Image link copied." }
        : { type: "error", message: "Could not copy link." },
    );
  }

  const expanded = images.find(
    (img) => `${img.kind}-${img.id}` === expandedId,
  );

  return (
    <div className="social-workbench mx-auto max-w-lg pb-24">
      {notice ? (
        <AdminNotice
          type={notice.type}
          message={notice.message}
          onDismiss={() => setNotice(null)}
        />
      ) : null}

      <section className="border border-parchment bg-white p-4">
        <h2 className="font-serif text-lg text-bark">Get images for Instagram</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone">
          Save a photo to your camera roll, then open Instagram and post from
          Photos. Upload new shots in{" "}
          <a href="/admin/media" className="underline hover:text-bark">
            Media
          </a>
          .
        </p>
      </section>

      <section className="mt-4 border border-parchment bg-white p-4">
        <p className="text-xs font-medium tracking-wide text-stone">Source</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["library", "Library"],
              ["products", "Products"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSource(value)}
              className={`rounded-sm border px-3 py-2 text-sm ${
                source === value
                  ? "border-bark bg-bark text-cream"
                  : "border-parchment bg-white text-bark"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {source !== "products" && shoots.length > 0 ? (
          <label className="mt-4 block text-sm">
            Shoot
            <select
              className="input mt-1 w-full text-base"
              value={shootId}
              onChange={(e) => setShootId(e.target.value)}
            >
              {shoots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </section>

      <section className="mt-4 border border-parchment bg-white p-4">
        <p className="text-xs font-medium tracking-wide text-stone">
          Caption starters
        </p>
        <div className="mt-2 flex flex-col gap-2">
          {SOCIAL_CAPTION_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              className="btn w-full border-parchment bg-cream text-left text-sm text-bark"
              onClick={() => void handleCopyCaption(t.text)}
            >
              Copy: {t.label}
            </button>
          ))}
        </div>
      </section>

      {error ? (
        <p className="mt-4 text-sm text-bark">{error}</p>
      ) : loading ? (
        <p className="mt-6 text-sm text-stone">Loading images…</p>
      ) : images.length === 0 ? (
        <p className="mt-6 text-sm text-stone">
          No images yet. Add some in Media or product photos.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {images.map((item) => {
            const key = `${item.kind}-${item.id}`;
            return (
              <li
                key={key}
                className="border border-parchment bg-white"
              >
                <button
                  type="button"
                  className="relative block aspect-square w-full bg-parchment"
                  onClick={() =>
                    setExpandedId(expandedId === key ? null : key)
                  }
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.label}
                    fill
                    className="object-cover"
                    sizes="50vw"
                    unoptimized={isRemoteSrc(item.imageUrl)}
                  />
                  <span className="absolute left-1 top-1 bg-bark/75 px-1.5 py-0.5 text-[10px] text-cream">
                    {item.kind === "media" ? "Library" : "Product"}
                  </span>
                </button>
                <p className="truncate px-2 pt-2 text-xs text-stone">
                  {item.label}
                </p>
                <div className="grid grid-cols-2 gap-1 p-2">
                  <a
                    href={item.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn border-parchment py-2 text-center text-xs"
                  >
                    Open
                  </a>
                  <a
                    href={downloadUrl(item)}
                    className="btn border-bark bg-bark py-2 text-center text-xs text-cream"
                  >
                    Save
                  </a>
                </div>
                <button
                  type="button"
                  className="w-full border-t border-parchment py-2 text-xs text-stone underline"
                  onClick={() => void handleCopyLink(item.imageUrl)}
                >
                  Copy link
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {expanded ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-bark/90 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative min-h-0 flex-1">
            <Image
              src={expanded.imageUrl}
              alt={expanded.label}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized={isRemoteSrc(expanded.imageUrl)}
            />
          </div>
          <p className="mt-3 text-center text-sm text-cream">{expanded.label}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={expanded.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border-cream/40 bg-transparent text-cream"
            >
              Open full size
            </a>
            <a
              href={downloadUrl(expanded)}
              className="btn border-cream bg-cream text-bark"
            >
              Save to phone
            </a>
          </div>
          <button
            type="button"
            className="mt-3 w-full py-3 text-sm text-cream/80 underline"
            onClick={() => setExpandedId(null)}
          >
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}
