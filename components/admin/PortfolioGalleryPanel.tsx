"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { MediaAsset } from "@/lib/media/types";

function isRemoteSrc(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

type PortfolioGalleryPanelProps = {
  refreshKey?: number;
  onChanged?: () => void;
};

export function PortfolioGalleryPanel({
  refreshKey = 0,
  onChanged,
}: PortfolioGalleryPanelProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media/assets?portfolio=1");
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Could not load Work gallery.");
      setAssets([]);
      return;
    }
    setError("");
    setAssets((data.assets ?? []) as MediaAsset[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  async function removeAsset(asset: MediaAsset) {
    if (
      !window.confirm(
        `Remove “${asset.filename}” from the Work gallery? This deletes it from the site library.`,
      )
    ) {
      return;
    }

    setRemovingId(asset.id);
    const res = await fetch(`/api/admin/media/assets/${asset.id}`, {
      method: "DELETE",
    });
    setRemovingId(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not remove image.");
      return;
    }

    setAssets((prev) => prev.filter((a) => a.id !== asset.id));
    onChanged?.();
  }

  return (
    <section className="border border-parchment bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg text-bark">
            Work gallery ({loading ? "…" : assets.length})
          </h2>
          <p className="mt-1 text-sm text-stone max-w-xl">
            These photos are live on{" "}
            <a
              href="/gallery"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-bark"
            >
              /gallery
            </a>
            . Remove here to take one off the site. Add new ones with the upload
            area below.
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

      {error ? <p className="mt-3 text-sm text-bark">{error}</p> : null}

      {loading ? (
        <p className="mt-6 text-sm text-stone">Loading gallery…</p>
      ) : assets.length === 0 ? (
        <p className="mt-6 text-sm text-stone">
          Gallery is empty. Create a shoot below, then drop images — they appear
          here and on the public Work page automatically.
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((asset) => (
            <li
              key={asset.id}
              className="border border-parchment bg-cream/30 p-2"
            >
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
              <button
                type="button"
                disabled={removingId === asset.id}
                onClick={() => void removeAsset(asset)}
                className="mt-2 block w-full text-center text-xs text-stone underline hover:text-bark disabled:opacity-50"
              >
                {removingId === asset.id ? "Removing…" : "Remove from gallery"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
