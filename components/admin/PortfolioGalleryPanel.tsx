"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { MediaAsset } from "@/lib/media/types";

function isRemoteSrc(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

type Filter = "all" | "in" | "out";

type PortfolioGalleryPanelProps = {
  refreshKey?: number;
  onChanged?: () => void;
};

export function PortfolioGalleryPanel({
  refreshKey = 0,
  onChanged,
}: PortfolioGalleryPanelProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media/assets");
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not load library.");
      setAssets([]);
      return;
    }
    setError("");
    setAssets((data.assets ?? []) as MediaAsset[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  async function setInGallery(asset: MediaAsset, inGallery: boolean) {
    setTogglingId(asset.id);
    const res = await fetch(`/api/admin/media/assets/${asset.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ in_gallery: inGallery }),
    });
    setTogglingId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not update gallery selection.");
      return;
    }

    const data = await res.json();
    const next = data.asset as MediaAsset;
    setAssets((prev) =>
      prev.map((a) => (a.id === asset.id ? { ...a, ...next } : a)),
    );
    onChanged?.();
  }

  const selectedCount = assets.filter((a) => a.in_gallery).length;
  const visible = assets.filter((a) => {
    if (filter === "in") return a.in_gallery;
    if (filter === "out") return !a.in_gallery;
    return true;
  });

  return (
    <section className="border border-parchment bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg text-bark">
            Select Work gallery ({selectedCount} of {assets.length})
          </h2>
          <p className="mt-1 text-sm text-stone max-w-xl">
            Check an image to show it on public{" "}
            <a
              href="/gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-bark"
            >
              /gallery
            </a>
            . Uncheck to hide it — the file stays in your library so you can add
            it back anytime.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="btn border-parchment bg-white text-bark hover:border-bark"
        >
          Refresh
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {(
          [
            ["all", "All images"],
            ["in", "In gallery"],
            ["out", "Not in gallery"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`border px-3 py-1.5 ${
              filter === id
                ? "border-bark bg-bark text-cream"
                : "border-parchment bg-white text-stone hover:border-bark hover:text-bark"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? <p className="mt-3 text-sm text-bark">{error}</p> : null}

      {loading ? (
        <p className="mt-6 text-sm text-stone">Loading library…</p>
      ) : visible.length === 0 ? (
        <p className="mt-6 text-sm text-stone">
          {assets.length === 0
            ? "No images yet. Upload a shoot below, then check the ones you want on /gallery."
            : "No images match this filter."}
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((asset) => {
            const checked = Boolean(asset.in_gallery);
            const busy = togglingId === asset.id;
            return (
              <li
                key={asset.id}
                className={`relative border bg-cream/30 p-2 ${
                  checked ? "border-bark" : "border-parchment"
                }`}
              >
                <label className="absolute right-3 top-3 z-10 flex h-7 w-7 cursor-pointer items-center justify-center border border-parchment bg-white shadow-none">
                  <span className="sr-only">
                    {checked ? "Remove from gallery" : "Add to gallery"}
                  </span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-bark"
                    checked={checked}
                    disabled={busy}
                    onChange={(e) =>
                      void setInGallery(asset, e.target.checked)
                    }
                  />
                </label>
                <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
                  <Image
                    src={asset.public_url}
                    alt={asset.alt_text ?? asset.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 200px"
                    unoptimized={isRemoteSrc(asset.public_url)}
                  />
                </div>
                <p className="mt-2 truncate text-[11px] text-stone">
                  {asset.filename}
                </p>
                <p className="text-[10px] text-stone">
                  {checked ? "In gallery" : "Library only"}
                  {busy ? "…" : ""}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
