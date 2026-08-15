"use client";

import { useCallback, useEffect, useState } from "react";
import type { ClientGallery } from "@/lib/client-gallery/types";

type ClientGalleryRow = ClientGallery & {
  share_path: string;
  share_url: string;
  shoot_name?: string | null;
};

type ClientGalleriesOverviewProps = {
  onOpenShoot?: (shootId: string) => void;
};

export function ClientGalleriesOverview({
  onOpenShoot,
}: ClientGalleriesOverviewProps) {
  const [galleries, setGalleries] = useState<ClientGalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/client-galleries");
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not load client galleries.");
      setGalleries([]);
      return;
    }

    setError("");
    setGalleries((data.galleries ?? []) as ClientGalleryRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function togglePublished(gallery: ClientGalleryRow) {
    const res = await fetch(`/api/admin/client-galleries/${gallery.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !gallery.is_published }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Could not update gallery.");
      return;
    }
    await load();
    setMessage(
      data.gallery.is_published
        ? "Gallery published."
        : "Gallery unpublished.",
    );
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied.");
    } catch {
      setMessage("Could not copy link.");
    }
  }

  if (loading) {
    return <p className="text-sm text-stone">Loading client galleries…</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-serif text-lg text-bark">Client galleries</h2>
        <p className="mt-1 max-w-2xl text-sm text-stone">
          Private share links for clients to view and order digital files.
          Create new links from a shoot under the Shoots tab.
        </p>
      </div>

      {error ? (
        <p className="border border-parchment bg-white p-4 text-sm text-bark">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-stone" role="status">
          {message}
        </p>
      ) : null}

      {!galleries.length && !error ? (
        <p className="border border-parchment bg-white p-5 text-sm text-stone">
          No client galleries yet. Open a shoot, upload photos, then create a
          client link.
        </p>
      ) : (
        <ul className="space-y-3">
          {galleries.map((gallery) => (
            <li
              key={gallery.id}
              className="border border-parchment bg-white px-4 py-4 text-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-bark">{gallery.title}</p>
                  <p className="mt-1 text-stone">
                    Shoot: {gallery.shoot_name ?? "Unknown"}
                    {" · "}
                    {gallery.is_published ? "Published" : "Unpublished"}
                    {" · "}
                    {gallery.has_password ? "Password on" : "No password"}
                  </p>
                  <p className="mt-2 break-all font-mono text-xs text-stone">
                    {gallery.share_url}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void copyLink(gallery.share_url)}
                    className="btn border-parchment py-2 text-xs"
                  >
                    Copy link
                  </button>
                  <a
                    href={gallery.share_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn border-parchment py-2 text-xs"
                  >
                    Open
                  </a>
                  <button
                    type="button"
                    onClick={() => void togglePublished(gallery)}
                    className="btn border-parchment py-2 text-xs"
                  >
                    {gallery.is_published ? "Unpublish" : "Publish"}
                  </button>
                  {onOpenShoot ? (
                    <button
                      type="button"
                      onClick={() => onOpenShoot(gallery.shoot_id)}
                      className="btn border-bark bg-bark py-2 text-xs text-cream"
                    >
                      Open shoot
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
